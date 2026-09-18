import { Application } from "~/scripts/models/Application"
import { CompanyBank } from "./CompanyBank"
import { CompanyBankSignatory } from "./CompanyBankSignatory"
import type { IModelApplication } from "./IModelApplication"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"

export class CompanyChangeBankSignatory
  extends Application
  implements IModelApplication<CompanyChangeBankSignatory, ReturnType<typeof useCompanyChangeBankSignatoryStore>>
{
  companyBankId: string = ""
  companyBank: CompanyBank = new CompanyBank()
  signatories: CompanyBankSignatory[] = []

  constructor(data: any | null = null) {
    super()
    if (!data) {
      return
    }

    if (data instanceof CompanyChangeBankSignatory) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.companyBankId = data.company_bank_id
    this.companyBank = new CompanyBank(data.company_bank)
    this.signatories =
      data.signatories && Array.isArray(data.signatories)
        ? data.signatories.map((d: any) => {
            return new CompanyBankSignatory(d)
          })
        : []
  }

  cloneDetails(data: CompanyChangeBankSignatory): void {
    super.clone(data)
    this.companyBankId = data.companyBankId
    this.companyBank = new CompanyBank(data.companyBank)
    this.signatories = data.signatories.map((d: any) => {
      return new CompanyBankSignatory(d)
    })
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && !StringUtil.isNullOrEmpty(this.companyBankId)
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      company_bank_id: this.companyBankId,
      signatories: this.signatories.map((d: CompanyBankSignatory) => {
        return d.getRequestBody()
      }),
      status: this.status,
    }
  }

  async create(repository: ReturnType<typeof useCompanyChangeBankSignatoryStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyChangeBankSignatoryStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyChangeBankSignatoryStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    return response
  }
}
