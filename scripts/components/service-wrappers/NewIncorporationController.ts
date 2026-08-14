import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import { ServiceController } from "./ServiceController"
import type { IServiceController } from "./IServiceController"
import { CompanyConstants } from "~/scripts/constants/Company"
import { StringUtil } from "~/scripts/utils/String"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { User } from "~/scripts/models/User"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import type { DirectorInvitation } from "~/scripts/models/DirectorInvitation"

export class NewIncorporationController
  extends ServiceController
  implements IServiceController<ApplicationIncorporate, ReturnType<typeof useApplicationIncorporateStore>>
{
  applicationIncorporate = ref<ApplicationIncorporate>(new ApplicationIncorporate())
  application: ApplicationIncorporate = new ApplicationIncorporate()
  applicationId: string = ""
  repository = useApplicationIncorporateStore()
  companyRepository = useCompanyStore()

  name: Ref<string> = ref<string>("")
  registrationNumber: Ref<string> = ref<string>("")

  user = ref<User>(new User())
  directorUser = ref<User>(new User())
  signatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", false))

  declarationRef: any | null = null

  showSection201: Ref<boolean> = ref<boolean>(false)
  showSection14: Ref<boolean> = ref<boolean>(false)
  directorInvitationId: Ref<string> = ref<string>("")

  constructor(applicationId: string, emitEvents: any | null = null) {
    super(CompanyConstants.TARGET_DIRECTOR_INVITATION, "", emitEvents)

    this.init(applicationId)
  }

  async init(applicationId: string): Promise<void> {
    this.user.value = await CurrentUser.get()
    this.setApplicationId(applicationId)
  }

  setDeclarationRef(declarationRef: any): void {
    this.declarationRef = declarationRef
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.applicationId = applicationId
    await this.fetchApplication()
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId)) {
      return
    }

    try {
      const response = await this.repository.fetch(this.applicationId)
      this.application = new ApplicationIncorporate(response)
      this.applicationIncorporate.value = new ApplicationIncorporate(response)

      let directorInvitation = this.application.directorInvitations.find((invitation: DirectorInvitation) => {
        return invitation.email === this.user.value.email
      })

      this.showSection201.value = directorInvitation !== undefined
      this.directorInvitationId.value = directorInvitation ? directorInvitation.id : ""

      this.showSection14.value = !this.showSection201.value
    } catch (err: any) {
      // deep??
    }
  }

  async onSubmitClicked(): Promise<void> {
    // do nothing
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
    return true
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
}
