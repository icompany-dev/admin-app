import { CompanyNoConstitutionDeclaration } from "~/scripts/models/CompanyNoConstitutionDeclaration"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { useCompanyNoConstitutionDeclarationStore } from "#imports"
import { useCompanyStore } from "#imports"
import { CompanyConstants } from "~/scripts/constants/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"

export class NoConstitutionController
  extends ServiceController
  implements
    IServiceController<CompanyNoConstitutionDeclaration, ReturnType<typeof useCompanyNoConstitutionDeclarationStore>>
{
  application: CompanyNoConstitutionDeclaration = new CompanyNoConstitutionDeclaration()
  applicationId: string | null = null
  repository = useCompanyNoConstitutionDeclarationStore()
  companyRepository = useCompanyStore()

  canSubmit = ref<boolean>(true)
  canRemove = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_NO_CONSTITUTION, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyNoConstitutionDeclaration(response)
      this.applicationId = this.application.id
      this.targetId = this.application.id
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyNoConstitutionDeclaration()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
  }

  async onSubmitClicked(): Promise<void> {
    if (this.dcrRef) {
      let updatedData = this.dcrRef.getApplication() ?? null
      this.application = new CompanyNoConstitutionDeclaration(updatedData)
    }

    try {
      if (StringUtil.isNullOrEmpty(this.applicationId)) {
        await this.onCreate()
      } else {
        await this.onUpdate()
      }

      if (this.isADirector.value) {
        await this.submitSignature()
      }

      if (!this.hasPaid.value) {
        await this.pay()
      }

      this.emitEvents("back")
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
    return this.language.isMalay() ? "Pengisytiharan Tiada Perlembagaan" : "Declaration of No Constitution"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Pengisytiharan ini mengesahkan bahawa Syarikat tidak menerima pakai sebarang Perlembagaan dan oleh itu, 
        ia tertakluk kepada Jadual Ketiga Akta Syarikat 2016 sebagai peraturan dalaman asasnya.
        <br><br>
        Dengan ketiadaan Perlembagaan, segala hak, kuasa, tugas, dan obligasi Syarikat, Pengarah, dan Anggota 
        adalah terpakai sepenuhnya selaras dengan Akta tersebut serta Jadual Ketiga.
        <br><br>
        Pengisytiharan ini lazimnya diperlukan oleh Maybank bagi tujuan pembukaan akaun dengan mereka.
      `
    }

    return `
      This declaration confirms that the Company has not adopted a Constitution and is therefore governed by the 
      Third Schedule of the Companies Act 2016 as its default internal rules.
      <br><br>
      In the absence of a Constitution, the rights, powers, duties, and obligations of the Company, Directors, 
      and Members apply strictly in accordance with the Act and the Third Schedule.
      <br><br>
      This declaration is commonly asked by Maybank to Open an Account with them.
    `
  }
}
