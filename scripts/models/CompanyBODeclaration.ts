import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"
import { Shareholder } from "./Shareholder"
import { File } from "./File"
import { BODeclarationConstants, OwnershipType, CriteriaType } from "../constants/BODeclarations"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { useCompanyBODeclarationStore } from "~/stores/CompanyBODeclarations"

export class CompanyBODeclaration
  extends Application
  implements IModelApplication<CompanyBODeclaration, ReturnType<typeof useCompanyBODeclarationStore>>
{
  shareholderId: string = ""
  shareholder: Shareholder | null = null

  isBeneficialOwner: boolean = true

  fullName: string = ""
  residentialAddress: string = ""
  emailAddress: string = ""
  phone: string = ""
  nationality: string = ""
  dateOfBirth: string = ""
  race: string = ""
  gender: string = ""
  identificationType: string = ""
  identificationNumber: string = ""

  position: string = ""
  dateOfAppointment: string = ""

  typeOfOwnership: OwnershipType = OwnershipType.Direct
  criteriaType: CriteriaType = CriteriaType.A
  percentageOfShares: number = 0

  signatureFileId: string | null = null
  signatureFile: File | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyBODeclaration) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)

    this.shareholderId = data.shareholder_id ?? ""
    this.shareholder = data.shareholder ? new Shareholder(data.shareholder) : null

    this.isBeneficialOwner = data.is_beneficial_owner === 1 || data.is_beneficial_owner === true

    this.fullName = data.full_name ?? ""
    this.residentialAddress = data.residential_address ?? ""
    this.emailAddress = data.email_address ?? ""
    this.phone = data.phone ?? ""
    this.nationality = data.nationality ?? ""
    this.dateOfBirth = data.date_of_birth ?? ""
    this.race = data.race ?? ""
    this.gender = data.gender ?? ""
    this.identificationType = data.identification_type ?? ""
    this.identificationNumber = data.identification_number ?? ""

    this.position = data.position ?? ""
    this.dateOfAppointment = data.date_of_appointment ?? ""

    this.typeOfOwnership = data.type_of_ownership ?? OwnershipType.Direct
    this.criteriaType = data.criteria ?? CriteriaType.A
    this.percentageOfShares = data.percentage_of_shares ?? 0

    this.signatureFileId = data.signature?.id ?? data.signature_id ?? null
    this.signatureFile = data.signature ? new File(data.signature) : null
  }

  cloneDetails(data: CompanyBODeclaration): void {
    super.clone(data)

    this.shareholderId = data.shareholderId
    this.shareholder = data.shareholder ? new Shareholder(data.shareholder) : null

    this.isBeneficialOwner = data.isBeneficialOwner

    this.fullName = data.fullName
    this.residentialAddress = data.residentialAddress
    this.emailAddress = data.emailAddress
    this.phone = data.phone
    this.nationality = data.nationality
    this.dateOfBirth = data.dateOfBirth
    this.race = data.race
    this.gender = data.gender
    this.identificationType = data.identificationType
    this.identificationNumber = data.identificationNumber

    this.position = data.position
    this.dateOfAppointment = data.dateOfAppointment

    this.typeOfOwnership = data.typeOfOwnership
    this.criteriaType = data.criteriaType
    this.percentageOfShares = data.percentageOfShares

    this.signatureFileId = data.signatureFileId
    this.signatureFile = data.signatureFile ? new File(data.signatureFile) : null
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      shareholder_id: this.shareholderId,
      is_beneficial_owner: this.isBeneficialOwner,
      full_name: this.fullName,
      residential_address: this.residentialAddress,
      email_address: this.emailAddress,
      phone: this.phone,
      nationality: this.nationality,
      date_of_birth: StringUtil.isNullOrEmpty(this.dateOfBirth) ? null : this.dateOfBirth,
      race: this.race,
      gender: this.gender,
      identification_type: this.identificationType,
      identification_number: this.identificationNumber,
      position: this.position,
      date_of_appointment: StringUtil.isNullOrEmpty(this.dateOfAppointment) ? null : this.dateOfAppointment,
      type_of_ownership: this.typeOfOwnership,
      criteria: this.criteriaType,
      percentage_of_shares: this.percentageOfShares,
      signature_id: this.signatureFile?.id ?? this.signatureFileId,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) // handle this
  }

  isDirectOwnership(): boolean {
    return this.typeOfOwnership === OwnershipType.Direct
  }

  isIndirectOwnership(): boolean {
    return this.typeOfOwnership === OwnershipType.Indirect
  }

  isDirectIndirectOwnership(): boolean {
    return this.typeOfOwnership === OwnershipType.DirectIndirect
  }

  isOtherOwnership(): boolean {
    return this.typeOfOwnership === OwnershipType.Others
  }

  getOwnershipTypeLabel(): string {
    return BODeclarationConstants.OWNERSHIP_TYPE_LABELS[this.typeOfOwnership]
  }

  getCriteriaLabel(): string {
    return BODeclarationConstants.CRITERIA_LABELS[this.criteriaType]
  }

  async create(repository: ReturnType<typeof useCompanyBODeclarationStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async update(repository: ReturnType<typeof useCompanyBODeclarationStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async updateExternal(repository: ReturnType<typeof useCompanyBODeclarationStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.updateForExternal(this.id, data)
    if (repository.error) {
      let error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async remove(repository: ReturnType<typeof useCompanyBODeclarationStore>): Promise<void> {}
}
