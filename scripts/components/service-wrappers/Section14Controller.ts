import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import { ServiceController } from "./ServiceController"
import type { IServiceController } from "./IServiceController"
import { CompanyConstants } from "~/scripts/constants/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { Company } from "~/scripts/models/Company"
import { ApplicationSwitch } from "~/scripts/models/ApplicationSwitch"
import { User } from "~/scripts/models/User"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import type { RefSymbol } from "@vue/reactivity"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"

export class Section14Controller
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
