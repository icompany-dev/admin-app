import { City, State, type Location, Country } from "~/scripts/models/Location"
import { AddressInputController } from "./AddressInputController"
import { DeliveryAddress } from "~/scripts/types/DeliveryAddress"
import { useLanguage } from "#imports"
import { User } from "~/scripts/models/User"

export class DeliveryAddressInputController extends AddressInputController {
  name = ref<string>("")
  email = ref<string | null>(null)
  phone = ref<string | null>(null)

  cityName = ref<string | null>(null)
  stateName = ref<string | null>(null)
  countryName = ref<string | null>(null)

  isSameAsResidential = ref<boolean>(true)
  currentUser = ref<User>(new User())

  language = useLanguage()

  constructor(currentUser: User, emitEvents: any | null, location: Location | null = null) {
    super(emitEvents, location)

    this.setCurrentUser(currentUser)
  }

  setCurrentUser(user: User): void {
    this.currentUser.value.clone(user)
    this.name.value = this.currentUser.value.name
    this.email.value = this.currentUser.value.email
    this.phone.value = this.currentUser.value.phone
  
    this.onSameAsResidentialAddressChecked()
  }

  async onPostcodeInput(): Promise<void> {
    await super.onPostcodeChanged()

    if (this.selectedCity.value) {
      this.cityName.value = this.selectedCity.value.name
      this.emitEvents("updateCity", this.selectedCity.value)
    } else {
      this.cityName.value = null
    }

    if (this.selectedState.value) {
      this.stateName.value = this.selectedState.value.name
      this.emitEvents("updateState", this.selectedState.value)
    } else {
      this.stateName.value = null
    }

    if (this.selectedState.value) {
      this.countryName.value = this.selectedCountry.value ? this.selectedCountry.value.name : null
      this.emitEvents("updateCountry", this.selectedCountry.value)
    }
  }

  onSameAsResidentialAddressChecked(): void {
    if (!this.isSameAsResidential.value) {
      return
    }

    let residentialAddress = this.currentUser.value.detail?.location ?? null
    if (!residentialAddress) {
      return
    }

    this.addressLine1.value = residentialAddress.addressLine1
    this.addressLine2.value = residentialAddress.addressLine2
    this.postcode.value = residentialAddress.postcode
    this.selectedCity.value = new City(residentialAddress.city)
    this.cityName.value = residentialAddress.city?.name ?? ""
    this.selectedState.value = new State(residentialAddress.state)
    this.stateName.value = residentialAddress.state?.name ?? ""
    this.selectedCountry.value = new Country(residentialAddress.country)
    this.countryName.value = residentialAddress.country?.name ?? ""
    this.emitEvents("updateAddressLine1", this.addressLine1.value)
  }

  isFieldDisabled(): boolean {
    return this.isSameAsResidential.value
  }

  getDeliveryAddress(): DeliveryAddress {
    return new DeliveryAddress({
      name: this.name.value,
      email: this.email.value,
      phone: this.phone.value,
      addressLine1: this.addressLine1.value ?? "",
      addressLine2: this.addressLine2.value,
      city: this.cityName.value ? this.cityName.value : "",
      state: this.stateName.value ?? "",
      postcode: this.postcode.value ?? "",
      country: this.countryName.value ? this.countryName.value : "",
    })
  }

  //region copywriting
  recipientLabel(): string {
    return this.language.isMalay() ? "Nama Penerima" : "Recipient"
  }

  emailLabel(): string {
    return this.language.isMalay() ? "Emel Penerima" : "Recipient Email"
  }

  phoneLabel(): string {
    return this.language.isMalay() ? "Telefon Bimbit Penerima" : "Recipient Mobile Number"
  }

  addressLine1Label(): string {
    return this.language.isMalay() ? "Alamat Baris 1" : "Address Line 1"
  }

  addressLine1Placeholder(): string {
    return this.language.isMalay()
      ? "No Rumah, No Pejabat, Nama Bangunan dan lain-lain"
      : "House No, Office Suite No, Building Name and etc"
  }

  addressLine2Label(): string {
    return this.language.isMalay() ? "Alamat Baris 2" : "Address Line 2"
  }

  addressLine2Placeholder(): string {
    return this.language.isMalay() ? "Nama Jalan, Lorong dan lain-lain" : "Street Name, Road Name and etc."
  }

  postcodeLabel(): string {
    return this.language.isMalay() ? "Poskod" : "Postcode"
  }

  cityLabel(): string {
    return this.language.isMalay() ? "Bandar" : "City"
  }

  stateLabel(): string {
    return this.language.isMalay() ? "Negeri" : "State"
  }

  countryLabel(): string {
    return this.language.isMalay() ? "Negara" : "Country"
  }

  sameAsResidentialLabel(): string {
    return this.language.isMalay() ? "Sama seperti Alamat Rumah" : "Same as Residential Address"
  }

  sameAsResidentialSubnote(): string {
    return this.language.isMalay()
      ? "Ini Alamat yang anda daftar bersama kami."
      : "This is the Address you registered with us."
  }

  addressAutoComplete(): string {
    return this.language.isMalay()
      ? "Ruang Bandar dan Negeri akan diisi secara automatik apabila poskod Malaysia diisi."
      : "City and State fields are automatically completed once you input a valid Malaysian Postcode."
  }

  shippingNotice(): string {
    return this.language.isMalay()
      ? `Penghantaran akan disempurnakan oleh J&T untuk negara-negara yang disokong di Asia Tenggara dan China.<br>
        Untuk lokasi lain, penghantaran akan disempurnakan oleh DHL.`
      : "Shipping will be completed by J&T for supported countries in South East Asia and China.<br>For other locations, shipping will be completed by DHL."
  }
  //endregion
}
