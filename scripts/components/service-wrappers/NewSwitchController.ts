import { ApplicationSwitch } from "~/scripts/models/ApplicationSwitch"
import { ServiceController } from "./ServiceController"
import type { IServiceController } from "./IServiceController"
import { CompanyConstants } from "~/scripts/constants/Company"
import { StringUtil } from "~/scripts/utils/String"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { User } from "~/scripts/models/User"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { SwitchConstants } from "~/scripts/constants/Switches"
import { PropsLetterChangeReassignCosec } from "~/scripts/props/PropsLetterChangeReassignCosec"
import type { CorporateProfileJsonOfficerInfo } from "~/scripts/models/SsmCorporateProfileJsonData"
import { StatusConstants } from "~/scripts/constants/Status"

export class NewSwitchController
  extends ServiceController
  implements IServiceController<ApplicationSwitch, ReturnType<typeof useApplicationSwitchStore>>
{
  applicationSwitch = ref<ApplicationSwitch>(new ApplicationSwitch())
  application: ApplicationSwitch = new ApplicationSwitch()
  applicationId: string = ""
  repository = useApplicationSwitchStore()
  companyRepository = useCompanyStore()

  name: Ref<string> = ref<string>("")
  registrationNumber: Ref<string> = ref<string>("")

  directorName: Ref<string> = ref<string>("")

  user = ref<User>(new User())
  directorUser = ref<User>(new User())
  signatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", false))

  constructor(applicationId: string, emitEvents: any | null = null) {
    super(CompanyConstants.TARGET_APPLICATION_SWITCH, "", emitEvents)

    this.init(applicationId)
  }

  async init(applicationId: string): Promise<void> {
    this.user.value = await CurrentUser.get()
    this.setApplicationId(applicationId)
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.applicationId = applicationId
    await this.fetchApplication()
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId)) {
      return
    }

    try {
      const response = await this.repository.fetch(this.applicationId)
      this.application = new ApplicationSwitch(response)
      this.applicationSwitch.value = new ApplicationSwitch(response)

      await this.setDirectorName()
    } catch (err: any) {
      // deep??
    }
  }

  showReassignLetter(): boolean {
    return this.applicationSwitch.value.switchType === SwitchConstants.TYPE_SETTLE
  }

  async setDirectorName(): Promise<void> {
    if (this.applicationSwitch.value.signatureGroups.length > 0) {
      const firstSignatureGroup = this.applicationSwitch.value.signatureGroups[0]
      const email = firstSignatureGroup.email
      const userRepository = useUserStore()
      const userWhoSigned = await userRepository.fetchByEmail(email)
      if (userWhoSigned) {
        this.directorName.value = userWhoSigned.name
        return
      }
    }

    if (this.applicationSwitch.value.metadata !== null) {
      let jsonData = this.applicationSwitch.value.getCorporateProfileData()
      if (jsonData && jsonData.officerInfos.length > 0) {
        let directors = jsonData.officerInfos.filter((oi: CorporateProfileJsonOfficerInfo) => {
          return oi.designationCode.toLowerCase() === "d"
        })

        if (directors.length > 0) {
          let identificationNumber = this.user.value.detail?.identification ?? ""
          let isCurrentUserADirector = directors.some((d: CorporateProfileJsonOfficerInfo) => {
            return d.idNo === identificationNumber
          })

          if (!isCurrentUserADirector) {
            this.directorName.value = directors[0].name
            return
          }
        }
      }
    }

    this.directorName.value = this.user.value.name
  }

  async onSubmitClicked(): Promise<void> {
    // do nothing
  }

  async onCreate(): Promise<void> {
    //
  }

  async onUpdate(): Promise<void> {
    // handle
  }

  async onRemove(): Promise<void> {
    // not allowed
  }

  showWatermark(): boolean {
    return this.applicationSwitch.value.signatureGroups.length <= 0
  }

  watermarkText(): string {
    return this.applicationSwitch.value.status !== StatusConstants.PAID ? "PREVIEW" : "DRAFT"
  }

  hasSigned(): boolean {
    return true
  }

  helpTitle(): string {
    return this.language.isMalay() ? `Tukar kepada kami` : "Switch to Us"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return ``
    }

    return ``
  }

  get letterChangeReassignCosecProps(): PropsLetterChangeReassignCosec {
    return new PropsLetterChangeReassignCosec(
      this.applicationSwitch.value.name ?? "", //companyName
      this.applicationSwitch.value.registrationNumberNew, //registrationNumberNew
      this.applicationSwitch.value.registrationNumberOld, //registrationNumberOld
      this.applicationSwitch.value.secretaryCompanyName, //cosecCompanyName
      this.applicationSwitch.value.cosecAddressLine1(), //cosecAddressLine1
      this.applicationSwitch.value.cosecAddressLine2(), //cosecAddressLine2
      this.applicationSwitch.value.cosecAddressPostcode(), //cosecAddressPostCode
      this.applicationSwitch.value.cosecAddressCity(), //cosecAddressCity
      this.applicationSwitch.value.cosecAddressState(), //cosecAddressState
      this.applicationSwitch.value.secretaryName, //cosecName
      this.applicationSwitch.value.secretaryEmail, //cosecEmail
      this.applicationSwitch.value.secretaryPhone, //cosecPhone
      this.directorName.value, //directorName
      false, //isDocumentEditable
      true, //isReadonly
      "", //signatureUrl
      "", //documentDate
      false, //areValuesValid
      "", //validationMessage
      false, //hasSigned
      false, //isSignatureEditable
      false, //isSignatureHidden
      true, //isInPreviewMode
      this.showWatermark(), //showWatermark
      this.watermarkText() //watermarkText
    )
  }
}
