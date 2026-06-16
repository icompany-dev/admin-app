import { Director } from "~/scripts/models/Director"
import { StringUtil } from "~/scripts/utils/String"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { User } from "~/scripts/models/User"
import { CompanyDividendDeclaration } from "~/scripts/models/CompanyDividendDeclaration"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { Error } from "~/scripts/library/Error"

export class Section132Controller extends SdnBhdLegalDocumentController {
  applicationId: Ref<string> = ref<string>("")
  application = ref<CompanyDividendDeclaration>(new CompanyDividendDeclaration())
  directors: Ref<Director[]> = ref<Director[]>([])
  directorUsers = ref<User[]>([])
  signatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", false))
  directorSignatures: Record<string, SignatureItem> = {}

  currentUser = ref<User>(new User())

  isLoading: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  signatureFile: Ref<string | null> = ref<string | null>(null)

  constructor(companyId: string, applicationId: string, isInPreviewMode: boolean, emitEvents: any | null) {
    super("Declaration of Solvency", companyId, PaperOrientation.Portrait)
    this.emitEvents = emitEvents
    this.setIsInPreviewMode(isInPreviewMode)
    this.init(applicationId)
  }

  async init(applicationId: string): Promise<void> {
    this.isLoading.value = true
    this.currentUser.value = await CurrentUser.get()
    await Promise.all([this.setApplicationId(applicationId), this.fetchDirectors()])
    this.setSignatureItems()

    this.isLoading.value = false
  }

  async setApplicationId(applicationId: string | null): Promise<void> {
    if (!applicationId || StringUtil.isNullOrEmpty(applicationId)) {
      this.applicationId.value = ""
      this.application.value = new CompanyDividendDeclaration()
      this.application.value.companyId = this.companyId.value
    } else {
      this.applicationId.value = applicationId
      await this.fetchApplication()
    }
  }

  async onCompanyIdChanged(): Promise<void> {
    await this.fetchDirectors()
    this.setSignatureItems()
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    try {
      let repository = useCompanyDividendDeclarationStore()
      let response = await repository.fetch(this.applicationId.value)
      if (repository.error !== null) {
        throw repository.error
      }

      this.application.value = new CompanyDividendDeclaration(response)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error("", "")
        error.setForFetch()
        error.handle()
      }
    }
  }

  async fetchDirectors(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useDirectorStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)
    if (repository.error !== null) {
      throw repository.error
    }

    this.directors.value = response.map((d: any) => {
      return new Director(d)
    })

    let promises = this.directors.value.map((d: Director) => {
      return d.getRegisteredUser(useUserStore())
    })

    await Promise.all(promises).then((responses) => {
      this.directorUsers.value = responses
        .filter((u: User | null) => {
          return u !== null
        })
        .map((u: User | null) => {
          return new User(u)
        })
    })
  }

  setSignatureItems(): void {
    this.directorUsers.value.forEach((du: User) => {
      let signatureGroup = this.application.value.signatureGroups.find((sg: SignatureGroup) => {
        return sg.email === du.email
      })

      let signatureFile = signatureGroup?.signature ?? null

      let isSignatureEditable =
        du.email === this.currentUser.value.email && !this.isInPreviewMode.value && signatureFile === null

      this.directorSignatures[du.id] = new SignatureItem(
        signatureFile?.url ?? null,
        signatureFile !== null,
        isSignatureEditable,
        false,
        du.name,
        du.email,
        "Director",
        false
      )
    })
  }

  getDirectorIdentification(user: User): string {
    let detail = user.detail
    if (!detail) {
      return "(Unknown)"
    }

    return detail.identification
  }

  getDirectorAddress(user: User): string {
    let detail = user.detail
    if (!detail) {
      return "(unknown)"
    }

    return detail.location?.getOnelineAddress() ?? "(unknown)"
  }

  getDirectorSignatureItem(user: User): SignatureItem {
    return this.directorSignatures[user.id] ?? this.signatureItem.value
  }

  getDirectorSignatureDate(user: User): string {
    let signatureGroup = this.application.value.signatureGroups.find((sg: SignatureGroup) => {
      return sg.email === user.email
    })

    let time = useLocalTime()
    if (!signatureGroup) {
      if (!StringUtil.isNullOrEmpty(this.signatureFile.value)) {
        return time.formatDateOnlyFull(time.currentDateFull())
      }

      return "(date of signature)"
    }

    return time.formatDateOnlyFull(signatureGroup.createdAt ?? "")
  }

  hasDirectorSigned(user: User): boolean {
    let signatureGroup = this.application.value.signatureGroups.find((sg: SignatureGroup) => {
      return sg.email === user.email
    })

    return (
      (signatureGroup !== null && signatureGroup !== undefined) || !StringUtil.isNullOrEmpty(this.signatureFile.value)
    )
  }

  onSigned(signatureFile: string): void {
    this.emitEvents("signed", signatureFile)
    this.signatureFile.value = signatureFile
  }
}
