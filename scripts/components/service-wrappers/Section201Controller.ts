import { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
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

export class Section201Controller
  extends ServiceController
  implements IServiceController<DirectorInvitation, ReturnType<typeof useDirectorInvitationStore>>
{
  application: DirectorInvitation = new DirectorInvitation()
  applicationId: string = ""
  repository = useDirectorInvitationStore()
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
      await this.fetchInvitation()
      await Promise.all([this.fetchTarget(), this.fetchUser()])
      this.setSignatureItem()
    } catch (e) {
      // do nothing for now
    }
  }

  async fetchInvitation(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId)) {
      return
    }

    try {
      let response = await this.repository.fetch(this.applicationId)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      this.application = new DirectorInvitation(response)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForFetch()
        error.handle()
      }
    }
  }

  async fetchTarget(): Promise<void> {
    if (this.application.target.target === "company") {
      let response = await this.companyRepository.fetchPublic(this.application.target.id)
      let company = new Company(response)
      this.name.value = company.getFullName()
      this.registrationNumber.value = `${company.registrationNumberNew} (${company.registrationNumberOld})`
      return
    }

    if (this.application.target.target === CompanyConstants.TARGET_APPLICATION_INCORPORATE) {
      let repository = useApplicationIncorporateStore()
      let response = await repository.fetch(this.application.target.id)
      let application = new ApplicationIncorporate(response)
      this.name.value = application.getName()
      this.registrationNumber.value = ""
      return
    }

    if (this.application.target.target === CompanyConstants.TARGET_APPLICATION_SWITCH) {
      let repository = useApplicationSwitchStore()
      let response = await repository.fetch(this.application.target.id)
      let application = new ApplicationSwitch(response)
      this.name.value = `${application.name.toUpperCase()} SDN BHD`
      this.registrationNumber.value = `${application.registrationNumberNew} (${application.registrationNumberOld})`
    }
  }

  async fetchUser(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.application.userId)) {
      return
    }

    let repository = useUserStore()
    let response = await repository.fetch(this.application.userId ?? "")
    this.directorUser.value = new User(response)
  }

  setSignatureItem(): void {
    this.signatureItem.value = new SignatureItem(
      this.application.signature?.url ?? null,
      this.application.signatureId !== null,
      this.application.email === this.user.value.email && this.application.signatureId === null,
      false,
      this.directorUser.value.name,
      this.directorUser.value.email,
      "",
      false
    )
  }

  async onSubmitClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.signatureFile.value)) {
      return
    }

    try {
      let signatureGroup = new SignatureGroup()
      let time = useLocalTime()
      let dayjs = useDayjs()
      let today = dayjs().format("YYYY-MM-DD")
      let uploadedSignatureFile = await signatureGroup.uploadSignatureFile(
        this.signatureFile.value ?? "",
        useFileStore(),
        today
      )

      this.application.signatureId = uploadedSignatureFile.id
      await this.application.update(this.repository)

      await this.application.accept(this.repository)

      this.emitEvents("back", this.application)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForCUD()
        error.handle()
      }
    }
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
    return this.application.signatureId !== null
  }

  companyName(): string {
    return ""
  }

  companyRegistrationNumber(): string {
    return ""
  }

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
    if (!this.application.signatureId) {
      return "Your Signing Date"
    }

    let time = useLocalTime()
    let dayjs = useDayjs()
    let signatureDate = this.application.signature?.createdAt ?? dayjs().format("YYYY-MM-DD")

    return time.formatDateOnlyFull(signatureDate)
  }
}
