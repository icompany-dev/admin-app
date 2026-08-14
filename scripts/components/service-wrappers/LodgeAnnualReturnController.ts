import { CompanyAnnualReturnRequest } from "~/scripts/models/CompanyAnnualReturnRequest"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { useCompanyAnnualReturnRequestStore } from "#imports"
import { useCompanyStore } from "#imports"
import { CompanyConstants } from "~/scripts/constants/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { StatusConstants } from "~/scripts/constants/Status"

export class LodgeAnnualReturnController
  extends ServiceController
  implements IServiceController<CompanyAnnualReturnRequest, ReturnType<typeof useCompanyAnnualReturnRequestStore>>
{
  application: CompanyAnnualReturnRequest = new CompanyAnnualReturnRequest()
  applicationId: string | null = null
  repository = useCompanyAnnualReturnRequestStore()
  companyRepository = useCompanyStore()

  popupAnnualReturnLodgementRef: any | null = null
  yearToLodge: Ref<string> = ref<string>("")

  canSubmit = ref<boolean>(true)
  canRemove = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_LODGE_ANNUAL_RETURN, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyAnnualReturnRequest(response)
      this.applicationId = this.application.id
      this.targetId = this.application.id
      this.yearToLodge.value = this.application.year
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
    this.hasPaid.value =
      this.application.status !== StatusConstants.DRAFT && this.application.status !== StatusConstants.PENDING
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyAnnualReturnRequest()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
  }

  setPopupAnnualReturnLodgementRef(popupAnnualReturnLodgementRef: any | null) {
    this.popupAnnualReturnLodgementRef = popupAnnualReturnLodgementRef
  }

  async onSubmitClicked(): Promise<void> {
    try {
      if (this.dcrRef) {
        let updatedData = this.dcrRef.getApplication()
        this.application = new CompanyAnnualReturnRequest(updatedData)
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

  onAbstained(): void {
    this.popupAnnualReturnLodgementRef.show()
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
      ? "Resolusi Pengarah bagi Serah Simpan Penyata Tahunan"
      : "DCR to Lodge Annual Return"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Serah simpan wajib di bawah Seksyen 68 Akta Syarikat 2016. Setiap Sdn Bhd mesti menyerah simpan Penyata Tahunan dalam tempoh 30 hari dari ulang tahun pemerbadanan 
        setiap tahun. Ia mengandungi butir-butir syarikat terkini seperti alamat perniagaan, pengarah, pemegang saham, dan struktur saham.
        <br><br>
        Anggaplah ini sebagai ‘yuran langganan’ yang perlu dibayar kepada SSM secara tahunan.
      `
    }

    return `
      A mandatory filing under Section 68 of the Companies Act 2016. Every Sdn Bhd must lodge its Annual Return within 30 days from its incorporation anniversary each year. 
      It contains updated company particulars such as business address, directors, shareholders, and share structure.
      <br><br>
      Consider this as ‘subscription fees’ to be paid to SSM on a yearly basis.
    `
  }
}
