/**
 * Shared page-scanning and rendering utility.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  TO ADD A NEW LANGUAGE:                                            │
 * │  1. Add an entry to LOCALE_FILE_SUFFIXES below                     │
 * │  2. Add the locale to astro.config.mjs → i18n.locales              │
 * │  3. Add UI strings in src/i18n/index.ts                            │
 * │  4. Create src/pages/<locale>/[...slug].astro  (copy any existing  │
 * │     locale route file, change the scanPages('xx') call)            │
 * │  5. Start creating <name>.xx.md files in the repo                  │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * TO ADD A NEW CONTENT DIRECTORY:
 *   Just add the directory name to CONTENT_DIRS below.
 *
 * MARKDOWN FILE NAMING:
 *   English (default):  README.md,  CHARTER.md,  topic.md
 *   Chinese:            README.zh.md,  CHARTER-ZH.md  (or CHARTER.zh.md)
 *   Korean:             README.ko.md,  CHARTER-KO.md  (or CHARTER.ko.md)
 *   Any non-README .md file becomes a page at its file path as URL.
 *
 * LINK REWRITING:
 *   All .md hrefs in rendered HTML are rewritten to web paths:
 *     CHARTER.md       → charter/
 *     CHARTER-ZH.md    → charter/
 *     README.md        → ./
 *     topic.md         → topic/
 *     topic.zh.md      → topic/
 *     path/README.md#x → path/#x
 */

import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

// ── Configuration ────────────────────────────────────────────

/** Locale → file-suffix variants. Default locale has empty array. */
const LOCALE_FILE_SUFFIXES: Record<string, string[]> = {
  en:      [],                // files without any locale suffix
  'zh-cn': ['.zh', '-ZH'],   // README.zh.md  or  CHARTER-ZH.md
  ko:      ['.ko', '-KO'],   // README.ko.md  or  CHARTER-KO.md
};

/** Top-level directories to scan recursively. */
const CONTENT_DIRS = ['scenes', 'stories', 'knowledge', 'works', 'courses'];

// Pre-compute: all non-default suffixes (for excluding localized files from EN)
const ALL_LOCALE_SUFFIXES = Object.entries(LOCALE_FILE_SUFFIXES)
  .filter(([k]) => LOCALE_FILE_SUFFIXES[k].length > 0)
  .flatMap(([, v]) => v);

// ── Public API ───────────────────────────────────────────────

interface PageEntry {
  params: { slug: string | undefined };
  props: { file: string };
}

/**
 * Scan the repository for all markdown pages matching the given Astro locale.
 * Returns an array suitable for Astro's getStaticPaths().
 */
export function scanPages(locale: string): PageEntry[] {
  const root = process.cwd();
  const suffixes = LOCALE_FILE_SUFFIXES[locale] ?? [];
  const isDefault = suffixes.length === 0;
  const pages: PageEntry[] = [];

  // Homepage
  const homeFile = resolveFile(root, 'README', isDefault, suffixes);
  if (homeFile) {
    pages.push({ params: { slug: undefined }, props: { file: homeFile } });
  }

  // Root-level .md files (CHARTER, CONTRIBUTING, TEMPLATES, …)
  for (const name of fs.readdirSync(root)) {
    if (!name.endsWith('.md') || name.startsWith('.')) continue;
    if (coreName(name).toLowerCase() === 'readme') continue; // handled above
    if (matchesLocale(name, isDefault, suffixes)) {
      pages.push({ params: { slug: toSlug(name) }, props: { file: name } });
    }
  }

  // Content directories (recursive)
  for (const dir of CONTENT_DIRS) {
    walkDir(root, dir, isDefault, suffixes, pages);
  }

  return pages;
}

/**
 * Read a markdown file, render to HTML, extract title, rewrite .md links.
 */
