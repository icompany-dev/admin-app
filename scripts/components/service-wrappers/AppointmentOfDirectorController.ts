import { CompanyDirectorAppointment } from "~/scripts/models/CompanyDirectorAppointment"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyDirectorAppointmentStore } from "~/stores/CompanyDirectorAppointments"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import { InvitationTarget } from "~/scripts/models/Invitation"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class AppointmentOfDirectorController
  extends ServiceController
  implements IServiceController<CompanyDirectorAppointment, ReturnType<typeof useCompanyDirectorAppointmentStore>>
{
  application: CompanyDirectorAppointment = new CompanyDirectorAppointment()
  applicationId: string | null = null
  repository = useCompanyDirectorAppointmentStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)
  isByShareholder: Ref<boolean> = ref<boolean>(false)

  constructor(
    companyId: string,
    emitEvents: any | null,
    isByShareholder: boolean,
    applicationId: string | null = null
  ) {
    super(CompanyConstants.TARGET_DIRECTOR_APPOINTMENT, companyId, emitEvents)

    this.isByShareholder.value = isByShareholder

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.applicationId = applicationId
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyDirectorAppointment(response)
      this.applicationId = id
      this.targetId = this.application.id
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyDirectorAppointment()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  // async onSigned(signatureData: string): Promise<void> {
  //   this.signatureFile.value = signatureData

  //   await this.onSubmitClicked()
  // }

  async onSubmitClicked(): Promise<void> {
    try {
      if (this.dcrRef) {
        let updatedData = this.dcrRef.getApplication()
        this.application = new CompanyDirectorAppointment(updatedData)
        this.application.id = this.applicationId ?? ""
      } else {
        let updatedData = this.mcrRef.getApplication()
        this.application = new CompanyDirectorAppointment(updatedData)
        this.application.id = this.applicationId ?? ""
      }

      this.emitEvents("back", this.application)

      await this.onUpdate()

      if (this.isADirector.value || this.isAShareholder.value) {
        await this.submitSignature()
      }

      this.emitEvents("applicationUpdated", this.application)
    } catch (error: any) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForCUD()
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
    // add director invitation
    let newDirectorInvitation = new DirectorInvitation()
    newDirectorInvitation.email = this.application.emailAddress ?? ""
    newDirectorInvitation.name = this.application.directorName ?? ""
    newDirectorInvitation.target = new InvitationTarget({ id: this.companyId, target: "company" })
    if (
      !StringUtil.isNullOrEmpty(newDirectorInvitation.email) &&
      !StringUtil.isNullOrEmpty(newDirectorInvitation.name)
    ) {
      let repository = useDirectorInvitationStore()
      await newDirectorInvitation.create(repository)

      this.application.directorInvitations = []
      this.application.directorInvitations.push(newDirectorInvitation)
    }

    await this.application.update(this.repository)
  }

  async onRemove(): Promise<void> {
    if (this.applicationId === null) {
      this.emitEvents("back", this.application)
    }
    // TODO: update function
    // Must ask for confirmation before it proceeds to delete
    // await this.application.remove(this.repository)
    this.emitEvents("back", this.application)
  }

  helpTitle(): string {
    return this.language.isMalay()
      ? `Resolusi Pengarah & Pemegang Saham untuk Melantik Pengarah Baharu`
      : "DCR & MCR to Appoint New Director"
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
    return new PropsResolutionDocument<CompanyDirectorAppointment>(
      this.companyId,
      this.applicationId,
      this.application,
      this.isDraft(),
      "Draft",
      false,
      this.isByShareholder.value
    )
  }
}
