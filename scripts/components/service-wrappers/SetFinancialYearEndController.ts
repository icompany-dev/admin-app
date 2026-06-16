import { CompanySetFinancialYearEnd } from "~/scripts/models/CompanySetFinancialYearEnd"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { useCompanySetFinancialYearEndStore } from "#imports"
import { useCompanyStore } from "#imports"
import { CompanyConstants } from "~/scripts/constants/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"

export class SetFinancialYearEndController
  extends ServiceController
  implements IServiceController<CompanySetFinancialYearEnd, ReturnType<typeof useCompanySetFinancialYearEndStore>>
{
  application: CompanySetFinancialYearEnd = new CompanySetFinancialYearEnd()
  applicationId: string | null = null
  repository = useCompanySetFinancialYearEndStore()
  companyRepository = useCompanyStore()

  canSubmit = ref<boolean>(true)
  canRemove = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_SET_FINANCIAL_YEAR_END, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanySetFinancialYearEnd(response)
      this.applicationId = this.application.id
      this.targetId = this.application.id
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanySetFinancialYearEnd()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
  }

  async onSubmitClicked(): Promise<void> {
    if (this.dcrRef) {
      let updatedData = this.dcrRef.getApplication() ?? null
      this.application = new CompanySetFinancialYearEnd(updatedData)
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
      ? "Resolusi Pengarah bagi Menetapkan Tarikh Akhir Tahun Kewangan"
      : "DCR to Set Financial Year End"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Tarikh Akhir Tahun Kewangan anda menandakan tarikh penutupan akaun syarikat anda dan menetapkan garis masa untuk pemfailan audit, cukai, dan SSM.
        <br><br>
        Tarikh tersebut mesti ditetapkan dalam tempoh 18 bulan dari tarikh pemerbadanan dan dikekalkan konsisten setiap tahun melainkan diubah melalui resolusi.
        <br><br>
        Para Pengarah bertanggungjawab untuk memastikan semua penyata kewangan disediakan dan dihantar/didaftar dalam tempoh masa yang ditetapkan.
        <br><br>
        Permohonan ini adalah keperluan oleh SSM dan adalah mandatori apabila tiba masanya, walaupun syarikat Sdn Bhd anda tidak aktif atau tiada Akaun Bank.
        <br>
        Tarikh Akhir Tahun Kewangan mesti ditetapkan terlebih dahulu sebelum sebarang penyata kewangan disediakan.
      `
    }

    return `
      Your Financial Year End marks the closing date of your company's accounts and sets the timeline for audit, tax, and SSM filings.
      <br><br>
      It must be fixed within 18 months from incorporation and remain consistent each year unless changed by resolution.
      <br><br>
      Directors are responsible for ensuring all financial statements are prepared and lodged within the prescribed timeframe.
      <br><br>
      This Application is required by SSM and is mandatory when it is due even if your Sdn Bhd is not active or without a Bank Account.
      <br>
      A Financial Year End must be set first before any financial statement is prepared.
    `
  }
}
