import { Company } from "~/scripts/models/Company"
import { Director } from "~/scripts/models/Director"
import { Shareholder } from "~/scripts/models/Shareholder"
import { StringUtil } from "~/scripts/utils/String"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { PaperOrientation } from "~/scripts/constants/Paper"
import type { MsicCode } from "~/scripts/models/MsicCode"
import type { CompanyBranch } from "~/scripts/models/CompanyBranch"
import { NumberUtil } from "~/scripts/utils/Number"
import { User } from "~/scripts/models/User"

export class Section68Controller extends SdnBhdLegalDocumentController {
  shareholders: Ref<Shareholder[]> = ref<Shareholder[]>([])
  shareholderUsers: Ref<User[]> = ref<User[]>([])
  directors: Ref<Director[]> = ref<Director[]>([])
  directorUsers: Ref<User[]> = ref<User[]>([])

  additionalCssClass: string = "section68-document"
  isIncludeLogo: boolean = false
  totalPages: number = 13

  annualReturnYear: Ref<string> = ref<string>("2026")

  emitEvents: any | null = null

  constructor(companyId: string, annualReturnYear: string, emitEvents: any | null) {
    super("Section 68", companyId, PaperOrientation.Portrait)
    this.emitEvents = emitEvents
    this.setAnnualReturnYear(annualReturnYear)
    this.setData()
  }

  setAnnualReturnYear(year: string): void {
    this.annualReturnYear.value = year
  }

  async setData(): Promise<void> {
    await Promise.all([this.fetchShareholders(), this.fetchDirectors()])
  }

  async fetchShareholders(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useShareholderStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)
    if (repository.error !== null) {
      throw repository.error
    }

    this.shareholders.value = response.map((d: any) => {
      return new Shareholder(d)
    })

    let userRepository = useUserStore()
    let promises = this.shareholders.value.map((shareholder: Shareholder) => {
      return shareholder.getRegisteredUser(userRepository)
    })

    await Promise.all(promises).then((users) => {
      this.shareholderUsers.value = users.map((user: User | null) => {
        return new User(user)
      })
    })
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

    let userRepository = useUserStore()
    let promises = this.directors.value.map((director: Director) => {
      return director.getRegisteredUser(userRepository)
    })

