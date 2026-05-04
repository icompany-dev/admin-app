export enum ShareholdingType {
  Individual = "individual",
  Representative = "representative",
}

export enum ShareType {
  Ordinary = "ordinary_shares",
  Preference = "preference_shares",
}

export enum AllotmentCashType {
  Cash = "cash",
  NonCash = "noncash",
}

export enum ShareDistributionMethod {
  ByPercentage = "split-by-percentage",
  Equally = "equal-amount",
}

export enum RegisterOfTransferType {
  Approval = "approval",
  Delay = "delay",
  Refusal = "refusal",
}

export class AllotmentDistributionMethod {
  id: string = ""
  en: string = ""
  bm: string = ""

  constructor(id: string, en: string, bm: string) {
    this.id = id
    this.en = en
    this.bm = bm
  }
}

export class ShareholdingConstants {
  static ALLOTMENT_SPLIT_BY_PERCENTAGE = new AllotmentDistributionMethod(
    ShareDistributionMethod.ByPercentage,
    "Split by the Shareholding Percentage",
    "Bahagi mengikut pegangan saham semasa"
  )

  static ALLOTMENT_SPLIT_EQUALLY = new AllotmentDistributionMethod(
    ShareDistributionMethod.Equally,
    "Split equally among Shareholders",
    "Bahagi sama rata antara pemegang saham"
  )
}
