import { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"
import { CompanyShareholderTransferNotice } from "~/scripts/models/CompanyShareholderTransferNotice"
import { CompanyShareTransferDetail } from "~/scripts/models/CompanyShareTransferDetail"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyShareholderTransferStore } from "~/stores/CompanyShareholderTransfers"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { User } from "~/scripts/models/User"
import { CompanyConstants } from "~/scripts/constants/Company"
import { Shareholder } from "~/scripts/models/Shareholder"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { SignatureUtil } from "~/scripts/utils/Signature"
import { Toast } from "~/scripts/library/Toast"

export class Section105Controller {
  companyId: Ref<string> = ref<string>("")
  transferDetail = ref<CompanyShareTransferDetail>(new CompanyShareTransferDetail())
  repository = useCompanyShareholderTransferStore()
  companyRepository = useCompanyStore()

  currentUser = ref<User>(new User())

  shareholderId: Ref<string> = ref<string>("")
  shareholders = ref<Shareholder[]>([])

  isLoading: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()

  emitEvents: any | null = null

  constructor(companyId: string, transferDetail: CompanyShareTransferDetail, emitEvents: any) {
    this.companyId.value = companyId
    this.transferDetail.value = new CompanyShareTransferDetail(transferDetail)
    this.emitEvents = emitEvents

    this.init()
  }

  async init(): Promise<void> {
    this.isLoading.value = true

    try {
      this.currentUser.value = await CurrentUser.get()

      await this.setShareholderId()
    } catch (e) {
      // do something
    } finally {
      this.isLoading.value = false
    }
  }

  setTransferDetail(transferDetail: CompanyShareTransferDetail): void {
    this.transferDetail.value = new CompanyShareTransferDetail(transferDetail)
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId

    this.isLoading.value = true

    try {
      await this.setShareholderId()
    } catch (e) {
      // do something
    } finally {
      this.isLoading.value = false
    }
  }

  async setShareholderId(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useShareholderStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)
    this.shareholders.value = response.map((s: Shareholder) => {
      return new Shareholder(s)
    })

    this.shareholderId.value =
      this.shareholders.value.find((s: Shareholder) => {
        return s.email === this.currentUser.value.email
      })?.id ?? ""
  }

  async onTransferorSigned(signatureFileData: any): Promise<void> {
    this.emitEvents("back")

    try {
      let signatureFile = await SignatureUtil.submit(signatureFileData)
      await this.transferDetail.value.submitTransferorSignature(signatureFile.id, useCompanyShareholderTransferStore())

      this.showSuccessMessage()
    } catch (e) {
      this.showErrorMessage()
    }
  }

  async onTransferorRepSigned(signatureFileData: any): Promise<void> {
    this.emitEvents("back")

    try {
      let signatureFile = await SignatureUtil.submit(signatureFileData)
      await this.transferDetail.value.submitTransferorRepSignature(
        signatureFile.id,
        useCompanyShareholderTransferStore()
      )

      this.showSuccessMessage()
    } catch (e) {
      this.showErrorMessage()
    }
  }

  async onTransfereeSigned(signatureFileData: any): Promise<void> {
    this.emitEvents("back")

    try {
      let signatureFile = await SignatureUtil.submit(signatureFileData)
      await this.transferDetail.value.submitTransfereeSignature(signatureFile.id, useCompanyShareholderTransferStore())

      this.showSuccessMessage()
    } catch (e) {
      this.showErrorMessage()
    }
  }

  async onTransfereeRepSigned(signatureFileData: any): Promise<void> {
    this.emitEvents("back")

    try {
      let signatureFile = await SignatureUtil.submit(signatureFileData)
      await this.transferDetail.value.submitTransfereeRepSignature(
        signatureFile.id,
        useCompanyShareholderTransferStore()
      )

      this.showSuccessMessage()
    } catch (e) {
      this.showErrorMessage()
    }
  }

  loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing Your"
  }

  loaderSublabel(): string {
    return this.language.isMalay() ? "Notis Pemindahan" : "Notice of Transfer"
  }

  showSuccessMessage(): void {
    let toastTitle = this.language.isMalay()
      ? "Maklum balas anda telah dikemaskini."
      : "Your response has been updated."
    let toastMessage = this.language.isMalay() ? "" : ""

    let toast = new Toast(toastTitle, toastMessage)
    toast.success()
  }

  showErrorMessage(): void {
    let error = new Error("", "")
    error.setForCUD()
    error.handle()
  }
}
