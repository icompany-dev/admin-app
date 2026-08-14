import { CompanyDirectorLoan } from "~/scripts/models/CompanyDirectorLoan"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyDirectorLoanStore } from "~/stores/CompanyDirectorLoans"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import { InvitationTarget } from "~/scripts/models/Invitation"

export class LoanToDirectorController
  extends ServiceController
  implements IServiceController<CompanyDirectorLoan, ReturnType<typeof useCompanyDirectorLoanStore>>
{
  application: CompanyDirectorLoan = new CompanyDirectorLoan()
  applicationId: string | null = null
  repository = useCompanyDirectorLoanStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_DIRECTOR_LOAN, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyDirectorLoan(response)
      this.applicationId = this.application.id
      this.targetId = this.application.id
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyDirectorLoan()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  onDcrApplicationUpdated(): void {
    if (this.dcrRef) {
      let updatedData = this.dcrRef.getApplication()

      if (this.mcrRef) {
        this.mcrRef.onDataChanged(updatedData)
      }
    }
  }

  onMcrApplicationUpdated(): void {
    if (this.mcrRef) {
      let updatedData = this.mcrRef.getApplication()

      if (this.dcrRef) {
        this.dcrRef.onDataChanged(updatedData)
      }
    }
  }

  async onSubmitClicked(): Promise<void> {
    try {
      if (this.dcrRef) {
        let updatedData = this.dcrRef.getApplication()
        this.application = new CompanyDirectorLoan(updatedData)
        this.application.id = this.applicationId ?? ""
      } else {
        let updatedData = this.mcrRef.getApplication()
        this.application = new CompanyDirectorLoan(updatedData)
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
      ? `Resolusi Pengarah & Pemegang Saham untuk Pinjaman kepada Pengarah`
      : "DCR & MCR for Loan to Director"
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
}
