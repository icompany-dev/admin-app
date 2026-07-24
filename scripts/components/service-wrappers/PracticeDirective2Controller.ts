import { CompanyAmendmentAddress } from "~/scripts/models/CompanyAmendmentAddress"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyAmendmentAddressStore } from "~/stores/CompanyAmendmentAddresses"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { PropsPracticeDirective2 } from "~/scripts/props/PropsPracticeDirective2"
import { CompanyAmendmentDescription } from "~/scripts/models/CompanyAmendmentDescription"
import { CompanyAmendmentBranch } from "~/scripts/models/CompanyAmendmentBranch"

export class PracticeDirective2Controller
  extends ServiceController
  implements IServiceController<CompanyAmendmentAddress, ReturnType<typeof useCompanyAmendmentAddressStore>>
{
  targetType: Ref<string> = ref<string>("")

  application: CompanyAmendmentAddress = new CompanyAmendmentAddress()
  applicationId: string | null = null

  companyAmendmentAddress = ref<CompanyAmendmentAddress>(new CompanyAmendmentAddress())
  companyAmendmentBranch = ref<CompanyAmendmentBranch>(new CompanyAmendmentBranch())
  companyAmendmentDescription = ref<CompanyAmendmentDescription>(new CompanyAmendmentDescription())

  repository = useCompanyAmendmentAddressStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  constructor(companyId: string, targetType: string, emitEvents: any | null, applicationId: string | null = null) {
    super(targetType, companyId, emitEvents)
    this.targetType.value = targetType

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  async setTargetType(targetType: string): Promise<void> {
    this.targetType.value = targetType
    if (!StringUtil.isNullOrEmpty(this.applicationId)) {
      await this.fetchApplication(this.applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    this.applicationId = id
    this.targetId = id

    let repository = null
    switch (this.targetType.value) {
      case CompanyConstants.TARGET_AMENDMENT_ADDRESS:
        repository = useCompanyAmendmentAddressStore()
        break
      case CompanyConstants.TARGET_AMENDMENT_BRANCH:
        repository = useCompanyAmendmentBranchStore()
        break
      case CompanyConstants.TARGET_AMENDMENT_DESCRIPTION:
        repository = useCompanyAmendmentDescriptionStore()
        break
    }

    if (!repository) {
      return
    }

    let response = await repository.fetch(id)
    if (this.repository.error !== null) {
      return
    }
    this.application = new CompanyAmendmentAddress(response)

    switch (this.targetType.value) {
      case CompanyConstants.TARGET_AMENDMENT_ADDRESS:
        this.companyAmendmentAddress.value = new CompanyAmendmentAddress(response)
        break
      case CompanyConstants.TARGET_AMENDMENT_BRANCH:
        this.companyAmendmentBranch.value = new CompanyAmendmentBranch(response)
        // need to set for wrapper
        this.companyAmendmentAddress.value = new CompanyAmendmentAddress(response)
        break
      case CompanyConstants.TARGET_AMENDMENT_DESCRIPTION:
        this.companyAmendmentDescription.value = new CompanyAmendmentDescription(response)
        this.companyAmendmentAddress.value = new CompanyAmendmentAddress(response)
        break
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyAmendmentAddress()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }
  }

  async onSubmitClicked(): Promise<void> {
    // do nothing
  }

  async onCreate(): Promise<void> {
    //
  }

  async onUpdate(): Promise<void> {
    //
  }

  async onRemove(): Promise<void> {
    //
  }

  get practiceDirective2Props(): PropsPracticeDirective2 {
    let props = new PropsPracticeDirective2(this.companyId)

    switch (this.targetType.value) {
      case CompanyConstants.TARGET_AMENDMENT_ADDRESS:
        props.isUpdatingBusinessAddress = true
        props.updateAddress = this.companyAmendmentAddress.value.businessAddressLocation?.getMultilineAddress() ?? ""
        break
      case CompanyConstants.TARGET_AMENDMENT_BRANCH:
        if (this.companyAmendmentBranch.value.type === CompanyConstants.AMENDMENT_BRANCH_TYPE_ADD) {
          props.isAddingBranchAddress = true
          props.addAddress = this.companyAmendmentBranch.value.location.getMultilineAddress() ?? ""
        } else if (this.companyAmendmentBranch.value.type === CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE) {
          props.isUpdatingBranchAddress = true
          props.updateAddress = this.companyAmendmentBranch.value.location.getMultilineAddress() ?? ""
        } else if (this.companyAmendmentBranch.value.type === CompanyConstants.AMENDMENT_BRANCH_TYPE_REMOVE) {
          props.isRemovingBranchAddress = true
          props.removeAddress = this.companyAmendmentBranch.value.location.getMultilineAddress() ?? ""
        }
        break
      case CompanyConstants.TARGET_AMENDMENT_DESCRIPTION:
        props.isUpdatingNature = true
        break
    }

    return props
  }
}
