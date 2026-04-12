// Internationalization utilities
// English is the default locale (no prefix in URL)
// Other locales: /zh-cn/..., /ko/...

export const languages = {
  en: 'English',
  'zh-cn': '简体中文',
  ko: '한국어',
} as const;

export type Locale = keyof typeof languages;

// UI strings for the site shell
export const ui = {
  en: {
    'site.title': "Thomas's Digital Art Academy",
    'site.tagline': 'The Collage Garden',
    'nav.scenes': 'Scenes',
    'nav.stories': 'Stories',
    'nav.knowledge': 'Knowledge',
    'nav.works': 'Works',
    'nav.courses': 'Courses',
    'nav.charter': 'Charter',
    'footer.content_license': 'Content: CC BY-SA 4.0',
    'footer.code_license': 'Code: MIT',
    'label.ai_cocreated': 'AI co-created',
    'label.draft': 'Draft',
    'label.updated': 'Updated',
  },
  'zh-cn': {
    'site.title': '托马斯数字艺术学园',
    'site.tagline': '拼贴花园',
    'nav.scenes': '场景',
    'nav.stories': '故事',
    'nav.knowledge': '知识',
    'nav.works': '作品',
    'nav.courses': '课程',
    'nav.charter': '宪章',
    'footer.content_license': '内容：CC BY-SA 4.0',
    'footer.code_license': '代码：MIT',
    'label.ai_cocreated': 'AI 共创',
    'label.draft': '草稿',
    'label.updated': '更新于',
  },
  ko: {
    'site.title': '토마스 디지털 아트 아카데미',
    'site.tagline': '콜라주 가든',
    'nav.scenes': '장면',
    'nav.stories': '이야기',
    'nav.knowledge': '지식',
    'nav.works': '작품',
    'nav.courses': '코스',
    'nav.charter': '헌장',
    'footer.content_license': '콘텐츠: CC BY-SA 4.0',
    'footer.code_license': '코드: MIT',
    'label.ai_cocreated': 'AI 공동 창작',
    'label.draft': '초안',
    'label.updated': '업데이트',
  },
} as const;

/**
 * Get a UI string for the given locale, falling back to English.
 */
export function t(locale: Locale, key: keyof (typeof ui)['en']): string {
  return ui[locale]?.[key] ?? ui.en[key];
}
