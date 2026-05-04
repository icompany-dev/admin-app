import { File } from "./File"
import { Location } from "./Location"

export class UserDetail {
  identification: string = ""
  identificationType: string = ""
  race: string = ""
  customRace: string = ""
  citizenship: string = ""
  gender: string = ""
  image: File | null = null
  location: Location | null = null
  shippingLocation: Location | null = null
  verificationFile: File | null = null
  verificationFileAlt: File | null = null
  identificationVerified: boolean = false
  licenseNumber: string = ""

  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any = null) {
    if (data !== null) {
      if (data instanceof UserDetail) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  convertFromResponse(data: any) {
    this.identification = data.identification
    this.identificationType = data.identification_type
    this.race = data.race
    this.customRace = data.custom_race
    this.citizenship = data.citizenship
    this.gender = data.gender
    this.image = new File(data.image ?? null)
    this.location = new Location(data.location ?? null)
    this.shippingLocation = new Location(data.shipping_location ?? null)
    this.verificationFile = new File(data.verification_file ?? null)
    this.verificationFileAlt = new File(data.verification_file_alt ?? null)
    this.identificationVerified = data.identification_verified
    this.licenseNumber = data.license_number
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: UserDetail) {
    this.identification = data.identification
    this.identificationType = data.identificationType
    this.race = data.race
    this.customRace = data.customRace
    this.citizenship = data.citizenship
    this.gender = data.gender
    this.image = new File(data.image ?? null)
    this.location = new Location(data.location ?? null)
    this.shippingLocation = new Location(data.shippingLocation ?? null)
    this.verificationFile = new File(data.verificationFile ?? null)
    this.verificationFileAlt = new File(data.verificationFileAlt ?? null)
    this.identificationVerified = data.identificationVerified
    this.licenseNumber = data.licenseNumber
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): any {
    const body: any = {
      identification: this.identification,
      identification_type: this.identificationType,
      gender: this.gender,
      citizenship: this.citizenship,
      race: this.race,
      custom_race: this.customRace,
      license_number: this.licenseNumber,
      identification_verified: this.identificationVerified,
    }

    if (this.image && this.image.id) {
      body.image_id = this.image.id
    }

    if (this.verificationFile && this.verificationFile.id) {
      body.verification_file_id = this.verificationFile.id
    }

    if (this.verificationFileAlt && this.verificationFileAlt.id) {
      body.verification_file_alt_id = this.verificationFileAlt.id
    }

    if (this.location) {
      body.location = this.location.getRequestBody()
    }

    return body
  }

  getIdentificationTypeText() {
    if (this.identificationType === "passport") {
      return "Passport"
    }

    return "MyKad"
  }
}
