import { CompanyAmendmentDescription } from "~/scripts/models/CompanyAmendmentDescription"
import { ResolutionController } from "./ResolutionController"
import { useCompanyAmendmentDescriptionStore } from "~/stores/CompanyAmendmentDescriptions"
import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrChangeOfDescriptionsController extends ResolutionController<CompanyAmendmentDescription> {
  companyAmendmentDescriptionRepository = useCompanyAmendmentDescriptionStore()
  companyRepository = useCompanyStore()
  businessDescriptionValue = ref<string>("")

  constructor(props: IPropsResolutionDocument<CompanyAmendmentDescription>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyAmendmentDescription,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 4
    this.maxSignatureOnOtherPages.value = 6
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyAmendmentDescriptionRepository.fetch(id)
    if (!this.companyAmendmentDescriptionRepository.error) {
      this.application.value = new CompanyAmendmentDescription(response)
      this.businessDescriptionValue.value = this.application.value.businessDescription
      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyAmendmentDescription()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(response)
      this.initializeData()
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  async otherDataInitiation(): Promise<void> {
    // do nothing
  }

  setContent(): void {
    // do nothing
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return 1
    }

    return (
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )
    )
  }

  businessDescription(): string {
    if (this.isInPreviewMode.value) {
      return "YOUR NEW BUSINESS DESCRIPTION"
    }

    if (!this.application.value) {
      return ""
    }

    let formattedDescription = this.application.value.businessDescription.replace("\n", "<br>")

    return formattedDescription
  }

  onDescriptionChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.businessDescription = this.businessDescriptionValue.value
  }
}
