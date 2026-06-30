import type { AuditorPartner } from "~/scripts/models/AuditorPartner"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"

export class LetterOfNominationOfAuditorController {
  companyId: Ref<string> = ref<string>("")
  companyAuditorAppointmentRepository = useCompanyAuditorAppointmentStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  auditorPartners = ref<AuditorPartner[]>([])

  time = useLocalTime()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())
  resolutionContent = ref<string>("")
  originalResolutionContent = ref<string>("")

  private documentTemplateId: string = "1435a794-36ef-4c8b-9cb0-58b9dea307dd"

  constructor(companyId: string, applicationId: string | null, isInPreviewMode: boolean, emitEvents: any | null) {
    this.setCompanyId(companyId)
    this.setDocumentTemplate()
  }
}
