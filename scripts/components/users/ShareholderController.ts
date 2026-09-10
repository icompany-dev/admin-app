import type { PropsUserDetail } from "~/scripts/props/PropsUserDetail"
import { UserController } from "./UserController"
import { Shareholder } from "~/scripts/models/Shareholder"
import { Error } from "~/scripts/library/Error"
import { Toast } from "~/scripts/library/Toast"

export class ShareholderController extends UserController {
  shareholder: Ref<Shareholder> = ref<Shareholder>(new Shareholder())

  constructor(props: PropsUserDetail, emitEvents: any) {
    super(props, useShareholderStore(), emitEvents)
  }

  override setDataFromProps(props: PropsUserDetail): void {
    this.id.value = props.id
    this.user.value = props.user

    if (this.shareholder) {
      this.shareholder.value = props.role instanceof Shareholder ? new Shareholder(props.role) : new Shareholder()
    }
  }

  onUpdateClicked(): void {
    this.isInEditMode.value = true
  }

  onCancelUpdateClicked(): void {
    this.isInEditMode.value = false
  }

  async onProceedUpdateClicked(): Promise<void> {
    if (this.isUpdating.value) {
      return
    }

    try {
      this.isUpdating.value = true
      // await this.shareholder.value.update(this.repository)

      let toastTitle = this.language.isMalay() ? "Rekod telah dikemaskini" : "Your changes have been recorded."
      let toast = new Toast(toastTitle, "")
      toast.success()

      this.isInEditMode.value = false
    } catch (e) {
      if (e instanceof Error) {
        e.isMalay = this.language.isMalay()
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isUpdating.value = false
    }
  }

  get totalSharesLabel(): string {
    return this.language.isMalay() ? "Jumlah Saham" : "Total Shares"
  }

  get removeItemName(): string {
    return this.language.isMalay() ? "Pemegang Saham" : "Shareholder"
  }

  get ordinarySharesLabel(): string {
    return this.language.isMalay() ? "Saham Biasa" : "Ordinary Shares"
  }

  get preferenceSharesLabel(): string {
    return this.language.isMalay() ? "Saham Keutamaan" : "Preference Shares"
  }
}
