import _ from "lodash"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { Bank } from "./Bank"
import { BankBranch } from "./BankBranch"
import { CompanyBankSignatory } from "./CompanyBankSignatory"
import type { IModelApplication } from "./IModelApplication"
import { OnlineBanking } from "../types/banks/OnlineBanking"
import { AllianceBankApplicationDetails } from "../types/banks/AllianceBankApplicationDetails"
import { AffinBankApplicationDetails } from "../types/banks/AffinBankApplicationDetails"

export class CompanyBankAccountOpening
  extends Application
  implements IModelApplication<CompanyBankAccountOpening, ReturnType<typeof useCompanyBankAccountOpeningStore>>
{
  type: string = ""
  bankId: string = ""
  bank: Bank = new Bank()
  bankBranchId: string = ""
  bankBranch: BankBranch = new BankBranch()
  signatories: CompanyBankSignatory[] = []
  metaData: any = {}
  requirements: any = []

  onlineBanking: OnlineBanking[] = []
  signatoryType: string = "anyone"

  allianceBankApplicationDetails: AllianceBankApplicationDetails | null = null
  affinBankApplicationDetails: AffinBankApplicationDetails | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyBankAccountOpening) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.type = data.type ?? ""
    this.bankId = data.bank_id ?? ""
    this.bank = new Bank(data.bank)
    this.bankBranchId = data.bank_branch?.id ?? ""
    this.bankBranch = new BankBranch(data.bank_branch)
    this.signatories =
      data.signatories && Array.isArray(data.signatories)
        ? data.signatories.map((d: any) => {
            return new CompanyBankSignatory(d)
          })
        : []
    this.metaData = data.meta_data ? JSON.parse(JSON.stringify(data.meta_data)) : {}
    this.requirements = data.requirements ? JSON.parse(JSON.stringify(data.requirements)) : []

    if (data.meta_data) {
      if (data.meta_data.online_banking && Array.isArray(data.meta_data.online_banking)) {
        this.onlineBanking = data.meta_data.online_banking.map((d: any) => {
          return new OnlineBanking(d)
        })
      }

      if (data.meta_data.type) {
        this.signatoryType = data.meta_data.type
      }

      if (data.meta_data.alliance_bank_details) {
        this.allianceBankApplicationDetails = new AllianceBankApplicationDetails(data.meta_data.alliance_bank_details)
      }

      if (data.meta_data.affin_bank_details) {
        this.affinBankApplicationDetails = new AffinBankApplicationDetails(data.meta_data.affin_bank_details)
      }
    }
  }

  cloneDetails(data: CompanyBankAccountOpening): void {
    super.clone(data)
    this.type = data.type
    this.bankId = data.bankId
    this.bank = new Bank(data.bank)
    this.bankBranchId = data.bankBranchId
    this.bankBranch = new BankBranch(data.bankBranch)
    this.signatories = data.signatories.map((d: any) => {
      return new CompanyBankSignatory(d)
    })
    this.requirements = data.requirements
    this.metaData = _.cloneDeep(data.metaData)
    this.onlineBanking = data.onlineBanking.map((d: any) => {
      return new OnlineBanking(d)
    })
    this.signatoryType = data.signatoryType
    this.allianceBankApplicationDetails =
      data.allianceBankApplicationDetails !== null
        ? new AllianceBankApplicationDetails(data.allianceBankApplicationDetails)
        : null

    this.affinBankApplicationDetails =
      data.affinBankApplicationDetails !== null
        ? new AffinBankApplicationDetails(data.affinBankApplicationDetails)
        : null
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      type: this.type,
      bank_id: this.bankId,
      bank_branch_id: this.bankBranchId,
      signatories: this.signatories.map((s: CompanyBankSignatory) => {
        return s.getRequestBody()
      }),
      meta_data: {
        type: this.signatoryType,
        online_banking: this.onlineBanking,
        ...(this.allianceBankApplicationDetails !== null && {
          alliance_bank_details: this.allianceBankApplicationDetails,
        }),
        ...(this.affinBankApplicationDetails !== null && {
          affin_bank_details: this.affinBankApplicationDetails,
        }),
      },
      requirements: this.requirements,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && !StringUtil.isNullOrEmpty(this.bankId)
  }

  async create(repository: ReturnType<typeof useCompanyBankAccountOpeningStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error()
      error.setForIncompleteData()
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

  async update(repository: ReturnType<typeof useCompanyBankAccountOpeningStore>): Promise<void> {
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

  async addBankAccountNumber(
    bankAccountNumber: string,
    repository: ReturnType<typeof useCompanyBankAccountOpeningStore>
  ): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.addBankAccountNumber(this.id, bankAccountNumber)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyBankAccountOpeningStore>): Promise<void> {
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
