import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { Toast } from "~/scripts/library/Toast"
import { Bank } from "~/scripts/models/Bank"
import type { BankBranch } from "~/scripts/models/BankBranch"
import { CompanyBank } from "~/scripts/models/CompanyBank"
import type { PropsCompanyBank } from "~/scripts/props/PropsCompanyBank"
import { SelectOption } from "~/scripts/types/SelectOption"
import { StringUtil } from "~/scripts/utils/String"

export class BankController {
  banks: Ref<Bank[]> = ref<Bank[]>([])

  companyId: Ref<string> = ref<string>("")
  originalCompanyBank: Ref<CompanyBank> = ref<CompanyBank>(new CompanyBank())
  companyBank: Ref<CompanyBank> = ref<CompanyBank>(new CompanyBank())

  emitEvents: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  isEditing: Ref<boolean> = ref<boolean>(false)
  isSubmitting: Ref<boolean> = ref<boolean>(false)

  searchText: Ref<string> = ref<string>("")

  language = useLanguage()

  confirmToDeleteRef: any | null = null

  constructor(props: PropsCompanyBank, emitEvents: any) {
    this.emitEvents = emitEvents

    this.fetchBanks()
    this.setDataFromProps(props)
  }

  setDataFromProps(props: PropsCompanyBank): void {
    this.originalCompanyBank.value = new CompanyBank(props.companyBank)
    this.companyBank.value = new CompanyBank(props.companyBank)
    this.companyId.value = props.companyId

    if (StringUtil.isNullOrEmpty(this.companyBank.value.id)) {
      this.onEditClicked()
    }
  }

  setConfirmToDeleteRef(confirmToDeleteRef: any): void {
    this.confirmToDeleteRef = confirmToDeleteRef
  }

  async fetchBanks(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    this.banks.value = []
    this.isLoading.value = true

    try {
      let filter = new Filter()
      filter.takeAll = true

      let repository = useBankStore()
      let response = await repository.fetchAll(filter)

      this.banks.value = response.data.map((d: any) => {
        return new Bank(d)
      })
    } catch (e) {
      //
    } finally {
      this.isLoading.value = false
    }
  }

  onEditClicked(): void {
    this.isEditing.value = true
    this.isSubmitting.value = false
  }

  onCancelEditClicked(): void {
    this.companyBank.value = new CompanyBank(this.originalCompanyBank.value)
    this.isEditing.value = false
    this.isSubmitting.value = false

    this.emitEvents("cancel")
  }

  onSearchBank(searchText: string): void {
    this.searchText.value = searchText
  }

  onSelectedBank(bankId: string): void {
    if (this.companyBank.value.bankId === bankId) {
      return
    }

    this.companyBank.value.bankId = bankId
    this.companyBank.value.bankBranchId = "" // reset
  }

  onBranchSelected(branchId: string): void {
    this.companyBank.value.bankBranchId = branchId
  }

  async onSaveClicked(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    this.isSubmitting.value = true

    try {
      let toastTitle = ""
      if (StringUtil.isNullOrEmpty(this.companyBank.value.id)) {
        this.companyBank.value.companyId = this.companyId.value
        toastTitle = this.language.isMalay() ? "Akaun Bank telah direkod" : "The Bank Account is recorded."
        await this.companyBank.value.create(useCompanyBankStore())
        this.emitEvents("added", this.companyBank.value)
      } else {
        toastTitle = this.language.isMalay()
          ? "Rekod Akaun Bank telah dikemaskini."
          : "The Bank Account record is updated."
        await this.companyBank.value.update(useCompanyBankStore())
        this.emitEvents("updated", this.companyBank.value)
      }

      let toast = new Toast(toastTitle, "")
      toast.success()

      this.isEditing.value = false
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.isMalay = this.language.isMalay()
        error.setForCUD()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  onRemoveClicked(): void {
    if (this.confirmToDeleteRef) {
      this.confirmToDeleteRef.show()
    }
  }

  async onProceedRemoved(): Promise<void> {
    this.emitEvents("removed", this.companyBank.value.id) // get the parent to handle the remove

    if (StringUtil.isNullOrEmpty(this.companyBank.value.id)) {
      return
    }

    try {
      await this.companyBank.value.remove(useCompanyBankStore())

      let toastTitle = this.language.isMalay()
        ? "Rekod Akaun Bank telah dipadamkan."
        : "Bank Account Record is Removed."
      let toast = new Toast(toastTitle, "")
      toast.success()
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
    }
  }

  get bankOptions(): SelectOption[] {
    if (this.isLoading.value) {
      return [new SelectOption("", "", "Retrieving List of Banks ...", false, false)]
    }

    return this.banks.value
      .filter((b: Bank) => {
        if (StringUtil.isNullOrEmpty(this.searchText.value)) {
          return true
        }

        return (
          StringUtil.contains(b.name, this.searchText.value) || StringUtil.contains(b.nickname, this.searchText.value)
        )
      })
      .map((b: Bank) => {
        return new SelectOption(b.id, b.id, `${b.name} (${b.nickname})`)
      })
  }

  get selectedBankName(): string {
    if (!this.isEditing.value) {
      return this.companyBank.value.bank?.name ?? "(Select a Bank)"
    }

    if (this.isLoading.value) {
      return "Retrieving List of Banks ..."
    }

    if (StringUtil.isNullOrEmpty(this.companyBank.value.bankId)) {
      return "Select a Bank"
    }

    let bank = this.banks.value.find((b: Bank) => {
      return b.id === this.companyBank.value.bankId
    })

    if (!bank) {
      return "Select a Bank"
    }

    return bank.name
  }

  get selectedBank(): Bank | null {
    return (
      this.banks.value.find((b: Bank) => {
        return b.id === this.companyBank.value.bankId
      }) ?? null
    )
  }

  get selectedBranchName(): string {
    if (!this.isEditing.value) {
      return this.companyBank.value.bankBranch?.name ?? "(Select a Branch)"
    }

    let selectedBank = this.selectedBank
    if (!selectedBank) {
      return "(Select a Branch)"
    }

    let selectedBranch = selectedBank.branches.find((d: BankBranch) => {
      return d.id === this.companyBank.value.bankBranchId
    })

    return selectedBranch?.name ?? ""
  }

  get selectedBranchAddress(): string {
    if (!this.isEditing.value) {
      return this.companyBank.value.bankBranch?.address ?? "(Select a Branch)"
    }

    let selectedBank = this.selectedBank
    if (!selectedBank) {
      return "(Select a Branch)"
    }

    let selectedBranch = selectedBank.branches.find((d: BankBranch) => {
      return d.id === this.companyBank.value.bankBranchId
    })

    return selectedBranch?.address ?? ""
  }

  get accountNumberLabel(): string {
    return this.language.isMalay() ? "No. Akaun" : "Account Number"
  }

  get itemToRemoveName(): string {
    return this.language.isMalay() ? "Rekod Akaun Bank" : "Record of Bank Account"
  }
}
