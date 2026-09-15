import { ShareholdingType } from "../constants/Shareholder"

export class CompanyShareAllotToExternal {
  allotmentDetailId: string = ""
  shareholdingType: ShareholdingType = ShareholdingType.Individual
  name: string = ""
  identificationType: string = "ic" // IC, company registration number, passport
  identificationNumber: string = ""
  identificationNumberAlt: string | null = null
  numberOfShares: number = 1

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyShareAllotToExternal) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.allotmentDetailId = data.allotment_detail_id
    this.shareholdingType = data.shareholding_type
    this.name = data.name
    this.identificationType = data.identification_type
    this.identificationNumber = data.identification_number
    this.identificationNumberAlt = data.identification_number_alt
    this.numberOfShares = data.number_of_shares
  }

  clone(data: CompanyShareAllotToExternal): void {
    this.allotmentDetailId = data.allotmentDetailId
    this.shareholdingType = data.shareholdingType
    this.name = data.name
    this.identificationType = data.identificationType
    this.identificationNumber = data.identificationNumber
    this.identificationNumberAlt = data.identificationNumberAlt
    this.numberOfShares = data.numberOfShares
  }

  getRequestBody(): object {
    return {
      shareholding_type: this.shareholdingType,
      name: this.name,
      identification_type: this.identificationType,
      identification_number: this.identificationNumber,
      identification_number_alt: this.identificationNumberAlt,
      number_of_shares: this.numberOfShares,
    }
  }

  get shareholdingTypeName(): string {
    return this.shareholdingType === ShareholdingType.Individual
      ? "Natural Person / Individual"
      : "Artificial Person / Legal Entity"
  }
}
