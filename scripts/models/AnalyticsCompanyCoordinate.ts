import { Coordinate } from "./Coordinate"
import { MsicCode } from "./MsicCode"
import _ from "lodash"

export class AnalyticsCompanyCoordinate {
  companyId: string = ""
  name: string = ""
  address: string = ""
  msicCodes: MsicCode[] = []
  coordinate = new Coordinate()
  annualReturnCompliance: any = null // need to set the type here

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof AnalyticsCompanyCoordinate) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.companyId = data.company_id ?? ""
    this.name = data.name
    this.address = data.address
    this.msicCodes =
      data.msic_codes && Array.isArray(data.msic_codes)
        ? data.msic_codes.map((msicCode: any) => {
            return new MsicCode(msicCode)
          })
        : []
    this.coordinate = new Coordinate(data.coordinates ?? null)
    this.annualReturnCompliance = data.annual_return_compliance ? _.cloneDeep(data.annual_return_compliance) : null
  }

  clone(data: AnalyticsCompanyCoordinate): void {
    this.companyId = data.companyId
    this.name = data.name
    this.address = data.address
    this.msicCodes = data.msicCodes.map((msicCode) => {
      return new MsicCode(msicCode)
    })
    this.coordinate = new Coordinate(data.coordinate)
    this.annualReturnCompliance = data.annualReturnCompliance ? _.cloneDeep(data.annualReturnCompliance) : null
  }
}
