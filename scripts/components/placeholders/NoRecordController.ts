export class NoRecordController {
  language = useLanguage()

  title: Ref<string> = ref<string>("")
  subtitle: Ref<string> = ref<string>("")

  constructor(title: string, subtitle: string) {
    if (title) {
      this.title.value = title
    }

    if (subtitle) {
      this.subtitle.value = subtitle
    }
  }

  setTitle(title: string): void {
    this.title.value = title
  }

  setSubtitle(subtitle: string): void {
    this.subtitle.value = subtitle
  }

  titleLabel(): string {
    if (this.title.value) {
      return this.title.value
    }

    return this.language.isMalay() ? `Tiada Aplikasi Lepas ditemui.` : `No Past Application found.`
  }

  subtitleLabel(): string {
    if (this.subtitle.value) {
      return this.subtitle.value
    }

    return this.language.isMalay()
      ? `Data akan dipaparkan apabila tersedia.`
      : `Data will appear once it becomes available.`
  }
}
