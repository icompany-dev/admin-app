import { StringUtil } from "~/scripts/utils/String"

export class StatementAccompanyingMcrController {
  resolutionTitle: Ref<string> = ref<string>("")

  constructor(resolutionTitle: string) {
    this.resolutionTitle.value = resolutionTitle
  }

  setResolutionTitle(resolutionTitle: string): void {
    this.resolutionTitle.value = resolutionTitle
  }

  isSpecialResolution(): boolean {
    return StringUtil.contains(this.resolutionTitle.value, "special resolution")
  }

  lapseDate(): string {
    return this.isSpecialResolution() ? "28 days from date of circulation" : "21 days from date of circulation"
  }

  circulationDate(): string {
    return "To be determined by iCompany"
  }
}
