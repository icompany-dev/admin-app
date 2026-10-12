import { PropsIdentificationDocumentWatermark } from "~/scripts/props/PropsIdentificationDocumentWatermark"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { User } from "~/scripts/models/User"

export class UserViewerController {
  emitEvents: any | null = null

  user: Ref<User> = ref<User>(new User())
  userId: Ref<string | null> = ref<string | null>(null)
  email: Ref<string | null> = ref<string | null>(null)

  isShowNric: Ref<boolean> = ref<boolean>(false)

  purpose: Ref<string> = ref<string>("")

  windowPosition = reactive({
    x: 200,
    y: 150,
  })

  private dragOffset = {
    x: 0,
    y: 0,
  }

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

  onDragStart(event: PointerEvent): void {
    if (event.button !== 0) {
      return
    }

    this.dragOffset.x = event.clientX - this.windowPosition.x
    this.dragOffset.y = event.clientY - this.windowPosition.y

    window.addEventListener("pointermove", this.onDragMove)
    window.addEventListener("pointerup", this.onDragEnd)
    window.addEventListener("pointercancel", this.onDragEnd)
  }

  onDragMove = (event: PointerEvent): void => {
    this.windowPosition.x = event.clientX - this.dragOffset.x
    this.windowPosition.y = event.clientY - this.dragOffset.y
  }

  onDragEnd = (): void => {
    window.removeEventListener("pointermove", this.onDragMove)
    window.removeEventListener("pointerup", this.onDragEnd)
    window.removeEventListener("pointercancel", this.onDragEnd)
  }

  destroy(): void {
    this.onDragEnd()
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
