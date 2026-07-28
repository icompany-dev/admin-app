import { CompanyConstants } from "~/scripts/constants/Company"
import { Error } from "~/scripts/library/Error"
import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { User } from "~/scripts/models/User"
import { PropsIncorporationApplication } from "~/scripts/props/PropsIncorporationApplication"
import { StringUtil } from "~/scripts/utils/String"
import { PropsServiceApplication } from "~/scripts/props/PropsServiceApplication"
import { PropsShipApplication } from "~/scripts/props/PropsShipApplication"
import { DocumentTargets } from "~/scripts/constants/DocumentTargets"
import { PropsServiceApplicationNode } from "~/scripts/props/PropsServiceApplicationNode"
import { StatusConstants } from "~/scripts/constants/Status"
import { ApplicationNameReservation } from "~/scripts/models/ApplicationNameReservation"
import { ObjectUtil } from "~/scripts/utils/Object"
import { PropsNameReservationRejected } from "~/scripts/props/PropsNameReservationRejected"
import type { NameReservationRejected } from "~/scripts/types/emit-messages/NameReservationRejected"
import { NameReservationVariant } from "~/scripts/models/NameReservationVariant"
import { Toast } from "~/scripts/library/Toast"

/**
 * THINGS THEY WANT TO KNOW
 * 1. Payment
 * 2. Section 201
 * 3. Names proposed
 * 4. Directors
 * 5. Shareholders
 * 6. Upload documents for each stage
 * 7. Name rejected
 * 8. Complete incorporation
 */

export class ApplicationController {
  applicationId: Ref<string> = ref<string>("")
  application: Ref<ApplicationIncorporate> = ref<ApplicationIncorporate>(new ApplicationIncorporate())
  applicant: Ref<User> = ref<User>(new User())

  applicationNameReservation: Ref<ApplicationNameReservation> = ref<ApplicationNameReservation>(
    new ApplicationNameReservation()
  )

  paymentOrderId: Ref<string> = ref<string>("")
  paymentOrder: Ref<PaymentOrder> = ref<PaymentOrder>(new PaymentOrder())

  emitEvents: any | null = null

  uploadDocumentPopup: any | null = null
  nameReservedPopup: any | null = null
  nameReservedQueriedPopup: any | null = null
  nameReservationRejectedPopup: any | null = null

  language = useLanguage()

  isLoading: Ref<boolean> = ref<boolean>(false)

  isShowReceipt: Ref<boolean> = ref<boolean>(false)
  isShowSection27: Ref<boolean> = ref<boolean>(false)

  isShowProposedNames: Ref<boolean> = ref<boolean>(false)
  selectedProposedName: Ref<string> = ref<string>("")

  isUploadingSection27: Ref<boolean> = ref<boolean>(false)
  isDownloadingSection27: Ref<boolean> = ref<boolean>(false)
  isShowSection27Actions: Ref<boolean> = ref<boolean>(false)
  isUpdatingSection27: Ref<boolean> = ref<boolean>(false)

  selectedDocumentTarget: Ref<string> = ref<string>(DocumentTargets.TARGET_RECEIPT)

