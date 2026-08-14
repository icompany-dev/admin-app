import { Application } from "~/scripts/models/Application"
import { CompanyBank } from "./CompanyBank"
import { StringUtil } from "../utils/String"
import type { IModelApplication } from "./IModelApplication"
import { Error } from "../library/Error"

export class CompanyBankAccountClosure
  extends Application
  implements IModelApplication<CompanyBankAccountClosure, ReturnType<typeof useCompanyBankAccountClosureStore>>
{
  companyBankId: string | null = null
  companyBank: CompanyBank | null = null
  bankName: string = ""
  bankBranch: string = ""
  bankAddress: string = ""
  bankAccountNo: string = ""
  transferToBankName: string = ""
  transferToBeneficiary: string = ""
  transferToBankAccountNo: string = ""

  constructor(data: any | null = null) {
    super()
    if (!data) {
      return
    }

    if (data instanceof CompanyBankAccountClosure) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.companyBankId = data.company_bank_id ?? null
    this.companyBank = data.company_bank ? new CompanyBank(data.company_bank) : null
    this.bankName = data.bank_name ?? ""
    this.bankBranch = data.bank_branch ?? ""
    this.bankAddress = data.bank_address ?? ""
    this.bankAccountNo = data.bank_account_no ?? ""
    this.transferToBankName = data.transfer_to_bank_name ?? ""
    this.transferToBeneficiary = data.transfer_to_beneficiary ?? ""
    this.transferToBankAccountNo = data.transfer_to_bank_account_no ?? ""
  }

  cloneDetails(data: CompanyBankAccountClosure): void {
    super.clone(data)
    this.companyBankId = data.companyBankId
    this.companyBank = data.companyBank ? new CompanyBank(data.companyBank) : null
    this.bankName = data.bankName
    this.bankBranch = data.bankBranch
    this.bankAddress = data.bankAddress
    this.bankAccountNo = data.bankAccountNo
    this.transferToBankName = data.transferToBankName
    this.transferToBeneficiary = data.transferToBeneficiary
    this.transferToBankAccountNo = data.transferToBankAccountNo
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      company_bank_id: this.companyBankId,
      bank_name: this.bankName,
      bank_branch: this.bankBranch,
      bank_address: this.bankAddress,
      bank_account_no: this.bankAccountNo,
      transfer_to_bank_name: this.transferToBankName,
      transfer_to_beneficiary: this.transferToBeneficiary,
      transfer_to_bank_account_no: this.transferToBankAccountNo,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.bankName) &&
      !StringUtil.isNullOrEmpty(this.bankBranch) &&
      !StringUtil.isNullOrEmpty(this.bankAddress) &&
      !StringUtil.isNullOrEmpty(this.bankAccountNo) &&
      !StringUtil.isNullOrEmpty(this.transferToBankName) &&
      !StringUtil.isNullOrEmpty(this.transferToBeneficiary) &&
      !StringUtil.isNullOrEmpty(this.transferToBankAccountNo)
    )
  }

  async create(repository: ReturnType<typeof useCompanyBankAccountClosureStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyBankAccountClosureStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
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

  async remove(repository: ReturnType<typeof useCompanyBankAccountClosureStore>): Promise<void> {
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
