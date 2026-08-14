import { CompanyStrikingOffResolution } from "~/scripts/models/CompanyStrikingOffResolution"
import { ResolutionController } from "./ResolutionController"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrStrikingOffController extends ResolutionController<CompanyStrikingOffResolution> {
  companyStrikingOffRepository = useCompanyStrikingOffResolutionStore()
  companyRepository = useCompanyStore()

  resolutionContent = ref<string>("")

  constructor(props: IPropsResolutionDocument<CompanyStrikingOffResolution>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyStrikingOffResolution,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )
    this.isDcr.value = true

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

    await this.getPersonsToSign()
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyStrikingOffRepository.fetch(id)
    if (!this.companyStrikingOffRepository.error && response !== null) {
      this.application.value = new CompanyStrikingOffResolution(response)
    }
  }

  async setApplication(): Promise<void> {
    let response = await this.companyRepository.fetch(this.companyId.value)
    let company = new Company(response)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyStrikingOffResolution()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  async otherDataInitiation(): Promise<void> {
    // do nothing
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getContent(): string {
    const applicantName = this.application.value?.applicant.name || "THE APPLICANT"

    return `
      <div>
        <b>
          RESOLVED:
        </b>
      </div>

      <br>

      <div class="striking-off-resolution-title">
        PROPOSED MEMBERS’ CIRCULAR RESOLUTION
      </div>

      <br>

      <div class="striking-off-resolution-content">
        THAT the following motion be proposed to the Members of the Company for consideration, and if
        thought fit, to pass the motion as Ordinary Resolutions of the Company by way of a Members’ Circular
        Resolution made pursuant to Section 290 of the Companies Act, 2016 AND THAT the Secretary be
        authorised to prepare the necessary documents containing the motion for circulation to the Members of
        the Company for consideration and approval AND THAT the Board will indemnify the Company
        Secretaries in respect of any liabilities incurred in respect of the accuracy and truthfulness of which the
        Board verify:-
      </div>

      <br>

      <div class="striking-off-resolution-title">
        APPLICATION TO STRIKE OFF FROM REGISTER PURSUANT TO SECTION 550 OF THE COMPANIES ACT, 2016
      </div>

      <br>

      <div class="striking-off-resolution-content">
        THAT the Company has not been in operation since incorporation and has no intention to carry on its
        business in the foreseeable future.
      </div>

      <br>

      <div class="striking-off-resolution-content">
        THAT the Company is not involved in any legal proceeding within or outside Malaysia.
      </div>

      <br>

      <div class="striking-off-resolution-content">
        THAT authority be and is hereby given to the Directors of the Company to apply to the Companies
        Commission of Malaysia to strike off the Company from its register pursuant to Section 550 of the
        Companies Act, 2016.
      </div>

      <br>

      <div class="striking-off-resolution-content">
        THAT <span class="text-uppercase">${applicantName}</span> be and is hereby authorized to execute the Application to
        Strike Off Company and any other relevant documents in connection therewith for and on behalf of the
        Company.”
      </div>
    `
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

  async refreshData(): Promise<void> {
    await this.fetchApplication(this.applicationId.value ?? "")
    await this.initializeData()
  }
}