  constructor(props: PropsIncorporationApplication, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  async setDataFromProps(props: PropsIncorporationApplication): Promise<void> {
    this.applicationId.value = props.applicationId
    await this.init()
  }

  setNameReservationRejectedPopup(nameReservationRejectedPopup: any): void {
    this.nameReservationRejectedPopup = nameReservationRejectedPopup
  }

  setNameReservedPopup(nameReservedPopup: any): void {
    this.nameReservedPopup = nameReservedPopup
  }

  setNameReservedQueriedPopup(nameReservedQueriedPopup: any): void {
    this.nameReservedQueriedPopup = nameReservedQueriedPopup
  }

  setUploadDocumentPopup(uploadDocumentPopup: any): void {
    this.uploadDocumentPopup = uploadDocumentPopup
  }

  async init(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      let error = new Error()
      error.title = this.language.isMalay() ? "ID Permohonan Tiada" : "No Application ID found"
      error.message = this.language.isMalay()
        ? "Anda akan dibawa ke laman utama"
        : "You will be redirected to the main page."
      error.promptWarning()

      this.emitEvents("back")
      return
    }

    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      await Promise.allSettled([this.fetchApplication(), this.fetchPaymentOrder()])

      await this.fetchApplicant()

      this.application.value.paidAt = this.paymentOrder.value.paidAt
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchApplication(): Promise<void> {
    let repository = useApplicationIncorporateStore()
    let response = await repository.fetch(this.applicationId.value)

    if (repository.error !== null) {
      throw repository.error
    }

    this.application.value = new ApplicationIncorporate(response)
  }

  async fetchPaymentOrder(): Promise<void> {
    let repository = usePaymentOrderStore()
    let response = await repository.fetchByTarget(
      CompanyConstants.TARGET_APPLICATION_INCORPORATE,
      this.applicationId.value
    )

    if (!response || repository.error !== null) {
      this.paymentOrderId.value = ""
      return
    }

    this.paymentOrder.value = new PaymentOrder(response)
    this.paymentOrderId.value = this.paymentOrder.value.id
  }

  async fetchApplicant(): Promise<void> {
    let repository = useUserStore()
    let response = await repository.fetch(this.application.value.applicantId)

    if (repository.error !== null) {
      throw repository.error
    }

    this.applicant.value = new User(response)
  }

  resetAllDocumentValues(): void {
    this.isShowReceipt.value = false
    this.isShowSection27.value = false

    this.selectedDocumentTarget.value = DocumentTargets.TARGET_RECEIPT
  }

  async onUploadDocumentClicked(): Promise<void> {
    if (!this.uploadDocumentPopup) {
      return
    }

    this.uploadDocumentPopup.show()
  }

  onPaymentStepClicked(): void {
    this.resetAllDocumentValues()
    this.isShowReceipt.value = true
    this.selectedDocumentTarget.value = DocumentTargets.TARGET_RECEIPT
  }

  // Name Reservation Step
  onNameReservationStepClicked(): void {
    this.resetAllDocumentValues()
    this.isShowSection27.value = true
    this.selectedDocumentTarget.value = DocumentTargets.TARGET_RECEIPT //DocumentTargets.TARGET_INCORP_SECTION_27
  }

  onProposedNamesClicked(): void {
    this.isShowProposedNames.value = !this.isShowProposedNames.value
  }

  onProposedNamesSelected(name: string): void {
    this.isShowProposedNames.value = false
    this.selectedProposedName.value = name
  }

  onShowSection27ActionClicked(): void {
    this.isShowSection27Actions.value = !this.isShowSection27Actions.value
  }

  async onDownloadSection27Clicked(): Promise<void> {
    if (!this.isSection27Uploaded || this.isDownloadingSection27.value) {
      return
    }

    try {
      // TODO: Update download function
      // let companyDocument = this.uploadedDocumentChecker.value.latestDocument(
      //   DocumentTargets.TARGET_AMENDMENT_NAME_SECTION27,
      //   this.application.value?.createdAt ?? ""
      // )
      // if (!companyDocument || !companyDocument.fileUrl || StringUtil.isNullOrEmpty(companyDocument.fileUrl)) {
      //   throw "new file"
      // }
      // this.isDownloadingSection27.value = true
      // let url = companyDocument.fileUrl
      // const response = await fetch(url)
      // if (!response.ok) {
      //   throw "Unable to fetch PDF document from source."
      // }
      // const blob = await response.blob()
      // const blobUrl = window.URL.createObjectURL(blob)
      // const link = document.createElement("a")
      // link.href = blobUrl
      // link.setAttribute("download", companyDocument.documentName)
      // document.body.appendChild(link)
      // link.click()
      // document.body.removeChild(link)
      // window.URL.revokeObjectURL(blobUrl)
    } catch {
      let error = new Error()
      error.setForFetch()
      error.handle()
    } finally {
      this.isDownloadingSection27.value = false
    }
  }

  async onSubmitNameReservation(): Promise<void> {
    this.isShowSection27Actions.value = false

    if (this.isUpdatingSection27.value || !this.application.value) {
      return
    }

    if (StringUtil.isNullOrEmpty(this.selectedProposedName.value)) {
      this.selectedProposedName.value = this.nameOptions[0]
    }

    try {
      this.applicationNameReservation.value = new ApplicationNameReservation()
      this.applicationNameReservation.value.applicationIncorporateId = this.application.value.id
      this.applicationNameReservation.value.name = this.selectedProposedName.value
        .replace("SDN BHD", "")
        .replace("sdn bhd", "")
        .replace("SDN. BHD.", "")
        .replace("sdn. bhd.", "")
      this.applicationNameReservation.value.nameType = "sdnbhd"
      this.applicationNameReservation.value.status = "paid"

      if (this.nameReservedPopup) {
        this.nameReservedPopup.show()
      } else {
        throw ""
      }
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      //
    }
  }

  async onProceedSubmitNameReservation(data: ApplicationNameReservation): Promise<void> {
    try {
      this.isUpdatingSection27.value = true

      this.applicationNameReservation.value.clone(data)

      await this.applicationNameReservation.value.create(useApplicationNameReservationStore())
      await this.fetchApplication()

      let toastTitle = this.language.isMalay()
        ? "Tindakan anda telah berjaya direkod."
        : "Your action has been recorded successfully"
      let toastMessage = this.language.isMalay()
        ? "Pemohon akan diberitahu melalui emel dan WhatsApp."
        : "The applicant will be informed via Email and WhatsApp."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isUpdatingSection27.value = false
      this.applicationNameReservation.value = new ApplicationNameReservation()
    }
  }

  onQueryNameReservation(): void {
    this.isShowSection27Actions.value = false

    try {
      if (!this.latestSection27Application || !this.nameReservedQueriedPopup) {
        throw ""
      }

      this.applicationNameReservation.value = new ApplicationNameReservation(this.latestSection27Application)

      this.nameReservedQueriedPopup.show()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    }
  }

  async onProceedQueryNameReservation(data: ApplicationNameReservation): Promise<void> {
    try {
      this.isUpdatingSection27.value = true

      this.applicationNameReservation.value.clone(data)

      await this.applicationNameReservation.value.queried(useApplicationNameReservationStore())
      await this.fetchApplication()

      let toastTitle = this.language.isMalay()
        ? "Tindakan anda telah berjaya direkod."
        : "Your action has been recorded successfully"
      let toastMessage = this.language.isMalay()
        ? "Pemohon akan diberitahu melalui emel dan WhatsApp."
        : "The applicant will be informed via Email and WhatsApp."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isUpdatingSection27.value = false
      this.applicationNameReservation.value = new ApplicationNameReservation()
    }
  }

  onNameReservationRejectedClicked(): void {
    this.isShowSection27Actions.value = false

    if (this.nameReservationRejectedPopup) {
      this.nameReservationRejectedPopup.show()
    }
  }

  async onProceedNameReservationRejected(details: NameReservationRejected): Promise<void> {
    let application = this.latestSection27Application
    if (!application || this.isUpdatingSection27.value) {
      return
    }

    application.resultAt = details.dateRejected
    application.ssmRemarksEn = details.reason
    application.ssmRemarksBm = details.reason

    try {
      this.isUpdatingSection27.value = true
      await application.reject(useApplicationNameReservationStore())
      await this.fetchApplication()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isUpdatingSection27.value = false
    }
  }

  async onApproveNameReservation(): Promise<void> {
    this.isShowSection27Actions.value = false

    if (!this.latestSection27Application || this.isUpdatingSection27.value) {
      return
    }

    let application = this.latestSection27Application
    try {
      this.isUpdatingSection27.value = true
      await application.approve(useApplicationNameReservationStore())

      if (this.application.value) {
        this.application.value.nameSelected = new NameReservationVariant(
          application.name,
          application.nameType,
          application.nameDescription,
          application.supportingDocumentId
        )

        await this.application.value.createOrUpdateNamesReservations(useApplicationIncorporateStore())
      }

      await this.fetchApplication()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isUpdatingSection27.value = false
    }
  }

  // getters
  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Permohonan" : "Application"
  }

