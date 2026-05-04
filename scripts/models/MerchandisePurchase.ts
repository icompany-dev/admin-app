import { StatusConstants } from "../constants/Status"
import type { IModel } from "./IModel"
import { MerchandisePurchaseItem } from "./MerchandisePurchaseItem"
import { Company } from "./Company"
import { User } from "./User"
import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"

export class MerchandisePurchase implements IModel<MerchandisePurchase> {
  id: string = ""
  user: User = new User()
  userId: string = ""
  company: Company = new Company()
  companyId: string = ""
  name: string = ""
  email: string = ""
  phone: string = ""
  items: MerchandisePurchaseItem[] = []
  status: string = ""
  redirectUrl: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof MerchandisePurchase) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.userId = data.user_id ?? ""
    this.user = new User(data.user)
    this.companyId = data.company_id ?? ""
    this.company = new Company(data.company)
    this.name = data.name
    this.email = data.email
    this.phone = data.phone
    this.items =
      data.items.length > 0
        ? data.items.map((item: any) => {
            return new MerchandisePurchaseItem(item)
          })
        : []

    this.status = data.status ?? StatusConstants.DRAFT
  }

  clone(data: MerchandisePurchase): void {
    this.id = data.id
    this.userId = data.userId
    this.user = new User(data.user)
    this.companyId = data.companyId
    this.company = new Company(data.company)
    this.name = data.name
    this.email = data.email
    this.phone = data.phone
    this.items = data.items.map((item) => {
      return new MerchandisePurchaseItem(item)
    })
    this.status = data.status
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.userId) &&
      !StringUtil.isNullOrEmpty(this.name) &&
      !StringUtil.isNullOrEmpty(this.email) &&
      !StringUtil.isNullOrEmpty(this.phone) &&
      this.items.length > 0
    )
  }

  getRequestBody(): object {
    const items = this.items.map((item: MerchandisePurchaseItem): any => {
      return item.getRequestBody()
    })

    const total = this.items.reduce((sum, data) => {
      return sum + data.totalPrice
    }, 0)

    return {
      user_id: this.userId,
      name: this.name,
      email: this.email,
      phone: this.phone,
      items: items,
      company_id: this.companyId,
      subtotal: total,
      total: total,
      status: this.status,
    }
  }

  async create(repository: ReturnType<typeof useMerchandisePurchaseStore>): Promise<void> {
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

    this.convertFromResponse(response)
  }

  // Todo: update does not exist of this check
  async update(repository: ReturnType<typeof useMerchandisePurchaseStore>): Promise<void> {
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

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof useMerchandisePurchaseStore>): Promise<void> {
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
