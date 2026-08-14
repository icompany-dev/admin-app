import { CompanyAuditorAppointment } from "~/scripts/models/CompanyAuditorAppointment"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { AuditorPartner } from "~/scripts/models/AuditorPartner"
import { AuditorInvitation } from "~/scripts/models/AuditorInvitation"

export class AppointmentOfAuditorController
  extends ServiceController
  implements IServiceController<CompanyAuditorAppointment, ReturnType<typeof useCompanyAuditorAppointmentStore>>
{
  application: CompanyAuditorAppointment = new CompanyAuditorAppointment()
  applicationId: string | null = null
  repository = useCompanyAuditorAppointmentStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  nominationRef: any | null = null

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_AUDITOR_APPOINTMENT, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.applicationId = applicationId
      this.fetchApplication(applicationId ?? "")
    }
  }

  setNominationRef(nominationRef: any): void {
    this.nominationRef = nominationRef
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyAuditorAppointment(response)
      this.applicationId = id
      this.targetId = id
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyAuditorAppointment()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }
  }

  onPartnerSelected(applicationData: CompanyAuditorAppointment): void {
    if (!this.nominationRef) {
      return
    }

    this.nominationRef.setApplicationData(applicationData)
  }

  onNominationLetterSigned(signatureFileData: string): void {
    // do something?
  }

  async onSubmitClicked(): Promise<void> {
    try {
      if (this.dcrRef) {
        let updatedData = this.dcrRef.getApplication()
        this.application = new CompanyAuditorAppointment(updatedData)
        this.application.id = this.applicationId ?? ""
      }

      this.emitEvents("back", this.application)

      await this.onUpdate()

      if (this.isADirector.value) {
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
    // create invitation first
    let auditorPartnerId = this.application.auditorPartnerId
    let auditorPartnerRepository = useAuditorPartnerStore()
    let response = await auditorPartnerRepository.fetch(auditorPartnerId)
    if (!auditorPartnerRepository.error) {
      let auditorPartner = new AuditorPartner(response)
      let auditorInvitation = new AuditorInvitation()
      auditorInvitation.name = auditorPartner.name
      auditorInvitation.phone = auditorPartner.companyPhone
      auditorInvitation.companyName = auditorPartner.companyName
      auditorInvitation.companyEmail = auditorPartner.companyEmail
      auditorInvitation.email = auditorPartner.companyEmail
      auditorInvitation.target.target = "company"
      auditorInvitation.target.id = this.companyId

      let invitationRepository = useAuditorInvitationStore()
      try {
        await auditorInvitation.create(invitationRepository)
        if (!invitationRepository.error) {
          this.application.auditorInvitations = []
          this.application.auditorInvitations.push(auditorInvitation)
          this.application.auditorInvitationId = auditorInvitation.id
        }
      } catch (e) {
        // do nothing proceed
      }
    }

    await this.application.update(this.repository)
  }

  async onRemove(): Promise<void> {
    if (this.applicationId === null) {
      this.emitEvents("back")
    }
    this.emitEvents("back")
  }

  helpTitle(): string {
    return this.language.isMalay()
      ? `Resolusi Pengarah untuk Menukar Alamat Perniagaan`
      : "DCR to Change Business Branch"
  }

  helpDescription(): string {
    return this.language.isMalay()
      ? `Resolusi ini memerlukan:
        <ul>
          <li>Semua Pengarah <b>mesti menandatangani</b> untuk pengesahan (<i>boleh dilakukan secara elektronik di sini</i>).</li>
          <li>Pilih: <b>Express Filing</b> atau <b>Normal Filing</b> (harga berbeza mengikut SSM).</li>
          <li>Setelah pendaftaran diluluskan oleh SSM, Sistem iCompany akan memberitahu semua Pengarah.</li>
          <li>Beli & Muat Turun Profil Korporat SSM sebagai pengesahan perubahan (pilihan).</li>
        </ul>
        `
      : `This DCR requires:
          <ul>
            <li>All Directors <b>must sign</b> for confirmation (<i>can be done electronically here</i>).</li>
            <li>Choose: <b>Express Filing</b> or <b>Normal Filing</b> (price varies based on SSM Fees).</li>
            <li>Once filing is approved by SSM, iCompany System will notify all Directors.</li>
            <li>Purchase & Download SSM Corporate Profile as confirmation of the change (optional).</li>
          </ul>
        `
  }

  isDraft(): boolean {
    return this.application.signatureGroups.length <= 0
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAuditorAppointment>(
      this.companyId,
      this.applicationId,
      this.application,
      this.isDraft(),
      "Draft",
      false,
      false
    )
  }
}
