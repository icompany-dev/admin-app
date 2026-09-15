import { Director } from "~/scripts/models/Director"
import { ServiceController } from "./ServiceController"
import type { IServiceController } from "./IServiceController"
import { CompanyConstants } from "~/scripts/constants/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { Company } from "~/scripts/models/Company"
import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import { ApplicationSwitch } from "~/scripts/models/ApplicationSwitch"
import { User } from "~/scripts/models/User"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { ObjectUtil } from "~/scripts/utils/Object"

export class Section201ForDirectorController
  extends ServiceController
  implements IServiceController<Director, ReturnType<typeof useDirectorStore>>
{
  application: Ref<Director> = ref<Director>(new Director())
  applicationId: string = ""
  signatureGroup = ref<SignatureGroup>(new SignatureGroup())

  repository = useDirectorStore()
  companyRepository = useCompanyStore()

  name: Ref<string> = ref<string>("")
  registrationNumber: Ref<string> = ref<string>("")

  user = ref<User>(new User())
  directorUser = ref<User>(new User())
  signatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", false))

  declarationRef: any | null = null

  constructor(applicationId: string, emitEvents: any | null = null) {
    super(CompanyConstants.TARGET_DIRECTOR_INVITATION, "", emitEvents)

    this.init()
    this.setApplicationId(applicationId)
  }

  async init(): Promise<void> {
    this.user.value = await CurrentUser.get()
  }

  setDeclarationRef(declarationRef: any): void {
    this.declarationRef = declarationRef
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.applicationId = applicationId
    try {
      await this.fetchDirector()
      this.setSignatureItem()
    } catch (e) {
      // do nothing for now
    }
  }

  async fetchDirector(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId)) {
      return
    }

    try {
      let response = await this.repository.fetch(this.applicationId)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      this.application.value = new Director(response)

      await this.application.value.setCompany(useCompanyStore())
      await this.fetchFirstSignature()

      this.name.value = this.application.value.company?.getFullName() ?? ""
      this.registrationNumber.value = `${this.application.value.company?.registrationNumberNew} (${this.application.value.company?.registrationNumberOld})`
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    }
  }

  async fetchFirstSignature(): Promise<void> {
    this.signatureGroup.value = new SignatureGroup()

    if (this.application.value.companyId === null) {
      return
    }

    let repository = useSignatureStore()
    let response = await repository.fetchByGroup(this.application.value.companyId, "director")
    if (!response) {
      return
    }

    let signatureGroups = response
      .map((d: any) => {
        return new SignatureGroup(d)
      })
      .filter((sg: SignatureGroup) => {
        return sg.group?.id === this.application.value.id
      })

    if (signatureGroups.length <= 0) {
      return
    }

    let orderedSignatureGroups = ObjectUtil.sort<SignatureGroup>(signatureGroups, "createdAt", "asc")

    this.signatureGroup.value = new SignatureGroup(orderedSignatureGroups[0])
  }

  setSignatureItem(): void {
    this.signatureItem.value = new SignatureItem(
      this.signatureGroup.value.signature?.url ?? null,
      this.signatureGroup.value.signature !== null,
      false,
      false,
      this.application.value.user?.name ?? "",
      this.application.value.user?.email ?? "",
      "",
      false
    )
  }

  async onSubmitClicked(): Promise<void> {
    // if (StringUtil.isNullOrEmpty(this.signatureFile.value)) {
    //   return
    // }
    // try {
    //   let signatureGroup = new SignatureGroup()
    //   let time = useLocalTime()
    //   let dayjs = useDayjs()
    //   let today = dayjs().format("YYYY-MM-DD")
    //   let uploadedSignatureFile = await signatureGroup.uploadSignatureFile(
    //     this.signatureFile.value ?? "",
    //     useFileStore(),
    //     today
    //   )
    //   this.application.value.signatureId = uploadedSignatureFile.id
    //   await this.application.value.update(this.repository)
    //   await this.application.value.accept(this.repository)
    //   this.emitEvents("back", this.application)
    // } catch (e) {
    //   if (e instanceof Error) {
    //     e.handle()
    //   } else {
    //     let error = new Error()
    //     error.setForCUD()
    //     error.handle()
    //   }
    // }
  }

  async onCreate(): Promise<void> {
    //
  }

  async onUpdate(): Promise<void> {
    // handle
  }

  async onRemove(): Promise<void> {
    // not allowed
  }

  hasSigned(): boolean {
    return !StringUtil.isNullOrEmpty(this.signatureGroup.value.id)
  }

  // override get companyName(): string {
  //   return ""
  // }

  // override get companyRegistrationNumber(): string {
  //   return ""
  // }

  helpTitle(): string {
    return this.language.isMalay() ? `Pengisytiharan bawah Seksyen 201` : "Declaration under Section 201"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return ``
    }

    return ``
  }

  signatureDate(): string {
    if (!this.signatureGroup.value.signature) {
      return "Your Signing Date"
    }

    let time = useLocalTime()
    let dayjs = useDayjs()
    let signatureDate = this.application.value.dateAppointed ?? dayjs().format("YYYY-MM-DD")

    return time.formatDateOnlyFull(signatureDate)
  }

  override async onDownloadClicked(): Promise<void> {
    let promises = []

    if (this.dcrRef) {
      let dcrPages = await this.dcrRef.getPdfPages()
      promises.push(
        PdfPaperUtil.generatePdfFile(
          dcrPages,
          20,
          `${this.application.value.name} - Declaration under Section 201.pdf`,
          PaperSize.A4,
          PaperOrientation.Portrait
        )
      )
    }

    if (promises.length <= 0) {
      return
    }

    await Promise.all(promises)
  }
}
