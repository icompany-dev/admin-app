import { PropsIdentificationDocumentWatermark } from "~/scripts/props/PropsIdentificationDocumentWatermark"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { User } from "~/scripts/models/User"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"

export class UserViewerController {
  language = useLanguage()
  emitEvents: any | null = null

  user: Ref<User> = ref<User>(new User())
  userId: Ref<string | null> = ref<string | null>(null)
  email: Ref<string | null> = ref<string | null>(null)

  isShowNric: Ref<boolean> = ref<boolean>(false)
  isShowUserDetail: Ref<boolean> = ref<boolean>(false)
  identificationRef: any | null = null

  purpose: Ref<string> = ref<string>("")
  title: Ref<string> = ref<string>("")
  subtitle: Ref<string> = ref<string>("")
  // TODO: need to allow auto select company

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setEmail(props.email)
    this.setUserId(props.userId)
  }

  setUserId(userId: string | null): void {
    this.userId.value = userId
  }

  setEmail(email: string | null): void {
    this.email.value = email
  }

  setIdentificationRef(identificationRef: any | null): void {
    this.identificationRef = identificationRef
  }

  async fetchUserDetail(): Promise<void> {
    const repository = useUserStore()

    if (!this.email.value) {
      return
    }

    const response = await repository.fetchByEmail(this.email.value)

    if (!repository.error && response) {
      this.user.value = new User(response)
      this.purpose.value = `COPY OF ${this.identificationType}`
      this.title.value = this.user.value.name
      this.subtitle.value = this.user.value.detail?.identification ?? ""
    }
  }

  async onUserDetailClicked(): Promise<void> {
    if (!this.user.value.id) {
      await this.fetchUserDetail()
    }

    if (!this.user.value.id) {
      return
    }

    this.isShowNric.value = false
    this.isShowUserDetail.value = true
  }

  onCloseUserDetailClicked(): void {
    this.isShowUserDetail.value = false
  }

  async onNricClicked(): Promise<void> {
    if (!this.user.value.id) {
      await this.fetchUserDetail()
    }

    if (!this.user.value.id) {
      return
    }

    this.isShowUserDetail.value = false
    this.isShowNric.value = true
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

    const fileName = `${this.user.value.name} ${this.identificationType}.pdf`
    const blob = await PdfPaperUtil.getPdfBlob(pages, 20, fileName, PaperSize.A4, PaperOrientation.Portrait)
    const blobURL = URL.createObjectURL(blob)

    await nextTick()
    printWindow.location.href = blobURL

    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  getIdentificationDocumentWatermarkProps(): PropsIdentificationDocumentWatermark {
    const detail = this.user.value.detail

    let x = this.purpose.value

    return new PropsIdentificationDocumentWatermark(
      this.title.value,
      this.subtitle.value,
      detail?.verificationFile?.url ?? "",
      detail?.verificationFileAlt?.url ?? null,
      x ?? "Purpose",
      PaperOrientation.Portrait,
      PaperSize.A4
    )
  }

  get identificationType(): string {
    if (!this.user.value.detail) {
      return "MYKAD"
    }

    return this.user.value?.detail?.identificationType === "passport" ? "PASSPORT" : "MYKAD"
  }

  // Copywriting
  get downloadLabel(): string {
    return this.language.isMalay() ? "Muat Turun" : "Download"
  }
}
