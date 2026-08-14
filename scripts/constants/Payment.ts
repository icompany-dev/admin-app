import { SelectOption } from "../types/SelectOption"

export class PaymentConstants {
  static BILL_FOR_INCORPORATION: string = "bill-for-incorporation"
  static BILL_FOR_SWITCH: string = "bill-for-switch"
  static BILL_FOR_SECRETARIAL_SERVICES: string = "bill-for-secretarial-services"
  static BILL_FOR_SUBSCRIPTION: string = "bill-for-subscription"
  static BILL_FOR_MERCHANDISES: string = "bill-for-merchandises"

  static PAYMENT_CART_STATUS_PENDING: string = "pending"
  static PAYMENT_CART_STATUS_PAID: string = "paid"

  static PAYMENT_CART_ENTITY_TYPE_COMPANY: string = "company"
  static PAYMENT_CART_ENTITY_TYPE_APPLICATION_INCORPORATE: string = "application_incorporate"
  static PAYMENT_CART_ENTITY_TYPE_APPLICATION_SWITCH: string = "application_switch"

  static PAYMENT_ORDER_STATUS_PENDING: string = "pending"
  static PAYMENT_ORDER_STATUS_PAID: string = "paid"
}

export class CtcConstants {
  static CTC_TYPE_NONE: string = "none"
  static CTC_TYPE_COSEC: string = "cosec"
  static CTC_TYPE_SSM: string = "ssm"
  static CTC_OPTION_PAGE: string = "per page"
  static CTC_OPTION_APPLICATION: string = "per application"
  static CTC_OPTION_BATCH: string = "per batch"
  static CTC_COPIES_SINGLE: string = "single"
  static CTC_COPIES_DUPLICATE: string = "duplicate"
  static CTC_COPIES_TRIPLICATE: string = "triplicate"

  static TYPE_OPTIONS_EN = [
    new SelectOption(this.CTC_TYPE_NONE, this.CTC_TYPE_NONE, "None"),
    new SelectOption(this.CTC_TYPE_COSEC, this.CTC_TYPE_COSEC, "by CoSec"),
    new SelectOption(this.CTC_TYPE_SSM, this.CTC_TYPE_SSM, "by SSM"),
  ]

  static TYPE_OPTIONS_BM = [
    new SelectOption(this.CTC_TYPE_NONE, this.CTC_TYPE_NONE, "Tiada"),
    new SelectOption(this.CTC_TYPE_COSEC, this.CTC_TYPE_COSEC, "oleh S/U"),
    new SelectOption(this.CTC_TYPE_SSM, this.CTC_TYPE_SSM, "oleh SSM"),
  ]

  static OPTIONS_EN = [
    new SelectOption(this.CTC_OPTION_PAGE, this.CTC_OPTION_PAGE, "per page"),
    new SelectOption(this.CTC_OPTION_APPLICATION, this.CTC_OPTION_APPLICATION, "per application"),
    new SelectOption(this.CTC_OPTION_BATCH, this.CTC_OPTION_BATCH, "per batch"),
  ]

  static OPTIONS_BM = [
    new SelectOption(this.CTC_OPTION_PAGE, this.CTC_OPTION_PAGE, "setiap mukasurat"),
    new SelectOption(this.CTC_OPTION_APPLICATION, this.CTC_OPTION_APPLICATION, "setiap permohonan"),
    new SelectOption(this.CTC_OPTION_BATCH, this.CTC_OPTION_BATCH, "setiap kelompok"),
  ]

  static COPY_OPTIONS_EN = [
    new SelectOption(this.CTC_COPIES_SINGLE, this.CTC_COPIES_SINGLE, "single (one set)"),
    new SelectOption(this.CTC_COPIES_DUPLICATE, this.CTC_COPIES_DUPLICATE, "duplicate (two sets)"),
    new SelectOption(this.CTC_COPIES_TRIPLICATE, this.CTC_COPIES_TRIPLICATE, "triplicate (three sets)"),
  ]

