export class DeliveryOption {
  id: string
  value: string
  en: string
  bm: string
  basePrice: number
  productId: string
  excludeRegions: string[] = []
  canCaptureRates: boolean

  notesEn: string = ""
  notesBm: string = ""

  serviceCutOffTime: string[] = []
  serviceScheduleTime: string[] = []
  isSameDay: boolean = false

  constructor(
    id: string,
    value: string,
    en: string,
    bm: string,
    basePrice: number,
    productId: string,
    excludeRegions: string[],
    canCaptureRates: boolean,
    notesEn: string,
    notesBm: string,
    serviceCutOffTime: string[],
    serviceScheduleTime: string[],
    isSameDay: boolean = false
  ) {
    this.id = id
    this.value = value
    this.en = en
    this.bm = bm
    this.basePrice = basePrice
    this.productId = productId
    this.excludeRegions = excludeRegions
    this.canCaptureRates = canCaptureRates
    this.notesEn = notesEn
    this.notesBm = notesBm
    this.serviceCutOffTime = serviceCutOffTime
    this.serviceScheduleTime = serviceScheduleTime
    this.isSameDay = isSameDay
  }
}

export class DeliveryOptions {
  static westMalaysiaCourier = new DeliveryOption(
    "1",
    "by-courier",
    "By Courier",
    "Melalui Kurier",
    10.0, //This price will be overridden with backend call
    "3177a131-4ee1-4aac-84dc-91a9d03a13a3",
    ["sabah", "sarawak", "non-malaysia"],
    false,
    "",
    "",
    [],
    []
  )

  static eastMalaysiaCourier = new DeliveryOption(
    "2",
    "by-courier",
    "By Courier",
    "Melalui Kurier",
    15.0, //This price will be overridden with backend call
    "6f992ad5-fc5b-4596-8aee-50a8654c7153",
    ["west-malaysia", "non-malaysia"],
    false,
    "",
    "",
    [],
    []
  )

  static internationalCourier = new DeliveryOption(
    "3",
    "by-courier",
    "By Courier",
    "Melalui Kurier",
    30.0, //This price will be overridden with backend call
    "6f992ad5-fc5b-4596-8aee-50a8654c7153", //To be replaced with the actual international courier product id
    ["non-malaysia"],
    false,
    "",
    "",
    [],
    []
  )

  static sameDayDelivery = new DeliveryOption(
    "4",
    "same-day-delivery",
    "Same Day Delivery",
    "Penghantaran Hari Sama",
    20.0, //This price will be overridden with backend call
    "e4cf4549-cde6-4f33-b59e-d13838e46fa4",
    [],
    true,
    "Delivery time will be by 5:00PM on the same day for orders placed before 2:00PM (excluding holidays).",
    "Masa penghantaran adalah sebelum 5:00PM pada hari yang sama untuk pesanan yang dibuat sebelum 2:00PM (tidak termasuk hari cuti umum).",
    ["2:00PM"],
    ["11:00AM", "12:00PM", "2:30PM", "3:30PM", "4:30PM"],
    true
  )

  static nextWorkingDay = new DeliveryOption(
    "5",
    "next-working-day-delivery",
    "Next Working Day Delivery",
    "Penghantaran Hari Bekerja Seterusnya",
    20.0, //This price will be overridden with backend call
    "5fbdbd93-8d0a-4d53-8298-cb7faf82057f",
    [],
    true,
    "Delivery time will be between 10.00AM to 12.00PM and 3.00PM to 5.00PM on the next working day (excluding holidays).",
    "Masa penghantaran adalah antara 10.00AM hingga 12.00PM dan 3.00PM hingga 5.00PM pada hari bekerja seterusnya (tidak termasuk hari cuti umum).",
    ["4:00PM"],
    ["11:00AM", "12:00PM", "2:30PM", "3:30PM", "4:30PM"]
  )

  static selfPickup = new DeliveryOption(
    "6",
    "self-pick-up",
    "Self Pick-Up",
    "Ambil Sendiri",
    20.0, //This price will be overridden with backend call
    "f8b9d1b1-e464-44ca-b9a9-e8be46362205",
    [],
    false,
    "Only on weekdays from 10.00AM to 12.00PM and 3.00PM to 5.00PM (excluding holidays).",
    "Hari bekerja sahaja dari 10.00AM hingga 12.00PM dan 3.00PM hingga 5.00PM (tidak termasuk hari cuti umum).",
    ["2:00PM"],
    ["11:00AM", "12:00PM", "2:30PM", "3:30PM", "4:30PM"],
    true
  )

  static download = new DeliveryOption("7", "download", "Download", "Muat Turun", 0.0, "", [], false, "", "", [], [])

  static email = new DeliveryOption("8", "email", "Email", "Emel", 0.0, "", [], false, "", "", [], [])

  static options: DeliveryOption[] = [
    DeliveryOptions.westMalaysiaCourier,
    DeliveryOptions.eastMalaysiaCourier,
    DeliveryOptions.internationalCourier,
    DeliveryOptions.sameDayDelivery,
    DeliveryOptions.nextWorkingDay,
    DeliveryOptions.selfPickup,
    DeliveryOptions.download,
    DeliveryOptions.email,
  ]

  static freeDeliveryValues: string[] = DeliveryOptions.options
    .filter((option: DeliveryOption) => {
      return option.basePrice === 0.0
    })
    .map((option: DeliveryOption) => {
      return option.value
    })

  static captureRateDeliveryValues: string[] = DeliveryOptions.options
    .filter((option: DeliveryOption) => {
      return option.canCaptureRates
    })
    .map((option: DeliveryOption) => {
      return option.value
    })
}
