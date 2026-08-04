import { CompanyConstants } from "../constants/Company"
import { StatusConstants } from "../constants/Status"
import { SwitchConstants } from "../constants/Switches"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { DirectorInvitation } from "./DirectorInvitation"
import { File } from "./File"
import type { IApplication } from "./IApplication"
import type { IModel } from "./IModel"
import { Location } from "./Location"
import { ShareholderInvitation } from "./ShareholderInvitation"
import { SignatureGroup } from "./SignatureGroup"
import {
  SsmCorporateProfilePurchaseData,
  type CorporateProfileJsonData,
  CorporateProfileJsonOfficerInfo,
} from "./SsmCorporateProfileJsonData"

export class ApplicationSwitch implements IApplication {
  id: string = ""
  name: string = ""
  nameType: string = ""
  refNo: string = ""
  nameDescription: string = ""
  registrationNumberNew: string = ""
  registrationNumberOld: string = ""
  hasConstitution: boolean = false
  constitutionFile: File | null = null
  businessDescription: string = ""
  businessAddressLocation: Location | null = null
  resignationForm: File | null = null
  hasCompanySecretary: boolean = false
  secretaryEmail: string = ""
  secretaryPhone: string = ""
  secretaryCompanyName: string = ""
  secretaryCompanyAddress: string = ""
  secretaryName: string = ""
  directorInvitations: DirectorInvitation[] = []
  shareholderInvitations: ShareholderInvitation[] = []
  status: string = StatusConstants.DRAFT
  signatureGroups: SignatureGroup[] = []
  signatureGroupStatus: string = ""
  applicantId: string = ""
  metadata: any | null = null
  incorporatedAt: string | null = null
  paidAt: string | null = ""
  submittedAt: string | null = ""
  completedAt: string | null = ""
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  switchType: string = SwitchConstants.TYPE_SETTLE

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ApplicationSwitch) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.nameType = data.name_type
    this.refNo = data.ref_no
    this.nameDescription = data.name_description
    this.registrationNumberNew = data.registration_number_new
    this.registrationNumberOld = data.registration_number_old
    this.hasConstitution = data.constitution
    this.constitutionFile = data.constitution_file ? new File(data.constitution_file) : null
    this.businessDescription = data.business_description
    this.businessAddressLocation = data.business_address_location ? new Location(data.business_address_location) : null
    this.resignationForm = data.resignation_form
    this.hasCompanySecretary = data.has_company_secretary
    this.secretaryEmail = data.secretary_email
    this.secretaryPhone = data.secretary_phone
    this.secretaryCompanyName = data.secretary_company_name
    this.secretaryCompanyAddress = data.secretary_company_address
    this.secretaryName = data.secretary_name
    this.directorInvitations =
      data.director_invitations && Array.isArray(data.director_invitations)
        ? data.director_invitations.map((d: any) => {
            return new DirectorInvitation(d)
          })
        : []
    this.shareholderInvitations =
      data.shareholder_invitations && Array.isArray(data.shareholder_invitations)
        ? data.shareholder_invitations.map((s: any) => {
            return new ShareholderInvitation(s)
          })
        : []
    this.status = data.status
    this.signatureGroups =
      data.signature_groups && Array.isArray(data.signature_groups)
        ? data.signature_groups.map((sg: any) => {
            return new SignatureGroup(sg)
          })
        : []
    this.signatureGroupStatus = data.signature_group_status ?? ""
    this.applicantId = data.applicant_id ?? ""
    this.metadata = data.meta_data
    this.incorporatedAt = data.incorporated_at ?? null
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.paidAt = data.created_at

    this.switchType = data.switch_type ?? SwitchConstants.TYPE_SETTLE
  }

  clone(data: ApplicationSwitch): void {
    this.id = data.id
    this.name = data.name
    this.nameType = data.nameType
    this.refNo = data.refNo
    this.nameDescription = data.nameDescription
    this.registrationNumberNew = data.registrationNumberNew
    this.registrationNumberOld = data.registrationNumberOld
    this.hasConstitution = data.hasConstitution
    this.constitutionFile = data.constitutionFile ? new File(data.constitutionFile) : null
    this.businessDescription = data.businessDescription
    this.businessAddressLocation = data.businessAddressLocation ? new Location(data.businessAddressLocation) : null
    this.resignationForm = data.resignationForm
    this.hasCompanySecretary = data.hasCompanySecretary
    this.secretaryEmail = data.secretaryEmail
    this.secretaryPhone = data.secretaryPhone
    this.secretaryCompanyName = data.secretaryCompanyName
    this.secretaryCompanyAddress = data.secretaryCompanyAddress
    this.secretaryName = data.secretaryName
    this.directorInvitations = data.directorInvitations.map((d: DirectorInvitation) => {
      return new DirectorInvitation(d)
    })
    this.shareholderInvitations = data.shareholderInvitations.map((s: ShareholderInvitation) => {
      return new ShareholderInvitation(s)
    })
    this.status = data.status
    this.signatureGroups = data.signatureGroups.map((sg: SignatureGroup) => {
      return new SignatureGroup(sg)
    })
    this.signatureGroupStatus = data.signatureGroupStatus
    this.applicantId = data.applicantId
    this.metadata = data.metadata
    this.incorporatedAt = data.incorporatedAt
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.switchType = data.switchType
    this.paidAt = data.paidAt
    this.submittedAt = data.submittedAt
    this.completedAt = data.completedAt
  }

  getCorporateProfileData(): CorporateProfileJsonData | null {
    if (!this.metadata) {
      return null
    }

    let ssmCorporateProfilePurchaseData: SsmCorporateProfilePurchaseData = new SsmCorporateProfilePurchaseData(
      this.metadata
    )

    return ssmCorporateProfilePurchaseData.ssm
  }

  getRequestBody(): object {
    return {
      name: this.name,
      name_type: "sdnbhd",
      registration_number_new: this.registrationNumberNew,
      registration_number_old: this.registrationNumberOld,
      meta_data: this.metadata,
      switch_type: this.switchType,
      business_description: this.businessDescription,
      business_address_location: this.businessAddressLocation?.canCreate()
        ? this.businessAddressLocation.getRequestBody()
        : [],
      secretary_email: this.secretaryEmail,
      secretary_phone: this.secretaryPhone,
      incorporated_at: this.incorporatedAt,
      has_company_secretary: this.hasCompanySecretary,
      secretary_company_name: this.secretaryCompanyName,
      secretary_company_address: this.secretaryCompanyAddress,
      secretary_name: this.secretaryName,
    }
  }

  getRequestBodyForMetadata(): object {
    return {
      name: this.name,
      name_type: "sdnbhd",
      registration_number_new: this.registrationNumberNew,
      registration_number_old: this.registrationNumberOld,
      meta_data: this.metadata,
    }
  }

  //TODO: Add CUD here
  async create(repository: ReturnType<typeof useApplicationSwitchStore>): Promise<void> {
    let response = await repository.create(this.getRequestBody())
    if (repository.error !== null) {
      throw repository.error
    }

    this.convertFromResponse(response)
  }

  async update(repository: ReturnType<typeof useApplicationSwitchStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let response = await repository.update(this.id, this.getRequestBody())
    if (repository.error !== null) {
      throw repository.error
    }

    this.convertFromResponse(response)
  }

  async updateMetadata(repository: ReturnType<typeof useApplicationSwitchStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let response = await repository.update(this.id, this.getRequestBodyForMetadata())
    if (repository.error !== null) {
      throw repository.error
    }

    this.convertFromResponse(response)
  }

  async delete(repository: ReturnType<typeof useApplicationSwitchStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let response = await repository.remove(this.id)
    if (repository.error !== null) {
      throw repository.error
    }

    return response
  }

  //UI helper
  cosecAddressFragments(): string[] {
    if (!this.secretaryCompanyAddress) {
      return []
    }

    let address = this.secretaryCompanyAddress.replaceAll(/\n/g, "<br>").replaceAll(/\s+/g, " ").trim()

    if (StringUtil.contains(address, "<br>")) {
      return address.split("<br>").map((fragment: string) => {
        return fragment.trim()
      })
    }

    return address.split(",").map((fragment: string) => {
      return fragment.trim()
    })
  }

  cosecAddressLine1(): string {
    return this.cosecAddressFragments()[0] || ""
  }

  cosecAddressLine2(): string {
    return this.cosecAddressFragments()[1] || ""
  }

  cosecAddressPostcode(): string {
    // Postcodes are purely numeric, minimum 5 digits in Malaysia. So we can do it this way
    return (
      this.cosecAddressFragments().find((fragment: string) => {
        return /^\d{5,}$/.test(fragment)
      }) ?? ""
    )
  }

  cosecAddressCity(): string {
    let postcode = this.cosecAddressPostcode()
    if (!postcode) {
      return ""
    }

    let postcodeIndex = this.cosecAddressFragments().indexOf(postcode)
    if (postcodeIndex <= 0) {
      return ""
    }

    return this.cosecAddressFragments()[postcodeIndex + 1] || ""
  }

  cosecAddressState(): string {
    let city = this.cosecAddressCity()
    if (!city) {
      return ""
    }

    let cityIndex = this.cosecAddressFragments().indexOf(city)
    if (cityIndex <= 0) {
      return ""
    }

    return this.cosecAddressFragments()[cityIndex + 1] || ""
  }

  hasInvitedAllDirectors(): boolean {
    if (
      this.metadata === null ||
      this.directorInvitations.length <= 0 ||
      this.status === StatusConstants.PAID ||
      this.status === StatusConstants.PENDING
    ) {
      return false
    }

    let corporateData = this.getCorporateProfileData()
    if (!corporateData) {
      return false
    }

    let officerInfos = corporateData.officerInfos.filter((oi: CorporateProfileJsonOfficerInfo) => {
      return oi.designationCode.toLowerCase() === "d"
    })

    return officerInfos.every((oi: CorporateProfileJsonOfficerInfo) => {
      return this.directorInvitations.some((di: DirectorInvitation) => {
        return StringUtil.isEqual(di.invitationName ?? "", oi.name)
      })
    })
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
    if (StringUtil.isNullOrEmpty(this.name)) {
      return ""
    }

    let cleanedName = this.name
      .toLowerCase()
      .replaceAll("sdn bhd", "")
      .replaceAll("berhad", "")
      .replaceAll("sdn. bhd.", "")
      .toUpperCase()

    return `${cleanedName} ${this.getType()}`
  }
}
