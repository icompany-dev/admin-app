export class BillplzPaymentGateway {
  id: string = "" // this is a dummy id - not needed
  code: string = ""
  name: string = ""
  active: boolean = false
  billPlzCategory: string = ""
  category: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof BillplzPaymentGateway) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }

    this.mapCategoryName()
  }

  convertFromResponse(data: any): void {
    this.code = data.code ?? ""
    this.name = data.name ?? ""
    this.active = data.active ?? false
    this.billPlzCategory = data.category ?? ""
    this.category = data.category ?? ""
  }

  clone(data: BillplzPaymentGateway): void {
    this.id = data.id
    this.code = data.code
    this.name = data.name
    this.active = data.active
    this.billPlzCategory = data.billPlzCategory
    this.category = data.category
  }

  mapCategoryName(): void {
    switch (this.category.toLowerCase()) {
      case "bankislam":
        this.category = "Credit Card"
        this.name = "Bank Islam Visa / Mastercard"
        break
      case "billplz":
        this.category = "Simulator"
        break
      case "billplz::card":
        this.category = "Credit Card"
        this.name = "Visa / Mastercard"
        break
      case "boost":
        this.category = "E-Wallet & QR"
        break
      case "fpx":
        this.category = "FPX"
        break
      case "fpxb2b1":
        this.category = "More"
        break
      case "maybank":
        this.category = "Credit Card"
        this.name = `Maybank ${this.name}`
        break
      case "ocbc":
        this.category = "Credit Card"
        this.name = "OCBC Visa / Mastercard"
        break
      case "paypal":
        this.category = "More"
        break
      case "touchngo":
        this.category = "E-Wallet & QR"
        this.name = "TnG"
        break
      case "twoctwopbnpl":
        this.category = "BNPL"
        break
      case "razerpay":
        this.category = "E-Wallet & QR"
        break
      case "2c2p":
        this.category = "E-Wallet & QR"
        break
    }
  }

  logo(): string {
    const url = `${window.location.origin}/img/payment_gateways/`
    const logos = this.logoMaps().filter((logo: BillplzPaymentGatewayLogoMap) => {
      return this.name.toLowerCase().includes(logo.short)
    })

    if (logos.length <= 0) {
      return url + "billplz.png"
    }

    return url + logos[0].logo
  }

  logoMaps(): BillplzPaymentGatewayLogoMap[] {
    return [
      new BillplzPaymentGatewayLogoMap("affin", "affin.png"),
      new BillplzPaymentGatewayLogoMap("agro", "agronet.png"),
      new BillplzPaymentGatewayLogoMap("alliance", "alliance.png"),
      new BillplzPaymentGatewayLogoMap("amonline", "ambank.png"),
      new BillplzPaymentGatewayLogoMap("amaccess", "ambank.png"),
      new BillplzPaymentGatewayLogoMap("atome", "atome.jpeg"),
      new BillplzPaymentGatewayLogoMap("boost", "boost.png"),
      new BillplzPaymentGatewayLogoMap("bsn", "bsn.png"),
      new BillplzPaymentGatewayLogoMap("cimb", "cimb-bank.png"),
      new BillplzPaymentGatewayLogoMap("citi", "citibank.png"),
      new BillplzPaymentGatewayLogoMap("grabpaylater", "grabpaylater.png"),
      new BillplzPaymentGatewayLogoMap("grab", "grab-pay.png"),
      new BillplzPaymentGatewayLogoMap("hlb", "hlb.png"),
      new BillplzPaymentGatewayLogoMap("hsbc", "hsbc.png"),
      new BillplzPaymentGatewayLogoMap("islam", "bank-islam.png"),
      new BillplzPaymentGatewayLogoMap("kfh", "kfh.png"),
      new BillplzPaymentGatewayLogoMap("maybank", "maybank.png"),
      new BillplzPaymentGatewayLogoMap("muamalat", "muamalat.png"),
      new BillplzPaymentGatewayLogoMap("ocbc", "ocbc.png"),
      new BillplzPaymentGatewayLogoMap("paypal", "paypal.webp"),
      new BillplzPaymentGatewayLogoMap("pbe", "public-bank.png"),
      new BillplzPaymentGatewayLogoMap("rakyat", "bank-rakyat.png"),
      new BillplzPaymentGatewayLogoMap("rhb", "rhb.png"),
      new BillplzPaymentGatewayLogoMap("sc", "standard-chartered.png"),
      new BillplzPaymentGatewayLogoMap("shopee", "shopee-pay.png"),
      new BillplzPaymentGatewayLogoMap("tng", "tng-ewallet.png"),
      new BillplzPaymentGatewayLogoMap("uob", "uob.png"),
      new BillplzPaymentGatewayLogoMap("visa", "visa-mastercard.png"),
      new BillplzPaymentGatewayLogoMap("wechat", "wechat-pay.png"),
    ]
  }

  gatewayName(): string {
    switch (this.name.toLowerCase()) {
      case "affinonline": {
        return "Affin Bank (affinonline)"
      }
      case "affinmax": {
        return "Affin Bank (AFFINMAX)"
      }
      case "agronet": {
        return "AGRO Bank (AGRONet)"
      }
      case "agronetbiz": {
        return "AGRO Bank (AGRONetBiz)"
      }
      case "allianceonline": {
        return "Alliance Bank (allianceonline)"
      }
      case "amonline": {
        return "AmBank (AmOnline)"
      }
      case "i-muamalat": {
        return "Bank Muamalat (i-Muamalat)"
      }
      case "hlb connect": {
        return "Hong Leong Bank (HLB Connect)"
      }
      case "i-rakyat": {
        return "Bank Rakyat (i-Rakyat)"
      }
      case "kfh online": {
        return "Kuwait Finance House (KFH Online)"
      }
      case "pbe": {
        return "Public Bank (PBe)"
      }
      case "pb enterprise": {
        return "Public Bank (PB enterprise)"
      }
      case "sc online banking": {
        return "Standard Chartered Online Banking"
      }
      case "sc straight2bank": {
        return "Standard Chartered Straight2Bank"
      }
      default:
        return this.name
    }
  }
}

export class BillplzPaymentGatewayLogoMap {
  short: string = ""
  logo: string = ""

  constructor(short: string, logo: string) {
    this.short = short
    this.logo = logo
  }
}
