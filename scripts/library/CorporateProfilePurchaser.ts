import { CompanyDocumentNames } from "../constants/CompanyDocuments"
import { CompanyDocumentRequest } from "../models/CompanyDocumentRequest"
import type { CompanyDocumentRequestItem } from "../models/CompanyDocumentRequestItem"
import { MyDataPurchaseCorporateProfileResponse } from "../models/MyDataPurchaseCorporateProfileResponse"
import { StringUtil } from "../utils/String"
import { Error } from "./Error"
import { Form } from "~/scripts/models/Form"
import { File as UploadedFile } from "~/scripts/models/File"

export class CorporateProfilePurchaser {
  repository = useMyDataStore()

  companyId: string | null = ""
  registrationNumberNew: string = ""
  registrationNumberOld: string = ""

  purchaseResponse: MyDataPurchaseCorporateProfileResponse | null = null

  jsonData: any | null = null
  pdfBlob: any | null = null

  isPurchasing: boolean = false

  constructor() {
    this.resetValues()
  }

  setRegistrationNumberNew(registrationNumberNew: string): void {
    this.registrationNumberNew = registrationNumberNew
  }

  setRegistrationNumberOld(registrationNumberOld: string): void {
    this.registrationNumberOld = registrationNumberOld
  }

  resetValues(): void {
    this.registrationNumberNew = ""
    this.registrationNumberOld = ""
    this.purchaseResponse = null
    this.jsonData = null
    this.pdfBlob = null
    this.isPurchasing = false
  }

  async purchase(): Promise<void> {
    if (this.isPurchasing) {
      let errorMessage: Error = new Error()
      errorMessage.setForInProgress("Purchase", "Pembelian")
      throw errorMessage
    }

    if (StringUtil.isNullOrEmpty(this.registrationNumberOld) && StringUtil.isNullOrEmpty(this.registrationNumberOld)) {
      let errorMessage: Error = new Error()
      errorMessage.setForIncompleteData()
      throw errorMessage
    }

    this.isPurchasing = true
    let response = await this.repository.purchaseCorporateProfile(
      this.registrationNumberOld,
      this.registrationNumberNew
    )
    if (this.repository.error !== null || !response) {
      this.isPurchasing = false
      let errorMessage: Error = new Error()
      errorMessage.setForPurchaseFail("SSM Corporate Profile", "Profil Korporat SSM")
      throw errorMessage
    }

    this.purchaseResponse = new MyDataPurchaseCorporateProfileResponse(response)
    if (this.purchaseResponse.successCode !== "00") {
      this.isPurchasing = false
      let errorMessage: Error = new Error()
      errorMessage.setForPurchaseFail("SSM Corporate Profile", "Profil Korporat SSM")
      throw errorMessage
    }

    await this.getJsonPdf()
    this.isPurchasing = false
  }

  async purchaseByDocumentRequest(documentRequestId: string): Promise<void> {
    if (this.isPurchasing) {
      let errorMessage: Error = new Error()
      errorMessage.setForInProgress("Purchase", "Pembelian")
      throw errorMessage
    }

    this.isPurchasing = true
    let companyDocumentRequestRepository = useCompanyDocumentRequestStore()
    let response = await companyDocumentRequestRepository.purchaseCorporateProfile(documentRequestId)

    if (this.repository.error !== null || !response) {
      this.isPurchasing = false
      let errorMessage: Error = new Error()
      errorMessage.setForPurchaseFail("SSM Corporate Profile", "Profil Korporat SSM")
      throw errorMessage
    }

    let purchasedDocumentRequest = new CompanyDocumentRequest(response)
    let purchasedItem = purchasedDocumentRequest.items.find((item: CompanyDocumentRequestItem) => {
      return item.documentName === CompanyDocumentNames.CorporateProfile
    })
    if (!purchasedItem || !purchasedItem.mydataOrderNumber) {
      this.isPurchasing = false
      let errorMessage: Error = new Error()
      errorMessage.setForPurchaseFail("SSM Corporate Profile", "Profil Korporat SSM")
      throw errorMessage
    }

    this.purchaseResponse = new MyDataPurchaseCorporateProfileResponse()
    this.purchaseResponse.orderNumber = purchasedItem.mydataOrderNumber
    this.purchaseResponse.invoiceNumber = purchasedItem.mydataCustomerReferenceNumber ?? ""
    if (StringUtil.isNullOrEmpty(this.purchaseResponse.orderNumber)) {
      this.isPurchasing = false
      let errorMessage: Error = new Error()
      errorMessage.setForPurchaseFail("SSM Corporate Profile", "Profil Korporat SSM")
      throw errorMessage
    }

    await this.getJsonPdf()
    this.isPurchasing = false
  }

  async getJsonPdf(): Promise<void> {
    if (!this.purchaseResponse || !this.isPurchasing) {
      let errorMessage: Error = new Error()
      errorMessage.setForNoPurchaseToGetJson("SSM Corporate Profile", "Profil Korporat SSM")
      throw errorMessage
    }

    await Promise.all([this.getJson(), this.getPdf()])
  }

  async getJson(): Promise<void> {
    this.jsonData = null

    if (!this.purchaseResponse) {
      let errorMessage: Error = new Error()
      errorMessage.setForNoPurchaseToGetJson("SSM Corporate Profile", "Profil Korporat SSM")
      throw errorMessage
    }

    this.jsonData = await this.repository.fetchPurchasedCorporateProfileJson(this.purchaseResponse.orderNumber)
  }

  async getPdf(): Promise<void> {
    this.pdfBlob = null

    if (!this.purchaseResponse) {
      let errorMessage: Error = new Error()
      errorMessage.setForNoPurchaseToGetJson("SSM Corporate Profile", "Profil Korporat SSM")
      throw errorMessage
    }

    this.pdfBlob = await this.repository.fetchPurchasedCorporateProfilePdf(this.purchaseResponse.orderNumber)
    if (!this.pdfBlob) {
      return
    }

    let companyRegistrationNumber = !StringUtil.isNullOrEmpty(this.registrationNumberOld)
      ? this.registrationNumberOld
      : this.registrationNumberNew
    let fileName = `${companyRegistrationNumber} Corporate Profile.pdf`

    //upload to S3
    if (this.companyId !== null && !StringUtil.isNullOrEmpty(this.companyId)) {
      let fileToUpload = new File([this.pdfBlob], fileName, { type: "application/pdf" })
      let uploadedFile = new UploadedFile()
      await uploadedFile.uploadFile(fileToUpload, useFileStore())
      let form = new Form()
      form.companyId = this.companyId
      form.type = "business_detail"
      form.fileId = uploadedFile.id
      form.status = "active"
      await form.create(useFormStore())
    }

    const fileUrl = URL.createObjectURL(this.pdfBlob)
    const fileLink = document.createElement("a")
    fileLink.href = fileUrl
    fileLink.setAttribute("download", fileName)
    document.body.appendChild(fileLink)
    fileLink.click()
    document.body.removeChild(fileLink)
  }
}
