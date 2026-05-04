import { DirectorDeclarationConflictOfInterestShareholdingTypes } from "../constants/DirectorConflictsOfInterests"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { DirectorDeclarationConflictOfInterestDisclosure } from "./DirectorDeclarationConflictOfInterestDisclosure"
import { DirectorDeclarationConflictOfInterestProperty } from "./DirectorDeclarationConflictOfInterestProperty"
import { DirectorDeclarationConflictOfInterestShareholding } from "./DirectorDeclarationConflictOfInterestShareholding"
import { File } from "./File"

export class DirectorDeclarationConflictOfInterest extends Application {
  directorId: string = ""
  name: string = ""
  nationality: string = ""
  race: string = ""
  residentialAddress: string = ""
  identificationType: string = ""
  identificationNumber: string = ""
  dateOfBirth: string = ""
  passportExpiryDate: string | null = null
  businessOccupation: string = "Director"
  businessAddress: string = ""
  emailAddress: string = ""
  directorshipsInOtherCompanies: string[] = Array(4).fill("")
  shareholdingInCompanyAtAppointment: DirectorDeclarationConflictOfInterestShareholding =
    new DirectorDeclarationConflictOfInterestShareholding()
  shareholdingInRelatedCompanyAtAppointment: DirectorDeclarationConflictOfInterestShareholding =
    new DirectorDeclarationConflictOfInterestShareholding()
  shareholdingInCompanyFurtherAcquired: DirectorDeclarationConflictOfInterestShareholding =
    new DirectorDeclarationConflictOfInterestShareholding()
  shareholdingInRelatedCompanyFurtherAcquired: DirectorDeclarationConflictOfInterestShareholding =
    new DirectorDeclarationConflictOfInterestShareholding()
  shareholdingInCompanyDisposed: DirectorDeclarationConflictOfInterestShareholding =
    new DirectorDeclarationConflictOfInterestShareholding()
  shareholdingInRelatedCompanyDisposed: DirectorDeclarationConflictOfInterestShareholding =
    new DirectorDeclarationConflictOfInterestShareholding()
  disclosureOfInterests: DirectorDeclarationConflictOfInterestDisclosure[] = []
  propertiesPossessed: DirectorDeclarationConflictOfInterestProperty[] = []
  signatureId: string = ""
  signature: File | null = null

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof DirectorDeclarationConflictOfInterest) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.directorId = data.director_id
    this.name = data.name
    this.nationality = data.nationality
    this.race = data.race
    this.residentialAddress = data.residential_address
    this.identificationType = data.identification_type
    this.identificationNumber = data.identification_number
    this.dateOfBirth = data.date_of_birth
    this.passportExpiryDate = data.passport_expiry_date
    this.businessOccupation = data.business_occupation
    this.businessAddress = data.business_address
    this.emailAddress = data.email_address
    this.directorshipsInOtherCompanies = data.directorships_in_other_companies?.split(",") ?? []
    if (this.directorshipsInOtherCompanies.length < 4) {
      let balance = 4 - this.directorshipsInOtherCompanies.length
      this.directorshipsInOtherCompanies = this.directorshipsInOtherCompanies.concat(Array(balance).fill(""))
    }

    // handle shareholdings
    this.shareholdingInCompanyAtAppointment = new DirectorDeclarationConflictOfInterestShareholding()
    this.shareholdingInRelatedCompanyAtAppointment = new DirectorDeclarationConflictOfInterestShareholding()
    this.shareholdingInCompanyFurtherAcquired = new DirectorDeclarationConflictOfInterestShareholding()
    this.shareholdingInRelatedCompanyFurtherAcquired = new DirectorDeclarationConflictOfInterestShareholding()
    this.shareholdingInCompanyDisposed = new DirectorDeclarationConflictOfInterestShareholding()
    this.shareholdingInRelatedCompanyDisposed = new DirectorDeclarationConflictOfInterestShareholding()
    if (data.shareholdings && Array.isArray(data.shareholdings)) {
      data.shareholdings.forEach((d: any) => {
        if (d.type === DirectorDeclarationConflictOfInterestShareholdingTypes.InCompanyAtAppointment) {
          this.shareholdingInCompanyAtAppointment = new DirectorDeclarationConflictOfInterestShareholding(d)
        }
        if (d.type === DirectorDeclarationConflictOfInterestShareholdingTypes.InRelatedCompanyAtAppointment) {
          this.shareholdingInRelatedCompanyAtAppointment = new DirectorDeclarationConflictOfInterestShareholding(d)
        }
        if (d.type === DirectorDeclarationConflictOfInterestShareholdingTypes.InCompanyFurtherAcquired) {
          this.shareholdingInCompanyFurtherAcquired = new DirectorDeclarationConflictOfInterestShareholding(d)
        }
        if (d.type === DirectorDeclarationConflictOfInterestShareholdingTypes.InRelatedCompanyFurtherAcquired) {
          this.shareholdingInRelatedCompanyFurtherAcquired = new DirectorDeclarationConflictOfInterestShareholding(d)
        }
        if (d.type === DirectorDeclarationConflictOfInterestShareholdingTypes.InCompanyDisposed) {
          this.shareholdingInCompanyDisposed = new DirectorDeclarationConflictOfInterestShareholding(d)
        }
        if (d.type === DirectorDeclarationConflictOfInterestShareholdingTypes.InRelatedCompanyDisposed) {
          this.shareholdingInRelatedCompanyDisposed = new DirectorDeclarationConflictOfInterestShareholding(d)
        }
      })
    }

    this.disclosureOfInterests =
      data.disclosures && Array.isArray(data.disclosures)
        ? data.disclosures.map((d: any) => {
            return new DirectorDeclarationConflictOfInterestDisclosure(d)
          })
        : []
    this.propertiesPossessed =
      data.properties && Array.isArray(data.properties)
        ? data.properties.map((d: any) => {
            return new DirectorDeclarationConflictOfInterestProperty(d)
          })
        : []
    this.signatureId = data.signature_id
    this.signature = data.signature ? new File(data.signature) : null
  }

  cloneDetails(data: DirectorDeclarationConflictOfInterest): void {
    super.clone(data)
    this.directorId = data.directorId
    this.name = data.name
    this.nationality = data.nationality
    this.race = data.race
    this.residentialAddress = data.residentialAddress
    this.identificationType = data.identificationType
    this.identificationNumber = data.identificationNumber
    this.dateOfBirth = data.dateOfBirth
    this.passportExpiryDate = data.passportExpiryDate
    this.businessOccupation = data.businessOccupation
    this.businessAddress = data.businessAddress
    this.emailAddress = data.emailAddress
    this.directorshipsInOtherCompanies = data.directorshipsInOtherCompanies
    this.shareholdingInCompanyAtAppointment = new DirectorDeclarationConflictOfInterestShareholding(
      data.shareholdingInCompanyAtAppointment
    )
    this.shareholdingInRelatedCompanyAtAppointment = new DirectorDeclarationConflictOfInterestShareholding(
      data.shareholdingInRelatedCompanyAtAppointment
    )
    this.shareholdingInCompanyFurtherAcquired = new DirectorDeclarationConflictOfInterestShareholding(
      data.shareholdingInCompanyFurtherAcquired
    )
    this.shareholdingInRelatedCompanyFurtherAcquired = new DirectorDeclarationConflictOfInterestShareholding(
      data.shareholdingInRelatedCompanyFurtherAcquired
    )
    this.shareholdingInCompanyDisposed = new DirectorDeclarationConflictOfInterestShareholding(
      data.shareholdingInCompanyDisposed
    )
    this.shareholdingInRelatedCompanyDisposed = new DirectorDeclarationConflictOfInterestShareholding(
      data.shareholdingInRelatedCompanyDisposed
    )
    this.disclosureOfInterests = data.disclosureOfInterests.map((d: any) => {
      return new DirectorDeclarationConflictOfInterestDisclosure(d)
    })
    this.propertiesPossessed = data.propertiesPossessed.map((d: any) => {
      return new DirectorDeclarationConflictOfInterestProperty(d)
    })
    this.signatureId = data.signatureId
    this.signature = data.signature ? new File(data.signature) : null
  }

  getRequestBody(): object {
    let shareholdings = [
      this.shareholdingInCompanyAtAppointment,
      this.shareholdingInRelatedCompanyAtAppointment,
      this.shareholdingInCompanyFurtherAcquired,
      this.shareholdingInRelatedCompanyFurtherAcquired,
      this.shareholdingInCompanyDisposed,
      this.shareholdingInRelatedCompanyDisposed,
    ].filter((d: DirectorDeclarationConflictOfInterestShareholding) => {
      return !StringUtil.isNullOrEmpty(d.type)
    })

    let directorshipsInOtherCompanies = this.directorshipsInOtherCompanies.filter((d: string) => {
      return !StringUtil.isNullOrEmpty(d)
    })
    let directorshipsInOtherCompaniesString =
      directorshipsInOtherCompanies.length > 0 ? directorshipsInOtherCompanies.join(",") : ""

    let body = {
      name: this.name,
      nationality: this.nationality,
      race: this.race,
      residential_address: this.residentialAddress,
      identification_type: this.identificationType,
      identification_number: this.identificationNumber,
      date_of_birth: this.dateOfBirth,
      passport_expiry_date: this.passportExpiryDate,
      business_occupation: this.businessOccupation,
      business_address: this.businessAddress,
      email_address: this.emailAddress,
      directorships_in_other_companies: directorshipsInOtherCompaniesString,
      shareholdings: shareholdings.map((d: DirectorDeclarationConflictOfInterestShareholding) => {
        return d.getRequestBody()
      }),
      disclosures: this.disclosureOfInterests
        .filter((d: DirectorDeclarationConflictOfInterestDisclosure) => {
          return d.noOfSharesHeld > 0
        })
        .map((d: DirectorDeclarationConflictOfInterestDisclosure) => {
          return d.getRequestBody()
        }),
      properties: this.propertiesPossessed
        .filter((d: DirectorDeclarationConflictOfInterestProperty) => {
          return !StringUtil.isNullOrEmpty(d.particulars)
        })
        .map((d: DirectorDeclarationConflictOfInterestProperty) => {
          return d.getRequestBody()
        }),
      status: this.status,
    }

    return body
  }

  getRequestBodyToCreate(): object {
    return {
      company_id: this.companyId,
      director_id: this.directorId,
      status: this.status,
    }
  }

  canCreate(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId) && !StringUtil.isNullOrEmpty(this.directorId)
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.id) &&
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.directorId)
    )
  }

  async create(repository: ReturnType<typeof useDirectorDeclarationConflictOfInterestStore>): Promise<void> {
    if (!this.canCreate()) {
      let error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBodyToCreate()
    let response = await repository.create(data)
    if (repository.error !== null) {
      let error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useDirectorDeclarationConflictOfInterestStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    let response = await repository.update(this.id, data)
    if (repository.error !== null) {
      let error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async submitSignature(
    signatureFileData: string,
    signatureDate: string,
    fileRepository: ReturnType<typeof useFileStore>,
    repository: ReturnType<typeof useDirectorDeclarationConflictOfInterestStore>
  ): Promise<void> {
    if (!this.canSubmit()) {
      let error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let fileName = crypto.randomUUID()
    let uploadFileData = {
      base64attachment: signatureFileData,
      name: fileName,
      description: `${fileName} Sign on ${signatureDate}`,
      slug: fileName,
    }
    let uploadedFile = await fileRepository.create(uploadFileData)
    if (fileRepository.error) {
      throw fileRepository.error
    }

    let response = await repository.submitSignature(this.id, uploadedFile.id)
    if (repository.error !== null) {
      let error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }
}
