import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import type { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import type { ShareholderInvitation } from "~/scripts/models/ShareholderInvitation"
import { User } from "~/scripts/models/User"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"

export class Section14Controller {
  application = ref<ApplicationIncorporate>(new ApplicationIncorporate())

  isLoading: Ref<boolean> = ref<boolean>(false)

  directorUsers = ref<Map<string, User>>(new Map())
  shareholderUsers = ref<Map<string, User>>(new Map())

  userRepository = useUserStore()
  language = useLanguage()
  time = useLocalTime()
  dayjs = useDayjs()

  documentRef: any | null = null

  isFetchingUsers = ref<boolean>(false)

  constructor(application: ApplicationIncorporate) {
    this.setApplication(application)
  }

  setApplication(application: ApplicationIncorporate): void {
    this.application.value = application
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  async fetchUsers(): Promise<void> {
    if (this.isFetchingUsers.value) {
      return
    }

    try {
      this.isFetchingUsers.value = true
      let directorUserPromises = this.application.value.directorInvitations.map((di: DirectorInvitation) => {
        return di.setUser(this.userRepository)
      })

      let shareholderUserPromises = this.application.value.shareholderInvitations.map((si: ShareholderInvitation) => {
        return si.setUser(this.userRepository)
      })

      let promises = directorUserPromises.concat(shareholderUserPromises)
      await Promise.all(promises)

      this.application.value.directorInvitations.forEach((di: DirectorInvitation) => {
        this.directorUsers.value.set(di.id, new User(di.user))
      })

      this.application.value.shareholderInvitations.forEach((si: ShareholderInvitation) => {
        this.shareholderUsers.value.set(si.id, new User(si.user))
      })
    } catch (e) {
      console.error(e)
    } finally {
      this.isFetchingUsers.value = false
    }
  }

  proposedCompanyName(): string {
    if (!this.application.value || !this.application.value.nameSelected) {
      return "NIL"
    }

    let name = this.application.value.nameSelected.name

    if (this.application.value.nameSelected.nameType === "sdnbhd") {
      name = `${name} SDN.BHD.`
    }

    return name
  }

  getTotalPage(): number {
    return 4
  }

  getTotalShares(): number {
    return this.application.value.shareholderInvitations.reduce((sum, item) => {
      return sum + (item.totalShares ?? 0)
    }, 0)
  }

  getShareType(shareholderInvitation: ShareholderInvitation): string {
    if (shareholderInvitation.preferenceShares > 0) {
      return "PREFERENCE SHARES"
    }

    return "ORDINARY SHARES"
  }

  getDirectorUser(director: DirectorInvitation): User | null {
    return this.directorUsers.value.get(director.id) ?? null
  }

  getDirectorName(director: DirectorInvitation): string {
    const user = this.getDirectorUser(director)
    if (!user || StringUtil.isNullOrEmpty(user.name)) {
      return !StringUtil.isNullOrEmpty(director.name) ? (director.name as string) : director.email
    }
    return user.name ?? user.email
  }

  getDirectorIdentification(director: DirectorInvitation): string {
    const user = this.getDirectorUser(director)
    if (!user?.detail) {
      return ""
    }
    return user.detail.identification ?? ""
  }

  getDirectorNationality(director: DirectorInvitation): string {
    const user = this.getDirectorUser(director)
    if (!user?.detail) {
      return ""
    }
    return user.detail.citizenship ?? ""
  }

  getDirectorAddress(director: DirectorInvitation): string {
    const user = this.getDirectorUser(director)
    if (!user?.detail?.location) {
      return ""
    }
    return user.detail.location.getOnelineAddress() ?? ""
  }

  getDirectorRace(director: DirectorInvitation): string {
    const user = this.getDirectorUser(director)
    if (!user?.detail) {
      return ""
    }
    if (user.detail.race === "other" && user.detail.customRace) {
      return user.detail.customRace
    }
    return StringUtil.capitalize(user.detail.race ?? "")
  }

  getShareholderUser(shareholder: ShareholderInvitation): User | null {
    return this.shareholderUsers.value.get(shareholder.id) ?? null
  }

  getShareholderName(shareholder: ShareholderInvitation): string {
    const user = this.getShareholderUser(shareholder)
    if (!user || StringUtil.isNullOrEmpty(user.name)) {
      return !StringUtil.isNullOrEmpty(shareholder.name) ? (shareholder.name as string) : shareholder.email
    }
    return user.name ?? user.email
  }

  getShareholderIdentification(shareholder: ShareholderInvitation): string {
    const user = this.getShareholderUser(shareholder)
    if (!user?.detail) {
      return ""
    }
    return user.detail.identification ?? ""
  }

  getShareholderIdType(shareholder: ShareholderInvitation): string {
    const user = this.getShareholderUser(shareholder)
    if (!user?.detail) {
      return ""
    }
    return user.detail.getIdentificationTypeText()
  }

  getShareholderNationality(shareholder: ShareholderInvitation): string {
    const user = this.getShareholderUser(shareholder)
    if (!user?.detail) {
      return ""
    }
    return user.detail.citizenship ?? ""
  }

  getShareholderAddress(shareholder: ShareholderInvitation): string {
    const user = this.getShareholderUser(shareholder)
    if (!user?.detail?.location) {
      return ""
    }
    return user.detail.location.getOnelineAddress() ?? ""
  }

  getShareholderRace(shareholder: ShareholderInvitation): string {
    const user = this.getShareholderUser(shareholder)
    if (!user?.detail) {
      return ""
    }
    if (user.detail.race === "other" && user.detail.customRace) {
      return user.detail.customRace
    }
    return StringUtil.capitalize(user.detail.race ?? "")
  }

  async getPdfElements(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    return await PdfPaperUtil.getPdfElements(this.documentRef as HTMLElement)
  }

  isRunning(): boolean {
    return this.isFetchingUsers.value
  }
}
