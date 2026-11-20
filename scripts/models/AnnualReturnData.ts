import { Director } from "./Director"
import { Location } from "./Location"
import { MsicCode } from "./MsicCode"
import { Shareholder } from "./Shareholder"
import { User } from "./User"

export class AnnualReturnData {
  id: string = ""
  registrationNumberNew: string = ""
  registrationNumberOld: string = ""
  name: string = ""
  currentName: string = ""
  nameType: string = ""
  businessAddress: Location | null = null
  registeredAddress: Location | null = null
  description: string = ""
  msicCodes: MsicCode[] = []
  directors: Director[] = []
  shareholders: AnnualReturnShareholder[] = []
  totalOrdinaryShares: number = 0
  totalPreferenceShares: number = 0
  totalShares: number = 0

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.registrationNumberNew = data.registration_number_new ?? ""
    this.registrationNumberOld = data.registration_number_old ?? ""
    this.name = data.name ?? ""
    this.currentName = data.current_name ?? ""
    this.nameType = data.name_type ?? ""
    this.businessAddress = data.business_address ? new Location(data.business_address) : null
    this.registeredAddress = data.registered_address ? new Location(data.registered_address) : null
    this.description = data.description ?? ""
    this.msicCodes =
      data.msic_codes && Array.isArray(data.msic_codes)
        ? data.msic_codes.map((d: any) => {
            return new MsicCode(d)
          })
        : []
    this.directors =
      data.directors && Array.isArray(data.directors)
        ? data.directors.map((d: any) => {
            return new Director(d)
          })
        : []
    this.shareholders =
      data.shareholders && Array.isArray(data.shareholders)
        ? data.shareholders.map((d: any) => {
            return new AnnualReturnShareholder(d)
          })
        : []
    this.totalOrdinaryShares = data.total_ordinary_shares ?? 0
    this.totalPreferenceShares = data.total_preference_shares ?? 0
    this.totalShares = data.total_shares ?? 0
  }

  clone(data: AnnualReturnData): void {
    this.id = data.id
    this.registrationNumberNew = data.registrationNumberNew
    this.registrationNumberOld = data.registrationNumberOld
    this.name = data.name
    this.currentName = data.currentName
    this.nameType = data.nameType
    this.businessAddress = data.businessAddress ? new Location(data.businessAddress) : null
    this.registeredAddress = data.registeredAddress ? new Location(data.registeredAddress) : null
    this.description = data.description
    this.msicCodes = data.msicCodes.map((d: any) => {
      return new MsicCode(d)
    })
    this.directors = data.directors.map((d: any) => {
      return new Director(d)
    })
    this.shareholders = data.shareholders.map((d: any) => {
      return new AnnualReturnShareholder(d)
    })
    this.totalOrdinaryShares = data.totalOrdinaryShares
    this.totalPreferenceShares = data.totalPreferenceShares
    this.totalShares = data.totalShares
  }
}

export class AnnualReturnShareholder {
  shareholder: Shareholder = new Shareholder()
  ordinarySharesAtDate: number = 0
  ordinarySharesAtStart: number = 0
  ordinarySharesReceived: number = 0
  ordinarySharesTransferredOut: number = 0
  preferenceSharesAtDate: number = 0
  preferenceSharesAtStart: number = 0
  preferenceSharesReceived: number = 0
  preferenceSharesTransferredOut: number = 0

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof AnnualReturnShareholder) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.shareholder = new Shareholder(data.shareholder)
    this.ordinarySharesAtDate = data.ordinary_shares_at_date
    this.ordinarySharesAtStart = data.ordinary_shares_at_start
    this.ordinarySharesReceived = data.ordinary_shares_received
    this.ordinarySharesTransferredOut = data.ordinary_shares_transferred_out
    this.preferenceSharesAtDate = data.preference_shares_at_date
    this.preferenceSharesAtStart = data.preference_shares_at_start
    this.preferenceSharesReceived = data.preference_shares_received
    this.preferenceSharesTransferredOut = data.preference_shares_transferred_out
  }

  clone(data: AnnualReturnShareholder): void {
    this.shareholder = new Shareholder(data.shareholder)
    this.ordinarySharesAtDate = data.ordinarySharesAtDate
    this.ordinarySharesAtStart = data.ordinarySharesAtStart
    this.ordinarySharesReceived = data.ordinarySharesReceived
    this.ordinarySharesTransferredOut = data.ordinarySharesTransferredOut
    this.preferenceSharesAtDate = data.preferenceSharesAtDate
    this.preferenceSharesAtStart = data.preferenceSharesAtStart
    this.preferenceSharesReceived = data.preferenceSharesReceived
    this.preferenceSharesTransferredOut = data.preferenceSharesTransferredOut
  }
}
