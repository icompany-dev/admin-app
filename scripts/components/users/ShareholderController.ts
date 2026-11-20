import { Shareholder } from "~/scripts/models/Shareholder"
import { User } from "~/scripts/models/User"
import { UserDetail } from "~/scripts/models/UserDetail"
import type { PropsShareholderDetail } from "~/scripts/props/PropsShareholderDetail"
import { PropsUserDetail } from "~/scripts/props/PropsUserDetail"
import { NumberUtil } from "~/scripts/utils/Number"

export class ShareholderController {
  shareholder: Ref<Shareholder> = ref<Shareholder>(new Shareholder())

  emitEvents: any | null = null

  language = useLanguage()

  constructor(props: PropsShareholderDetail, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setDataFromProps(props)
  }

  setDataFromProps(props: PropsShareholderDetail): void {
    this.shareholder.value = new Shareholder(props.shareholder)
  }

  get userDetailProps(): PropsUserDetail {
    return new PropsUserDetail(
      this.shareholder.value.user ?? new User(),
      this.shareholder.value.user?.detail ?? new UserDetail()
    )
  }

  get isCorporateShareholder(): boolean {
    return this.shareholder.value.isCorporateRepresentative()
  }

  get shareholderName(): string {
    return this.shareholder.value.fullName()
  }

  get addressLine1(): string {
    if (!this.isCorporateShareholder) {
      return ""
    }

    return this.shareholder.value.location?.addressLine1.toUpperCase() ?? ""
  }

  get addressLine2(): string {
    if (!this.isCorporateShareholder) {
      return ""
    }

    return this.shareholder.value.location?.addressLine2?.toUpperCase() ?? ""
  }

  get addressLine3(): string {
    if (!this.isCorporateShareholder) {
      return ""
    }

    return this.shareholder.value.location?.addressLine3?.toUpperCase() ?? ""
  }

  get postcode(): string {
    if (!this.isCorporateShareholder) {
      return ""
    }

    return this.shareholder.value.location?.postcode ?? ""
  }

  get cityName(): string {
    if (!this.isCorporateShareholder) {
      return ""
    }

    return this.shareholder.value.location?.city?.name.toUpperCase() ?? ""
  }

  get stateName(): string {
    if (!this.isCorporateShareholder) {
      return ""
    }

    return this.shareholder.value.location?.state?.name.toUpperCase() ?? ""
  }

  get countryName(): string {
    if (!this.isCorporateShareholder) {
      return ""
    }

    return this.shareholder.value.location?.country?.name.toUpperCase() ?? ""
  }

  get registrationNumber(): string {
    if (!this.isCorporateShareholder) {
      return ""
    }

    return this.shareholder.value.identification
  }

  get corporateRepresentativeLabel(): string {
    return this.language.isMalay() ? "Wakil Korporat" : "Corporate Representative"
  }

  get ordinaryShares(): string {
    return NumberUtil.thousandSeparator(this.shareholder.value.ordinaryShares)
  }

  get preferenceShares(): string {
    return NumberUtil.thousandSeparator(this.shareholder.value.preferenceShares)
  }
}