    await Promise.all(promises).then((users) => {
      this.directorUsers.value = users.map((user: User | null) => {
        return new User(user)
      })
    })
  }

  dateOfAnnualReturn(): string {
    if (!this.company.value) {
      return ""
    }

    let dayjs = useDayjs()

    let incorporatedAt = dayjs(this.company.value.incorporatedAt).format("MM-DD")
    return `${this.annualReturnYear.value}-${incorporatedAt}`
  }

  firstAnnualReturnDisclosure(): string {
    if (!this.company.value) {
      return "YES"
    }

    let dayjs = useDayjs()

    let oneYearAnniversary = dayjs(this.company.value.incorporatedAt).add(1, "year").format("YYYY-MM-DD")
    return this.dateOfAnnualReturn() === oneYearAnniversary ? "YES" : "NO"
  }

  registeredOfficeLine1(): string {
    return this.company.value?.registeredAddressLocation?.addressLine1.toUpperCase() ?? ""
  }

  registeredOfficeLine2(): string {
    return this.company.value?.registeredAddressLocation?.addressLine2?.toUpperCase() ?? ""
  }

  registeredOfficePostcode(): string {
    return this.company.value?.registeredAddressLocation?.postcode ?? ""
  }

  registeredOfficeTown(): string {
    return this.company.value?.registeredAddressLocation?.city?.name.toUpperCase() ?? ""
  }

  registeredOfficeState(): string {
    return this.company.value?.registeredAddressLocation?.state?.name.toUpperCase() ?? ""
  }

  registeredOfficeCountry(): string {
    return this.company.value?.registeredAddressLocation?.country?.name.toUpperCase() ?? ""
  }

  businessAddress(): string {
    return this.company.value?.businessAddressLocation?.getOnelineAddress() ?? ""
  }

  natureOfBusiness(): string {
    return this.company.value?.businessDescription ?? ""
  }

  msicCodes(): MsicCode[] {
    return this.company.value?.msicCodeAssigns?.map((assigned) => {
      return assigned.msicCode
    })
  }

  branchAddresses(): string[] {
    if (!this.company.value) {
      return []
    }

    return this.company.value.branches.map((branch: CompanyBranch) => {
      return branch.location.getOnelineAddress()
    })
  }

  ordinaryShares(): string {
    let total = this.shareholders.value.reduce((sum: number, shareholder) => {
      return sum + Number(shareholder.ordinaryShares)
    }, 0)

    return NumberUtil.thousandSeparator(total)
  }

  preferenceShares(): string {
    let total = this.shareholders.value.reduce((sum: number, shareholder) => {
      return sum + Number(shareholder.preferenceShares)
    }, 0)

    return NumberUtil.thousandSeparator(total)
  }

  totalShares(): string {
    let total = this.shareholders.value.reduce((sum: number, shareholder) => {
      return sum + Number(shareholder.ordinaryShares) + Number(shareholder.preferenceShares)
    }, 0)

    return NumberUtil.thousandSeparator(total)
  }

  userIdentification(user: User): string {
    let detail = user.detail
    if (detail === null) {
      return ""
    }

    let type = detail.identificationType === "ic" ? "MYKAD" : "PASSPORT"
    return `${type}<br>${detail.identification}`
  }

  userNationality(user: User): string {
    let detail = user.detail
    if (detail === null) {
      return ""
    }

    return `${detail.citizenship.toUpperCase()}<br>${detail.race.toUpperCase()}`
  }

  userGender(user: User): string {
    let detail = user.detail
    if (detail === null) {
      return "MALE"
    }

    return detail.gender.toUpperCase()
  }

  userDateOfBirth(user: User): string {
    let detail = user.detail
    if (detail === null) {
      return ""
    }

    return "" // compute
  }

  userAddress(user: User): string {
    let detail = user.detail
    if (detail === null || detail.location === null) {
      return ""
    }

    return detail.location.getOnelineAddress()
  }

  typeOfShareholder(shareholder: Shareholder): string {
    return shareholder.isCorporateRepresentative() ? "BODY CORPORATE" : "INDIVIDUAL"
  }

  shareholderIdentification(shareholder: Shareholder): string {
    if (shareholder.isCorporateRepresentative()) {
      return ""
    }

    let user = this.shareholderUser(shareholder)

    return user ? this.userIdentification(user) : ""
  }

  shareholderNationality(shareholder: Shareholder): string {
    if (shareholder.isCorporateRepresentative()) {
      return ""
    }

    let user = this.shareholderUser(shareholder)

    return user ? this.userNationality(user) : ""
  }

  shareholderGender(shareholder: Shareholder): string {
    if (shareholder.isCorporateRepresentative()) {
      return ""
    }

    let user = this.shareholderUser(shareholder)

    return user ? this.userGender(user) : ""
  }

  shareholderDateOfBirth(shareholder: Shareholder): string {
    if (shareholder.isCorporateRepresentative()) {
      return ""
    }

    let user = this.shareholderUser(shareholder)

    return user ? this.userDateOfBirth(user) : ""
  }

  shareholderAddress(shareholder: Shareholder): string {
    if (shareholder.isCorporateRepresentative()) {
      return ""
    }

    let user = this.shareholderUser(shareholder)

    return user ? this.userAddress(user) : ""
  }

  shareholderUser(shareholder: Shareholder): User | null {
    return (
      this.shareholderUsers.value.find((u: User) => {
        return u.id === shareholder.userId
      }) ?? null
    )
  }

  sharesHeldByMalays(): string {
    let total = this.shareholders.value
      .filter((shareholder) => {
        return shareholder.isCorporateRepresentative() === false
      })
      .reduce((sum: number, shareholder) => {
        let user = this.shareholderUser(shareholder)
        if (user && user.detail && user.detail.race.toLowerCase() === "malay") {
          return sum + Number(shareholder.ordinaryShares) + Number(shareholder.preferenceShares)
        }

        return sum
      }, 0)

    return NumberUtil.thousandSeparator(total)
  }

  sharesHeldByNonMalays(): string {
    let total = this.shareholders.value
      .filter((shareholder) => {
        return shareholder.isCorporateRepresentative() === false
      })
      .reduce((sum: number, shareholder) => {
        let user = this.shareholderUser(shareholder)
        if (
          user &&
          user.detail &&
          user.detail.citizenship.includes("malaysia") &&
          user.detail.race.toLowerCase() !== "malay"
        ) {
          return sum + Number(shareholder.ordinaryShares) + Number(shareholder.preferenceShares)
        }

        return sum
      }, 0)

    return NumberUtil.thousandSeparator(total)
  }
}