export async function renderPage(file: string): Promise<{ title: string; html: string }> {
  const raw = fs.readFileSync(path.resolve(file), 'utf-8');

  // Extract title from first # heading, strip inline markdown
  const m = raw.match(/^#\s+(.+)$/m);
  const title = m
    ? m[1]
        .replace(/\*[^*]*\*/g, '')                     // *italic*
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')       // [text](url)
        .trim()
    : 'Page';

  // Protect math expressions from marked's backslash escaping.
  // Extract $$...$$ and $...$ blocks, replace with placeholders,
  // then restore after markdown rendering.
  const mathStore: string[] = [];
  let src = raw;
  // Display math first ($$...$$)
  src = src.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    const idx = mathStore.length;
    mathStore.push(`$$${math}$$`);
    return `%%MATH${idx}%%`;
  });
  // Inline math ($...$) — avoid matching $$ or empty $
  src = src.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    const idx = mathStore.length;
    mathStore.push(`$${math}$`);
    return `%%MATH${idx}%%`;
  });

  let html = await marked(src);
  html = rewriteLinks(html);

  // Restore math expressions
  for (let i = 0; i < mathStore.length; i++) {
    html = html.replace(`%%MATH${i}%%`, mathStore[i]);
  }

  return { title, html };
}

// ── Internal helpers ─────────────────────────────────────────

function walkDir(
  root: string, dir: string,
  isDefault: boolean, suffixes: string[],
  pages: PageEntry[],
) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return;

  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isDirectory()) {
      walkDir(root, `${dir}/${entry.name}`, isDefault, suffixes, pages);
    } else if (entry.name.endsWith('.md') && matchesLocale(entry.name, isDefault, suffixes)) {
      const slug = toSlug(entry.name);
      pages.push({
        params: { slug: slug ? `${dir}/${slug}` : dir },
        props: { file: `${dir}/${entry.name}` },
      });
    }
  }
}

/** Find a locale-appropriate file by base name (e.g. 'README') */
function resolveFile(dir: string, baseName: string, isDefault: boolean, suffixes: string[]): string | null {
  if (isDefault) {
    const f = `${baseName}.md`;
    return fs.existsSync(path.join(dir, f)) ? f : null;
  }
  for (const s of suffixes) {
    const f = `${baseName}${s}.md`;
    if (fs.existsSync(path.join(dir, f))) return f;
  }
  return null;
}

/** Does this file belong to the target locale? */
function matchesLocale(filename: string, isDefault: boolean, suffixes: string[]): boolean {
  const stem = filename.replace(/\.md$/, '');
  if (isDefault) {
    // Default: must NOT have any known locale suffix
    return !ALL_LOCALE_SUFFIXES.some(s => stem.toLowerCase().endsWith(s.toLowerCase()));
  }
  // Non-default: must have one of this locale's suffixes
  return suffixes.some(s => stem.toLowerCase().endsWith(s.toLowerCase()));
}

/** Strip .md extension and all locale suffixes → pure base name */
function coreName(filename: string): string {
  let stem = filename.replace(/\.md$/, '');
  for (const s of ALL_LOCALE_SUFFIXES) {
    const re = new RegExp(esc(s) + '$', 'i');
    stem = stem.replace(re, '');
  }
  return stem;
}

/** Convert a markdown filename to a URL slug ('' for README) */
function toSlug(filename: string): string {
  const base = coreName(filename).toLowerCase();
  return base === 'readme' ? '' : base;
}

function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Rewrite .md href links in rendered HTML to web-friendly paths.
 * Handles relative paths, locale suffixes, and #fragments.
 */
function rewriteLinks(html: string): string {
  return html.replace(/href="([^"]*?\.md(?:#[^"]*)?)"/g, (_match, raw: string) => {
    // Skip absolute URLs
    if (raw.startsWith('http://') || raw.startsWith('https://')) return _match;

    // Separate #fragment
    const hashIdx = raw.indexOf('#');
    const mdPath = hashIdx >= 0 ? raw.substring(0, hashIdx) : raw;
    const fragment = hashIdx >= 0 ? raw.substring(hashIdx) : '';

    // Separate directory prefix and filename
    const slashIdx = mdPath.lastIndexOf('/');
    const prefix = slashIdx >= 0 ? mdPath.substring(0, slashIdx + 1) : '';
    const file = slashIdx >= 0 ? mdPath.substring(slashIdx + 1) : mdPath;

    const slug = toSlug(file);
    if (!slug) {
      // README → directory index
      return `href="${prefix || './'}${fragment}"`;
    }
    return `href="${prefix}${slug}/${fragment}"`;
  });
}
