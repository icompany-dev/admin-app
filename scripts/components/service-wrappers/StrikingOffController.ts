import { CompanyStrikingOffResolution } from "~/scripts/models/CompanyStrikingOffResolution"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { CompanyStrikingOffRequirement } from "~/scripts/models/CompanyStrikingOffRequirement"
import { CompanyStrikingOffChecklist } from "~/scripts/models/CompanyStrikingOffChecklist"
import { CompanyStrikingOffApplication } from "~/scripts/models/CompanyStrikingOffApplication"
import { User } from "~/scripts/models/User"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { SignatureGroup, SignatureGroupGroup, SignatureGroupTarget } from "~/scripts/models/SignatureGroup"
import { ActivityLogger } from "~/scripts/library/ActivityLogger"
import { CompanyStrikingOffRegistrarLetter } from "~/scripts/models/CompanyStrikingOffRegistrarLetter"

export class StrikingOffController
  extends ServiceController
  implements IServiceController<CompanyStrikingOffResolution, ReturnType<typeof useCompanyStrikingOffResolutionStore>>
{
  application: CompanyStrikingOffResolution = new CompanyStrikingOffResolution()
  applicationId: string | null = null
  repository = useCompanyStrikingOffResolutionStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  section550Ref: any | null = null
  checklistRef: any | null = null
  clearanceLetterRef: any | null = null
  supportingLetterRef: any | null = null

  supportingLetterSignatureFile = ref<string | null>(null)
  strikingOffRequirement = ref<CompanyStrikingOffRequirement>(new CompanyStrikingOffRequirement())

  clearanceLetterSignatureFile = ref<string | null>(null)

  checklistSignatureFile = ref<string | null>(null)
  strikingOffChecklist = ref<CompanyStrikingOffChecklist>(new CompanyStrikingOffChecklist())

  section550SignatureFile = ref<string | null>(null)
  strikingOffApplication = ref<CompanyStrikingOffApplication>(new CompanyStrikingOffApplication())

  currentUser = ref<User>(new User())

  hasConfirmedSignedAll = ref<boolean>(false)
  isSignAll = ref<boolean>(false)

  signAllPopupRef: any | null = null

  latestSignatureFile = ref<string | null>(null)

  dcrSignatureFile = ref<string | null>(null)
  mcrSignatureFile = ref<string | null>(null)

  eventManager = useEventManagerStore()

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_STRIKING_OFF_RESOLUTION, companyId, emitEvents)

    this.init()

    this.setApplicationId(applicationId ?? "")
  }

  async init(): Promise<void> {
    this.currentUser.value = await CurrentUser.get()
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.applicationId = applicationId

    if (StringUtil.isNullOrEmpty(applicationId)) {
      return
    }

    await this.fetchApplication(applicationId)
  }

  setSection550Ref(section550Ref: any): void {
    this.section550Ref = section550Ref
  }

  setChecklistRef(checklistRef: any): void {
    this.checklistRef = checklistRef
  }

  setClearanceLetterRef(clearanceLetterRef: any): void {
    this.clearanceLetterRef = clearanceLetterRef
  }

  setSupportingLetterRef(supportingLetterRef: any): void {
    this.supportingLetterRef = supportingLetterRef
  }

  setSignAllPopupRef(signAllPopupRef: any): void {
    this.signAllPopupRef = signAllPopupRef
  }

  onScrollToDocumentName(): void {
    if (!this.eventManager.documentToView) {
      return
    }

    const docName = this.eventManager.documentToView
    const refName = `${docName}Ref`
    const targetComponent = (this as any)[refName]

    if (!targetComponent) {
      return
    }

    const element = targetComponent.$el || targetComponent

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    })
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyStrikingOffResolution(response)
      this.applicationId = this.application.id
      this.targetId = this.application.id
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyStrikingOffResolution()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  onSupportingLetterSigned(signatureFile: string): void {
    this.supportingLetterSignatureFile.value = signatureFile

    if (this.supportingLetterRef) {
      let data = this.supportingLetterRef.getApplicationData()
      this.strikingOffRequirement.value = new CompanyStrikingOffRequirement(data)
    }

    this.handleOnSigned(signatureFile)
  }

  onClearanceLetterSigned(signatureFile: string): void {
    this.clearanceLetterSignatureFile.value = signatureFile

    this.handleOnSigned(signatureFile)
  }

  onChecklistSigned(signatureFile: string): void {
    this.checklistSignatureFile.value = signatureFile

    if (this.checklistRef) {
      let data = this.checklistRef.getApplicationData()
      this.application.checklist = new CompanyStrikingOffChecklist(data)
    }

    this.handleOnSigned(signatureFile)
  }

  onSection550Signed(signatureFile: string): void {
    this.section550SignatureFile.value = signatureFile

    if (this.section550Ref) {
      let data = this.section550Ref.getApplicationData()
      this.application.application = new CompanyStrikingOffApplication(data)
    }

    this.handleOnSigned(signatureFile)
  }

  onMcrSigned(signatureFile: string): void {
    this.mcrSignatureFile.value = signatureFile

    this.handleOnSigned(signatureFile)
  }

  onDcrSigned(signatureFile: string): void {
    this.dcrSignatureFile.value = signatureFile

    this.handleOnSigned(signatureFile)
  }

  override async onSigned(signatureFile: string): Promise<void> {
    // do nothing
  }

  handleOnSigned(signatureFile: string): void {
    // check if we can hide
    if (this.signAllPopupRef && !this.hasConfirmedSignedAll.value) {
      this.latestSignatureFile.value = signatureFile
      this.signAllPopupRef.show()
      this.hasConfirmedSignedAll.value = true
      return
    }

    this.handleSignSubmit()
  }

  onSignAll(): void {
    this.isSignAll.value = true
    if (this.isApplicant()) {
      this.supportingLetterSignatureFile.value = this.latestSignatureFile.value
      this.clearanceLetterSignatureFile.value = this.latestSignatureFile.value
      this.checklistSignatureFile.value = this.latestSignatureFile.value
      this.section550SignatureFile.value = this.latestSignatureFile.value
    }

    this.signatureFile.value = this.latestSignatureFile.value
    if (this.isADirector.value) {
      this.dcrSignatureFile.value = this.latestSignatureFile.value
    }

    if (this.isAShareholder.value) {
      this.mcrSignatureFile.value = this.latestSignatureFile.value
    }

    this.handleSignSubmit()
  }

  async handleSignSubmit(): Promise<void> {
    if (!this.isSignAll.value && this.isApplicant()) {
      if (
        StringUtil.isNullOrEmpty(this.supportingLetterSignatureFile.value) ||
        StringUtil.isNullOrEmpty(this.clearanceLetterSignatureFile.value) ||
        StringUtil.isNullOrEmpty(this.checklistSignatureFile.value) ||
        StringUtil.isNullOrEmpty(this.section550SignatureFile.value)
      ) {
        return
      }
    }

    if (this.isADirector.value && StringUtil.isNullOrEmpty(this.dcrSignatureFile.value)) {
      return
    }

    if (this.isAShareholder.value && StringUtil.isNullOrEmpty(this.mcrSignatureFile.value)) {
      return
    }

    await this.onSubmitClicked()
  }

  isApplicant(): boolean {
    return this.application.applicant.id === this.currentUser.value.id
  }

  async submitSupportingLetterSignature(): Promise<void> {
    if (
      StringUtil.isNullOrEmpty(this.supportingLetterSignatureFile.value) ||
      this.supportingLetterSignatureFile.value === null
    ) {
      return
    }

    let signatureGroup = new SignatureGroup()
    let signatureDate = this.time.currentDataTimeForSignature()

    let uploadedFile = await signatureGroup.uploadSignatureFile(
      this.supportingLetterSignatureFile.value ?? "",
      useFileStore(),
      signatureDate
    )

    if (!this.application.registrarLetter) {
      this.application.registrarLetter = new CompanyStrikingOffRegistrarLetter()
    }

    this.application.registrarLetter.signatureId = uploadedFile.id
  }

  async submitChecklistSignature(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.checklistSignatureFile.value) || this.checklistSignatureFile.value === null) {
      return
    }

    let signatureGroup = new SignatureGroup()
    let signatureDate = this.time.currentDataTimeForSignature()

    let uploadedFile = await signatureGroup.uploadSignatureFile(
      this.checklistSignatureFile.value ?? "",
      useFileStore(),
      signatureDate
    )

    if (!this.application.checklist) {
      this.application.checklist = new CompanyStrikingOffChecklist()
    }

    this.application.checklist.signatureId = uploadedFile.id
    this.application.checklist.hasDeclarationByApplicant = true
  }

  async submitApplicationSignature(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.section550SignatureFile.value) || this.section550SignatureFile.value === null) {
      return
    }

    let signatureGroup = new SignatureGroup()
    let signatureDate = this.time.currentDataTimeForSignature()

    let uploadedFile = await signatureGroup.uploadSignatureFile(
      this.section550SignatureFile.value ?? "",
      useFileStore(),
      signatureDate
    )

    if (!this.application.application) {
      this.application.application = new CompanyStrikingOffApplication()
    }
    this.application.application.signatureId = uploadedFile.id
  }

  override async submitSignature(): Promise<void> {
    let signaturePromises = [
      this.submitChecklistSignature(),
      this.submitApplicationSignature(),
      this.submitSupportingLetterSignature(),
    ]

    let activityLogger = new ActivityLogger()
    await activityLogger.init()
    let role =
      this.isADirector && this.isAShareholder ? "Director & Shareholder" : this.isADirector ? "Director" : "Shareholder"

    if (!this.isADirector && !this.isAShareholder) {
      role = "Applicant"
    }

    let signatureDate = this.time.currentDataTimeForSignature()

    if (this.isADirector.value) {
      if (!this.existingSignatureAsDirector.value) {
        let newSignatureGroup = new SignatureGroup()
        newSignatureGroup.target = new SignatureGroupTarget(this.targetId ?? "", this.target)
        newSignatureGroup.group = new SignatureGroupGroup(this.directorId.value ?? "", "director")
        signaturePromises.push(
          newSignatureGroup.create(
            this.signatureFile.value ?? "",
            this.fileRepository,
            this.signatureRepository,
            signatureDate
          )
        )
      }
    }

    if (this.isAShareholder.value) {
      if (!this.existingSignatureAsShareholder.value) {
        let newSignatureGroup = new SignatureGroup()
        newSignatureGroup.target = new SignatureGroupTarget(this.targetId ?? "", this.target)
        newSignatureGroup.group = new SignatureGroupGroup(this.shareholderId.value ?? "", "shareholder")
        signaturePromises.push(
          newSignatureGroup.update(
            this.signatureFile.value ?? "",
            this.fileRepository,
            this.signatureRepository,
            signatureDate
          )
        )
      }
    }

    await Promise.all(signaturePromises)
      .then(() => {
        activityLogger.addSignLog(this.companyId, role, this.target, this.targetId ?? "", "success")
      })
      .catch(() => {
        activityLogger.addSignLog(this.companyId, role, this.target, this.targetId ?? "", "failed")
      })
  }

  async onSubmitClicked(): Promise<void> {
    try {
      this.emitEvents("back", this.application)
      await this.submitSignature()
      await this.onUpdate()

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
    let promises = []

    if (!this.application.application || StringUtil.isNullOrEmpty(this.application.application.id)) {
      if (!this.application.application) {
        this.application.application = new CompanyStrikingOffApplication()
      }

      this.application.application.strikingOffId = this.application.id
      this.application.application.applicantId = this.application.applicant.id
      promises.push(this.application.application.create(useCompanyStrikingOffApplicationStore()))
    } else {
      promises.push(this.application.application.update(useCompanyStrikingOffApplicationStore()))
    }

    if (!this.application.registrarLetter || StringUtil.isNullOrEmpty(this.application.registrarLetter.id)) {
      if (!this.application.registrarLetter) {
        this.application.registrarLetter = new CompanyStrikingOffRegistrarLetter()
      }

      this.application.registrarLetter.strikingOffId = this.application.id
      this.application.registrarLetter.applicantId = this.application.applicant.id
      promises.push(this.application.registrarLetter.create(useCompanyStrikingOffRegistrarLetterStore()))
    } else {
      promises.push(this.application.registrarLetter.update(useCompanyStrikingOffRegistrarLetterStore()))
    }

    if (!this.application.checklist || StringUtil.isNullOrEmpty(this.application.checklist.id)) {
      if (!this.application.checklist) {
        this.application.checklist = new CompanyStrikingOffChecklist()
      }

      this.application.checklist.strikingOffId = this.application.id
      this.application.checklist.applicantId = this.application.applicant.id
      promises.push(this.application.checklist.create(useCompanyStrikingOffChecklistStore()))
    } else {
      promises.push(this.application.checklist.update(useCompanyStrikingOffChecklistStore()))
    }

    promises.push(this.application.update(this.repository))

    await Promise.all(promises)
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
      ? `Resolusi Pengarah untuk Meluluskan/Menangguhkan/Menolak Pendaftaran Pemindahan Saham`
      : "DCR to Approve/Delay/Refuse Registration of Transfer of Shares"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Resolusi ini adalah dokumen bertulis rasmi yang digunakan oleh Lembaga Pengarah untuk merekodkan 
        keputusan mereka secara formal bagi meluluskan, menangguhkan, atau menolak pindah milik saham. 
        Bagi meluluskan pindah milik, Pengarah menandatangani dokumen ini sebagai kebenaran kepada Setiausaha 
        Syarikat untuk mengemas kini Daftar Ahli dan mengeluarkan sijil saham baharu kepada pemilik baharu.
        <br><br>
        Sekiranya Pengarah memutuskan untuk menangguhkan atau menolak pendaftaran tersebut (biasanya kerana 
        pemegang saham masih berhutang ke atas saham tersebut atau Perlembagaan Syarikat melarang pindah 
        milik berkenaan), Resolusi ini mestilah diluluskan dalam tempoh <b>30 hari</b> selepas menerima 
        permohonan pindah milik. Apa yang penting, dokumen ini mestilah menyatakan dengan jelas sebab-sebab 
        khusus penolakan tersebut, dan syarikat kemudiannya mesti memaklumkan sebab-sebab ini kepada pembeli 
        dan penjual dalam tempoh <b>7 hari</b> selepas resolusi diluluskan.
      `
    }

    return `
      This Resolution is the official written document used by the Board of Directors to formally 
      record their decision to approve, delay, or refuse a share transfer. To say "yes" to a transfer, 
      the Directors sign this document to authorize the company secretary to update the Register 
      of Members and issue a new share certificate to the new owner.
      <br><br>
      If the Directors decide to delay or refuse the registration (usually because the shareholder 
      owes money on the shares or the Company Constitution forbids the transfer), this DCR must be 
      passed within <b>30 days</b> of receiving the transfer application. Crucially, this document must 
      clearly state the specific reasons for the refusal, and the company must then notify the buyer 
      and seller of these reasons within <b>7 days</b> of the resolution being passed.
    `
  }

  showWatermark(): boolean {
    return this.application.signatureGroups.length <= 0
  }

  watermarkText(): string {
    if (!this.showWatermark()) {
      return ""
    }

    return this.isInPreviewMode.value ? "PREVIEW" : "DRAFT"
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyStrikingOffResolution>(
      this.companyId,
      this.applicationId,
      this.application,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
