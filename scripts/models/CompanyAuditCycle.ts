import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"

export class CompanyAuditCycle
  extends Application
  implements IModelApplication<CompanyAuditCycle, ReturnType<typeof useCompanyDirectorAppointmentStore>>
{
  financialYearEndDate: string = ""
  isSubmittingAudited: boolean = false
  isSubmittingUnaudited: boolean = false
  isApplyingForEpc: boolean = false
  isDocumentsReceived: boolean = false
  circulationDate: string = ""
  lodgementDate: string = ""
  isExtended: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyAuditCycle) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.financialYearEndDate = data.financial_year_end_date
    this.isSubmittingAudited = data.is_submitting_audited
    this.isSubmittingUnaudited = data.is_submitting_unaudited
    this.isApplyingForEpc = data.is_applying_for_epc
    this.isDocumentsReceived = data.is_documents_received
    this.circulationDate = data.circulation_date
    this.lodgementDate = data.lodgment_date
    this.isExtended = data.is_extended ?? false
  }

  cloneDetails(data: CompanyAuditCycle): void {
    super.clone(data)
    this.financialYearEndDate = data.financialYearEndDate
    this.isSubmittingAudited = data.isSubmittingAudited
    this.isSubmittingUnaudited = data.isSubmittingUnaudited
    this.isApplyingForEpc = data.isApplyingForEpc
    this.isDocumentsReceived = data.isDocumentsReceived
    this.circulationDate = data.circulationDate
    this.lodgementDate = data.lodgementDate
    this.isExtended = data.isExtended
  }

  getRequestBody(): object {
    const time = useLocalTime()

    if (this.isSubmittingAudited) {
      return {
        company_id: this.companyId,
        financial_year_end_date: time.formatDateOnlySystem(this.financialYearEndDate),
        is_submitting_audited: this.isSubmittingAudited,
        is_submitting_unaudited: this.isSubmittingUnaudited,
        status: this.status,
      }
    } else {
      return {
        company_id: this.companyId,
        financial_year_end_date: time.formatDateOnlySystem(this.financialYearEndDate),
        status: this.status,
      }
    }
  }

  initiateAudit() {
    this.isSubmittingAudited = true
    this.isSubmittingUnaudited = false
  }

  applyAuditExemption() {
    this.isSubmittingUnaudited = true
    this.isSubmittingAudited = false
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && !StringUtil.isNullOrEmpty(this.financialYearEndDate)
  }

  async create(repository: ReturnType<typeof useCompanyDirectorAppointmentStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyDirectorAppointmentStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyDirectorAppointmentStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }
}
