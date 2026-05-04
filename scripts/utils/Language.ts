import { useI18n } from '#imports'

export class Language {
  static getLocale(): string {
    const { locale } = useI18n()

    return locale.value
  }

  static isEnglish() {
    return this.getLocale() === 'en'
  }

  static isMalay() {
    return this.getLocale() === 'bm'
  }

  static setLanguage(language: 'en' | 'bm') {
    const { setLocale } = useI18n()
    setLocale(language)
  }
}
