import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { Toast } from "~/scripts/library/Toast"
import { Bank } from "~/scripts/models/Bank"
import { BankConstants } from "~/scripts/constants/Banks"
import { BankBranch } from "~/scripts/models/BankBranch"
import { CompanyBank } from "~/scripts/models/CompanyBank"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import { SelectOption } from "~/scripts/types/SelectOption"
import { StringUtil } from "~/scripts/utils/String"
import { BasePopupController } from "./BasePopupController"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"

export class AddBankAccountController extends BasePopupController {
  companyBankAccountOpeningId: Ref<string> = ref<string>("")

  bankAccountNumber: Ref<string> = ref<string>("")
  isUpdating: Ref<boolean> = ref<boolean>(false)

  constructor(companyBankAccountOpeningId: string, emitEvents: any) {
    super(emitEvents)

    this.setCompanyBankAccountOpeningId(companyBankAccountOpeningId)
  }

  setCompanyBankAccountOpeningId(companyBankAccountOpeningId: string): void {
    this.companyBankAccountOpeningId.value = companyBankAccountOpeningId
  }

  async onProceedClicked(): Promise<void> {
    if (!this.canProceed) {
      let error = new Error()
      error.type = Error.ERROR_TYPE_DATA
      error.title = this.language.isMalay() ? "No. Akaun Bank diperlukan." : "Bank Account Number is Required"
      error.message = this.language.isMalay()
        ? "Anda tidak boleh tinggalkan ruang ini kosong."
        : "You cannot leave it empty."
      error.handle()
      return
    }

    if (this.isUpdating.value) {
      return
    }

    try {
      this.isUpdating.value = true
      let repository = useCompanyBankAccountOpeningStore()

      await repository.addBankAccountNumber(this.companyBankAccountOpeningId.value, this.bankAccountNumber.value)

      if (repository.error !== null) {
        throw repository.error
      }

      let toastTitle = this.language.isMalay() ? "No. Akaun Bank telah ditambah." : "Bank Account Number is Added."
      let toast = new Toast(toastTitle, "")
      toast.success()
      this.emitEvents(EmitMessages.PROCEED)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isUpdating.value = false
    }

    this.hide()
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? `Tambah No. Akaun Bank` : `Add Bank Account Number`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get canProceed(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.companyBankAccountOpeningId.value) &&
      !StringUtil.isNullOrEmpty(this.bankAccountNumber.value)
    )
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
        Masukkan no. akaun bank.
      `
    }

    return `
      Insert the Bank Account Number.
    `
  }

  get accountBankLabel(): string {
    return this.language.isMalay() ? "No. Akaun" : "Account Number"
  }
}
