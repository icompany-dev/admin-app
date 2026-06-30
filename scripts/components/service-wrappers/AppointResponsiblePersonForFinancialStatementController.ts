import { CompanyFinancialStatementAuthorisedPerson } from "~/scripts/models/CompanyFinancialStatementAuthorisedPerson"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { useCompanyFinancialStatementAuthorisedPersonStore } from "#imports"
import { useCompanyStore } from "#imports"
import { CompanyConstants } from "~/scripts/constants/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class AppointResponsiblePersonForFinancialStatementController
  extends ServiceController
  implements
    IServiceController<
      CompanyFinancialStatementAuthorisedPerson,
      ReturnType<typeof useCompanyFinancialStatementAuthorisedPersonStore>
    >
{
  application: CompanyFinancialStatementAuthorisedPerson = new CompanyFinancialStatementAuthorisedPerson()
  applicationId: string | null = null
  repository = useCompanyFinancialStatementAuthorisedPersonStore()
  companyRepository = useCompanyStore()

  financialPeriodId: Ref<string> = ref<string>("")

  canSubmit = ref<boolean>(true)
  canRemove = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_FINANCIAL_STATEMENT_AUTHORISED_PERSON, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    } else {
      this.setApplication(companyId)
    }
  }

  async fetchApplication(id: string): Promise<void> {
    await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyFinancialStatementAuthorisedPerson(
        this.repository.companyFinancialStatementAuthorisedPerson
      )
      this.applicationId = this.application.id
      this.targetId = this.application.id

      this.financialPeriodId.value = this.application.financialPeriodId ?? ""
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
  }

  async setApplication(companyId: string): Promise<void> {
    await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyFinancialStatementAuthorisedPerson()
      this.application.companyId = companyId
      this.application.company = new Company(this.companyRepository.company)
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
  }

  async onSubmitClicked(): Promise<void> {
    if (this.dcrRef) {
      let updatedData = this.dcrRef.getApplication() ?? null
      this.application = new CompanyFinancialStatementAuthorisedPerson(updatedData)
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
    return this.language.isMalay()
      ? "Resolusi Pengarah bagi Melantik Orang Bertanggungjawab"
      : "DCR to Appoint Responsible Person"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Di bawah Akta Syarikat 2016, setiap syarikat mesti mengenal pasti seorang individu khusus untuk memikul tanggungjawab undang-undang ke atas angka-angka 
        kewangan. Resolusi Pengarah (DCR) ini secara rasmi melantik individu tersebut—biasanya Pengarah, Ketua Pegawai Kewangan (CFO), atau Pengurus Kewangan—
        sebagai pegawai yang "bertanggungjawab utama ke atas pengurusan kewangan" syarikat.
        <br><br>
        Pelantikan ini memberi kuasa kepada mereka untuk menandatangani Akuan Berkanun (Statutory Declaration), satu dokumen undang-undang wajib yang mengesahkan 
        bahawa akaun tersebut adalah betul dan benar. Tanpa resolusi ini, Akuan Berkanun tersebut tidak akan sah untuk diserahkan kepada SSM.
        <br><br>
        Walaupun seluruh Lembaga Pengarah mesti menyemak dan meluluskan penyata kewangan, adalah tidak praktikal untuk setiap pengarah menandatangani dokumen 
        akhir. Resolusi ini merekodkan kelulusan Lembaga dan secara rasmi memberi kuasa kepada pengarah tertentu untuk menandatangani Laporan Pengarah dan 
        Penyata oleh Pengarah bagi pihak seluruh Lembaga.
        <br><br>
        Tandatangan ini bertindak sebagai bukti kepada SSM, juruaudit, dan pemegang saham bahawa Lembaga telah bersetuju secara kolektif mengenai kedudukan 
        kewangan syarikat bagi tahun tersebut.
      `
    }

    return `
      Under the Companies Act 2016, every company must identify one specific individual to take legal ownership of the financial figures. This DCR 
      officially appoints this person—usually a Director, CFO, or Finance Manager—as the officer "primarily responsible for the financial management" 
      of the company.
      <br><br>
      This appointment authorizes them to sign the Statutory Declaration, a mandatory legal document confirming that the accounts are correct 
      and true. Without this resolution, the Statutory Declaration would not be valid for submission to SSM.
      <br><br>
      While the entire Board of Directors must review and approve the financial statements, it is not practical for every single director to 
      sign the final documents. This DCR records the Board's approval and formally authorizes specific director to sign the Directors' 
      Report and the Statement by Directors on behalf of the whole Board. 
      <br><br>
      These signatures act as proof to SSM, auditors, and shareholders that the Board has collectively agreed on the company's financial position 
      for that year.
    `
  }

  isDraft(): boolean {
    return this.application.signatureGroups.length <= 0
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyFinancialStatementAuthorisedPerson>(
      this.companyId,
      this.applicationId,
      this.application,
      this.isDraft(),
      "Draft",
      false,
      false,
      this.financialPeriodId.value
    )
  }
}
