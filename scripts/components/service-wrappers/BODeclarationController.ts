import { CompanyBODeclaration } from "~/scripts/models/CompanyBODeclaration"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyBODeclarationStore } from "~/stores/CompanyBODeclarations"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"

export class BODeclarationController
  extends ServiceController
  implements IServiceController<CompanyBODeclaration, ReturnType<typeof useCompanyBODeclarationStore>>
{
  application: CompanyBODeclaration = new CompanyBODeclaration()
  applicationId: string | null = null
  repository = useCompanyBODeclarationStore()
  companyRepository = useCompanyStore()

  noticeRef: any | null = null

  nonBOEmailAddress: Ref<string> = ref<string>("")
  nonBOPhone: Ref<string> = ref<string>("")

  isShowCompletedDisclosure: Ref<boolean> = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_BO_DECLARATION, companyId, emitEvents)

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
      this.application = new CompanyBODeclaration(response)
      this.applicationId = this.application.id
      this.targetId = this.application.id
      this.shareholderId.value = this.application.shareholderId

      this.isShowCompletedDisclosure.value = !StringUtil.isNullOrEmpty(this.application.signatureFileId)
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyBODeclaration()
      this.application.companyId = companyId
      this.application.company = new Company(response)
      this.application.shareholderId = this.shareholderId.value ?? "" //Set it to the current shareholder
    }
  }

  getShareholderId(): string {
    if (!StringUtil.isNullOrEmpty(this.application.id)) {
      return this.application.shareholderId
    }

    return this.shareholderId.value ?? ""
  }

  async onSubmitClicked(): Promise<void> {
    try {
      if (this.dcrRef) {
        let updatedData = this.dcrRef.getApplicationData()
        this.application = new CompanyBODeclaration(updatedData)
        this.application.id = this.applicationId ?? ""
      }

      this.emitEvents("back", this.application)

      if (this.isAShareholder.value) {
        await this.submitSignature()
      }

      await this.onUpdate()

      this.emitEvents("applicationUpdated", this.application)
    } catch (error: any) {
      console.error(error)
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForCUD()
        errorMessage.handle()
      }
    }
  }

  override async submitSignature(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.signatureFile.value)) {
      return
    }

    let dayjs = useDayjs()
    let signatureDate = this.time.formatDateOnlySystem(dayjs().format("YYYY-MM-DD"))
    let signatureGroup = new SignatureGroup()
    let signatureFile = await signatureGroup.uploadSignatureFile(
      this.signatureFile.value ?? "",
      useFileStore(),
      signatureDate
    )

    this.application.signatureFile = signatureFile
    this.application.signatureFileId = signatureFile.id
  }

  async onCreate(): Promise<void> {
    await this.application.create(this.repository)
    this.applicationId = this.application.id
    this.targetId = this.application.id
  }

  async onUpdate(): Promise<void> {
    await this.application.update(this.repository)

    if (!this.application.isBeneficialOwner) {
      let newExternalBODeclaration = new CompanyBODeclaration()
      newExternalBODeclaration.companyId = this.companyId
      newExternalBODeclaration.shareholderId = ""
      newExternalBODeclaration.emailAddress = this.nonBOEmailAddress.value
      newExternalBODeclaration.phone = this.nonBOPhone.value

      await newExternalBODeclaration.create(this.repository)
    }
  }

  onUpdateNonBO(data: any): void {
    this.nonBOEmailAddress.value = data.email
    this.nonBOPhone.value = data.phone

    this.emitEvents("updateNonBO")
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
