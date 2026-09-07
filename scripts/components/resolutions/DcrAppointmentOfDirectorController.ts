import { CompanyDirectorAppointment } from "~/scripts/models/CompanyDirectorAppointment"
import { ResolutionAppointmentOfDirectorController } from "./ResolutionAppointmentOfDirectorController"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StringUtil } from "~/scripts/utils/String"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"

export class DcrAppointmentOfDirectorController extends ResolutionAppointmentOfDirectorController {
  constructor(props: IPropsResolutionDocument<CompanyDirectorAppointment>, emitEvents: any | null) {
    super(props, true, emitEvents)
  }

  override async getPdfPages(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    this.isGettingPdfPages.value = true

    let originalResolutionContent = this.dcrResolutionContent.value
    if (!StringUtil.isNullOrEmpty(this.dcrResolutionContent.value)) {
      let templateProcessor = new TemplateProcessor(null)
      this.dcrResolutionContent.value = templateProcessor.replaceInputsWithValues(this.dcrResolutionContent.value)
    }

    await nextTick()
    let pdfPages = await PdfPaperUtil.getPdfElements(this.documentRef)

    this.dcrResolutionContent.value = originalResolutionContent

    this.isGettingPdfPages.value = false

    return pdfPages
  }
}