  get serviceName(): string {
    return this.language.isMalay() ? "Pemerbadanan Sdn Bhd Baharu" : "Incorporation of New Sdn Bhd"
  }

  get isNameApproved(): boolean {
    return this.application.value.nameSelected !== null
  }

  get otherProposedNameLabel(): string {
    return this.language.isMalay() ? "Cadangan Nama Lain" : "Other Proposed Names"
  }

  get otherProposedName(): string {
    let names = [
      this.application.value.name1.name,
      this.application.value.name2?.name ?? "",
      this.application.value.name3?.name ?? "",
    ]

    let filteredNames = names.filter((s: string) => {
      if (StringUtil.isNullOrEmpty(s)) {
        return false
      }
      return (
        !(this.application.value.nameSelected && this.application.value.nameSelected.name === s) ||
        !this.application.value.nameSelected
      )
    })

    if (filteredNames.length <= 0) {
      return this.language.isMalay() ? "Tiada" : "None"
    }

    return StringUtil.oxfordJoin("&", filteredNames)
  }

  get applicantLabel(): string {
    return this.language.isMalay() ? "Butiran Pemohon" : "Details of Applicant"
  }

  get applicantName(): string {
    return this.applicant.value.name
  }

  get applicantEmail(): string {
    return this.applicant.value.email
  }

