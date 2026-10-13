import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { EmailUser } from "~/scripts/library/EmailUser"
import { User } from "~/scripts/models/User"
import { UserDetail } from "~/scripts/models/UserDetail"
import { PropsIdentificationDocumentWatermark } from "~/scripts/props/PropsIdentificationDocumentWatermark"
import { PropsUserDetail } from "~/scripts/props/PropsUserDetail"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"

export class UserDetailController {
  user: Ref<User> = ref<User>(new User())
  userDetail: Ref<UserDetail> = ref<UserDetail>(new UserDetail())
  isShowNric: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  language = useLanguage()
  identificationRef: any | null = null

  nricDownloadPurpose: Ref<string> = ref<string>("")
  nricDownloadTitle: Ref<string> = ref<string>("")
  nricDownloadSubtitle: Ref<string> = ref<string>("")

  constructor(props: PropsUserDetail, emitEvents: any) {
    this.emitEvents = emitEvents
  }

  setDataFromProps(props: PropsUserDetail): void {
    this.user.value = new User(props.user)
    this.userDetail.value = new UserDetail(props.userDetail)
  }

  setIdentificationRef(identificationRef: any | null): void {
    this.identificationRef = identificationRef
  }

  onEmailClicked(): void {
    let emailUser = new EmailUser(this.email)
    emailUser.connectToGmail()
  }

  onOpenNricClicked(): void {
    this.isShowNric.value = true

    this.nricDownloadPurpose.value = `Copy of ${this.userDetail.value.identificationType === "passport" ? "Passport" : "MYKAD"}`
    this.nricDownloadTitle.value = `${this.name}`
    this.nricDownloadSubtitle.value = `${this.identificationNumber}`
  }

  onCloseNricClicked(): void {
    this.isShowNric.value = false
  }

  async onDownloadNricClicked(): Promise<void> {
    if (!this.identificationRef) {
      return
    }

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write("Please wait, generating Spince for printing...")
    } else {
      throw "Fail to open new window"
    }

    let pages = await this.identificationRef.getPdfPages()

    if (pages.length <= 0) {
      printWindow.close()
      return
    }

    const fileName = `${this.user.value.name} ${this.userDetail.value.identificationType === "passport" ? "Passport" : "MYKAD"}.pdf`
    const blob = await PdfPaperUtil.getPdfBlob(pages, 20, fileName, PaperSize.A4, PaperOrientation.Portrait)
    const blobURL = URL.createObjectURL(blob)

    await nextTick()
    printWindow.location.href = blobURL

    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  get name(): string {
    return this.user.value.name
  }

  get email(): string {
    return this.user.value.email
  }

  get phone(): string {
    return this.user.value.phone
  }

  get identificationType(): string {
    let type = "MYKAD"
    return this.language.isMalay() ? `No. ${type}` : `${type} No.`
  }

  get identificationNumber(): string {
    return this.userDetail.value.identification
  }

  get raceLabel(): string {
    return this.language.isMalay() ? "Bangsa" : "Race"
  }

  get race(): string {
    return this.userDetail.value.race?.toUpperCase() ?? "(Unknown)"
  }

  get addressLabel(): string {
    return this.language.isMalay() ? "Alamat" : "Address"
  }

  get addressLine1(): string {
    return this.userDetail.value.location?.addressLine1?.toUpperCase() ?? "-"
  }

  get addressLine2(): string {
    return this.userDetail.value.location?.addressLine2?.toUpperCase() ?? "-"
  }

  get addressLine3(): string {
    return this.userDetail.value.location?.addressLine3?.toUpperCase() ?? "-"
  }

  get addressPostcode(): string {
    return this.userDetail.value.location?.postcode ?? "-"
  }

  get addressCity(): string {
    if (StringUtil.isEqual(this.userDetail.value.location?.city?.name ?? "", "others")) {
      return this.userDetail.value.location?.otherCity?.toUpperCase() ?? ""
    }

    return this.userDetail.value.location?.city?.name.toUpperCase() ?? "-"
  }

  get addressState(): string {
    if (StringUtil.isEqual(this.userDetail.value.location?.state?.name ?? "", "others")) {
      return this.userDetail.value.location?.otherState?.toUpperCase() ?? ""
    }

    return this.userDetail.value.location?.state?.name.toUpperCase() ?? "-"
  }

  get addressCountry(): string {
    if (StringUtil.isEqual(this.userDetail.value.location?.country?.name ?? "", "others")) {
      return this.userDetail.value.location?.otherCountry?.toUpperCase() ?? ""
    }

    return this.userDetail.value.location?.country?.name.toUpperCase() ?? "-"
  }

  get identificationDocumentWatermarkProps(): PropsIdentificationDocumentWatermark {
    const detail = this.userDetail.value

    return new PropsIdentificationDocumentWatermark(
      this.nricDownloadTitle.value,
      this.nricDownloadSubtitle.value,
      detail?.verificationFile?.url ?? "",
      detail?.verificationFileAlt?.url ?? null,
      this.nricDownloadPurpose.value,
      PaperOrientation.Portrait,
      PaperSize.A4
    )
  }
}
