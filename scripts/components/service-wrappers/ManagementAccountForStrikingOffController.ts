import { CompanyManagementAccount } from "~/scripts/models/CompanyManagementAccount"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyManagementAccountStore } from "~/stores/CompanyManagementAccounts"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StatusConstants } from "~/scripts/constants/Status"

export class ManagementAccountForStrikingOffController
  extends ServiceController
  implements IServiceController<CompanyManagementAccount, ReturnType<typeof useCompanyManagementAccountStore>>
{
  application: CompanyManagementAccount = new CompanyManagementAccount()
  applicationRef = ref<CompanyManagementAccount>(new CompanyManagementAccount())
  applicationId: string | null = null
  repository = useCompanyManagementAccountStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_MANAGEMENT_ACCOUNT, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.applicationId = applicationId
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyManagementAccount(response)
      this.applicationRef.value = new CompanyManagementAccount(response)
      this.applicationId = id
      this.targetId = id
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyManagementAccount()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  async onSubmitClicked(): Promise<void> {
    if (this.dcrRef) {
      let updatedData = this.dcrRef.getApplication()
      this.application = new CompanyManagementAccount(updatedData)
      this.application.id = this.applicationId ?? ""
    }

    try {
      this.emitEvents("back", this.application)

      if (StringUtil.isNullOrEmpty(this.application.id)) {
        await this.onCreate()
      } else {
        await this.onUpdate()
      }

      if (this.isADirector.value || this.isAShareholder.value) {
        await this.submitSignature()
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
    // Only way for this to be possible is because it is for Striking Off
    this.application.status = StatusConstants.PAID
    await this.application.create(this.repository)
    this.applicationId = this.application.id
    this.targetId = this.application.id
  }

  async onUpdate(): Promise<void> {
    await this.application.update(this.repository)
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
    let props = new PropsResolutionDocument<CompanyManagementAccount>(
      this.companyId,
      this.applicationId,
      this.applicationRef.value as CompanyManagementAccount,
      this.isDraft(),
      "Draft",
      false,
      false
    )

    return props
  }
}