  static COPY_OPTIONS_BM = [
    new SelectOption(this.CTC_COPIES_SINGLE, this.CTC_COPIES_SINGLE, "satu set"),
    new SelectOption(this.CTC_COPIES_DUPLICATE, this.CTC_COPIES_DUPLICATE, "dua set"),
    new SelectOption(this.CTC_COPIES_TRIPLICATE, this.CTC_COPIES_TRIPLICATE, "tiga set"),
  ]
}

export class DeliveryOptionConfig {
  id: string
  selectOption: SelectOption
  alertNotice: string
  limitation: (value: any) => boolean

  constructor(id: string, selectOption: SelectOption, alertNotice: string, limitation: (value: any) => boolean) {
    this.id = id
    this.selectOption = selectOption
    this.alertNotice = alertNotice
    this.limitation = limitation
  }
}

export class DeliveryConstants {
  static DELIVERY_NONE: string = "none"
  static DELIVERY_EMAIL: string = "email"
  static DELIVERY_WHATSAPP: string = "whatsapp"
  static DELIVERY_THIRD_PARTY: string = "third-party"
  static DELIVERY_OUR_FLEET: string = "our-fleet"
  static DELIVERY_SELF_PICKUP: string = "self-pickup"
  static DELIVERY_COURIER: string = "courier"
  static DELIVERY_INTERNATIONAL: string = "international"

  static DELIVERY_OPTIONS_EN = [
    new DeliveryOptionConfig(
      this.DELIVERY_NONE,
      new SelectOption(this.DELIVERY_NONE, this.DELIVERY_NONE, "None"),
      "",
      this.noLimitation
    ),
    new DeliveryOptionConfig(
      this.DELIVERY_EMAIL,
      new SelectOption(this.DELIVERY_EMAIL, this.DELIVERY_EMAIL, "Email"),
      "",
      this.noLimitation
    ),
    new DeliveryOptionConfig(
      this.DELIVERY_WHATSAPP,
      new SelectOption(this.DELIVERY_WHATSAPP, this.DELIVERY_WHATSAPP, "WhatsApp"),
      "",
      this.noLimitation
    ),
    new DeliveryOptionConfig(
      this.DELIVERY_THIRD_PARTY,
      new SelectOption(this.DELIVERY_THIRD_PARTY, this.DELIVERY_THIRD_PARTY, "Reverse Pick-Up"),
      "Delivery cost is payable when the item is delivered.",
      this.isWithinKlangValley
    ),
    new DeliveryOptionConfig(
      this.DELIVERY_OUR_FLEET,
      new SelectOption(this.DELIVERY_OUR_FLEET, this.DELIVERY_OUR_FLEET, "Our Fleet"),
      "10km Within Shah Alam only.",
      this.isWithinShahAlam
    ),
    new DeliveryOptionConfig(
      this.DELIVERY_SELF_PICKUP,
      new SelectOption(this.DELIVERY_SELF_PICKUP, this.DELIVERY_SELF_PICKUP, "Self Pick-Up"),
      "After 2.30pm",
      this.noLimitation
    ),
    new DeliveryOptionConfig(
      this.DELIVERY_COURIER,
      new SelectOption(this.DELIVERY_COURIER, this.DELIVERY_COURIER, "Courier"),
      "1 - 3 Working Days",
      this.isWithinMalaysia
    ),
    new DeliveryOptionConfig(
      this.DELIVERY_INTERNATIONAL,
      new SelectOption(this.DELIVERY_INTERNATIONAL, this.DELIVERY_INTERNATIONAL, "International Delivery"),
      "We will ship using DHL or any similar courier service",
      this.isNotInMalaysia
    ),
  ]

