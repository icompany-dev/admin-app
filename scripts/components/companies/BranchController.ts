import { Error } from "~/scripts/library/Error"
import { Toast } from "~/scripts/library/Toast"
import { CompanyBranch } from "~/scripts/models/CompanyBranch"
import { Location } from "~/scripts/models/Location"
import type { PropsCompanyBranch } from "~/scripts/props/PropsCompanyBranch"
import { StringUtil } from "~/scripts/utils/String"

export class BranchController {
  companyId: Ref<string> = ref<string>("")
  companyBranch: Ref<CompanyBranch> = ref<CompanyBranch>(new CompanyBranch())
  emitEvents: any | null = null

  isEditMode: Ref<boolean> = ref<boolean>(false)
  isUpdating: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()

  addressInputRef: any | null = null

  constructor(props: PropsCompanyBranch, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setDataFromProps(props)
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
    }
  }

  onEditClicked(): void {
    this.isEditMode.value = true
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

  onUpdateAddressLine1(data: any): void {
    this.companyBranch.value.location.addressLine1 = data
    this.companyBranch.value.name = data
    this.companyBranch.value.descriptions = data
  }

  onUpdateAddressLine2(data: any): void {
    this.companyBranch.value.location.addressLine2 = data
  }

  onUpdateAddressLine3(data: any): void {
    this.companyBranch.value.location.addressLine3 = data
  }

  onUpdateState(data: any): void {
    this.companyBranch.value.location.state = data
  }

  onUpdateCity(data: any): void {
    this.companyBranch.value.location.city = data
  }

  onUpdatePostcode(data: any): void {
    this.companyBranch.value.location.postcode = data
  }

  onUpdateCountry(data: any): void {
    this.companyBranch.value.location.country = data
  }

  get canProceed(): boolean {
    return this.companyBranch.value.canProceed()
  }

  get branchAddress(): string {
    return this.companyBranch.value.location.getMultilineAddress()
  }
}
