# Contributing to The Collage Garden

Welcome! This garden grows with every contributor. Whether you're a student, a fellow learner, or a curious passerby — you're welcome to plant something here.

## Before You Start

Please read the [Charter](CHARTER.md). It is short, and it is the constitution of this garden. Every contribution should respect its principles.

## What You Can Contribute

- **Stories** — Share your learning journey, creative process, or exploration
- **Knowledge notes** — Document something you learned that others might need
- **Works** — Share a creative piece born from scene-based learning
- **Improvements** — Fix errors, improve clarity, add translations
- **Ideas** — Open an issue to suggest a new topic, scene, or direction

## How to Contribute

### Quick edits

For small fixes (typos, broken links, clarifications):
1. Click the "Edit" button on any page
2. Make your change
3. Submit a pull request

### New content

1. **Fork** this repository
2. **Create a branch** with a descriptive name:
   ```
   git checkout -b story/my-first-3d-model
   ```
3. **Write your content** using the templates in [TEMPLATES.md](TEMPLATES.md)
4. **Important**: Set the `aiCoCreated` field honestly (Charter Principle VII)
5. **Submit a pull request** with a brief description of what you're sharing

### Content guidelines

- **Start from a real question or scenario** (Charter Principle II)
- **Credit your sources** and admit what you don't understand (Principle III)
- **Label AI co-creation transparently** (Principle VII)
- **Use the frontmatter templates** defined in [TEMPLATES.md](TEMPLATES.md)
- **Write in English** as the primary language; translations are welcome as separate files

### File naming

- Use kebab-case: `why-erhu-sounds-different.md`
- Place content in the correct directory:
  - Stories → `src/content/stories/`
  - Knowledge → `src/content/knowledge/{discipline}/`
  - Works → `src/content/works/`
  - Courses → `src/content/courses/`

### Translations

To create a translated version of an existing file:

```
src/content/stories/building-the-garden.md        ← English (default)
src/content/stories/building-the-garden.zh-cn.md  ← 中文
src/content/stories/building-the-garden.ko.md     ← 한국어
```

## Code of Conduct

Be kind. Be honest. Be curious. This is a garden, not a battleground.

We don't have a formal code of conduct document because the [Charter](CHARTER.md) already covers our values. If you're ever unsure, re-read Article Zero.

## Questions?

Open an issue. There are no stupid questions — only honest ones.
