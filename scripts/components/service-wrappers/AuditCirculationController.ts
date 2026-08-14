import { CompanyAuditCirculation } from "~/scripts/models/CompanyAuditCirculation"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { useCompanyAuditCirculationStore } from "#imports"
import { useCompanyStore } from "#imports"
import { CompanyConstants } from "~/scripts/constants/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class AuditCirculationController
  extends ServiceController
  implements IServiceController<CompanyAuditCirculation, ReturnType<typeof useCompanyAuditCirculationStore>>
{
  application: CompanyAuditCirculation = new CompanyAuditCirculation()
  applicationRef = ref<CompanyAuditCirculation>(new CompanyAuditCirculation())
  applicationId: string | null = null
  repository = useCompanyAuditCirculationStore()
  companyRepository = useCompanyStore()

  financialPeriodId: Ref<string> = ref<string>("")

  canSubmit = ref<boolean>(true)
  canRemove = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_AUDIT_CIRCULATION, companyId, emitEvents)

    this.applicationId = applicationId
    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    } else {
      this.setApplication(companyId)
    }
  }

  async fetchApplication(id: string): Promise<void> {
    await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyAuditCirculation(this.repository.companyAuditCirculation)
      this.applicationRef.value = new CompanyAuditCirculation(this.repository.companyAuditCirculation)
      this.applicationId = id
      this.targetId = id

      this.financialPeriodId.value = this.application.financialPeriodId ?? ""
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
  }

  async setApplication(companyId: string): Promise<void> {
    await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyAuditCirculation()
      this.application.companyId = companyId
      this.application.company = new Company(this.companyRepository.company)
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
  }

  async onSubmitClicked(): Promise<void> {
    if (this.dcrRef) {
      let updatedData = this.dcrRef.getApplication() ?? null
      this.application = new CompanyAuditCirculation(updatedData)
    }

    try {
      this.emitEvents("back", this.application)

      if (StringUtil.isNullOrEmpty(this.applicationId)) {
        await this.onCreate()
      } else {
        await this.onUpdate()
      }

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
    return this.language.isMalay() ? "Pengedaran dan Serah Simpan" : "Circulation and Lodgement"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        <b>Pengedaran</b> hanyalah tindakan mengagihkan penyata kewangan Sdn Bhd anda kepada pemegang saham dan pengarah. 
        Ia memastikan pemegang taruh utama dimaklumkan mengenai prestasi Sdn Bhd sebelum sebarang penyerahan rasmi dibuat.
        <br><br>
        Penyata kewangan perlu diedarkan dalam tempoh <b>6 bulan dari Tarikh Akhir Tahun Kewangan anda</b>.
        <br><br>
        <b>Serah Simpan</b> pula adalah langkah rasmi menyerahkan laporan yang sama kepada pihak penguasa, iaitu SSM, untuk 
        rekod mereka.
        <br><br>
        Penyata kewangan perlu diserah simpan dalam tempoh <b>30 hari dari tarikh edaran</b>.
      `
    }

    return `
      <b>Circulation</b> is simply the act of distributing your Sdn Bhd's financial statements to shareholders and directors. 
      It ensures that the key stakeholders are informed about the Sdn Bhd's performance before any official filings are made.
      <br><br>
      The statements must be circulated within <b>6 months of your Financial Year End</b>.
      <br><br>
      <b>Lodgement</b> is the official step of submitting that same report to the government regulator, SSM, for their records.
      <br><br>
      Financial statements must be lodged within <b>30 days of the circulation date</b>.
    `
  }

  isDraft(): boolean {
    return this.application.signatureGroups.length <= 0
  }

  get resolutionDocumentProps() {
    console.log("id", this.applicationRef.value.id)
    return new PropsResolutionDocument<CompanyAuditCirculation>(
      this.companyId,
      this.applicationRef.value.id,
      null,
      this.isDraft(),
      "Draft",
      false,
      false,
      this.financialPeriodId.value
    )
  }
}
