import { PropsIdentificationDocumentWatermark } from "~/scripts/props/PropsIdentificationDocumentWatermark"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { User } from "~/scripts/models/User"

export class UserViewerController {
  emitEvents: any | null = null

  user: Ref<User> = ref<User>(new User())
  userId: Ref<string | null> = ref<string | null>(null)
  email: Ref<string | null> = ref<string | null>(null)

  isShowNric: Ref<boolean> = ref<boolean>(false)
  identificationRef: any | null = null

  purpose: Ref<string> = ref<string>("")
  companyName: Ref<string> = ref<string>("")
  companyRegistrationNumber: Ref<string> = ref<string>("")

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
    }
  }

  async onNricClicked(): Promise<void> {
    if (!this.user.value.id) {
      await this.fetchUserDetail()
    }

    if (!this.user.value.id) {
      return
    }

    this.isShowNric.value = true
  }

  closeNric(): void {
    this.isShowNric.value = false
  }

  async onDownloadNricClicked(): Promise<void> {
    if (!this.identificationRef) {
      return
    }

    let identificationPage = await this.identificationRef.getPdfPages()

    console.log(identificationPage)
  }

  getIdentificationDocumentWatermarkProps(): PropsIdentificationDocumentWatermark {
    const detail = this.user.value.detail

    let x = this.purpose.value

    return new PropsIdentificationDocumentWatermark(
      "",
      "",
      detail?.verificationFile?.url ?? "",
      detail?.verificationFileAlt?.url ?? null,
      x ?? "Purpose",
      PaperOrientation.Portrait,
      PaperSize.A4
    )
  }
}
