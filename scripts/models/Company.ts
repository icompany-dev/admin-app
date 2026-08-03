import type { IModel } from "~/scripts/models/IModel"
import { File } from "./File"
import { Location } from "./Location"
import { CompanySetting } from "./CompanySetting"
import { CompanySubscription } from "./CompanySubscription"
import { CompanyConstants } from "../constants/Company"
import { useDayjs } from "#imports"
import { BillingInfo } from "./BillingInfo"
import { MsicCodeAssign } from "./MsicCodeAssign"
import { CompanyBranch } from "./CompanyBranch"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "../utils/String"

export class Company implements IModel<Company> {
  id: string = ""
  name: string = ""
  nameType: string = ""
  nameDescription: string = ""
  registrationNumberOld: string = ""
  registrationNumberNew: string = ""
  hasConstitution: boolean = false
  constitutionFileId: string | null = null
  constitutionFile: File | null = null
  businessDescription: string = ""
  businessAddressLocationId: string | null = null
  businessAddressLocation: Location | null = null
  registeredAddressLocationId: string | null = null
  registeredAddressLocation: Location | null = null
  imageId: string | null = null
  companyLogo: File | null = null
  incorporatedAt: string | null = null
  msicCodeAssigns: MsicCodeAssign[] = []
  ordinaryShares: number = 0
  preferenceShares: number = 0
  companySettingId: string | null = null
  companySetting: CompanySetting | null = null // Create company setting type
  subscription: CompanySubscription | null = null // create company subscription type
  branches: CompanyBranch[] = []
  hasBusinessAddress: boolean = true
  applicationIncorporationId: string | null = null
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Company) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name ?? ""
    this.nameType = data.name_type ?? ""
    this.nameDescription = data.name_description ?? ""
    this.registrationNumberOld = data.registration_number_old ?? ""
    this.registrationNumberNew = data.registration_number_new ?? ""
    this.hasConstitution = data.constitution === 1 || data.constitution === true
    this.constitutionFileId = data.constitution_file?.id ?? null
    this.constitutionFile = new File(data.constitution_file)
    this.businessDescription = data.business_description
    this.businessAddressLocationId = data.business_address_location?.id ?? null
    this.businessAddressLocation = new Location(data.business_address_location)
    this.registeredAddressLocationId = data.registered_address_location?.id ?? null
    this.registeredAddressLocation = new Location(data.registered_address_location)
    this.imageId = data.image?.id ?? null
    this.companyLogo = new File(data.image)
    this.incorporatedAt = data.incorporated_at
    this.msicCodeAssigns =
      data.msic_code_assigns && Array.isArray(data.msic_code_assigns)
        ? data.msic_code_assigns.map((d: any) => {
            return new MsicCodeAssign(d)
          })
        : []
    this.ordinaryShares = data.ordinary_shares ?? 0
    this.preferenceShares = data.preference_shares ?? 0
    this.companySettingId = data.company_settings?.id
    this.companySetting = new CompanySetting(data.company_setting)
    this.subscription = new CompanySubscription(data.company_subscription)
    this.branches =
      data.company_branches && Array.isArray(data.company_branches)
        ? data.company_branches.map((d: any) => {
            return new CompanyBranch(d)
          })
        : []
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: Company): void {
    this.id = data.id
    this.name = data.name
    this.nameType = data.nameType
    this.nameDescription = data.nameDescription
    this.registrationNumberOld = data.registrationNumberOld
    this.registrationNumberNew = data.registrationNumberNew
    this.hasConstitution = data.hasConstitution
    this.hasBusinessAddress = data.hasBusinessAddress
    this.constitutionFileId = data.constitutionFileId
    this.constitutionFile = new File(data.constitutionFile)
    this.businessDescription = data.businessDescription
    this.businessAddressLocationId = data.businessAddressLocationId
    this.businessAddressLocation = new Location(data.businessAddressLocation)
    this.registeredAddressLocationId = data.registeredAddressLocationId
    this.registeredAddressLocation = new Location(data.registeredAddressLocation)
    this.imageId = data.imageId
    this.companyLogo = new File(data.companyLogo)
    this.incorporatedAt = data.incorporatedAt
    this.msicCodeAssigns = data.msicCodeAssigns.map((d: any) => {
      return new MsicCodeAssign(d)
    })
    this.ordinaryShares = data.ordinaryShares
    this.preferenceShares = data.preferenceShares
    this.companySettingId = data.companySettingId
    this.companySetting = new CompanySetting(data.companySetting)
    this.subscription = new CompanySubscription(data.subscription)
    this.branches = data.branches.map((d: CompanyBranch) => {
      return new CompanyBranch(d)
    })
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    let data = {
      name: this.name,
      name_type: this.nameType,
      name_description: this.nameDescription,
      registration_number_new: this.registrationNumberNew,
      registration_number_old: this.registrationNumberOld,
      business_description: this.businessDescription,
      has_business_address: this.hasBusinessAddress,
      registered_address_location: this.registeredAddressLocation?.getRequestBody() ?? null,
      incorporated_at: this.incorporatedAt,
      application_incorporation_id: this.applicationIncorporationId,
    }

    if (this.hasBusinessAddress) {
      data.business_address_location = this.businessAddressLocation?.getRequestBody() ?? null
    }

    return data
  }

  getType(): string {
    switch (this.nameType) {
      case "sdnbhd":
        return CompanyConstants.TYPE_SDNBHD
      case "berhad":
        return CompanyConstants.TYPE_BERHAD
      case "others":
        return ""
      default:
        return CompanyConstants.TYPE_SDNBHD
    }
  }

  getFullName(): string {
    return `${this.name} ${this.getType()}`
  }

  subscriptionStatus(): string {
    if (!this.subscription) {
      return "expired"
    }

    const dayjs = useDayjs()
    const today = dayjs()
    const subscriptionEndDate = dayjs(this.subscription.subscriptionEndDate)

    if (subscriptionEndDate.isBefore(today)) {
      return "expired"
    }

    const aMonthFromToday = dayjs().add(1, "month")
    if (subscriptionEndDate.isBefore(aMonthFromToday)) {
      return "expiring"
    }

    return "active"
  }

  subscriptionExpiryDate(): string {
    if (!this.subscription) {
      return "-"
    }

    const dayjs = useDayjs()
    const subscriptionEndDate = dayjs(this.subscription.subscriptionEndDate)

    return subscriptionEndDate.format("D MMM YYYY")
  }

  async updateLogoFile(fileId: string, repository: ReturnType<typeof useCompanyStore>): Promise<void> {
    const data = {
      image_id: fileId,
    }

    await repository.updateDetails(this.id, data)
    if (repository.company) {
      this.clone(repository.company)
    }
  }

  billingInfo(): BillingInfo {
    let billingInfo = new BillingInfo()
    billingInfo.name = this.getFullName().toUpperCase()
    let address = this.businessAddressLocation
    billingInfo.addressLine1 = address?.addressLine1 ?? "-"
    billingInfo.addressLine2 = address?.addressLine2 ?? "-"
    billingInfo.addressPostcode = address?.postcode ?? "40400"
    billingInfo.addressCity = address?.city?.name ?? "-"
    billingInfo.addressState = address?.state?.name ?? "-"
    billingInfo.addressCountry = address?.country?.name ?? "Malaysia"

    return billingInfo
  }

  getAddress(): string {
    if (this.businessAddressLocation && this.businessAddressLocation.addressLine1) {
      return this.businessAddressLocation.getMultilineAddress()
    }
    if (this.registeredAddressLocation && this.registeredAddressLocation.addressLine1) {
      return this.registeredAddressLocation.getMultilineAddress()
    }
    return ""
  }

  getOnelineAddress(): string {
    if (this.businessAddressLocation && this.businessAddressLocation.addressLine1) {
      return this.businessAddressLocation.getOnelineAddress()
    }
    if (this.registeredAddressLocation && this.registeredAddressLocation.addressLine1) {
      return this.registeredAddressLocation.getOnelineAddress()
    }
    return ""
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.name) &&
      !StringUtil.isNullOrEmpty(this.nameType) &&
      !StringUtil.isNullOrEmpty(this.registrationNumberNew) &&
      !StringUtil.isNullOrEmpty(this.registrationNumberOld) &&
      !StringUtil.isNullOrEmpty(this.businessDescription) &&
      !StringUtil.isNullOrEmpty(this.incorporatedAt)
    )
  }

  async create(repository: ReturnType<typeof useCompanyStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }
}
