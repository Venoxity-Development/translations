export enum Language {
  // English
  ENGLISH = "en",

  // Foreign Languages
  FRENCH = "fr",
  GERMAN = "de",
  HUNGARIAN = "hu",
  PORTUGUESE = "pt",
  THAI = "th",
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
  verified: true
},

  // Foreign Languages
  {
  display: "French",
  emoji: "🇫🇷",
  i18n: "fr",
  dayjs: "fr",
  incomplete: true
},
  {
  display: "German",
  emoji: "🇩🇪",
  i18n: "de",
  dayjs: "de",
  verified: true,
  incomplete: true
},
  {
  display: "Hungarian",
  emoji: "🇭🇺",
  i18n: "hu",
  dayjs: "hu",
  incomplete: true,
  verified: true
},
  {
  display: "Portuguese",
  emoji: "🇵🇹",
  i18n: "pt",
  dayjs: "pt",
  incomplete: true,
  verified: true
},
  {
  display: "Thai",
  emoji: "🇹🇭",
  i18n: "th",
  dayjs: "th",
  verified: true,
  incomplete: true
},
};
