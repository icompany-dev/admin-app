import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"

export class CompanyChangeBankSignatories
  extends Application
  implements IModelApplication<CompanyChangeBankSignatories, ReturnType<typeof useCompanyDirectorAppointmentStore>>
{
  companyBankId = ''
  companyBank = null // TODO FIXME

  bankName: string = ''
  bankBranch: string = ''
  bankAddress: string = ''
  bankAccountNo: string = ''
  authorisedSignatories: any[] = [] // TODO FIXME
  authorisedType: string = ''

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyChangeBankSignatories) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.companyBankId = data.company_bank_id
    this.companyBank = data.company_bank // TODO FIXME
    this.bankName = data.bank_name ?? ''
    this.bankBranch = data.bank_branch ?? ''
    this.bankAddress = data.bank_address ?? ''
    this.bankAccountNo = data.bank_account_no ?? ''

    this.authorisedSignatories = data.authorised_signatories // TODO FIXME
    this.authorisedType = data.authorised_type ?? ''
  }

  cloneDetails(data: CompanyChangeBankSignatories): void {
    super.clone(data)
    this.companyBankId = data.companyBankId
    this.companyBank = data.companyBank // TODO FIXME
    this.bankName = data.bankName
    this.bankBranch = data.bankBranch
    this.bankAddress = data.bankAddress
    this.bankAccountNo = data.bankAccountNo
    this.authorisedSignatories = data.authorisedSignatories // TODO FIXME
    this.authorisedType = data.authorisedType
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      company_bank_id: this.companyBankId,
      bank_name: this.bankName,
      bank_branch: this.bankBranch,
      bank_address: this.bankAddress,
      bank_account_no: this.bankAccountNo,
      authorised_signatories: this.authorisedSignatories.map((item) => { return item.getRequestBody() }),
      authorised_type: this.authorisedType,
      status: this.status
    }
  }

  canSubmit(): boolean {
    return true
  }

  async create(repository: ReturnType<typeof useCompanyDirectorAppointmentStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error = new Error(
        Error.ERROR_TYPE_DATA,
        "There are missing data. Please ensure all the required fields have been filled up."
      )
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error = new Error(Error.ERROR_TYPE_API, repository.error)
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyDirectorAppointmentStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error(
        Error.ERROR_TYPE_DATA,
        "There are missing data. Please ensure all the required fields have been filled up."
      )
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error = new Error(Error.ERROR_TYPE_API, repository.error)
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyDirectorAppointmentStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error(
        Error.ERROR_TYPE_DATA,
        "Application ID is empty. Please create the application before removing."
      )
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error = new Error(Error.ERROR_TYPE_API, repository.error)
      throw error
    }

    return response
  }
}
