import { CompanyDirectorRemoval } from "~/scripts/models/CompanyDirectorRemoval"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyDirectorRemovalStore } from "~/stores/CompanyDirectorRemovals"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { SignatureGroup, SignatureGroupGroup, SignatureGroupTarget } from "~/scripts/models/SignatureGroup"
import { CompanyMeeting } from "~/scripts/models/CompanyMeeting"
import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"
import { StatusConstants } from "~/scripts/constants/Status"

export class RemoveDirectorController
  extends ServiceController
  implements IServiceController<CompanyDirectorRemoval, ReturnType<typeof useCompanyDirectorRemovalStore>>
{
  application: CompanyDirectorRemoval = new CompanyDirectorRemoval()
  applicationId: string | null = null
  repository = useCompanyDirectorRemovalStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  noticeRef: any | null = null

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_REMOVAL_OF_DIRECTOR, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.applicationId = applicationId
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyDirectorRemoval(response)
      this.applicationId = id
      this.targetId = this.applicationId
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyDirectorRemoval()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  setNoticeRef(noticeRef: any): void {
    this.noticeRef = noticeRef
  }

  async onNoticeSigned(signatureFile: string): Promise<void> {
    if (!this.isAShareholder.value) {
      return
    }

    if (!this.isADirector.value) {
      this.emitEvents("back")
    }

    let signatureDate = this.time.currentDataTimeForSignature()
    if (!this.existingSignatureAsShareholder.value) {
      let newSignatureGroup = new SignatureGroup()
      newSignatureGroup.target = new SignatureGroupTarget(this.targetId ?? "", this.target)
      newSignatureGroup.group = new SignatureGroupGroup(this.shareholderId.value ?? "", "shareholder")
      await newSignatureGroup.update(signatureFile, this.fileRepository, this.signatureRepository, signatureDate)
    }

    if (this.noticeRef) {
      let updatedData = this.noticeRef.getApplication()
      this.application.directorId = updatedData.directorId
      await this.onUpdate()
    }

    this.emitEvents("applicationUpdated", this.application)

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.application)
    }
  }

  async onDcrConveneSigned(signatureFile: string): Promise<void> {
    if (!this.isADirector.value) {
      return
    }

    this.emitEvents("back")

    if (this.dcrRef) {
      let updatedData = this.dcrRef.getApplication()
      this.application.egmVenue = updatedData.egmVenue
      this.application.egmDate = updatedData.egmDate
      this.application.egmTime = updatedData.egmTime
      await this.onUpdate()
    }

    let signatureDate = this.time.currentDataTimeForSignature()
    if (!this.existingSignatureAsShareholder.value) {
      let newSignatureGroup = new SignatureGroup()
      newSignatureGroup.target = new SignatureGroupTarget(this.targetId ?? "", this.target)
      newSignatureGroup.group = new SignatureGroupGroup(this.directorId.value ?? "", "director")
      await newSignatureGroup.update(signatureFile, this.fileRepository, this.signatureRepository, signatureDate)
    }

    await this.onPostDcrConveneSigned()

    this.emitEvents("applicationUpdated", this.application)
  }

  async onSubmitClicked(): Promise<void> {
    if (this.mcrRef) {
      let updatedData = this.mcrRef.getApplication()
      this.application.directorId = updatedData.directorId
    }

    if (this.dcrRef) {
      let updatedData = this.dcrRef.getApplication()
      this.application.egmVenue = updatedData.egmVenue
      this.application.egmDate = updatedData.egmDate
      this.application.egmTime = updatedData.egmTime
    }

    try {
      this.emitEvents("back", this.application)

      await this.onUpdate()

      if (this.isAShareholder.value || this.isADirector.value) {
        await this.submitSignature()
      }

      if (this.isADirector.value) {
        await this.onPostDcrConveneSigned()
      }

      this.emitEvents("applicationUpdated", this.application)
    } catch (error: any) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async onCreate(): Promise<void> {
    await this.application.create(this.repository)
    this.applicationId = this.application.id
    this.targetId = this.application.id
  }

  async onUpdate(): Promise<void> {
    await this.application.update(this.repository)
  }

  async onPostDcrConveneSigned(): Promise<void> {
    // need to send out notice
    let response = await this.directorRepository.fetchAllForCompany(this.companyId)
    let numberOfDirectors = response.length

    this.repository.clearItem()
    await this.fetchApplication(this.application.id)
    let numberOfDirectorSignatures = this.application.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "director"
    }).length

    let isMajorityReached = numberOfDirectorSignatures > 0.5 * (numberOfDirectors - 1)
    if (isMajorityReached) {
      let venueFragments = this.application.egmVenue?.split("-") ?? []
      // create meeting and send out notification
      let newCompanyMeeting = new CompanyMeeting()
      newCompanyMeeting.companyId = this.application.companyId
      newCompanyMeeting.venueType = venueFragments[0] ?? "-"
      newCompanyMeeting.otherVenueType = venueFragments[1] ?? ""
      newCompanyMeeting.platform = venueFragments[3] ? venueFragments[3] : (venueFragments[2] ?? "")
      newCompanyMeeting.platformLink = ""
      newCompanyMeeting.targetId = this.application.id
      newCompanyMeeting.targetType = CompanyConstants.TARGET_REMOVAL_OF_DIRECTOR
      newCompanyMeeting.status = StatusConstants.PAID
      newCompanyMeeting.create(useCompanyMeetingStore())

      this.repository.sendOutNotice(
        this.application.id,
        SecretaryInformation.SECRETARY_NAME,
        SecretaryInformation.SECRETARY_LICENSE
      )
    }
  }

  async onRemove(): Promise<void> {
    if (this.applicationId === null) {
      this.emitEvents("back")
    }
    // TODO: update function
    // Must ask for confirmation before it proceeds to delete
    // await this.application.remove(this.repository)
    this.emitEvents("back")
  }

  helpTitle(): string {
    return this.language.isMalay()
      ? `Resolusi Pengarah & Pemegang Saham untuk Memperuntuk Saham Baharu`
      : "DCR & MCR to Allot New Shares"
  }

  helpDescription(): string {
    //Get more details for help
    return this.language.isMalay()
      ? `Resolusi ini memerlukan:
        <ul>
          <li>Sekurang-kurangnya satu (1) <b>Cadangan Nama</b>. Ketersediaan nama adalah tertakluk kepada SSM.</li>
          <li><b>Resolusi Khas</b> mesti mencapai majoriti sekurang-kurangnya <b>75%</b> daripada Pemegang Saham.</li>
        </ul>
        Anda boleh Beli & Muat Turun Profil Korporat SSM sebagai pengesahan perubahan (pilihan).
        `
      : `This resolution requires:
          <ul>
            <li>At least one (1) <b>Proposed Name</b>. The availability of name is subjected to SSM.</li>
            <li>The <b>Special Resolution</b> must reach a majority of at least <b>75%</b> of the Shareholders.</li>
          </ul>
          You can Purchase & Download SSM Corporate Profile as confirmation of the change (optional).
        `
  }

  isDraft(): boolean {
    return this.application.signatureGroups.length <= 0
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyDirectorRemoval>(
      this.companyId,
      this.applicationId,
      this.application,
      this.isDraft(),
      "Draft",
      false,
      false
    )
  }

  get hasSignedAsDirector(): boolean {
    return (
      (this.isADirector.value &&
        this.application.signatureGroups.find((sg: SignatureGroup) => {
          return sg.group?.target === "director" && sg.group?.id === this.directorId.value
        }) !== undefined) ||
      !this.isADirector.value
    )
  }

  get hasSignedAsShareholder(): boolean {
    return (
      (this.isAShareholder.value &&
        this.application.signatureGroups.find((sg: SignatureGroup) => {
          return sg.group?.target === "shareholder" && sg.group?.id === this.shareholderId.value
        }) !== undefined) ||
      !this.isAShareholder.value
    )
  }
}
