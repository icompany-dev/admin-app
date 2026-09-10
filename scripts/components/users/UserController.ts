import { EmailUser } from "~/scripts/library/EmailUser"
import type { IRepositoryStore } from "~/scripts/models/IRepositoryStore"
import { User } from "~/scripts/models/User"
import type { UserDetail } from "~/scripts/models/UserDetail"
import type { PropsUserDetail } from "~/scripts/props/PropsUserDetail"
import { StringUtil } from "~/scripts/utils/String"

export abstract class UserController {
  id: Ref<string> = ref<string>("")
  user: Ref<User> = ref<User>(new User())

  isLoading: Ref<boolean> = ref<boolean>(false)

  isInEditMode: Ref<boolean> = ref<boolean>(false)
  isUpdating: Ref<boolean> = ref<boolean>(false)
  isRemoving: Ref<boolean> = ref<boolean>(false)

  removeConfirmationRef: any | null = null

  repository: IRepositoryStore

  emitEvents: any | null = null

  language = useLanguage()

  constructor(props: PropsUserDetail, repository: IRepositoryStore, emitEvents: any) {
    this.emitEvents = emitEvents
    this.repository = repository

    this.setDataFromProps(props)
  }

  setDataFromProps(props: PropsUserDetail): void {
    this.id.value = props.id
    this.user.value = props.user
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

  get userDetail(): UserDetail | null {
    return this.user.value.detail
  }

  get identificationType(): string {
    let type = "MyKad"
    if (this.userDetail) {
      type = this.userDetail.identificationType === "passport" ? "Passport" : "MyKad"
    }

    return this.language.isMalay() ? `No. ${type}` : `${type} No.`
  }

  get identificationNumber(): string {
    return this.userDetail?.identification ?? "(eKYC required)"
  }

  get raceLabel(): string {
    return this.language.isMalay() ? "Bangsa" : "Race"
  }

  get race(): string {
    return this.userDetail?.race?.toUpperCase() ?? "(Unknown)"
  }

  get addressLabel(): string {
    return this.language.isMalay() ? "Alamat" : "Address"
  }

  get addressLine1(): string {
    return this.userDetail?.location?.addressLine1.toUpperCase() ?? "-"
  }

  get hasAddressLine2(): boolean {
    return !StringUtil.isNullOrEmpty(this.userDetail?.location?.addressLine2 ?? "")
  }

  get addressLine2(): string {
    return this.userDetail?.location?.addressLine2?.toUpperCase() ?? "-"
  }

  get addressPostcode(): string {
    return this.userDetail?.location?.postcode ?? "-"
  }

  get addressCity(): string {
    return this.userDetail?.location?.city?.name.toUpperCase() ?? "-"
  }

  get addressState(): string {
    return this.userDetail?.location?.state?.name.toUpperCase() ?? "-"
  }

  get addressCountry(): string {
    return this.userDetail?.location?.country?.name.toUpperCase() ?? "-"
  }

  get removeLabel(): string {
    return this.language.isMalay() ? "Padam" : "Remove"
  }
}
