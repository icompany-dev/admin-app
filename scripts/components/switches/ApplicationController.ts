import { ApplicationSwitch } from "~/scripts/models/ApplicationSwitch"
import { PropsSwitchApplication } from "~/scripts/props/PropsSwitchApplication"
import type { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import type { ShareholderInvitation } from "~/scripts/models/ShareholderInvitation"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { User } from "~/scripts/models/User"
import { MsicCodeAssign } from "~/scripts/models/MsicCodeAssign"
import { MsicCode } from "~/scripts/models/MsicCode"
import { Filter } from "~/scripts/library/Filter"
import { SelectOption } from "~/scripts/types/SelectOption"
import type {
  CorporateProfileJsonBusinessCode,
  CorporateProfileJsonOfficerInfo,
  SsmCorporateProfilePurchaseData,
} from "~/scripts/models/SsmCorporateProfileJsonData"

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

  constructor(props: PropsSwitchApplication, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  async setDataFromProps(props: PropsSwitchApplication): Promise<void> {
    this.applicationId.value = props.applicationId
    await this.init()
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
    return this.application.value.directorInvitations
  }

  get shareholderLabel(): string {
    return this.language.isMalay() ? "Butiran Pemegang Saham yang Dinama" : "Details of Nominated Shareholders"
  }

  get shareholderDetails(): ShareholderInvitation[] {
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
}
