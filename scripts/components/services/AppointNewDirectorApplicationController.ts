import { ApplicationController } from "./ApplicationController"
import type { IPropsApplication } from "~/scripts/props/PropsApplication"
import { PropsServiceApplicationNode } from "~/scripts/props/PropsServiceApplicationNode"
import { Error } from "~/scripts/library/Error"
import { StatusConstants } from "~/scripts/constants/Status"
import { Toast } from "~/scripts/library/Toast"
import { DocumentTargets } from "~/scripts/constants/DocumentTargets"
import { StringUtil } from "~/scripts/utils/String"
import { ObjectUtil } from "~/scripts/utils/Object"
import { File } from "~/scripts/models/File"
import { PropsUploadDocument } from "~/scripts/props/PropsUploadDocument"
import { CompanyConstants } from "~/scripts/constants/Company"
import { CompanyDirectorAppointment } from "~/scripts/models/CompanyDirectorAppointment"
import { Bank } from "~/scripts/models/Bank"
import { Filter } from "~/scripts/library/Filter"
import { PaymentOrderItem } from "~/scripts/models/PaymentOrderItem"
import type { PaymentOrderItemMandatory } from "~/scripts/models/PaymentOrderItemMandatory"
import type { PaymentOrderItemOptional } from "~/scripts/models/PaymentOrderItemOptional"
import { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import { PropsInvitationDetail } from "~/scripts/props/PropsInvitationDetail"
import { GenerateDocumentDetails } from "~/scripts/types/GenerateDocumentDetails"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import type { CompanyDocument } from "~/scripts/types/CompanyDocument"

export class AppointNewDirectorApplicationController extends ApplicationController<CompanyDirectorAppointment> {
  resolutionsRef: any | null = null

  banks: Ref<Bank[]> = ref<Bank[]>([])

  isShowResolutions: Ref<boolean> = ref<boolean>(false)
  isShowShipped: Ref<boolean> = ref<boolean>(false)
  isShowCompleted: Ref<boolean> = ref<boolean>(false)

  isGenerating: Ref<boolean> = ref<boolean>(false)
  isApproving: Ref<boolean> = ref<boolean>(false)
  isCompleting: Ref<boolean> = ref<boolean>(false)

  isDownloadingDcr: Ref<boolean> = ref<boolean>(false)
  isDownloadingSection58: Ref<boolean> = ref<boolean>(false)

  constructor(props: IPropsApplication, emitEvents: any | null) {
    super(
      props.companyId,
      useCompanyDirectorAppointmentStore(),
      CompanyDirectorAppointment,
      CompanyConstants.TARGET_DIRECTOR_APPOINTMENT,
      emitEvents,
      props.applicationId
    )

    this.minimumMajorityRequired.value = 0
    this.selectedApprovalType.value = "director" // this is fixed for this service
  }

  setResolutionsRef(resolutionsRef: any): void {
    this.resolutionsRef = resolutionsRef
  }

  onPaymentStepClicked(): void {
    this.isShowReceipt.value = true
    this.isShowResolutions.value = false
    this.isShowCompleted.value = false

    this.emitEvents("documentSelected", DocumentTargets.TARGET_RECEIPT)
  }

  onApplicationDetailsClicked(): void {
    this.isShowReceipt.value = false
    this.isShowResolutions.value = true
    this.isShowCompleted.value = false

    this.emitEvents("documentSelected", DocumentTargets.TARGET_DIRECTOR_APPOINTMENT_RESOLUTIONS)
  }

  async onDownloadClicked(): Promise<void> {
    await nextTick()
    this.emitEvents("download")

    let generateDocumentDetails = new GenerateDocumentDetails(
      `DCR - Appointment of Director.pdf`,
      this.dayjs().format("YYYY-MM-DD"),
      1
    )

    this.emitEvents("generate", generateDocumentDetails)
  }

  async onDownloadGeneratedDcr(): Promise<void> {
    if (!this.isDownloadingDcr.value || !this.isDcrGenerated) {
      return
    }

    let generatedDcr = this.generatedDcr
    if (!generatedDcr) {
      return
    }

    try {
      this.isDownloadingDcr.value = true

      let url = generatedDcr.fileUrl ?? ""
      let response = await fetch(url)
      if (response.ok) {
        let blob = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = blobUrl
        link.setAttribute("download", generatedDcr.documentName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
      }
    } catch (e) {
    } finally {
      this.isDownloadingDcr.value = false
    }
  }

  async onDownloadSection58(): Promise<void> {
    if (this.isDownloadingSection58.value || !this.isSection58Uploaded) {
      return
    }

    let section58 = this.section58
    if (!section58) {
      return
    }

    try {
      this.isDownloadingSection58.value = true

      let url = section58.fileUrl ?? ""
      let response = await fetch(url)
      if (response.ok) {
        let blob = await response.blob()
        const blobUrl = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = blobUrl
        link.setAttribute("download", section58.documentName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
      }
    } catch (e) {
    } finally {
      this.isDownloadingSection58.value = false
    }
  }

  async onPrintClicked(): Promise<void> {
    //
  }

  async onApprovedClicked(): Promise<void> {
    if (!this.application.value) {
      return
    }

    this.isApproving.value = true
    try {
      this.application.value.status = StatusConstants.APPROVED
      await this.application.value.update(useCompanyDirectorAppointmentStore())
      await this.fetchApplication()

      let toastTitle = this.language.isMalay()
        ? "Anda telah mengemaskini status permohonan ini."
        : "You have updated this application status."
      let toastMessage = this.language.isMalay() ? "Sila muat naik Resolusi." : "Please upload the Resolution."

      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      if (this.uploadDocumentRef) {
        this.uploadDocumentRef.show()
      }
    } catch (e) {
      let error = new Error()
      error.setForCUD()
      error.handle()
    } finally {
      this.isApproving.value = false
    }
  }

  async onProceedPostUpload(): Promise<void> {
    await this.uploadedDocumentChecker.value.fetchDocuments()
  }

  async onShippedClicked(): Promise<void> {
    if (this.shipApplicationRef) {
      this.shipApplicationRef.show()
    }
  }

  onUploadClicked(): void {
    if (this.uploadDocumentRef) {
      this.uploadDocumentRef.show()
    }
  }

  async onProceedUpload(): Promise<void> {
    await this.uploadedDocumentChecker.value.fetchDocuments()
  }

  async onCompleteClicked(): Promise<void> {
    await this.proceedCompleteService()
  }

  async proceedCompleteService(): Promise<void> {
    if (!this.application.value) {
      return
    }
    try {
      let repository = useCompanyStore()
      await repository.postService(this.target.value, this.application.value.id)

      if (repository.error !== null) {
        throw repository.error
      }

      let toastTitle = this.language.isMalay()
        ? "Permohonan telah Selesai. Pengarah Baharu telah ditambah ke Syarikat."
        : "Application is Completed. The new Director has been added to the Company."
      let toastMessage = this.language.isMalay()
        ? "Anda akan dibawa ke muka Sdn Bhd."
        : "You will be redirected to the Sdn Bhd page."

      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      let router = useRouter()
      router.push({ path: `/sdnbhds/${this.application.value.companyId}` })
    } catch (e) {
      let error = new Error()
      error.setForCUD()
      error.handle()
    } finally {
      this.isCompleting.value = false
    }
  }

  getInvitationDetailProp(invitation: DirectorInvitation): PropsInvitationDetail {
    let props = new PropsInvitationDetail(invitation.id, invitation)

    props.hasSection201 = true

    return props
  }

  //getters
  get directorInvitations(): DirectorInvitation[] {
    return this.application.value?.directorInvitations ?? []
  }

  get serviceName(): string {
    return this.language.isMalay() ? "Lantik Pengarah Baharu" : "Appoint New Director"
  }

  get paymentApplicationNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(!this.hasPaid, this.hasPaid, this.isShowReceipt.value)
  }

  get applicationDetailsNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(this.hasPaid, this.isApproved, this.isShowResolutions.value)
  }

  get applicationDetailsLabel(): string {
    return this.language.isMalay() ? "Butiran Permohonan" : "Application Details"
  }

  get applicationDetailsSublabel(): string {
    return this.language.isMalay() ? "Butiran Pengarah Baharu" : "Details of New Director"
  }

  get directorNameLabel(): string {
    return this.language.isMalay() ? "Nama" : "Name"
  }

  get directorName(): string {
    return this.application.value?.directorName?.toUpperCase() ?? "(Incomplete)"
  }

  get directorIdentificationLabel(): string {
    if (this.language.isMalay()) {
      return this.application.value?.directorIdentificationType === "passport" ? "No. Passport" : "No. MyKad"
    }

    return this.application.value?.directorIdentificationType === "passport" ? "Passport No." : "MyKad No."
  }

  get directorAddressLabel(): string {
    return this.language.isMalay() ? "Alamat" : "Address"
  }

  get directorPostcodeLabel(): string {
    return this.language.isMalay() ? "Poskod" : "Postcode"
  }

  get directorCityLabel(): string {
    return this.language.isMalay() ? "Bandar" : "City"
  }

  get directorStateLabel(): string {
    return this.language.isMalay() ? "Negeri" : "State"
  }

  get directorCountryLabel(): string {
    return this.language.isMalay() ? "Negara" : "Country"
  }

  get itemsToPrepareLabel(): string {
    return this.language.isMalay() ? "Perkara Tambahan perlu disediakan" : "Additional Items to Prepare"
  }

  get itemsToPrepare(): string[] {
    if (!this.hasOtherRequirements) {
      return []
    }

    let items: string[] = []
    this.paymentOrderItem.optionals.forEach((poio: PaymentOrderItemOptional) => {
      if (!StringUtil.contains(poio.serviceName, "printed")) {
        items.push(StringUtil.capitalize(poio.serviceName))
      }
    })

    return items
  }

  get downloadLabel(): string {
    return this.language.isMalay() ? "Jana DCR" : "Generate DCR"
  }

  get isApproved(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.status === StatusConstants.APPROVED ||
      this.application.value.status === StatusConstants.SHIPPED ||
      this.application.value.status === StatusConstants.DELIVERED ||
      this.application.value.status === StatusConstants.CONVERTED ||
      this.application.value.status === StatusConstants.COMPLETED
    )
  }

  get approveLabel(): string {
    return this.language.isMalay() ? "Diluluskan" : "Approved"
  }

  get shipLabel(): string {
    return this.language.isMalay() ? "Hantar" : "Shipped"
  }

  get isShipped(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.status === StatusConstants.SHIPPED ||
      this.application.value.status === StatusConstants.DELIVERED ||
      this.application.value.status === StatusConstants.CONVERTED ||
      this.application.value.status === StatusConstants.COMPLETED
    )
  }

  get deliveryNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(this.isApproved, this.isShipped, this.isShowShipped.value)
  }

  get completedNodeProps(): PropsServiceApplicationNode {
    let isPreviousStepCompleted = this.isDeliveryRequired ? this.isShipped : this.isApproved

    let props = new PropsServiceApplicationNode(isPreviousStepCompleted, this.isCompleted, this.isShowCompleted.value)

    props.isLastNode = true

    return props
  }

  get isCompleted(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.status === StatusConstants.CONVERTED ||
      this.application.value.status === StatusConstants.COMPLETED
    )
  }

  get applicationCompletedLabel(): string {
    if (this.isDeliveryRequired) {
      return this.language.isMalay() ? "Dokumen Dihantar" : "Documents Delivered"
    }
    return this.language.isMalay() ? "Permohonan Selesai" : "Completion of Application"
  }

  get completedSublabel(): string {
    return this.language.isMalay() ? "Masukkan Permohonan ke dalam Arkib" : "Move Application to Company Documents"
  }

  get completedStatus(): string {
    if (!this.isCompleted) {
      return this.language.isMalay() ? "Menunggu pengesahan dari klien" : "Pending confirmation from client"
    }

    let time = useLocalTime()

    let completedAt = time.formatDateOnlyFull(this.application.value?.completedAt ?? "")

    return this.language.isMalay() ? `Disahkan pada ${completedAt}` : `Confirmed on ${completedAt}`
  }

  get uploadLabel(): string {
    if (this.isSection58Uploaded) {
      return this.language.isMalay() ? "Muat Naik Semula" : "Upload Again"
    }

    return this.language.isMalay() ? "Muat Naik" : "Upload"
  }

  get markCompletedLabel(): string {
    return this.language.isMalay() ? "Tanda Lengkap" : "Mark Completed"
  }

  // get document uploaded
  get isSection58Uploaded(): boolean {
    return this.uploadedDocumentChecker.value.isDocumentUploaded(
      DocumentTargets.TARGET_DIRECTOR_APPOINTMENT,
      this.application.value?.createdAt ?? ""
    )
  }

  get section58(): CompanyDocument | null {
    if (!this.isSection58Uploaded) {
      return null
    }

    return this.uploadedDocumentChecker.value.latestDocument(
      DocumentTargets.TARGET_DIRECTOR_APPOINTMENT,
      this.application.value?.createdAt ?? ""
    )
  }

  get section58Label(): string {
    if (this.section58) {
      return this.section58.documentName
    }

    return this.language.isMalay() ? "Seksyen 58 - Tambah Pengarah Baharu" : "Section 58 - Add New Director"
  }

  get isDcrGenerated(): boolean {
    return this.uploadedDocumentChecker.value.isDocumentUploaded(
      DocumentTargets.TARGET_DIRECTOR_APPOINTMENT_RESOLUTIONS,
      this.application.value?.createdAt ?? ""
    )
  }

  get generatedDcr(): CompanyDocument | null {
    if (!this.isDcrGenerated) {
      return null
    }

    return this.uploadedDocumentChecker.value.latestDocument(
      DocumentTargets.TARGET_DIRECTOR_APPOINTMENT_RESOLUTIONS,
      this.application.value?.createdAt ?? ""
    )
  }

  get generatedDcrLabel(): string {
    if (this.generatedDcr) {
      return this.generatedDcr.documentName
    }

    return this.language.isMalay() ? "DCR - Perlantikan Pengarah" : "DCR - Appointment of Director"
  }
}
