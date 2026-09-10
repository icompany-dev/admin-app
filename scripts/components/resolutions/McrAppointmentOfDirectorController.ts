import { CompanyDirectorAppointment } from "~/scripts/models/CompanyDirectorAppointment"
import { ResolutionAppointmentOfDirectorController } from "./ResolutionAppointmentOfDirectorController"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StringUtil } from "~/scripts/utils/String"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"

export class McrAppointmentOfDirectorController extends ResolutionAppointmentOfDirectorController {
  constructor(props: IPropsResolutionDocument<CompanyDirectorAppointment>, emitEvents: any | null) {
    super(props, true, emitEvents)
  }

  override async getPdfPages(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    this.isGettingPdfPages.value = true

    let originalResolutionContent = this.mcrResolutionContent.value
    if (!StringUtil.isNullOrEmpty(this.mcrResolutionContent.value)) {
      let templateProcessor = new TemplateProcessor(null)
      this.mcrResolutionContent.value = templateProcessor.replaceInputsWithValues(this.mcrResolutionContent.value)
    }

    await nextTick()
    let pdfPages = await PdfPaperUtil.getPdfElements(this.documentRef)

    this.mcrResolutionContent.value = originalResolutionContent

    this.isGettingPdfPages.value = false

    return pdfPages
  }
}
