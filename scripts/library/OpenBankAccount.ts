import { Bank } from "../models/Bank"
import { CompanyBankAccountOpening } from "../models/CompanyBankAccountOpening"
import { CompanyBankSignatory } from "../models/CompanyBankSignatory"
import { StringUtil } from "../utils/String"
import { Error } from "./Error"

export class OpenBankAccount {
  companyId: string = ""
  bankId: string = ""
  branchId: string = ""
  signatories: CompanyBankSignatory[] = []
  signatoryType: string = "anyone"
  authorisedOnlineBank: any = [] // create type

  applicationId: string = ""
  application: CompanyBankAccountOpening = new CompanyBankAccountOpening()

  bank: Bank = new Bank()

  constructor(companyId: string, bankId: string) {
    this.companyId = companyId
    this.bankId = bankId
  }

  async fetchBank(): Promise<void> {
    let repository = useBankStore()
    let response = await repository.fetch(this.bankId)

    if (repository.error !== null) {
      throw repository.error
    }

    this.bank = new Bank(response)
  }

  async initializeApplication(applicationId: string): Promise<void> {
    let repository = useCompanyBankAccountOpeningStore()
    let response = await repository.fetch(applicationId)

    if (repository.error !== null) {
      throw repository.error
    }

    this.application = new CompanyBankAccountOpening(response)
    this.applicationId = this.application.id
  }

  setApplication(application: CompanyBankAccountOpening): void {
    this.application = new CompanyBankAccountOpening(application)
    this.applicationId = this.application.id
  }

  async create(): Promise<void> {
    this.application = new CompanyBankAccountOpening()
    this.application.companyId = this.companyId
    this.application.bankId = this.bankId

    if (StringUtil.isNullOrEmpty(this.branchId)) {
      await this.fetchBank()
      if (this.bank.branches.length <= 0) {
        throw new Error(
          Error.ERROR_TYPE_DATA,
          "The bank does not have any branches. Please contact Admin to add branch."
        )
      }

      this.branchId = this.bank.branches[0].id
    }
    this.application.bankBranchId = this.branchId

    let repository = useCompanyBankAccountOpeningStore()
    await this.application.create(repository)
  }

  setSignatories(signatories: CompanyBankSignatory[]): void {
    this.signatories = signatories.map((d: CompanyBankSignatory) => {
      return new CompanyBankSignatory(d)
    })
  }

  setSignatoryType(signatoryType: string): void {
    this.signatoryType = StringUtil.isNullOrEmpty(signatoryType) ? "anyone" : signatoryType
  }

  setAuthorisedOnlineBanking(authorisedPersons: any): void {
    this.authorisedOnlineBank = authorisedPersons
  }

  async update(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId)) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForIncompleteData()
      throw errorMessage
    }

    this.application.signatories = this.signatories
    this.application.metaData = {
      type: this.signatoryType,
      authorised_persons: this.authorisedOnlineBank,
    }
    this.application.bankBranchId = this.branchId

    let repository = useCompanyBankAccountOpeningStore()
    await this.application.update(repository)
  }

  canCreate(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && !StringUtil.isNullOrEmpty(this.bankId)
  }

  canUpdate(): boolean {
    return !StringUtil.isNullOrEmpty(this.applicationId) && this.signatories.length > 0
  }
}
