import { useDirectorStore } from "#imports"
import { useShareholderStore } from "#imports"
import { useFileStore } from "#imports"
import { useSignatureStore } from "#imports"
import { useServicePricingStore } from "#imports"
import { useLanguage } from "#imports"
import { useLocalTime } from "#imports"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { ActivityLogger } from "~/scripts/library/ActivityLogger"
import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { SignatureGroup, SignatureGroupGroup, SignatureGroupTarget } from "~/scripts/models/SignatureGroup"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"

export abstract class ServiceController {
  target: string = ""
  targetId: string | null = null
  companyId: string = ""
  company = ref<Company>(new Company())
  isADirector = ref<boolean>(false)
  directorId = ref<string | null>(null)
  isAShareholder = ref<boolean>(false)
  shareholderId = ref<string | null>(null)
  isSignatureRequired = ref<boolean>(false)
  hasPaid = ref<boolean>(false)
  signatureFile = ref<string | null>(null)
  existingSignatureAsDirector = ref<SignatureGroup | null>(null)
  existingSignatureAsShareholder = ref<SignatureGroup | null>(null)

  zoomStep: number = 10 // percent
  currentZoomFactor = ref<number>(100)
  maxZoomFactor: number = 200
  minZoomFactor: number = 10

  showHelp = ref<boolean>(false)
  showOption = ref<boolean>(false)

  language = useLanguage()
  time = useLocalTime()

  directorRepository = useDirectorStore()
  shareholderRepository = useShareholderStore()
  fileRepository = useFileStore()
  signatureRepository = useSignatureStore()
  servicePricingRepository = useServicePricingStore()

  price = ref<number>(19)

  dcrRef: any | null = null
  mcrRef: any | null = null

  emitEvents: any | null = null
  isInPreviewMode = ref<boolean>(false)

  actionTrayElements = ref<ActionTrayElement[]>([])

  constructor(target: string, companyId: string, emitEvents: any | null) {
    this.target = target
    this.companyId = companyId
    this.emitEvents = emitEvents

    Promise.all([
      this.getCompany(),
      this.getDirectorForCompany(),
      this.getShareholderForCompany(),
      this.getServicePrice(),
    ])

    this.setActionTrayElements()
  }

  setTargetId(targetId: string) {
    this.targetId = targetId
  }

  setDcrRef(dcrRef: any): void {
    this.dcrRef = dcrRef
  }

  setMcrRef(mcrRef: any): void {
    this.mcrRef = mcrRef
  }

  setActionTrayElements(): void {
    this.actionTrayElements.value = [
      new ActionTrayElement("back", this.onBackClicked.bind(this), {
        label: new ActionTrayLabel("Back", "Kembali"),
        isIconStart: true,
        iconClass: "fa-solid fa-circle-arrow-left",
      }),
      new ActionTrayElement("download", this.onDownloadClicked.bind(this), {
        label: new ActionTrayLabel("Download", "Muat Turun"),
      }),
    ]
  }

  async getCompany(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    let repository = useCompanyStore()
    let response = await repository.fetch(this.companyId)

    this.company.value = new Company(response)
  }

  async getDirectorForCompany(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    await this.directorRepository.fetchAllForUserByCompany(this.companyId)
    if (!this.directorRepository.error && this.directorRepository.director !== null) {
      this.isADirector.value = !StringUtil.isNullOrEmpty(this.directorRepository.director.id)
      this.directorId.value = this.directorRepository.director.id
    }
  }

  async getShareholderForCompany(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    await this.shareholderRepository.fetchAllForUserByCompany(this.companyId)
    if (!this.shareholderRepository.error && this.shareholderRepository.shareholder !== null) {
      this.isAShareholder.value = !StringUtil.isNullOrEmpty(this.shareholderRepository.shareholder.id)
      this.shareholderId.value = this.shareholderRepository.shareholder.id
    }
  }

  async getServicePrice(): Promise<void> {
    let response: ServicePricing | null = await this.servicePricingRepository.fetchDefault(this.target)
    let servicePricing = new ServicePricing(response)
    if (servicePricing) {
      this.price.value = servicePricing.baseGrandTotal
    }
  }

  async onSigned(signatureData: string): Promise<void> {
    this.signatureFile.value = signatureData

    await this.onSubmitClicked()
  }

  abstract onSubmitClicked(): Promise<void>

  removeButtonLabel(): string {
    if (StringUtil.isNullOrEmpty(this.targetId)) {
      return this.language.isMalay() ? "Batal" : "Cancel"
    }

    return this.language.isMalay() ? "Tarik Balik Resolusi" : "Withdraw Resolution"
  }

  backButtonLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  submitButtonLabel(): string {
    if (StringUtil.isNullOrEmpty(this.targetId)) {
      return this.language.isMalay() ? "Mula Resolusi" : "Initiate Resolution"
    }

    if (!this.hasPaid.value) {
      return this.language.isMalay() ? "Buat Bayaran" : "Make Payment"
    }

    return this.language.isMalay() ? "Hantar Tandatangan" : "Submit Signature"
  }

  submitButtonClass(): string {
    if (!this.hasPaid.value) {
      return "btn-pay"
    }

    return "btn-default"
  }

  canZoomIn(): boolean {
    return this.currentZoomFactor.value < this.maxZoomFactor
  }

  canZoomOut(): boolean {
    return this.currentZoomFactor.value > this.minZoomFactor
  }

  async onDownloadClicked(): Promise<void> {
    let promises = []

    if (this.dcrRef) {
      let dcrPages = await this.dcrRef.getPdfPages()
      promises.push(
        PdfPaperUtil.generatePdfFile(
          dcrPages,
          20,
          "Directors' Resolutions.pdf",
          PaperSize.A4,
          PaperOrientation.Portrait
        )
      )
    }

    if (this.mcrRef) {
      let mcrPages = await this.mcrRef.getPdfPages()
      promises.push(
        PdfPaperUtil.generatePdfFile(mcrPages, 20, "Member's Resolutions.pdf", PaperSize.A4, PaperOrientation.Portrait)
      )
    }

    if (promises.length <= 0) {
      return
    }

    await Promise.all(promises)
  }

  onBackClicked(): void {
    this.emitEvents("back")
  }

  onZoomInClicked(): void {
    if (!this.canZoomIn()) {
      return
    }

    this.currentZoomFactor.value += this.zoomStep
  }

  onZoomOutClicked(): void {
    if (!this.canZoomOut()) {
      return
    }

    this.currentZoomFactor.value -= this.zoomStep
  }

  getZoomStyle(): string {
    return `transform: scale(${this.currentZoomFactor.value}%)`
  }

  onHelpClicked(): void {
    this.showHelp.value = !this.showHelp.value
  }

  onOptionClicked(): void {
    this.showOption.value = !this.showOption.value
  }

  async submitSignature(): Promise<void> {
    if (!this.signatureFile.value) {
      return
    }

    if (!this.isADirector && !this.isAShareholder) {
      return
    }

    if (!this.signatureFile.value) {
      let errorMessage: Error = new Error()
      errorMessage.setForCUD()
      throw errorMessage
    }

    let activityLogger = new ActivityLogger()
    await activityLogger.init()
    let signaturePromises = []
    let role =
      this.isADirector && this.isAShareholder ? "Director & Shareholder" : this.isADirector ? "Director" : "Shareholder"

    let signatureDate = this.time.currentDataTimeForSignature()
    if (this.isADirector.value && this.dcrRef) {
      if (!this.existingSignatureAsDirector.value) {
        let newSignatureGroup = new SignatureGroup()
        newSignatureGroup.target = new SignatureGroupTarget(this.targetId ?? "", this.target)
        newSignatureGroup.group = new SignatureGroupGroup(this.directorId.value ?? "", "director")
        signaturePromises.push(
          newSignatureGroup.create(
            this.signatureFile.value ?? "",
            this.fileRepository,
            this.signatureRepository,
            signatureDate
          )
        )
      }
    }

    if (this.isAShareholder.value && this.mcrRef) {
      if (!this.existingSignatureAsShareholder.value) {
        let newSignatureGroup = new SignatureGroup()
        newSignatureGroup.target = new SignatureGroupTarget(this.targetId ?? "", this.target)
        newSignatureGroup.group = new SignatureGroupGroup(this.shareholderId.value ?? "", "shareholder")
        signaturePromises.push(
          newSignatureGroup.update(
            this.signatureFile.value ?? "",
            this.fileRepository,
            this.signatureRepository,
            signatureDate
          )
        )
      }
    }

    await Promise.all(signaturePromises)
      .then(() => {
        activityLogger.addSignLog(this.companyId, role, this.target, this.targetId ?? "", "success")
      })
      .catch(() => {
        activityLogger.addSignLog(this.companyId, role, this.target, this.targetId ?? "", "failed")
      })
  }

  async pay(): Promise<void> {
    this.emitEvents("makePayment")
  }

  get companyName(): string {
    return this.company.value.getFullName()
  }

  get companyRegistrationNumber(): string {
    return `${this.company.value.registrationNumberNew} (${this.company.value.registrationNumberOld})`
  }
}