  get applicantPhone(): string {
    return this.applicant.value.phone
  }

  get applicantIdentification(): string {
    return this.applicant.value.detail?.identification ?? "-"
  }

  get serviceApplicationProps(): PropsServiceApplication {
    let props = new PropsServiceApplication(this.serviceName, true, this.isShowReceipt.value)

    props.application = this.application.value

    return props
  }

  get hasPaid(): boolean {
    return (
      this.application.value.status !== StatusConstants.DRAFT &&
      this.application.value.status !== StatusConstants.PENDING
    )
  }

  // region for names
  get nameReservationNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(this.hasPaid, this.isNameReservationCompleted, this.isShowSection27.value)
  }

  get isNameReservationCompleted(): boolean {
    return false // TODO: Update
  }

  get nameReservationLabel(): string {
    return this.language.isMalay() ? "Permohonan Tempahan Nama" : "Application of Name Reservation"
  }

  get nameReservationSublabel(): string {
    return this.language.isMalay() ? "Seksyen 27 Akta Syarikat 2016" : "Section 27 of the Act"
  }

  get proposedNamesLabel(): string {
    return this.language.isMalay() ? "Nama yang Dicadangkan" : "Proposed Names"
  }

  get canReservedName(): boolean {
    if (!this.application.value) {
      return false
    }

    return StringUtil.isNullOrEmpty(this.application.value.nameSelected?.name ?? "")
  }

  get nameReservations(): ApplicationNameReservation[] {
    if (!this.application.value) {
      return []
    }

    return ObjectUtil.sort<ApplicationNameReservation>(
      this.application.value.nameReservationApplications,
      "createdAt",
      "desc"
    )
  }

  get nameOptions(): string[] {
    if (!this.application.value) {
      return []
    }

    let names: string[] = []

    names.push(this.application.value.name1?.name ?? "")

    if (this.application.value.name2) {
      names.push(this.application.value.name2.name)
    }

    if (this.application.value.name3) {
      names.push(this.application.value.name3.name)
    }

    return names
  }

  get selectedProposedNameForDisplay(): string {
    if (this.isShowProposedNames.value) {
      return this.language.isMalay() ? "Pilih Nama yang Dicadangkan" : "Select Proposed Name"
    }

    if (!this.application.value) {
      return "PROPOSED NAME"
    }

    if (this.application.value.nameSelected) {
      return this.application.value.nameSelected.getCompleteName()
    }

    let ongoingApplication = this.nameReservations.find((nr: ApplicationNameReservation) => {
      return nr.status === StatusConstants.PENDING
    })

    if (ongoingApplication) {
      return ongoingApplication.name
    }

    return this.nameOptions[0]
  }

  get uploadSection27Label(): string {
    if (this.isSection27Uploaded) {
      return this.language.isMalay() ? "Muat Naik Semula" : "Upload Again"
    }

    return this.language.isMalay() ? "Muat Naik" : "Upload"
  }

  get downloadDocumentSection27Label(): string {
    return this.language.isMalay() ? "Seksyen 27" : "Section 27"
  }

  get isSection27Uploaded(): boolean {
    return false // TODO: update this
    // return this.uploadedDocumentChecker.value.isDocumentUploaded(
    //   DocumentTargets.TARGET_AMENDMENT_NAME_SECTION27,
    //   this.application.value?.createdAt ?? ""
    // )
  }

  get hasNextStepsForSection27(): boolean {
    return this.canSubmitSection27 || this.canUpdateSection27
  }

  get section27Applications(): ApplicationNameReservation[] {
    if (!this.application.value) {
      return []
    }

    let nameReservations = this.application.value.nameReservationApplications.map((nr: ApplicationNameReservation) => {
      return new ApplicationNameReservation(nr)
    })

    let orderedApplications = ObjectUtil.sort<ApplicationNameReservation>(nameReservations, "submittedAt", "desc")

    return orderedApplications
  }

  get latestSection27Application(): ApplicationNameReservation | null {
    if (this.section27Applications.length <= 0) {
      return null
    }

    return this.section27Applications[0]
  }

  get canSubmitSection27(): boolean {
    return !this.latestSection27Application || this.latestSection27Application.ssmResult === StatusConstants.REJECTED
  }

  get canResubmitSection27(): boolean {
    return (
      this.latestSection27Application !== null && this.latestSection27Application.ssmResult === StatusConstants.QUERIED
    )
  }

  get canUpdateSection27(): boolean {
    return (
      this.latestSection27Application !== null && this.latestSection27Application.status === StatusConstants.SUBMITTED
    )
  }

  get section27ActionLabel(): string {
    if (!this.canSubmitSection27 && !this.canUpdateSection27) {
      return this.language.isMalay() ? "Telah Ditempah" : "Reserved"
    }

    return this.language.isMalay() ? "Langkah Seterusnya" : "Next Step"
  }

  get submitSection27ApplicationLabel(): string {
    return this.language.isMalay() ? "Telah Hantar" : "Submitted"
  }

  get querySection27ApplicationLabel(): string {
    return this.language.isMalay() ? "Pertanyaan" : "Queried"
  }

  get resubmitSection27ApplicationLabel(): string {
    return this.language.isMalay() ? "Dihantar Semula" : "Resubmitted"
  }

  get approvedSection27Label(): string {
    return this.language.isMalay() ? "Lulus" : "Approved"
  }

  get rejectedSection27Label(): string {
    return this.language.isMalay() ? "Ditolak" : "Rejected"
  }

  get nameReservationRejectedProps(): PropsNameReservationRejected {
    return new PropsNameReservationRejected(
      "Incorporation of New Sdn Bhd",
      this.latestSection27Application?.name ?? "PROPOSED NAME"
    )
  }
}
