import { CompanyDirectorResignation } from "~/scripts/models/CompanyDirectorResignation"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyDirectorResignationStore } from "~/stores/CompanyDirectorResignations"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"

export class ResignationOfDirectorController
  extends ServiceController
  implements IServiceController<CompanyDirectorResignation, ReturnType<typeof useCompanyDirectorResignationStore>>
{
  application: CompanyDirectorResignation = new CompanyDirectorResignation()
  applicationId: string | null = null
  repository = useCompanyDirectorResignationStore()
  companyRepository = useCompanyStore()

  noticeRef: any | null = null

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_DIRECTOR_RESIGNATION, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    } else {
      this.setApplication(this.companyId)
    }
  }

  setNoticeRef(noticeRef: any): void {
    this.noticeRef = noticeRef
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyDirectorResignation(response)
      this.applicationId = this.application.id
      this.targetId = this.application.id
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyDirectorResignation()
      this.application.companyId = companyId
      this.application.company = new Company(response)
      this.application.directorId = this.directorId.value ?? "" //Set it to the current director
    }
  }

  async onSubmitClicked(): Promise<void> {
    try {
      if (this.noticeRef) {
        let updatedData = this.noticeRef.getData()
        this.application = new CompanyDirectorResignation(updatedData)
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
    return this.language.isMalay() ? `Perletakan Jawatan Pengarah` : "Resignation of Director"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Seorang Pengarah boleh meletakkan jawatan daripada Lembaga Pengarah dengan memberikan notis bertulis 
        kepada Syarikat. Peletakan jawatan tersebut berkuat kuasa sebaik sahaja dimaklumkan dan diserah simpan 
        di SSM.
        <br><br>
        Jika Pengarah mempunyai liabiliti atau tanggungjawab dan kewajipan tertunggak, Syarikat mungkin perlu 
        menyelesaikannya sebelum peletakan jawatan boleh diterima.
        <br><br>
        Peletakan jawatan tidak melepaskan tanggungjawab dan kewajipan terdahulu anda.
      `
    }

    return `
      A Director may step down from the Board by giving written notice to the Company. The resignation takes 
      effect once notified and lodged with SSM.
      <br><br>
      If the Director has outstanding liabilities or obligations, the Company may need to resolve these before 
      the resignation can be accepted.
      <br><br>
      Resignation does not absolve your prior obligations.
    `
  }
}
