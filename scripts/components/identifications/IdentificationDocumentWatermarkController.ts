import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import type { PropsIdentificationDocumentWatermark } from "~/scripts/props/PropsIdentificationDocumentWatermark"
import { StringUtil } from "~/scripts/utils/String"

export class IdentificationDocumentWatermarkController {
  emitEvents: any | null = null

  identificationFileUrl: Ref<string> = ref<string>("")
  altIdentificationFileUrl: Ref<string | null> = ref<string | null>(null)
  markerText: Ref<string> = ref<string>("")
  paperOrientation: Ref<PaperOrientation> = ref<PaperOrientation>(PaperOrientation.Landscape)
  paperSize: Ref<PaperSize> = ref<PaperSize>(PaperSize.A4)

  constructor(props: PropsIdentificationDocumentWatermark, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setDataFromProps(props)
  }

  setDataFromProps(props: PropsIdentificationDocumentWatermark): void {
    this.identificationFileUrl.value = props.identificationFileUrl
    this.altIdentificationFileUrl.value = props.altIdentificationFileUrl
    this.markerText.value = props.markerText
    this.paperOrientation.value = props.paperOrientation
    this.paperSize.value = props.paperSize
  }

  get hasAltIdentificationFile(): boolean {
    return !StringUtil.isNullOrEmpty(this.altIdentificationFileUrl.value)
  }
}
