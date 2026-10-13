import { Application } from "./Application"
import { DocumentHandover } from "./DocumentHandover"
import type { IModelApplication } from "./IModelApplication"
import { StringUtil } from "../utils/String"
import { Error } from "~/scripts/library/Error"

export class CompanySwitchOut
  extends Application
  implements IModelApplication<CompanySwitchOut, ReturnType<typeof useCompanySwitchOutStore>>
{
  isCosecResigned: boolean = false
  newCosecName: string = ""
  cosecName: string = ""
  effectiveResignationDate: string = ""
  effectiveAppointmentDate: string = ""
  handoverDocuments: DocumentHandover[] = []

  cosecNames: string[] = []
  newCosecNames: string[] = []

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanySwitchOut) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)

    this.isCosecResigned = data.is_cosec_resigned ?? false
    this.newCosecName = data.new_cosec_name ?? ""
    this.cosecName = data.cosec_name ?? ""
    this.effectiveResignationDate = data.effective_resignation_date ?? ""
    this.effectiveAppointmentDate = data.effective_appointment_date ?? ""
    this.handoverDocuments =
      data.handover_documents && Array.isArray(data.handover_documents)
        ? data.handover_documents.map((d: any) => {
            return new DocumentHandover(d)
          })
        : []

    this.cosecNames = this.cosecName.split(",")
    this.newCosecNames = this.newCosecName.split(",")
  }

  cloneDetails(data: CompanySwitchOut): void {
    super.clone(data)

    this.isCosecResigned = data.isCosecResigned
    this.newCosecName = data.newCosecName
    this.cosecName = data.cosecName
    this.effectiveResignationDate = data.effectiveResignationDate
    this.effectiveAppointmentDate = data.effectiveAppointmentDate
    this.handoverDocuments = data.handoverDocuments.map((d: DocumentHandover) => {
      return new DocumentHandover(d)
    })

    this.cosecNames = data.cosecNames
    this.newCosecNames = data.newCosecNames
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      is_cosec_resigned: this.isCosecResigned,
      new_cosec_name: this.newCosecNames.join(","),
      cosec_name: this.cosecNames.join(","),
      effective_resignation_date: this.effectiveResignationDate,
      effective_appointment_date: this.effectiveAppointmentDate,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanySwitchOutStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      let error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanySwitchOutStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanySwitchOutStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error()
      error.setForCUD()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error = new Error()
      error.setForCUD()
      throw error
    }

    return response
  }
}
