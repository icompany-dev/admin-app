import { EmailUser } from "~/scripts/library/EmailUser"
import { User } from "~/scripts/models/User"
import { UserDetail } from "~/scripts/models/UserDetail"
import { PropsUserDetail } from "~/scripts/props/PropsUserDetail"
import { StringUtil } from "~/scripts/utils/String"

export class UserDetailController {
  user: Ref<User> = ref<User>(new User())
  userDetail: Ref<UserDetail> = ref<UserDetail>(new UserDetail())

  emitEvents: any | null = null

  language = useLanguage()

  constructor(props: PropsUserDetail, emitEvents: any) {
    this.emitEvents = emitEvents
  }

  setDataFromProps(props: PropsUserDetail): void {
    this.user.value = new User(props.user)
    this.userDetail.value = new UserDetail(props.userDetail)
  }

  onEmailClicked(): void {
    let emailUser = new EmailUser(this.email)
    emailUser.connectToGmail()
  }

  get name(): string {
    return this.user.value.name
  }

  get email(): string {
    return this.user.value.email
  }

  get phone(): string {
    return this.user.value.phone
  }

  get identificationType(): string {
    let type = "MYKAD"
    return this.language.isMalay() ? `No. ${type}` : `${type} No.`
  }

  get identificationNumber(): string {
    return this.userDetail.value.identification
  }

  get raceLabel(): string {
    return this.language.isMalay() ? "Bangsa" : "Race"
  }

  get race(): string {
    return this.userDetail.value.race?.toUpperCase() ?? "(Unknown)"
  }

  get addressLabel(): string {
    return this.language.isMalay() ? "Alamat" : "Address"
  }

  get addressLine1(): string {
    return this.userDetail.value.location?.addressLine1?.toUpperCase() ?? "-"
  }

  get addressLine2(): string {
    return this.userDetail.value.location?.addressLine2?.toUpperCase() ?? "-"
  }

  get addressLine3(): string {
    return this.userDetail.value.location?.addressLine3?.toUpperCase() ?? "-"
  }

  get addressPostcode(): string {
    return this.userDetail.value.location?.postcode ?? "-"
  }

  get addressCity(): string {
    if (StringUtil.isEqual(this.userDetail.value.location?.city?.name ?? "", "others")) {
      return this.userDetail.value.location?.otherCity?.toUpperCase() ?? ""
    }

    return this.userDetail.value.location?.city?.name.toUpperCase() ?? "-"
  }

  get addressState(): string {
    if (StringUtil.isEqual(this.userDetail.value.location?.state?.name ?? "", "others")) {
      return this.userDetail.value.location?.otherState?.toUpperCase() ?? ""
    }

    return this.userDetail.value.location?.state?.name.toUpperCase() ?? "-"
  }

  get addressCountry(): string {
    if (StringUtil.isEqual(this.userDetail.value.location?.country?.name ?? "", "others")) {
      return this.userDetail.value.location?.otherCountry?.toUpperCase() ?? ""
    }

    return this.userDetail.value.location?.country?.name.toUpperCase() ?? "-"
  }
}
