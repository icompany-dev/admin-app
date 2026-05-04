import type { useCompanyMaterialStore } from "~/stores/CompanyMaterials"
import { StringUtil } from "../utils/String"
import { Cart } from "./Cart"
import { Company } from "./Company"
import type { IModel } from "./IModel"
import { Order } from "./Order"
import { Error } from "../library/Error"

export class CompanyMaterial implements IModel<CompanyMaterial> {
  id: string = ""
  companyId: string = ""
  company: Company = new Company()
  cartId: string = ""
  cart: Cart = new Cart()
  orderId: string | null = null
  order: Order | null = null
  status: string = ""
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyMaterial) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyId = data.company_id
    this.company = new Company(data.company)
    this.cartId = data.cart_id
    this.cart = new Cart(data.cart)
    this.orderId = data.order_id
    this.order = data.order ? new Order(data.order) : null
    this.status = data.status
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: CompanyMaterial): void {
    this.id = data.id
    this.companyId = data.companyId
    this.company = new Company(data.company)
    this.cartId = data.cartId
    this.cart = new Cart(data.cart)
    this.orderId = data.orderId
    this.order = data.order ? new Order(data.order) : null
    this.status = data.status
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      cart_id: this.cartId,
      order_id: this.orderId,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && !StringUtil.isNullOrEmpty(this.cartId)
  }

  async create(repository: ReturnType<typeof useCompanyMaterialStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    try {
      const newCompanyMaterial = await repository.create(this.getRequestBody())
      if (repository.error && !StringUtil.isNullOrEmpty(repository.error)) {
        throw repository.error
      }

      this.convertFromResponse(newCompanyMaterial)
    } catch (error) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForCUD()
      throw errorMessage
    }
  }

  async update(repository: ReturnType<typeof useCompanyMaterialStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    try {
      const updatedCompanyMaterial = await repository.update(this.id, this.getRequestBody())
      if (repository.error && !StringUtil.isNullOrEmpty(repository.error)) {
        throw repository.error
      }

      this.convertFromResponse(updatedCompanyMaterial)
    } catch (error) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForCUD()
      throw errorMessage
    }
  }

  async remove(repository: ReturnType<typeof useCompanyMaterialStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    try {
      await repository.remove(this.id)
      if (repository.error && !StringUtil.isNullOrEmpty(repository.error)) {
        throw repository.error
      }
    } catch (error) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForCUD()
      throw errorMessage
    }
  }
}
