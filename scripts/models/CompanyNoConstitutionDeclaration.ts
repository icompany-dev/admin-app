import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { User } from "./User"
import type { IModelApplication } from "./IModelApplication"

export class CompanyNoConstitutionDeclaration
  extends Application
  implements
    IModelApplication<CompanyNoConstitutionDeclaration, ReturnType<typeof useCompanyNoConstitutionDeclarationStore>>
{
  purchasedById: string = ""
  purchasedBy: User = new User()
  toWhom: string | null = "To Whom It May Concern"
  toAddress: string | null = null
  deliveryMethod: string | null = null
  isDownloaded: boolean = false
  isEmailed: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyNoConstitutionDeclaration) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.purchasedById = data.purchased_by_id || ""
    this.purchasedBy = new User(data.purchased_by)
    this.toWhom = data.to_whom
    this.toAddress = data.to_address
    this.deliveryMethod = data.delivery_method
    this.isDownloaded = data.is_downloaded ?? false
    this.isEmailed = data.is_emailed ?? false
  }

  cloneDetails(data: CompanyNoConstitutionDeclaration): void {
    super.clone(data)
    this.purchasedById = data.purchasedById
    this.purchasedBy = new User(data.purchasedBy)
    this.toWhom = data.toWhom
    this.toAddress = data.toAddress
    this.deliveryMethod = data.deliveryMethod
    this.isDownloaded = data.isDownloaded
    this.isEmailed = data.isEmailed
  }

  canSubmit() {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  getRequestBody() {
    return {
      company_id: this.companyId,
      purchased_by_id: this.purchasedById,
      to_whom: this.toWhom,
      to_address: this.toAddress,
      status: this.status,
    }
  }

  async create(repository: ReturnType<typeof useCompanyNoConstitutionDeclarationStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    try {
      const newCompanyNoConstitutionDeclaration = await repository.create(this.getRequestBody())
      if (repository.error && !StringUtil.isNullOrEmpty(repository.error)) {
        throw repository.error
      }

      this.convertFromResponse(newCompanyNoConstitutionDeclaration)
    } catch (error) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForCUD()
      throw errorMessage
    }
  }

  async update(repository: ReturnType<typeof useCompanyNoConstitutionDeclarationStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    try {
      const updatedCompanyNoConstitutionDeclaration = await repository.update(this.id, this.getRequestBody())
      if (repository.error && !StringUtil.isNullOrEmpty(repository.error)) {
        throw repository.error
      }

      this.convertFromResponse(updatedCompanyNoConstitutionDeclaration)
    } catch (error) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForCUD()
      throw errorMessage
    }
  }

  async remove(repository: ReturnType<typeof useCompanyNoConstitutionDeclarationStore>): Promise<void> {
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

  async download(repository: ReturnType<typeof useCompanyNoConstitutionDeclarationStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    try {
      let response = await repository.download(this.id)
      if (repository.error && !StringUtil.isNullOrEmpty(repository.error)) {
        throw repository.error
      }

      // this.convertFromResponseDetails(response)
    } catch (error) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForRetrieveDownload()
      throw errorMessage
    }
  }

  async email(
    name: string,
    email: string,
    fileUrl: string,
    repository: ReturnType<typeof useCompanyNoConstitutionDeclarationStore>
  ): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    try {
      let response = await repository.email(this.id, name, email, fileUrl)
      if (repository.error && !StringUtil.isNullOrEmpty(repository.error)) {
        throw repository.error
      }

      // this.convertFromResponseDetails(response)
    } catch (error) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForEmailDocument()
      throw errorMessage
    }
  }
}
