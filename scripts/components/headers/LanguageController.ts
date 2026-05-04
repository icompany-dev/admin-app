export class LanguageController {
  language = useLanguage()

  constructor() {}

  setLanguage(language: "en" | "bm"): void {
    this.language.setLanguage(language)
  }

  onToggleClicked(): void {
    this.language.setLanguage(this.getAlternateLanguage())
  }

  isEnglish(): boolean {
    return this.language.isEnglish()
  }

  isMalay(): boolean {
    return this.language.isMalay()
  }

  languageCopywriting(): string {
    return this.isEnglish() ? "EN" : "BM"
  }

  getLabel(): string {
    return this.isEnglish() ? "Language" : "Bahasa"
  }

  getAlternateLanguage(): "en" | "bm" {
    if (this.isEnglish()) {
      return "bm"
    } else {
      return "en"
    }
  }
}
