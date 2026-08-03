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
import { Company } from "~/scripts/models/Company"
import type { CompletionOfIncorporation } from "~/scripts/types/emit-messages/CompletionOfIncorporation"
import { CorporateProfilePurchaser } from "~/scripts/library/CorporateProfilePurchaser"
import type { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import type { ShareholderInvitation } from "~/scripts/models/ShareholderInvitation"
import type { MsicCodeAssign } from "~/scripts/models/MsicCodeAssign"
import { MsicCode } from "~/scripts/models/MsicCode"
import { Filter } from "~/scripts/library/Filter"
import { SelectOption } from "~/scripts/types/SelectOption"
import { City, Country, Location, State } from "~/scripts/models/Location"
import { Form } from "~/scripts/models/Form"
import { File } from "~/scripts/models/File"

/**
 * THINGS THEY WANT TO KNOW
 * 1. Payment (done)
 * 2. Section 201
 * 3. Names proposed (done)
 * 4. Directors (done)
 * 5. Shareholders (done)
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
  completionOfIncorporationPopup: any | null = null

  language = useLanguage()

  documentRef: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  isShowSection201: Ref<boolean> = ref<boolean>(false)
  selectedDirectorInvitationFor201: Ref<DirectorInvitation | null> = ref<DirectorInvitation | null>(null)

  isShowReceipt: Ref<boolean> = ref<boolean>(false)
  isShowSection27: Ref<boolean> = ref<boolean>(false)
  isShowRegistration: Ref<boolean> = ref<boolean>(false)
  isShowCompletion: Ref<boolean> = ref<boolean>(false)

  isShowProposedNames: Ref<boolean> = ref<boolean>(false)
  selectedProposedName: Ref<string> = ref<string>("")

  isUploadingSection27: Ref<boolean> = ref<boolean>(false)
  isDownloadingSection27: Ref<boolean> = ref<boolean>(false)
  isShowSection27Actions: Ref<boolean> = ref<boolean>(false)
  isUpdatingSection27: Ref<boolean> = ref<boolean>(false)

  isUploadingRegistration: Ref<boolean> = ref<boolean>(false)
  isDownloadingRegistration: Ref<boolean> = ref<boolean>(false)
  isShowRegistrationActions: Ref<boolean> = ref<boolean>(false)
  isUpdatingRegistration: Ref<boolean> = ref<boolean>(false)

  isUploadingCompletion: Ref<boolean> = ref<boolean>(false)
  isDownloadingCompletion: Ref<boolean> = ref<boolean>(false)
  isShowCompletionActions: Ref<boolean> = ref<boolean>(false)
  isUpdatingCompletion: Ref<boolean> = ref<boolean>(false)

  selectedDocumentTarget: Ref<string> = ref<string>(DocumentTargets.TARGET_RECEIPT)

  incorporatedAt: Ref<string | null> = ref<string | null>(null)
  registrationNumberNew: Ref<string | null> = ref<string | null>(null)
  registrationNumberOld: Ref<string | null> = ref<string | null>(null)

  isEditingDescription: Ref<boolean> = ref<boolean>(false)
  isUpdatingDescription: Ref<boolean> = ref<boolean>(false)
  isEditingAddress: Ref<boolean> = ref<boolean>(false)

  selectedMsicCodeIds: Ref<string[]> = ref<string[]>([])
  searchTextsForMsicCodes: Ref<string[]> = ref<string[]>([])
  msicCodes: Ref<MsicCode[]> = ref<MsicCode[]>([])

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

  setCompletionOfIncorporationPopup(completionOfIncorporationPopup: any): void {
    this.completionOfIncorporationPopup = completionOfIncorporationPopup
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
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

      await Promise.allSettled([this.fetchApplication(), this.fetchPaymentOrder(), this.fetchMsicCodes()])

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

    let directorPromises = this.application.value.directorInvitations.map((di: DirectorInvitation) => {
      return di.setUser(useUserStore())
    })

    let shareholderPromises = this.application.value.shareholderInvitations.map((si: ShareholderInvitation) => {
      return si.setUser(useUserStore())
    })

    let promises = directorPromises.concat(shareholderPromises)

    await Promise.all(promises)
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

  async fetchMsicCodes(): Promise<void> {
    let repository = useMsicCodeStore()
    let filter = new Filter()
    filter.takeAll = true
    let response = await repository.fetchAll(filter)

    this.msicCodes.value = response.data.map((d: any) => {
      return new MsicCode(d)
    })
  }

  resetAllDocumentValues(): void {
    this.isShowReceipt.value = false
    this.isShowSection27.value = false
    this.isShowRegistration.value = false
    this.isShowCompletion.value = false

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

  onEditBusinessDescriptionClicked(): void {
    this.isEditingDescription.value = true
    this.selectedMsicCodeIds.value = this.application.value.msicCodeAssigns.map((msicCodeAssign: MsicCodeAssign) => {
      return msicCodeAssign.msicCode.id
    })
  }

  onCancelEditBusinessDescriptionClicked(): void {
    this.isEditingDescription.value = false
  }

  async onSaveBusinessDescriptionClicked(): Promise<void> {
    try {
      this.isUpdatingDescription.value = true
      await this.application.value.updateBusinessDescriptionAndMsicCodes(
        this.selectedMsicCodeIds.value,
        useApplicationIncorporateStore()
      )
      this.isEditingDescription.value = false
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isUpdatingDescription.value = false
    }
  }

  onMsicCodeSelected(msicCode: any, index: number): void {
    if (this.selectedMsicCodeIds.value[index]) {
      this.selectedMsicCodeIds.value[index] = msicCode
    } else {
      this.selectedMsicCodeIds.value.push(msicCode)
    }
  }

  onMsicCodeSearched(searchText: string, index: number): void {
    if (this.searchTextsForMsicCodes.value[index]) {
      this.searchTextsForMsicCodes.value[index] = searchText
    } else {
      this.searchTextsForMsicCodes.value.push(searchText)
    }
  }

  onViewSection201Clicked(directorInvitation: DirectorInvitation): void {
    this.selectedDirectorInvitationFor201.value = directorInvitation
    this.isShowSection201.value = true
    this.selectedDocumentTarget.value = DocumentTargets.TARGET_SECTION_201
  }

  onHideSection201(): void {
    this.isShowSection201.value = false
    this.selectedDirectorInvitationFor201.value = null
    this.selectedDocumentTarget.value = DocumentTargets.TARGET_RECEIPT
  }

  // Name Reservation Step
  onNameReservationStepClicked(): void {
    this.resetAllDocumentValues()
    this.isShowSection27.value = true
    this.selectedDocumentTarget.value = DocumentTargets.TARGET_INCORP_SECTION_27
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

  // Registration Incorporation
  onRegistrationOfIncorporationClicked(): void {
    this.resetAllDocumentValues()
    this.isShowRegistration.value = true

    this.selectedDocumentTarget.value = DocumentTargets.TARGET_INCORP_SECTION_236_THREE // update the document target
  }

  onIncorporationApproved(): void {
    this.isShowRegistrationActions.value = false
    /**
     * Items at this step:
     * 1. Incorporation Date
     * 2. Confirmation on the Company Details
     * 3. Documents relating to the company - COI, Superform, Appointment of First Cosec (At this step?)
     * */
    if (this.completionOfIncorporationPopup) {
      this.completionOfIncorporationPopup.show()
    }
  }

  async onProceedIncorporationApproved(data: CompletionOfIncorporation): Promise<void> {
    // save the data
    try {
      this.isUpdatingRegistration.value = true

      if (!this.application.value.metaData) {
        this.application.value.metaData = {}
      }

      this.application.value.metaData.company_data = data
      await this.application.value.updateMetadata(useApplicationIncorporateStore())

      let toastTitle = this.language.isMalay()
        ? "Maklumat baharu telah dikemaskini."
        : "Your changes have been recorded."
      let toastMessage = this.language.isMalay()
        ? "Teruskan dengan Seksyen 236(3) dan Profil Korporat."
        : "Proceed with generation of Section 236(3) and purchase of Corporate Profile."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()
    } catch (e) {
      console.log(e)
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isUpdatingRegistration.value = false
    }
  }

  async onDownloadRegistrationClicked(): Promise<void> {
    //
  }

  onShowRegistrationActionsClicked(): void {
    this.isShowRegistrationActions.value = !this.isShowRegistrationActions.value
  }

  // completion of incorporation
  onCompletionOfIncorporationClicked(): void {
    this.resetAllDocumentValues()
    this.isShowCompletion.value = true

    this.selectedDocumentTarget.value = DocumentTargets.TARGET_INCORP_SECTION_236_THREE // update the document target
  }

  onShowCompletionActionsClicked(): void {
    this.isShowCompletionActions.value = !this.isShowCompletionActions.value
  }

  async onCompleteIncorporation(): Promise<void> {
    try {
      this.isUpdatingCompletion.value = true

      let repository = useApplicationIncorporateStore()
      this.application.value.status = StatusConstants.APPROVED
      let data = {
        status: StatusConstants.APPROVED,
      }
      await repository.update(this.application.value.id, data)
      let response = await this.application.value.notifyApproved(repository)

      if (!response) {
        let error = new Error()
        error.setForCUD()
        throw error
      } else {
        let toastTitle = this.language.isMalay()
          ? "Promoter telah diberitahu melalui emel dan WhatsApp."
          : "Promoter has been informed via Email and WhatsApp."
        let toastMessage = this.language.isMalay()
          ? "Sila tunggu sementara kami masukkan butiran Sdn Bhd Baharu."
          : "Please wait while we initialize details of the New Sdn Bhd."
        let toast = new Toast(toastTitle, toastMessage)
        toast.success()
      }

      let companyToConvert = new Company(this.companyToConvert)
      await companyToConvert.create(useCompanyStore())

      let formsToAdd: Form[] = []
      // Corporate Profile
      if (
        this.application.value.metaData?.corporate_profile &&
        !StringUtil.isNullOrEmpty(this.application.value.metaData.corporate_profile.file_id)
      ) {
        let corporateProfileForm = new Form()
        corporateProfileForm.companyId = companyToConvert.id
        corporateProfileForm.type = "business_detail"
        corporateProfileForm.fileId = this.application.value.metaData.corporate_profile.file_id
        corporateProfileForm.documentDate = companyToConvert.incorporatedAt
        corporateProfileForm.status = "active"
        corporateProfileForm.noOfPages = 5 // default
        formsToAdd.push(corporateProfileForm)
      }

      // Section 236
      if (
        this.application.value.metaData?.section236 &&
        !StringUtil.isNullOrEmpty(this.application.value.metaData.section236)
      ) {
        let section236Form = new Form()
        section236Form.companyId = companyToConvert.id
        section236Form.type = "section_236"
        section236Form.fileId = this.application.value.metaData.section236
        section236Form.documentDate = companyToConvert.incorporatedAt
        section236Form.status = "active"
        section236Form.noOfPages = 1
        formsToAdd.push(section236Form)
      }

      let promises = formsToAdd.map((form: Form) => {
        return form.create(useFormStore())
      })

      await Promise.allSettled(promises)

      let router = useRouter()
      router.push({ path: `/sdnbhds/${companyToConvert.id}` })
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isUpdatingCompletion.value = false
    }
  }

  async onIncorporationCompleted(): Promise<void> {
    if (this.isUpdatingCompletion.value) {
      return
    }

    try {
      this.isUpdatingCompletion.value = true

      let repository = useApplicationIncorporateStore()
      this.application.value.status = StatusConstants.APPROVED
      let data = {
        status: StatusConstants.APPROVED,
      }
      await repository.update(this.application.value.id, data)
      let response = await this.application.value.notifyApproved(repository)

      if (!response) {
        let error = new Error()
        error.setForCUD()
        throw error
      } else {
        let toastTitle = this.language.isMalay() ? "Rekod telah dikemaskini." : "Your changes have been recorded!"
        let toastMessage = this.language.isMalay()
          ? "Promoter telah diberitahu melalui emel dan WhatsApp."
          : "Promoter has been informed via Email and WhatsApp."
        let toast = new Toast(toastTitle, toastMessage)
        toast.success()
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
      this.isUpdatingCompletion.value = false
    }
  }

  onSection236Clicked(): void {
    this.isShowRegistrationActions.value = false
    this.selectedDocumentTarget.value = DocumentTargets.TARGET_INCORP_SECTION_236_THREE
  }

  async onGenerate236Clicked(): Promise<void> {
    this.onSection236Clicked()
    try {
      this.isUpdatingRegistration.value = true

      await nextTick()
      if (!this.documentRef) {
        let error = new Error()
        error.setForDocumentDownload()
        throw error
      }

      let uploadedFileId = await this.documentRef.onGenerateClicked()
      if (!uploadedFileId) {
        this.isUpdatingRegistration.value = false
        return
      }

      await this.documentRef.onDownloadClicked()

      if (this.application.value.metaData === null) {
        this.application.value.metaData = {}
      }

      this.application.value.metaData.section236 = uploadedFileId
      await this.application.value.updateMetadata(useApplicationIncorporateStore())

      let toastTitle = this.language.isMalay()
        ? "Seksyen 236(3) telah direkodkan bagi Permohonan ini."
        : "Section 236(3) has been generated for this Application."
      let toastMessage = this.language.isMalay()
        ? "Salinan telah dimuat turun untuk rekod anda."
        : "A copy has been downloaded for your record."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()
    } catch (e) {
      console.error(e) // check what is the issue
    } finally {
      this.isUpdatingRegistration.value = false
    }
  }

  async onPurchaseCorporateProfile(): Promise<void> {
    this.isShowRegistrationActions.value = false

    try {
      this.isUpdatingRegistration.value = true

      let corporateProfilePurchaser = new CorporateProfilePurchaser()
      corporateProfilePurchaser.isUploadFile = true
      corporateProfilePurchaser.setRegistrationNumberNew(this.companyToConvert.registrationNumberNew)
      corporateProfilePurchaser.setRegistrationNumberOld(this.companyToConvert.registrationNumberOld)

      await corporateProfilePurchaser.purchase()

      if (!this.application.value.metaData) {
        this.application.value.metaData = {}
      }

      this.application.value.metaData.corporate_profile = {
        json: corporateProfilePurchaser.jsonData,
        file_id: corporateProfilePurchaser.uploadedFileId,
      }
      await this.application.value.updateMetadata(useApplicationIncorporateStore())

      let toastTitle = this.language.isMalay()
        ? "Profil Korporat SSM telah dibeli bagi Permohonan ini."
        : "SSM Corporate Profile has been purchased for this Application."
      let toastMessage = this.language.isMalay()
        ? "Salinan telah dimuat turun untuk rekod anda."
        : "A copy has been downloaded for your record."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForPurchaseFail("SSM Corporate Profile", "Profil Korporat SSM")
        error.handle()
      }
    } finally {
      this.isUpdatingRegistration.value = false
    }
  }

  async onDownloadCorporateProfile(): Promise<void> {
    if (!this.hasPurchasedCorporateProfile) {
      return
    }

    let fileId = this.application.value.metaData?.corporate_profile?.file_id
    let repository = useFileStore()
    let response = await repository.fetch(fileId)

    if (repository.error !== null) {
      let error = new Error()
      error.setForFetch()
      error.handle()
      return
    }

    let file = new File(response)
    if (!file.url) {
      return
    }
    window.open(file.url, "_blank")
  }

  async generatedSection201For(directorInvitation: DirectorInvitation): Promise<void> {
    // get the document ref, upload the document, and update the application metadata
    this.onViewSection201Clicked(directorInvitation)
    try {
      await nextTick()
      if (!this.documentRef) {
        let error = new Error()
        error.setForDocumentDownload()
        throw error
      }

      let uploadedFileId = await this.documentRef.onGenerateClicked()
      if (!uploadedFileId) {
        this.isUpdatingRegistration.value = false
        return
      }

      await this.documentRef.onDownloadClicked()

      if (!this.application.value.metaData) {
        this.application.value.metaData = {}
      }

      if (!this.application.value.metaData.section201) {
        this.application.value.metaData.section201 = []
      }

      this.application.value.metaData.section201.push({
        directorInvitationId: directorInvitation.id,
        fileId: uploadedFileId,
      })

      await this.application.value.updateMetadata(useApplicationIncorporateStore())

      let toastTitle = this.language.isMalay()
        ? `Pengisytiharan bawah Seksyen 201 telah direkodkan bagi ${directorInvitation.name}.`
        : `Declaration under Section 201 has been generated for ${directorInvitation.name}.`
      let toastMessage = this.language.isMalay()
        ? "Salinan telah dimuat turun untuk rekod anda."
        : "A copy has been downloaded for your record."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()
    } catch (e) {
      console.error(e) // check what is the issue
    } finally {
      //
    }
  }

  hasGeneratedSection201For(directorInvitation: DirectorInvitation): boolean {
    if (!this.application.value || !this.application.value.metaData || !this.application.value.metaData.section201) {
      return false
    }

    return this.application.value.metaData.section201.some((d: any) => {
      return d.directorInvitationId === directorInvitation.id
    })
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

  get viewSection201Label(): string {
    return this.language.isMalay() ? "Pengisytiharan bawah Seksyen 201" : "Declaration under Section 201"
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

  get directorLabel(): string {
    return this.language.isMalay() ? "Butiran Pengarah yang Dilantik" : "Details of Elected Directors"
  }

  get directorDetails(): DirectorInvitation[] {
    return this.application.value.directorInvitations
  }

  get shareholderLabel(): string {
    return this.language.isMalay() ? "Butiran Pemegang Saham yang Dinama" : "Details of Nominated Shareholders"
  }

  get shareholderDetails(): ShareholderInvitation[] {
    return this.application.value.shareholderInvitations
  }

  get serviceApplicationProps(): PropsServiceApplication {
    let props = new PropsServiceApplication(this.serviceName, true, this.isShowReceipt.value)

    props.application = this.application.value

    return props
  }

  get totalSharesLabel(): string {
    return this.language.isMalay() ? "Jumlah Saham" : "Total Shares"
  }

  get businessNatureLabel(): string {
    return this.language.isMalay() ? "Perihal Perniagaan" : "Nature of Business"
  }

  get msicCodeLabel(): string {
    return this.language.isMalay() ? "Kod MSIC" : "MSIC Codes"
  }

  get msicCodesList(): string {
    return this.application.value.msicCodeAssigns
      .map((msic: MsicCodeAssign) => {
        return `${msic.msicCode.code} - ${msic.msicCode.descriptionEn}`
      })
      .join("<br>")
  }

  get businessAddressLabel(): string {
    return this.language.isMalay() ? "Alamat Perniagaan" : "Business Address"
  }

  get businessAddress(): string {
    if (!this.application.value.hasBusinessAddress) {
      return "(No Business Address)"
    }

    return this.application.value.businessAddressLocation?.getMultilineAddress() ?? "(No Business Address)"
  }

  get hasPaid(): boolean {
    return (
      this.application.value.status !== StatusConstants.DRAFT &&
      this.application.value.status !== StatusConstants.PENDING
    )
  }

  get serviceApplicationId(): string {
    if (this.selectedDocumentTarget.value === DocumentTargets.TARGET_SECTION_201) {
      return this.selectedDirectorInvitationFor201.value?.id ?? this.applicationId.value
    }

    return this.applicationId.value
  }

  // region for names
  get nameReservationNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(this.hasPaid, this.isNameReservationCompleted, this.isShowSection27.value)
  }

  get isNameReservationCompleted(): boolean {
    return this.isNameApproved // TODO: Update
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
    if (this.isNameApproved) {
      return this.language.isMalay() ? "Lulus" : "Approved"
    }

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

  // registration of incoporation
  get registrationNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(
      this.isNameApproved,
      this.isRegistrationCompleted,
      this.isShowRegistration.value
    )
  }

  get isRegistrationCompleted(): boolean {
    return this.application.value.metaData !== null && !!this.application.value.metaData.company_data
  }

  get registrationLabel(): string {
    return this.language.isMalay() ? "Pemerbadanan Sdn Bhd Baharu" : "Incorporation of New Sdn Bhd"
  }

  get registrationSublabel(): string {
    return this.language.isMalay() ? "Pendaftaran Pemerbadanan" : "Registration of Incorporation"
  }

  get uploadlCOILabel(): string {
    return this.language.isMalay() ? "Muat Naik" : "Upload"
  }

  get registeredLabel(): string {
    return this.language.isMalay() ? "Diluluskan" : "Approved"
  }

  get isCOIUploaded(): boolean {
    return false
  }

  get downloadCOILabel(): string {
    return this.language.isMalay() ? "Muat Turun" : "Download"
  }

  get hasNextStepsForRegistration(): boolean {
    return !this.isIncorporationApproved
  }

  get registrationActionLabel(): string {
    if (!this.hasNextStepsForRegistration) {
      return this.language.isMalay() ? "Diluluskan" : "Approved"
    }

    return this.language.isMalay() ? "Seterusnya" : "Next Steps"
  }

  get isIncorporationApproved(): boolean {
    return this.application.value.metaData !== null && !!this.application.value.metaData.company_data
  }

  get approvedRegistrationLabel(): string {
    return this.language.isMalay() ? "Diluluskan" : "Approved"
  }

  get generateSection236Label(): string {
    return this.language.isMalay() ? "Seksyen 236(2)" : "Section 236(2)"
  }

  get corporateProfileLabel(): string {
    return this.language.isMalay() ? "Profil Korporat" : "Corporate Profile"
  }

  // Completion of Incorporation
  get completionnNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(
      this.isRegistrationCompleted,
      this.isIncorporationCompleted,
      this.isShowCompletion.value
    )
  }

  get isIncorporationCompleted(): boolean {
    return this.application.value.status === StatusConstants.COMPLETED
  }

  get completionOfIncorporationLabel(): string {
    return this.language.isMalay() ? "Pemerbadanan Selesai" : "Completion of Incorporation"
  }

  get completionOfIncorporationSublabel(): string {
    return this.language.isMalay() ? "Penubuhan Sdn Bhd Baharu" : "Creation of New Sdn Bhd"
  }

  get hasNextStepsForCompletion(): boolean {
    return this.application.value.status !== StatusConstants.COMPLETED
  }

  get documentsToGenerateLabel(): string {
    return this.language.isMalay() ? "Dokumen yang Diperlukan" : "Required Documents"
  }

  get generateLabel(): string {
    return this.language.isMalay() ? "Hasilkan" : "Generate"
  }

  get hasGeneratedSection201(): boolean {
    return this.application.value.metaData !== null && !!this.application.value.metaData.section201
  }

  get haveAllDirectorsSigned(): boolean {
    return this.application.value.directorInvitations.every((director: DirectorInvitation) => {
      return director.signatureId !== null
    })
  }

  get nameOfDirectorsNotSigned(): string {
    let unsignedDirectors = this.application.value.directorInvitations
      .filter((director: DirectorInvitation) => {
        return director.signatureId === null
      })
      .map((director: DirectorInvitation) => {
        return director.name
      })

    let prefix = this.language.isMalay() ? "Pengarah yang belum menandatangani" : "Directors who have not signed"

    return `${prefix}: ${unsignedDirectors.join(", ")}`
  }

  get hasGeneratedSection236(): boolean {
    return this.application.value.metaData !== null && !!this.application.value.metaData.section236
  }

  get hasPurchasedCorporateProfile(): boolean {
    return this.application.value.metaData !== null && !!this.application.value.metaData.corporate_profile
  }

  get completionActionLabel(): string {
    if (!this.hasNextStepsForCompletion) {
      return this.language.isMalay() ? "Selesai" : "Completed"
    }

    return this.language.isMalay() ? "Seterusnya" : "Next Steps"
  }

  get areDocumentsReadyToConvert(): boolean {
    return (
      this.application.value.metaData !== null &&
      !!this.application.value.metaData.company_data &&
      !!this.application.value.metaData.section236 &&
      !!this.application.value.metaData.corporate_profile
    )
  }

  get convertLabel(): string {
    return this.language.isMalay() ? "Selesai" : "Complete"
  }

  get companyToConvert(): Company {
    let company = new Company()

    let registrationNumberNew = this.application.value.metaData?.company_data?.registrationNumberNew ?? ""
    let registrationNumberOld = this.application.value.metaData?.company_data?.registrationNumberOld ?? ""

    company.name = this.application.value.nameSelected?.name ?? ""
    company.nameType = this.application.value.nameSelected?.nameType ?? ""
    company.nameDescription = this.application.value.nameSelected?.nameDescription ?? "-"
    company.registrationNumberNew = registrationNumberNew ?? ""
    company.registrationNumberOld = registrationNumberOld ?? ""
    company.businessDescription = this.application.value.businessDescription
    company.hasBusinessAddress = this.application.value.hasBusinessAddress
    company.businessAddressLocation = this.application.value.hasBusinessAddress
      ? new Location(this.application.value.businessAddressLocation)
      : null
    company.registeredAddressLocation = new Location()
    company.registeredAddressLocation.addressLine1 = "D-1-6, FIRST FLOOR, BLOCK D, SEKITAR26 ENTERPRISE"
    company.registeredAddressLocation.addressLine2 = "PERSIARAN HULU SELANGOR, SEKSYEN 26"
    company.registeredAddressLocation.postcode = "40400"
    company.registeredAddressLocation.city = new City()
    company.registeredAddressLocation.city.id = 61096
    company.registeredAddressLocation.city.name = "SHAH ALAM"
    company.registeredAddressLocation.state = new State()
    company.registeredAddressLocation.state.id = 23
    company.registeredAddressLocation.country = new Country()
    company.registeredAddressLocation.country.id = 87
    company.applicationIncorporationId = this.application.value.id
    company.incorporatedAt = this.application.value.metaData?.company_data?.incorporatedAt ?? null

    return company
  }

  // MSIC Codes
  get firstSelectedMsicCodeName(): string {
    if (!this.selectedMsicCodeIds.value[0] || StringUtil.isNullOrEmpty(this.selectedMsicCodeIds.value[0])) {
      return ""
    }

    let msicCode = this.msicCodes.value.find((msicCode: MsicCode) => {
      return msicCode.id === this.selectedMsicCodeIds.value[0]
    })

    if (!msicCode) {
      return ""
    }

    return `${msicCode.code} - ${msicCode.descriptionEn}`
  }

  get firstMsicCodeOptions(): SelectOption[] {
    return this.msicCodes.value
      .filter((msicCode: MsicCode) => {
        if (!this.searchTextsForMsicCodes.value[0] || StringUtil.isNullOrEmpty(this.searchTextsForMsicCodes.value[0])) {
          return true
        }

        return (
          StringUtil.contains(msicCode.code, this.searchTextsForMsicCodes.value[0]) ||
          StringUtil.contains(msicCode.description, this.searchTextsForMsicCodes.value[0]) ||
          StringUtil.contains(msicCode.descriptionEn, this.searchTextsForMsicCodes.value[0])
        )
      })
      .map((msicCode: MsicCode) => {
        return new SelectOption(msicCode.id, msicCode.id, `${msicCode.code} - ${msicCode.descriptionEn}`)
      })
  }

  get secondSelectedMsicCodeName(): string {
    if (!this.selectedMsicCodeIds.value[1] || StringUtil.isNullOrEmpty(this.selectedMsicCodeIds.value[1])) {
      return ""
    }

    let msicCode = this.msicCodes.value.find((msicCode: MsicCode) => {
      return msicCode.id === this.selectedMsicCodeIds.value[1]
    })

    if (!msicCode) {
      return ""
    }

    return `${msicCode.code} - ${msicCode.descriptionEn}`
  }

  get secondMsicCodeOptions(): SelectOption[] {
    return this.msicCodes.value
      .filter((msicCode: MsicCode) => {
        if (!this.searchTextsForMsicCodes.value[1] || StringUtil.isNullOrEmpty(this.searchTextsForMsicCodes.value[1])) {
          return true
        }

        return (
          StringUtil.contains(msicCode.code, this.searchTextsForMsicCodes.value[1]) ||
          StringUtil.contains(msicCode.description, this.searchTextsForMsicCodes.value[1]) ||
          StringUtil.contains(msicCode.descriptionEn, this.searchTextsForMsicCodes.value[1])
        )
      })
      .map((msicCode: MsicCode) => {
        return new SelectOption(msicCode.id, msicCode.id, `${msicCode.code} - ${msicCode.descriptionEn}`)
      })
  }

  get thirdSelectedMsicCodeName(): string {
    if (!this.selectedMsicCodeIds.value[2] || StringUtil.isNullOrEmpty(this.selectedMsicCodeIds.value[2])) {
      return ""
    }

    let msicCode = this.msicCodes.value.find((msicCode: MsicCode) => {
      return msicCode.id === this.selectedMsicCodeIds.value[2]
    })

    if (!msicCode) {
      return ""
    }

    return `${msicCode.code} - ${msicCode.descriptionEn}`
  }

  get thirdMsicCodeOptions(): SelectOption[] {
    return this.msicCodes.value
      .filter((msicCode: MsicCode) => {
        if (!this.searchTextsForMsicCodes.value[2] || StringUtil.isNullOrEmpty(this.searchTextsForMsicCodes.value[2])) {
          return true
        }

        return (
          StringUtil.contains(msicCode.code, this.searchTextsForMsicCodes.value[2]) ||
          StringUtil.contains(msicCode.description, this.searchTextsForMsicCodes.value[2]) ||
          StringUtil.contains(msicCode.descriptionEn, this.searchTextsForMsicCodes.value[2])
        )
      })
      .map((msicCode: MsicCode) => {
        return new SelectOption(msicCode.id, msicCode.id, `${msicCode.code} - ${msicCode.descriptionEn}`)
      })
  }
}
