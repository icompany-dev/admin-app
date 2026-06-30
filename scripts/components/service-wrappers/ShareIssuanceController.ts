import { CompanyShareIssuance } from "~/scripts/models/CompanyShareIssuance"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { useCompanyShareIssuanceStore } from "#imports"
import { useCompanyStore } from "#imports"
import { CompanyConstants } from "~/scripts/constants/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { User } from "~/scripts/models/User"
import type { CompanyShareIssuanceResponse } from "~/scripts/models/CompanyShareIssuanceResponse"
import { SignatureGroup, SignatureGroupGroup, SignatureGroupTarget } from "~/scripts/models/SignatureGroup"

export class ShareIssuanceController
  extends ServiceController
  implements IServiceController<CompanyShareIssuance, ReturnType<typeof useCompanyShareIssuanceStore>>
{
  application: CompanyShareIssuance = new CompanyShareIssuance()
  applicationId: string | null = null
  repository = useCompanyShareIssuanceStore()
  companyRepository = useCompanyStore()

  canSubmit = ref<boolean>(true)
  canRemove = ref<boolean>(false)

  preferenceSharePopupRef: any | null = null

  eventManager = useEventManagerStore()

  directorSignatureFile = ref<string | null>(null)
  initiatorSignatureFile = ref<string | null>(null)
  shareholderSignatureFile = ref<string | null>(null)

  hasJustResponded: Ref<boolean> = ref<boolean>(false)

  currentUser = ref<User>(new User())

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_ALLOTMENT, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }

    this.setCurrentUser()
  }

  async setCurrentUser(): Promise<void> {
    this.currentUser.value = await CurrentUser.get()
  }

  setPreferenceSharePopupRef(preferenceSharePopupRef: any): void {
    this.preferenceSharePopupRef = preferenceSharePopupRef
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyShareIssuance(response)
      this.applicationId = this.application.id
      this.targetId = this.application.id
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyShareIssuance()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.id)
  }

  hasResponded(): boolean {
    if (!this.isAShareholder.value) {
      return true // set to true to skip checking
    }

    if (this.hasJustResponded.value) {
      return true
    }

    return this.application.responses.some((response: CompanyShareIssuanceResponse) => {
      return response.responseFile !== null
    })
  }

  async onResponded(): Promise<void> {
    this.hasJustResponded.value = true

    if (this.isADirector.value) {
      let hasPreviouslySigned = this.application.signatureGroups.some((sg: SignatureGroup) => {
        if (!sg.group) {
          return false
        }

        return sg.group.target === "director" && sg.group.id === this.directorId.value
      })

      if (!hasPreviouslySigned && StringUtil.isNullOrEmpty(this.signatureFile.value)) {
        return
      }

      await this.onSubmitClicked()
      return
    }

    this.emitEvents("applicationUpdated", this.application)
  }

  override async onSigned(signatureData: string): Promise<void> {
    this.signatureFile.value = signatureData

    if (!this.hasResponded()) {
      return
    }

    await this.onSubmitClicked()
  }

  async onSubmitClicked(): Promise<void> {
    if (this.dcrRef) {
      let updatedData = this.dcrRef.getApplication() ?? null
      this.application = new CompanyShareIssuance(updatedData)
    }

    try {
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

  showWatermark(): boolean {
    if (this.isInPreviewMode.value) {
      return true
    }

    return this.application.signatureGroups.length <= 0
  }

  hasConstitution(): boolean {
    if (!this.application || !this.application.company) {
      return false
    }

    return this.application.company.hasConstitution
  }

  async onPreferenceShareSelected(): Promise<void> {
    if (!this.preferenceSharePopupRef) {
      this.eventManager.setIsAllotingPreferenceShare(false)
      return
    }

    let preferenceShareRightRepository = useCompanyPreferenceShareRightStore()
    let response = await preferenceShareRightRepository.latestCompleted(this.companyId)
    if (preferenceShareRightRepository.error !== null) {
      return
    }

    if (response !== null) {
      this.eventManager.setIsAllotingPreferenceShare(false)
      return
    }

    this.emitEvents("back")
    this.preferenceSharePopupRef.show()
  }

  onGoToConstitution(): void {
    this.eventManager.setIsAllotingPreferenceShare(true)
    let router = useRouter()
    router.push(`/sdnbhd/${this.companyId}/constitution?do=preference-share`)
  }

  onCancelPreferenceShares(): void {
    this.eventManager.setIsAllotingPreferenceShare(false)
    this.emitEvents("cancelPreferenceShares")
  }

  watermarkText(): string {
    if (!this.application) {
      return ""
    }

    if (this.isInPreviewMode.value) {
      return "PREVIEW"
    }

    if (this.application.signatureGroups.length <= 0) {
      return "DRAFT"
    }

    return ""
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Cadang Peruntukkan Saham" : "Propose Allotment of Share"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Resolusi Cadangan Umpukan adalah langkah wajib yang pertama. Resolusi ini belum menerbitkan sebarang saham — ia 
        sekadar memberi kuasa kepada Syarikat untuk memulakan proses dengan mengesahkan bahawa Lembaga Pengarah berhasrat 
        untuk mewujudkan saham baharu dan ingin meneruskan langkah-langkah pematuhan yang diperlukan. Ini adalah kelulusan 
        dalaman yang membolehkan Setiausaha Syarikat menyediakan dan mengedarkan Notis Hak Pradip kepada semua pemegang 
        saham sedia ada.
        <br><br>
        Dengan meluluskan cadangan ini, Lembaga Pengarah memperakui bahawa sebarang umpukan pada masa hadapan mestilah 
        mematuhi Seksyen 85 Akta. Oleh itu, Para Pengarah bersetuju untuk memulakan proses pra-umpukan, yang merangkumi 
        penawaran saham baharu secara berkadar kepada pemegang saham sedia ada dan menunggu maklum balas mereka. Hanya setelah 
        cadangan ini diluluskan, barulah Syarikat boleh beralih ke peringkat seterusnya dalam proses umpukan tersebut.
      `
    }

    return `
      The Resolution to Propose the Allotment is the first mandatory step. This resolution does not issue any shares yet — 
      it simply authorises the Company to begin the process by confirming that the Board intends to create new shares and 
      wishes to proceed with the required compliance steps. It is an internal approval that allows the Company Secretary to 
      prepare and circulate the Notice of Pre-Emptive Rights to all existing shareholders.
      <br><br>
      By passing this proposal, the Board acknowledges that any future allotment must comply with Section 85 of the Act. 
      The Directors are therefore agreeing to initiate the pre-allotment sequence, which includes offering the new shares 
      proportionately to existing shareholders and waiting for their responses. Only after this proposal is approved can the 
      Company move to the next stage of the allotment process.

    `
  }
}
