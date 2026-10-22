import { Error } from "~/scripts/library/Error"
import { Toast } from "~/scripts/library/Toast"
import { CompanyBranch } from "~/scripts/models/CompanyBranch"
import { Location } from "~/scripts/models/Location"
import type { PropsCompanyBranch } from "~/scripts/props/PropsCompanyBranch"
import { StringUtil } from "~/scripts/utils/String"

export class BranchController {
  companyId: Ref<string> = ref<string>("")
  companyBranch: Ref<CompanyBranch> = ref<CompanyBranch>(new CompanyBranch())
  branchLocation: Ref<Location> = ref<Location>(new Location())
  emitEvents: any | null = null

  isEditMode: Ref<boolean> = ref<boolean>(false)
  isUpdating: Ref<boolean> = ref<boolean>(false)

  isDeleting: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()

  addressInputRef: any | null = null
  confirmToDeleteRef: any | null = null

  constructor(props: PropsCompanyBranch, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setDataFromProps(props)
  }

  setConfirmToDeleteRef(confirmToDeleteRef: any): void {
    this.confirmToDeleteRef = confirmToDeleteRef
  }

  setAddressInputRef(addressInputRef: any): void {
    this.addressInputRef = addressInputRef
  }

  setDataFromProps(props: PropsCompanyBranch): void {
    this.companyId.value = props.companyId
    this.companyBranch.value = props.companyBranch

    if (StringUtil.isNullOrEmpty(this.companyBranch.value.id)) {
      this.companyBranch.value.companyId = this.companyId.value
      this.companyBranch.value.location = new Location()
      this.companyBranch.value.status = "active"

      this.onEditClicked()
    }

    this.branchLocation.value = new Location(this.companyBranch.value.location)
  }

  onEditClicked(): void {
    this.isEditMode.value = true
  }

  onRemoveClicked(): void {
    if (this.confirmToDeleteRef) {
      this.confirmToDeleteRef.show()
    }
  }

  async onProceedToDelete(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyBranch.value.id)) {
      this.emitEvents("removed")
      return
    }

    if (this.isDeleting.value) {
      return
    }

    try {
      this.isDeleting.value = true

      await this.companyBranch.value.remove(useCompanyBranchStore())

      this.emitEvents("removed")

      let toastTitle = this.language.isMalay() ? `Maklumat Cawangan telah dipadamkan.` : `The Branch info is removed.`
      let toast = new Toast(toastTitle, "")
      toast.success()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    } finally {
      this.isDeleting.value = false
    }
  }

  onCancelEditClicked(): void {
    this.isEditMode.value = false
  }

  async onSaveClicked(): Promise<void> {
    if (this.isUpdating.value) {
      return
    }

    try {
      this.isUpdating.value = true
      let isNew = StringUtil.isNullOrEmpty(this.companyBranch.value.id)

      if (this.addressInputRef) {
        this.companyBranch.value.location = new Location(this.addressInputRef.getAddress())
      }

      this.companyBranch.value.name = this.companyBranch.value.location.addressLine1
      this.companyBranch.value.descriptions = this.companyBranch.value.location.addressLine1

      if (StringUtil.isNullOrEmpty(this.companyBranch.value.id)) {
        await this.companyBranch.value.create(useCompanyBranchStore())
      } else {
        await this.companyBranch.value.update(useCompanyBranchStore())
      }

      this.emitEvents("branchUpdated", this.companyBranch.value)

      let toastTitle = this.language.isMalay()
        ? `Maklumat Cawangan berjaya dikemas kini.`
        : `The Branch info is successfully ${isNew ? "added" : "updated"}.`
      let toast = new Toast(toastTitle, "")
      toast.success()
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
      this.isEditMode.value = false
    }
  }

  get canProceed(): boolean {
    return this.companyBranch.value.canProceed()
  }

  get branchAddress(): string {
    return this.companyBranch.value.location.getMultilineAddress()
  }

  get itemToRemoveName(): string {
    return this.language.isMalay() ? "Butiran Cawangan" : "Branch Details"
  }
}
