import { ApplicationSwitch } from "~/scripts/models/ApplicationSwitch"
import { PropsSwitchApplication } from "~/scripts/props/PropsSwitchApplication"
import { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import { ShareholderInvitation } from "~/scripts/models/ShareholderInvitation"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { User } from "~/scripts/models/User"
import { MsicCodeAssign, MsicCodeAssignTarget } from "~/scripts/models/MsicCodeAssign"
import { MsicCode } from "~/scripts/models/MsicCode"
import { Filter } from "~/scripts/library/Filter"
import { SelectOption } from "~/scripts/types/SelectOption"
import type {
  CorporateProfileJsonBusinessCode,
  CorporateProfileJsonOfficerInfo,
  CorporateProfileJsonShareInfo,
  SsmCorporateProfilePurchaseData,
} from "~/scripts/models/SsmCorporateProfileJsonData"
import { UserDetail } from "~/scripts/models/UserDetail"
import { PropsServiceApplication } from "~/scripts/props/PropsServiceApplication"
import { DocumentTargets } from "~/scripts/constants/DocumentTargets"
import { SwitchConstants } from "~/scripts/constants/Switches"
import { PropsServiceApplicationNode } from "~/scripts/props/PropsServiceApplicationNode"
import { StatusConstants } from "~/scripts/constants/Status"
import { Toast } from "~/scripts/library/Toast"
import { Company } from "~/scripts/models/Company"
import { City, Country, Location, State } from "~/scripts/models/Location"
import type { Invitation } from "~/scripts/models/Invitation"
import { PropsInvitationDetail } from "~/scripts/props/PropsInvitationDetail"

export class ApplicationController {
  applicationId: Ref<string> = ref<string>("")
  application: Ref<ApplicationSwitch> = ref<ApplicationSwitch>(new ApplicationSwitch())
  applicant: Ref<User> = ref<User>(new User())
  paymentOrderId: Ref<string> = ref<string>("")
  paymentOrder: Ref<PaymentOrder> = ref<PaymentOrder>(new PaymentOrder())

  emitEvents: any | null = null

  language = useLanguage()

  documentRef: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  isEditingDescription: Ref<boolean> = ref<boolean>(false)
  isUpdatingDescription: Ref<boolean> = ref<boolean>(false)
  isEditingAddress: Ref<boolean> = ref<boolean>(false)

  selectedMsicCodeIds: Ref<string[]> = ref<string[]>([])
  searchTextsForMsicCodes: Ref<string[]> = ref<string[]>([])
  msicCodes: Ref<MsicCode[]> = ref<MsicCode[]>([])

  selectedDocumentTarget: Ref<string> = ref<string>(DocumentTargets.TARGET_RECEIPT)

  isShowReceipt: Ref<boolean> = ref<boolean>(false)
  isShowNotifyPreviousCosec: Ref<boolean> = ref<boolean>(false)
  isShowDcrFromDirectors: Ref<boolean> = ref<boolean>(false)
  isShowSection236: Ref<boolean> = ref<boolean>(false)
  isShowSubmissionToSSM: Ref<boolean> = ref<boolean>(false)
  isShowCompleted: Ref<boolean> = ref<boolean>(false)

  isUpdatingNotifyPreviousCosec: Ref<boolean> = ref<boolean>(false)
  isUploadingDocumentsForPreviousCosec: Ref<boolean> = ref<boolean>(false)

  isGeneratingDCR: Ref<boolean> = ref<boolean>(false)

  isGeneratingSection236: Ref<boolean> = ref<boolean>(false)

  isCompletingProcess: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsSwitchApplication, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  async setDataFromProps(props: PropsSwitchApplication): Promise<void> {
    this.applicationId.value = props.applicationId
    await this.init()
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  // Data initialization
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
    let repository = useApplicationSwitchStore()
    let response = await repository.fetch(this.applicationId.value)

    if (repository.error !== null) {
      throw repository.error
    }

    this.application.value = new ApplicationSwitch(response)

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
    let response = await repository.fetchByTarget(CompanyConstants.TARGET_APPLICATION_SWITCH, this.applicationId.value)

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

  getPropsInvitationDetail(invitation: Invitation): PropsInvitationDetail {
    let props = new PropsInvitationDetail(invitation.id, invitation)

    props.hasSection201 = false

    return props
  }

  //Update business description
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
      // await this.application.value.updateBusinessDescriptionAndMsicCodes(
      //   this.selectedMsicCodeIds.value,
      //   useApplicationIncorporateStore()
      // )
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

  // Application Step functions
  resetAllDocumentValues(): void {
    this.isShowReceipt.value = false
    this.isShowNotifyPreviousCosec.value = false
    this.isShowDcrFromDirectors.value = false
    this.isShowSection236.value = false
    this.isShowSubmissionToSSM.value = false
    this.isShowCompleted.value = false

    this.selectedDocumentTarget.value = DocumentTargets.TARGET_RECEIPT
  }

  onPaymentStepClicked(): void {
    this.resetAllDocumentValues()
    this.isShowReceipt.value = true
    this.selectedDocumentTarget.value = DocumentTargets.TARGET_RECEIPT
  }

  // NotifyPreviousCosec step functions
  onNotifyPreviousCosecStepClicked(): void {
    this.resetAllDocumentValues()
    this.isShowNotifyPreviousCosec.value = true
    this.selectedDocumentTarget.value = DocumentTargets.TARGET_SWITCH_LETTER_TO_COSEC
  }

  async onDocumentReceivedClicked(): Promise<void> {
    try {
      this.isUpdatingNotifyPreviousCosec.value = true

      this.application.value.status = StatusConstants.DOCUMENT_RECEIVED
      await this.application.value.update(useApplicationSwitchStore())

      let toastTitle = this.language.isMalay()
        ? "Rekod telah dikemaskini"
        : "Your Changes has been recorded successfully."
      let toast = new Toast(toastTitle, "")
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
      this.isUpdatingNotifyPreviousCosec.value = false
    }
  }

  // Show DCR from directors
  onShowDirectorsResolutionClicked(): void {
    this.resetAllDocumentValues()
    this.isShowDcrFromDirectors.value = true
    this.selectedDocumentTarget.value = DocumentTargets.TARGET_SWITCH_RESO // need to change to DCR
  }

  async onGenerateDcrClicked(): Promise<void> {
    this.onShowDirectorsResolutionClicked()

    if (this.isGeneratingDCR.value) {
      return
    }

    try {
      this.isGeneratingDCR.value = true

      await nextTick()
      if (!this.documentRef) {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForDocumentDownload()
        throw error
      }

      await this.documentRef.onDownloadClicked()

      let toastTitle = this.language.isMalay()
        ? "Resolusi Pengarah telah direkodkan bagi Permohonan ini."
        : "Directors Resolution has been generated for this Application."
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
        error.isMalay = this.language.isMalay()
        error.setForGenerateDocumentFailed()
        error.handle()
      }
    } finally {
      this.isGeneratingDCR.value = false
    }
  }

  // Show 236
  onShowSection236Clicked(): void {
    this.resetAllDocumentValues()
    this.isShowSection236.value = true
    this.selectedDocumentTarget.value = DocumentTargets.TARGET_SECTION_236
  }

  async onGenerateSection236Clicked(): Promise<void> {
    this.onShowSection236Clicked()

    if (this.isGeneratingSection236.value) {
      return
    }

    try {
      this.isGeneratingSection236.value = true

      await nextTick()
      if (!this.documentRef) {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForDocumentDownload()
        throw error
      }

      await this.documentRef.onDownloadClicked()

      let toastTitle = this.language.isMalay()
        ? "Seksyen 236(3) telah direkodkan bagi Permohonan ini."
        : "Section 236(3) has been generated for this Application."
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
        error.isMalay = this.language.isMalay()
        error.setForGenerateDocumentFailed()
        error.handle()
      }
    } finally {
      this.isGeneratingSection236.value = false
    }
  }

  // Show submission
  onShowSubmissionClicked(): void {
    this.resetAllDocumentValues()
    this.isShowSubmissionToSSM.value = true
    this.selectedDocumentTarget.value = DocumentTargets.TARGET_SECTION_236
  }

  async onSubmitToSSMClicked(): Promise<void> {
    //
  }

  async onUploadSection58Clicked(): Promise<void> {
    //
  }

  // Show completed
  onShowCompletedClicked(): void {
    this.resetAllDocumentValues()
    this.isShowCompleted.value = true

    this.selectedDocumentTarget.value = DocumentTargets.TARGET_SECTION_236
  }

  async onCompleteProcessClicked(): Promise<void> {
    if (this.isCompletingProcess.value) {
      return
    }

    try {
      this.isCompletingProcess.value = true

      await this.setMsicCodes()

      let repository = useApplicationSwitchStore()
      this.application.value.status = StatusConstants.APPROVED
      let data = {
        status: StatusConstants.APPROVED,
      }
      await repository.update(this.application.value.id, data)

      //TODO: Notification need to go out here, backend is not ready

      let companyToConvert = new Company(this.companyToConvert)
      await companyToConvert.create(useCompanyStore())

      // No documents to upload here. Everything will need to scan AFTER this process.

      let toastTitle = this.language.isMalay() ? "Sdn Bhd telah ditambah." : "Sdn Bhd successfully added."
      let toastMessage = this.language.isMalay()
        ? "Anda akan dihantar ke muka Sdn Bhd."
        : "You will be redirected to the Sdn Bhd page."
      let toast = new Toast(toastTitle, toastMessage)
      toast.success()

      let router = useRouter()
      router.push({ path: `/sdnbhds/${companyToConvert.id}` })
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isCompletingProcess.value = false
    }
  }

  async setMsicCodes(): Promise<void> {
    if (
      this.application.value.msicCodeAssigns.length > 0 ||
      !this.ssmCorporateProfileData ||
      !this.ssmCorporateProfileData.ssm
    ) {
      return
    }

    let businessCodes = this.ssmCorporateProfileData.ssm.businessCodes.map(
      (businessCode: CorporateProfileJsonBusinessCode) => {
        return businessCode.businessCode
      }
    )

    if (businessCodes.length <= 0) {
      return
    }

    this.application.value.msicCodeAssigns = this.msicCodes.value
      .filter((msicCode: MsicCode) => {
        return businessCodes.includes(msicCode.code)
      })
      .map((msicCode: MsicCode) => {
        let newMsicCodeAssign = new MsicCodeAssign()
        newMsicCodeAssign.msicCode = msicCode
        newMsicCodeAssign.assign = new MsicCodeAssignTarget(null)
        newMsicCodeAssign.assign.target = "application_switch"
        newMsicCodeAssign.assign.id = this.application.value.id

        return newMsicCodeAssign
      })

    let promises = this.application.value.msicCodeAssigns.map((msicCodeAssign: MsicCodeAssign) => {
      return msicCodeAssign.create(useMsicCodeAssignStore())
    })

    await Promise.allSettled(promises)
  }

  //getters
  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Permohonan" : "Application"
  }

  get serviceName(): string {
    return this.language.isMalay() ? "Pertukaran Setiausaha Syarikat" : "Reassignment of Company Secretary"
  }

  get dateOfIncorporationLabel(): string {
    return this.language.isMalay() ? "Tarikh Pemerbadanan" : "Date of Incorporation"
  }

  get incorporatedAt(): string {
    let time = useLocalTime()

    if (StringUtil.isNullOrEmpty(this.application.value.incorporatedAt)) {
      if (this.ssmCorporateProfileData && this.ssmCorporateProfileData.ssm) {
        let incorporateAt = this.ssmCorporateProfileData.ssm.companyInfo?.incorpDate ?? ""
        if (StringUtil.isNullOrEmpty(incorporateAt)) {
          return "-"
        }

        return time.formatDateOnlyFull(incorporateAt)
      }

      return "-"
    }

    return time.formatDateOnlyFull(this.application.value.incorporatedAt ?? "")
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
    let directorsToInvite: DirectorInvitation[] = []
    if (this.ssmCorporateProfileData && this.ssmCorporateProfileData.ssm) {
      let directorsFromCorporateProfile = this.ssmCorporateProfileData.ssm.officerInfos.filter(
        (officer: CorporateProfileJsonOfficerInfo) => {
          return officer.designationCode.toLowerCase() === "d"
        }
      )

      if (directorsFromCorporateProfile.length > 0) {
        directorsToInvite = directorsFromCorporateProfile.map((director: CorporateProfileJsonOfficerInfo) => {
          let directorInvitation = new DirectorInvitation()
          directorInvitation.name = director.name
          directorInvitation.email = this.language.isMalay() ? "(Tidak Direkodkan)" : "(Not Invited)"
          directorInvitation.phone = this.language.isMalay() ? "(Tidak Direkodkan)" : "(Not Invited)"
          directorInvitation.user = new User()
          directorInvitation.user.detail = new UserDetail()
          directorInvitation.user.detail.identification = director.idNo
          directorInvitation.user.detail.identificationType = director.idType === "P" ? "passport" : "id"

          return directorInvitation
        })
      }
    }

    if (directorsToInvite.length > 0) {
      directorsToInvite.forEach((director: DirectorInvitation) => {
        let existingInvitation = this.application.value.directorInvitations.find((invitation: DirectorInvitation) => {
          return (
            invitation.user?.detail?.identification === director.user?.detail?.identification &&
            invitation.user?.detail?.identificationType === director.user?.detail?.identificationType
          )
        })

        if (existingInvitation) {
          director.email = existingInvitation.email
          director.phone = existingInvitation.phone
          director.user = existingInvitation.user
        }
      })

      return directorsToInvite
    }

    return this.application.value.directorInvitations
  }

  get shareholderLabel(): string {
    return this.language.isMalay() ? "Butiran Pemegang Saham yang Dinama" : "Details of Nominated Shareholders"
  }

  get shareholderDetails(): ShareholderInvitation[] {
    let shareholdersToInvite: ShareholderInvitation[] = []
    if (this.ssmCorporateProfileData && this.ssmCorporateProfileData.ssm) {
      let shareholdersFromCorporateProfile = this.ssmCorporateProfileData.ssm.shareholderInfos

      if (shareholdersFromCorporateProfile.length > 0) {
        shareholdersToInvite = shareholdersFromCorporateProfile.map((shareholder: CorporateProfileJsonShareInfo) => {
          let shareholderInvitation = new ShareholderInvitation()
          shareholderInvitation.name = shareholder.name
          shareholderInvitation.email = this.language.isMalay() ? "(Tidak Direkodkan)" : "(Not Invited)"
          shareholderInvitation.user = new User()
          shareholderInvitation.user.detail = new UserDetail()
          shareholderInvitation.user.detail.identification = shareholder.idNo
          shareholderInvitation.user.detail.identificationType = shareholder.idType === "P" ? "passport" : "id"
          shareholderInvitation.totalShares = shareholder.share

          return shareholderInvitation
        })
      }
    }

    if (shareholdersToInvite.length > 0) {
      shareholdersToInvite.forEach((shareholder: ShareholderInvitation) => {
        let existingInvitation = this.application.value.shareholderInvitations.find(
          (invitation: ShareholderInvitation) => {
            return (
              invitation.user?.detail?.identification === shareholder.user?.detail?.identification &&
              invitation.user?.detail?.identificationType === shareholder.user?.detail?.identificationType
            )
          }
        )

        if (existingInvitation) {
          shareholder.email = existingInvitation.email
          shareholder.user = existingInvitation.user
        }
      })

      return shareholdersToInvite
    }

    return this.application.value.shareholderInvitations
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
    if (this.application.value.msicCodeAssigns.length <= 0) {
      // get from ssm data
      if (this.ssmCorporateProfileData && this.ssmCorporateProfileData.ssm) {
        let businessCodes = this.ssmCorporateProfileData.ssm.businessCodes.map(
          (businessCode: CorporateProfileJsonBusinessCode) => {
            return businessCode.businessCode
          }
        )

        if (businessCodes.length <= 0) {
          return "(No MSIC Codes)"
        }

        return this.msicCodes.value
          .filter((msicCode: MsicCode) => {
            return businessCodes.includes(msicCode.code)
          })
          .map((msicCode: MsicCode) => {
            return `${msicCode.code} - ${msicCode.descriptionEn}`
          })
          .join("<br>")
      } else {
        return "(No MSIC Codes)"
      }
    }

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
    return this.application.value.businessAddressLocation?.getMultilineAddress() ?? "(No Business Address)"
  }

  get companySecretaryLabel(): string {
    return this.language.isMalay() ? "Setiausaha Syarikat Sediada" : "Existing Company Secretary"
  }

  get companySecretaryName(): string {
    if (
      StringUtil.isNullOrEmpty(this.application.value.secretaryName) &&
      this.ssmCorporateProfileData &&
      this.ssmCorporateProfileData.ssm
    ) {
      let secretary = this.ssmCorporateProfileData.ssm.officerInfos.find((officer: CorporateProfileJsonOfficerInfo) => {
        return officer.designationCode.toLowerCase() === "s"
      })

      if (secretary) {
        return secretary.name
      }
    }

    return this.application.value.secretaryName ?? "(No Company Secretary)"
  }

  get companySecretaryFirmName(): string {
    if (
      StringUtil.isNullOrEmpty(this.application.value.secretaryCompanyName) &&
      this.ssmCorporateProfileData &&
      this.ssmCorporateProfileData.ssm
    ) {
      let secretary = this.ssmCorporateProfileData.ssm.officerInfos.find((officer: CorporateProfileJsonOfficerInfo) => {
        return officer.designationCode.toLowerCase() === "s"
      })

      if (secretary) {
        return secretary.name
      }
    }

    return this.application.value.secretaryCompanyName ?? ""
  }

  get companySecretaryFirmAddress(): string {
    if (
      StringUtil.isNullOrEmpty(this.application.value.secretaryCompanyAddress) &&
      this.ssmCorporateProfileData &&
      this.ssmCorporateProfileData.ssm
    ) {
      let secretary = this.ssmCorporateProfileData.ssm.officerInfos.find((officer: CorporateProfileJsonOfficerInfo) => {
        return officer.designationCode.toLowerCase() === "s"
      })

      if (secretary) {
        return `
          ${secretary.address1}<br>
          ${secretary.address2}<br>
          ${secretary.address3}
        `
      }
    }

    return this.application.value.cosecAddressFragments().join("<br>") ?? ""
  }

  get companySecretaryEmail(): string {
    return this.application.value.secretaryEmail ?? "(No Email Provided)"
  }

  get companySecretaryPhone(): string {
    return this.application.value.secretaryPhone ?? "(No Phone Number Provided)"
  }

  get ssmCorporateProfileData(): SsmCorporateProfilePurchaseData | null {
    return this.application.value.ssmMetaData
  }

  //MSIC Codes
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

  // Application Step Nodes
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

  // NotifyPreviousCosec
  get hasNotifyPreviousCosecResolution(): boolean {
    return this.application.value.switchType === SwitchConstants.TYPE_SETTLE
  }

  get notifyPreviousCosecNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(
      this.hasPaid,
      this.isNotifyPreviousCosecCompleted,
      this.isShowNotifyPreviousCosec.value
    )
  }

  get isNotifyPreviousCosecCompleted(): boolean {
    return this.application.value.status === StatusConstants.DOCUMENT_RECEIVED
  }

  get notifyPreviousCosecLabel(): string {
    return this.language.isMalay() ? "Beritahu Setiausaha Syarikat Sedia Ada" : "Notify Existing Company Secretary"
  }

  get notifyPreviousCosecSublabel(): string {
    return this.language.isMalay()
      ? "Handover of Company Documents from Prev. Company Secretary"
      : "Handover of Company Documents from Prev. Company Secretary"
  }

  get documentReceivedLabel(): string {
    return this.language.isMalay() ? "Dokumen Diterima" : "Documents Received"
  }

  // Resolution from directors
  get directorsResolutionNodeProps(): PropsServiceApplicationNode {
    if (!this.hasNotifyPreviousCosecResolution) {
      return new PropsServiceApplicationNode(
        this.hasPaid,
        this.isDirectorsResolutionCompleted,
        this.isShowDcrFromDirectors.value
      )
    }

    return new PropsServiceApplicationNode(
      this.isNotifyPreviousCosecCompleted,
      this.isDirectorsResolutionCompleted,
      this.isShowDcrFromDirectors.value
    )
  }

  get isDirectorsResolutionCompleted(): boolean {
    if (this.hasNotifyPreviousCosecResolution && !this.isNotifyPreviousCosecCompleted) {
      return false
    }

    return this.hasPaid && this.application.value.signatureGroups.length > 0
  }

  get directorsResolutionLabel(): string {
    return this.language.isMalay() ? "Resolusi Pengarah" : "Directors' Resolution"
  }

  get directorsResolutionSublabel(): string {
    return this.language.isMalay() ? "Perlantikan Setiausaha Syarikat Baharu" : "Appointment of New Company Secretary"
  }

  get generateLabel(): string {
    return this.language.isMalay() ? "Jana" : "Generate"
  }

  // Section 236(3)
  get section236NodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(
      this.isDirectorsResolutionCompleted,
      this.isSection236Completed,
      this.isShowSection236.value
    )
  }

  get isSection236Completed(): boolean {
    return this.isDirectorsResolutionCompleted
  }

  get section236Label(): string {
    return this.language.isMalay() ? "Kebenaran Menjadi Setiausaha Syarikat" : "Consent to Act as Company Secretary"
  }

  get section236Sublabel(): string {
    return this.language.isMalay() ? "Pengisytiharan bawah Seksyen 236(3)" : "Declaration under Section 236(3)"
  }

  // Submit to SSM
  get submitToSSMNodeProps(): PropsServiceApplicationNode {
    return new PropsServiceApplicationNode(
      this.isSection236Completed,
      this.isSubmittedToSSM,
      this.isShowSubmissionToSSM.value
    )
  }

  get isSubmittedToSSM(): boolean {
    return (
      this.application.value.status === StatusConstants.SUBMITTED ||
      this.application.value.status === StatusConstants.APPROVED ||
      this.application.value.status === StatusConstants.COMPLETED ||
      this.application.value.status === StatusConstants.CONVERTED
    )
  }

  get submitToSSMLabel(): string {
    return this.language.isMalay()
      ? "Pemberitahuan Pertukaran dalam Daftar Pengarah, Pengurus dan Setiausaha"
      : "Notification of Change in Register of Directors, Managers and Secretaries"
  }

  get submitToSSMSublabel(): string {
    return this.language.isMalay() ? "Kemaskini Seksyen 58" : "Update Section 58"
  }

  get submittedLabel(): string {
    return this.language.isMalay() ? "Dihantar" : "Submitted"
  }

  get uploadSection58Label(): string {
    return this.language.isMalay() ? "Muat Naik" : "Upload"
  }

  // complete node
  get completedProcessApplicationNode(): PropsServiceApplicationNode {
    let props = new PropsServiceApplicationNode(
      this.isSubmittedToSSM,
      this.isApplicationCompleted,
      this.isShowCompleted.value
    )

    props.isLastNode = true

    return props
  }

  get isApplicationCompleted(): boolean {
    return (
      this.application.value.status === StatusConstants.APPROVED ||
      this.application.value.status === StatusConstants.COMPLETED ||
      this.application.value.status === StatusConstants.CONVERTED
    )
  }

  get completedProcessLabel(): string {
    return this.language.isMalay() ? "Permohonan Selesai" : "Onboard Company"
  }

  get completedProcessSublabel(): string {
    return this.language.isMalay() ? "Proses Pertukaran Selesai" : "Reassignment Process Completed"
  }

  get completedLabel(): string {
    return this.language.isMalay() ? "Selesai" : "Completed"
  }

  // convert process
  get companyToConvert(): Company {
    let company = new Company()

    let incorporatedAtDate = ""
    let time = useLocalTime()

    if (StringUtil.isNullOrEmpty(this.application.value.incorporatedAt)) {
      if (this.ssmCorporateProfileData && this.ssmCorporateProfileData.ssm) {
        let incorporateAt = this.ssmCorporateProfileData.ssm.companyInfo?.incorpDate ?? ""
        if (!StringUtil.isNullOrEmpty(incorporateAt)) {
          incorporatedAtDate = time.formatDateOnlySystem(incorporateAt)
        }
      }
    } else {
      incorporatedAtDate = time.formatDateOnlySystem(this.application.value.incorporatedAt ?? "")
    }

    company.name = this.application.value.companyName
    company.nameType = this.application.value.nameType
    company.nameDescription = "-"
    company.registrationNumberNew = this.application.value.registrationNumberNew
    company.registrationNumberOld = this.application.value.registrationNumberOld
    company.businessDescription = this.application.value.businessDescription
    company.hasBusinessAddress = this.application.value.businessAddressLocation !== null
    company.businessAddressLocation =
      this.application.value.businessAddressLocation !== null
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
    company.applicationSwitchId = this.application.value.id
    company.incorporatedAt = incorporatedAtDate

    return company
  }
}
