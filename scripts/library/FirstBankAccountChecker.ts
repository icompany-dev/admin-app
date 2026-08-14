import { StatusConstants } from "../constants/Status"
import { Filter } from "./Filter"

export class FirstBankAccountChecker {
  companyId: string = ""
  isFirst: boolean = false

  constructor(companyId: string) {
    this.companyId = companyId
  }

  async init() {
    this.isFirst = await Promise.all([this.isFirstBank(), this.isFirstBankResolution()]).then((response) => {
      return response[0] || response[1]
    })
  }

  async isFirstBankResolution(): Promise<boolean> {
    let filter = new Filter()
    filter.companyId = this.companyId
    filter.includeDeleted = true
    filter.statuses = [
      StatusConstants.PAID,
      StatusConstants.CONVERTED,
      StatusConstants.APPROVED,
      StatusConstants.SUBMITTED,
      StatusConstants.WITHDRAWN,
    ]

    let repository = useCompanyBankAccountOpeningStore()

    const response = await repository.fetchAll(filter)
    return response.totalRecords <= 0
  }

  async isFirstBank(): Promise<boolean> {
    let filter = new Filter()
    filter.companyId = this.companyId
    let repository = useCompanyBankStore()

    const response = await repository.fetchAll(filter)
    return response.totalRecords <= 0
  }
}
