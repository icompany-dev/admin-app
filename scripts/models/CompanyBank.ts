import type { IModel } from "./IModel"
import { Company } from "./Company"
import { StringUtil } from "../utils/String"
import { Bank } from "./Bank"
import { BankBranch } from "~/scripts/models/BankBranch"
import { Error } from "../library/Error"
import type { CompanyBankSignatory } from "./CompanyBankSignatory"

export class CompanyBank implements IModel<CompanyBank> {
  id: string = ""
  companyId: string = ""
  company: Company = new Company()
  bankId: string = ""
  bank: Bank = new Bank()
  bankBranchId: string = ""
  bankBranch: BankBranch = new BankBranch()
  accountNumber: string = ""
  status: string = ""
  createdAt: string | null = null
  updatedAt: string | null = null

  signatories: CompanyBankSignatory[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyBank) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  getRequestBody(): object {
    return {
      account_number: this.accountNumber,
    }
  }

  getRequestBodyToCreate(): object {
    return {
      company_id: this.companyId,
      bank_id: this.bankId,
      bank_branch_id: this.bankBranchId,
      account_number: this.accountNumber,
      signatories: this.signatories.map((cbs: CompanyBankSignatory) => {
        return cbs.getRequestBody()
      }),
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id || ""
    this.companyId = data.company_id || ""
    this.company = new Company(data.company)
    this.bankId = data.bank_id || ""
    this.bank = new Bank(data.bank)
    this.bankBranchId = data.bank_branch_id || ""
    this.bankBranch = new BankBranch(data.bank_branch)
    this.accountNumber = data.account_number || ""
    this.status = data.status || ""
    this.createdAt = data.created_at || null
    this.updatedAt = data.updated_at || null
  }

  clone(data: CompanyBank): void {
    this.id = data.id
    this.companyId = data.companyId
    this.company = new Company(data.company)
    this.bankId = data.bankId
    this.bank = new Bank(data.bank)
    this.bankBranchId = data.bankBranchId
    this.bankBranch = new BankBranch(data.bankBranch)
    this.accountNumber = data.accountNumber
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  canCreate(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.bankId) &&
      !StringUtil.isNullOrEmpty(this.bankBranchId) &&
      !StringUtil.isNullOrEmpty(this.accountNumber) &&
      this.signatories.length > 0 &&
      this.signatories.every((cbs: CompanyBankSignatory) => {
        return cbs.canCreate()
      })
    )
  }

  async create(repository: ReturnType<typeof useCompanyBankStore>): Promise<void> {
    if (!this.canCreate()) {
      let error = new Error()
      error.setForIncompleteData()
      throw error
    }

    await repository.create(this.getRequestBodyToCreate())
  }

  async update(repository: ReturnType<typeof useCompanyBankStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      return
    }

    await repository.update(this.id, this.getRequestBody())
  }

  async remove(repository: ReturnType<typeof useCompanyBankStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      return
    }

    await repository.remove(this.id)
  }
}
