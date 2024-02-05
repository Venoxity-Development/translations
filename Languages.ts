export enum Language {
  // English
  ENGLISH = "en",

  // Foreign Languages
  FRENCH = "fr",
  GERMAN = "de",
  HUNGARIAN = "hu",
  ITALIAN = "it",
  SPANISH = "es",
  SWEDISH = "sv",
  THAI = "th",
  TURKISH = "tr",
}

export interface LanguageEntry {
  /**
   * What should appear in the UI as the name for the language
   */
  display: string;

  /**
   * What emoji should be displayed
   */
  emoji: string;

  /**
   * Filename of the related language file
   */
  i18n: string;

  /**
   * Dayjs locale file if different
   */
  dayjs?: string;

  /**
   * Whether the UI should be right-to-left
   */
  rtl?: boolean;

  /**
   * Whether the language is a conlang (constructed language) or a joke
   */
  cat?: "const" | "alt";

  /**
   * Whether the language has a maintainer
   * (patched in)
   */
  verified?: boolean;

  /**
   * Whether the language is incomplete
   * (patched in)
   */
  incomplete?: boolean;
}

export const Languages: { [key in Language]: LanguageEntry } = {
  en: {
    display: "English",
    emoji: "🇺🇸",
    i18n: "en",
    dayjs: "en",
  },

  // Foreign Languages
  fr: {
    display: "Français",
    emoji: "🇫🇷",
    i18n: "fr",
    dayjs: "fr",
  },
  de: {
    display: "Deutsch",
    emoji: "🇩🇪",
    i18n: "de",
    dayjs: "de",
  },
  hu: {
    display: "Magyar",
    emoji: "🇭🇺",
    i18n: "hu",
    dayjs: "hu",
  },
  th: {
    display: "ไทย",
    emoji: "🇹🇭",
    i18n: "th",
    dayjs: "th",
  },
  es: {
    display: "Español",
    emoji: "🇪🇸",
    i18n: "es",
    dayjs: "es",
  },
  it: {
    display: "Italiano",
    emoji: "🇮🇹",
    i18n: "it",
    dayjs: "it",
  },
  sv: {
    display: "Svenska",
    emoji: "🇸🇪",
    i18n: "sv",
    dayjs: "sv",
  },
  tr: {
    display: "Türkçe",
    emoji: "🇹🇷",
    i18n: "tr",
    dayjs: "tr",
  }
};
