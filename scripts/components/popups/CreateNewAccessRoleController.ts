import { AccessRole } from "~/scripts/models/AccessRole"
import { BasePopupController } from "./BasePopupController"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import { Toast } from "~/scripts/library/Toast"
import { Error } from "~/scripts/library/Error"
import { EmitMessages } from "~/scripts/constants/EmitMessages"

export class CreateNewAccessRoleController extends BasePopupController {
  companyId: Ref<string> = ref<string>("")

  accessRole: Ref<AccessRole> = ref<AccessRole>(new AccessRole())

  isSubmitting: Ref<boolean> = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any) {
    super(emitEvents)

    this.isCompliance.value = false

    this.setCompanyId(companyId)
  }

  setCompanyId(companyId: string): void {
    this.companyId.value = companyId

    this.accessRole.value = new AccessRole()
    this.accessRole.value.companyId = this.companyId.value
  }

  async onProceedClicked(): Promise<void> {
    if (!this.accessRole.value.canSubmit() || this.isSubmitting.value) {
      return
    }

    this.isSubmitting.value = true

    try {
      await this.accessRole.value.create(useAccessRoleStore())

      let toastTitle = this.language.isMalay()
        ? "Peranan ditambah bagi Sdn Bhd ini."
        : "Role is added for this Sdn Bhd."
      let toast = new Toast(toastTitle, "")
      toast.success()

      this.emitEvents(EmitMessages.PROCEED)

      this.hide()
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
      this.isSubmitting.value = false
    }
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? `Tambah Peranan` : `Add Access Role`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
        Peranan Baharu:
      `
    }

    return `
      New Role:
    `
  }
}