  static DELIVERY_OPTIONS_BM = [
    new DeliveryOptionConfig(
      this.DELIVERY_NONE,
      new SelectOption(this.DELIVERY_NONE, this.DELIVERY_NONE, "Tiada"),
      "",
      this.noLimitation
    ),
    new DeliveryOptionConfig(
      this.DELIVERY_EMAIL,
      new SelectOption(this.DELIVERY_EMAIL, this.DELIVERY_EMAIL, "Emel"),
      "",
      this.noLimitation
    ),
    new DeliveryOptionConfig(
      this.DELIVERY_WHATSAPP,
      new SelectOption(this.DELIVERY_WHATSAPP, this.DELIVERY_WHATSAPP, "WhatsApp"),
      "",
      this.noLimitation
    ),
    new DeliveryOptionConfig(
      this.DELIVERY_THIRD_PARTY,
      new SelectOption(this.DELIVERY_THIRD_PARTY, this.DELIVERY_THIRD_PARTY, "Penghantaran Pulangan"),
      "Kos Penghantaran akan ditanggung sepenuhnya oleh anda",
      this.isWithinKlangValley
    ),
    new DeliveryOptionConfig(
      this.DELIVERY_OUR_FLEET,
      new SelectOption(this.DELIVERY_OUR_FLEET, this.DELIVERY_OUR_FLEET, "Kurier Kami"),
      "10km sekitar Shah Alam.",
      this.isWithinShahAlam
    ),
    new DeliveryOptionConfig(
      this.DELIVERY_SELF_PICKUP,
      new SelectOption(this.DELIVERY_SELF_PICKUP, this.DELIVERY_SELF_PICKUP, "Ambil Sendiri"),
      "Selepas 2.30pm",
      this.noLimitation
    ),
    new DeliveryOptionConfig(
      this.DELIVERY_COURIER,
      new SelectOption(this.DELIVERY_COURIER, this.DELIVERY_COURIER, "Kurier"),
      "1 - 3 Hari berkerja",
      this.isWithinMalaysia
    ),
    new DeliveryOptionConfig(
      this.DELIVERY_INTERNATIONAL,
      new SelectOption(this.DELIVERY_INTERNATIONAL, this.DELIVERY_INTERNATIONAL, "Penghantaran Luar Negara"),
      "Kami akan hantar melalui DHL atau kurier lain mengikut kesesuaian.",
      this.isNotInMalaysia
    ),
  ]

  static noLimitation(value: string): boolean {
    return true
  }

  static isWithinShahAlam(deliveryCity: string): boolean {
    return deliveryCity.toLowerCase() === "shah alam"
  }

  static isWithinKlangValley(deliveryState: string): boolean {
    return deliveryState.toLowerCase() === "selangor" || deliveryState.toLowerCase() === "kuala lumpur"
  }

  static isWithinMalaysia(deliveryCountry: string): boolean {
    return deliveryCountry.toLowerCase() === "malaysia"
  }

  static isNotInMalaysia(deliveryCountry: string): boolean {
    return deliveryCountry.toLowerCase() !== "malaysia"
  }
}

export enum ControlledServicePricingId {
  ParticularsOfShareholder = "4810227c-b652-4cdd-bd99-a87b6f4b3044",
  ParticularsOfDirectors = "c2090de2-9468-4037-90bd-dab13f02de45",
  CorporateProfile = "1ddee1cf-aa6e-4794-b413-5822d17c0354",
  CertificateOfIncorporationLatestCopy = "7effe05a-ab53-42e5-a549-90a89a5e0162",
  CertificateOfIncorporation = "7324104a-e524-42ca-a93b-25939c0ec28b",
  CertificateChangeOfName = "e57fe69f-302a-4572-b6e7-08f0bee02c95",
  SuperformLatestCopy = "2220c745-6ace-4c0f-a8b7-6989b22e20a0",
  Superform = "4084d57f-46a6-4eb8-8854-8351e633f5db",
  OutstandingAnnualReturn = "022b9b5b-08d9-4490-b4ab-a583e4c86edf",
  MinimumCompoundBySSM = "724238b3-3f9a-4388-888f-60e3f94dbfb6",
}
