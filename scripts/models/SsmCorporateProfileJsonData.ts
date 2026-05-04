import { DateUtil } from "../utils/Dates"

export class SsmCorporateProfilePurchaseData {
  orderNumber: string = ""
  ssm: CorporateProfileJsonData | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof SsmCorporateProfilePurchaseData) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.orderNumber = data.orderNumber
    this.ssm = data.ssm.data ? new CorporateProfileJsonData(data.ssm.data) : null
  }

  clone(data: SsmCorporateProfilePurchaseData): void {
    this.orderNumber = data.orderNumber
    this.ssm = data.ssm ? new CorporateProfileJsonData(data.ssm) : null
  }
}

export class CorporateProfileJsonData {
  newRegistration: string = ""
  oldRegistration: string = ""
  businessCodes: CorporateProfileJsonBusinessCode[] = []
  businessCharge: any | null = null // Not sure what is the structure for this yet
  companyInfo: CorporateProfileJsonCompanyInfo | null = null
  officerInfos: CorporateProfileJsonOfficerInfo[] = []
  documentsLodge: CorporateProfileJsonDocumentLodge[] = []
  profitLoss: CorporateProfileJsonProfitLoss[] = []
  businessAddress: CorporateProfileJsonAddress | null = null
  registeredAddress: CorporateProfileJsonAddress | null = null
  shareCapital: CorporateProfileJsonShareCapital | null = null
  shareholderInfos: CorporateProfileJsonShareInfo[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CorporateProfileJsonData) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.newRegistration = data.rocCompanyInfo?.newFormatRegNo ?? ""
    this.oldRegistration = `${data.rocCompanyInfo?.companyNo ?? ""}-${data.rocCompanyInfo?.checkDigit ?? ""}`
    this.businessCodes =
      data.rocBusinessCodeListInfo &&
      data.rocBusinessCodeListInfo.rocBusinessCodeInfos &&
      Array.isArray(data.rocBusinessCodeListInfo.rocBusinessCodeInfos)
        ? data.rocBusinessCodeListInfo.rocBusinessCodeInfos.map((bc: any) => {
            return new CorporateProfileJsonBusinessCode(bc)
          })
        : []
    this.businessCharge = data.rocChargesListInfo
    this.companyInfo = data.rocCompanyInfo ? new CorporateProfileJsonCompanyInfo(data.rocCompanyInfo) : null
    this.officerInfos =
      data.rocCompanyOfficerListInfo &&
      data.rocCompanyOfficerListInfo.rocCompanyOfficerInfos &&
      Array.isArray(data.rocCompanyOfficerListInfo.rocCompanyOfficerInfos)
        ? data.rocCompanyOfficerListInfo.rocCompanyOfficerInfos.map((oi: any) => {
            return new CorporateProfileJsonOfficerInfo(oi)
          })
        : []
    this.documentsLodge =
      data.rocDocumentLodgeListInfo &&
      data.rocDocumentLodgeListInfo.rocDocumentLodgeInfos &&
      Array.isArray(data.rocDocumentLodgeListInfo.rocDocumentLodgeInfos)
        ? data.rocDocumentLodgeListInfo.rocDocumentLodgeInfos.map((dl: any) => {
            return new CorporateProfileJsonDocumentLodge(dl)
          })
        : []
    this.profitLoss =
      data.rocProfitLossListInfo &&
      data.rocProfitLossListInfo.rocProfitLossInfos &&
      Array.isArray(data.rocProfitLossListInfo.rocProfitLossInfos)
        ? data.rocProfitLossListInfo.rocProfitLossInfos.map((pl: any) => {
            return new CorporateProfileJsonProfitLoss(pl)
          })
        : []
    this.businessAddress = data.rocBusinessAddressInfo
      ? new CorporateProfileJsonAddress(data.rocBusinessAddressInfo)
      : null
    this.registeredAddress = data.rocRegAddressInfo ? new CorporateProfileJsonAddress(data.rocRegAddressInfo) : null
    this.shareCapital = data.rocShareCapitalInfo ? new CorporateProfileJsonShareCapital(data.rocShareCapitalInfo) : null
    this.shareholderInfos =
      data.rocShareholderListInfo &&
      data.rocShareholderListInfo.rocShareholderInfos &&
      Array.isArray(data.rocShareholderListInfo.rocShareholderInfos)
        ? data.rocShareholderListInfo.rocShareholderInfos.map((si: any) => new CorporateProfileJsonShareInfo(si))
        : []
  }

  clone(data: CorporateProfileJsonData): void {
    this.newRegistration = data.newRegistration
    this.oldRegistration = data.oldRegistration
    this.businessCodes = data.businessCodes.map((bc: CorporateProfileJsonBusinessCode) => {
      return new CorporateProfileJsonBusinessCode(bc)
    })
    this.businessCharge = data.businessCharge
    this.companyInfo = data.companyInfo ? new CorporateProfileJsonCompanyInfo(data.companyInfo) : null
    this.officerInfos = data.officerInfos.map((oi: CorporateProfileJsonOfficerInfo) => {
      return new CorporateProfileJsonOfficerInfo(oi)
    })
    this.documentsLodge = data.documentsLodge.map((dl: CorporateProfileJsonDocumentLodge) => {
      return new CorporateProfileJsonDocumentLodge(dl)
    })
    this.profitLoss = data.profitLoss.map((pl: CorporateProfileJsonProfitLoss) => {
      return new CorporateProfileJsonProfitLoss(pl)
    })
    this.businessAddress = data.businessAddress ? new CorporateProfileJsonAddress(data.businessAddress) : null
    this.registeredAddress = data.registeredAddress ? new CorporateProfileJsonAddress(data.registeredAddress) : null
    this.shareCapital = data.shareCapital ? new CorporateProfileJsonShareCapital(data.shareCapital) : null
    this.shareholderInfos = data.shareholderInfos.map((si: CorporateProfileJsonShareInfo) => {
      return new CorporateProfileJsonShareInfo(si)
    })
  }
}

export class CorporateProfileJsonBusinessCode {
  businessCode: string = ""
  companyNo: string = ""
  priority: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CorporateProfileJsonBusinessCode) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.businessCode = data.businessCode
    this.companyNo = data.companyNo
    this.priority = data.priority
  }

  clone(data: CorporateProfileJsonBusinessCode): void {
    this.businessCode = data.businessCode
    this.companyNo = data.companyNo
    this.priority = data.priority
  }
}

export class CorporateProfileJsonCompanyInfo {
  errorMsg: any | null = null // Not clear what the structure for this yet
  infoId: any | null = null // Not clear what the structure for this yet
  lastUpdateDate: string | null = null
  successCode: string = ""
  balaceSheetInfo: any | null = null // Not clear what the structure for this yet
  balaceSheetInfoDesc: any | null = null // Not clear what the structure for this yet
  businessDescription: string = ""
  checkDigit: string = ""
  companyCountry: string = ""
  companyName: string = ""
  companyNo: string = ""
  companyOldName: any | null = null // Not clear what the structure for this yet
  companyStatus: string = ""
  companyType: string = ""
  currency: string = ""
  dateOfChange: any | null = null // Not clear what the structure for this yet
  incomeStatInfo: any | null = null // Not clear what the structure for this yet
  incomeStatInfoDesc: any | null = null // Not clear what the structure for this yet
  incorpDate: string = ""
  infoColon: any | null = null // Not clear what the structure for this yet
  latestDocUpdateDate: string = ""
  llpInfo: any | null = null // Not clear what the structure for this yet
  llpInfoDesc: any | null = null // Not clear what the structure for this yet
  llpName: any | null = null // Not clear what the structure for this yet
  llpNo: any | null = null // Not clear what the structure for this yet
  llpconvertDate: any | null = null // Not clear what the structure for this yet
  localforeignCompany: string = ""
  naBal: any | null = null // Not clear what the structure for this yet
  naProf: any | null = null // Not clear what the structure for this yet
  registrationDate: string = ""
  statusOfCompany: string = ""
  wupType: any | null = null // Not clear what the structure for this yet
  newFormatRegNo: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CorporateProfileJsonCompanyInfo) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.errorMsg = data.errorMsg
    this.infoId = data.infoId
    this.lastUpdateDate = data.lastUpdateDate ? DateUtil.getDateString(data.lastUpdateDate) : null
    this.successCode = data.successCode
    this.balaceSheetInfo = data.balaceSheetInfo
    this.balaceSheetInfoDesc = data.balaceSheetInfoDesc
    this.businessDescription = data.businessDescription
    this.checkDigit = data.checkDigit
    this.companyCountry = data.companyCountry
    this.companyName = data.companyName
    this.companyNo = data.companyNo
    this.companyOldName = data.companyOldName
    this.companyStatus = data.companyStatus
    this.companyType = data.companyType
    this.currency = data.currency
    this.dateOfChange = data.dateOfChange
    this.incomeStatInfo = data.incomeStatInfo
    this.incomeStatInfoDesc = data.incomeStatInfoDesc
    this.incorpDate = DateUtil.getDateString(data.incorpDate)
    this.infoColon = data.infoColon
    this.latestDocUpdateDate = DateUtil.getDateString(data.latestDocUpdateDate)
    this.llpInfo = data.llpInfo
    this.llpInfoDesc = data.llpInfoDesc
    this.llpName = data.llpName
    this.llpNo = data.llpNo
    this.llpconvertDate = data.llpconvertDate
    this.localforeignCompany = data.localforeignCompany
    this.naBal = data.naBal
    this.naProf = data.naProf
    this.registrationDate = DateUtil.getDateString(data.registrationDate)
    this.statusOfCompany = data.statusOfCompany
    this.wupType = data.wupType
    this.newFormatRegNo = data.newFormatRegNo
  }

  clone(data: CorporateProfileJsonCompanyInfo): void {
    this.errorMsg = data.errorMsg
    this.infoId = data.infoId
    this.lastUpdateDate = data.lastUpdateDate
    this.successCode = data.successCode
    this.balaceSheetInfo = data.balaceSheetInfo
    this.balaceSheetInfoDesc = data.balaceSheetInfoDesc
    this.businessDescription = data.businessDescription
    this.checkDigit = data.checkDigit
    this.companyCountry = data.companyCountry
    this.companyName = data.companyName
    this.companyNo = data.companyNo
    this.companyOldName = data.companyOldName
    this.companyStatus = data.companyStatus
    this.companyType = data.companyType
    this.currency = data.currency
    this.dateOfChange = data.dateOfChange
    this.incomeStatInfo = data.incomeStatInfo
    this.incomeStatInfoDesc = data.incomeStatInfoDesc
    this.incorpDate = data.incorpDate
    this.infoColon = data.infoColon
    this.latestDocUpdateDate = data.latestDocUpdateDate
    this.llpInfo = data.llpInfo
    this.llpInfoDesc = data.llpInfoDesc
    this.llpName = data.llpName
    this.llpNo = data.llpNo
    this.llpconvertDate = data.llpconvertDate
    this.localforeignCompany = data.localforeignCompany
    this.naBal = data.naBal
    this.naProf = data.naProf
    this.registrationDate = data.registrationDate
    this.statusOfCompany = data.statusOfCompany
    this.wupType = data.wupType
    this.newFormatRegNo = data.newFormatRegNo
  }
}

export class CorporateProfileJsonOfficerInfo {
  address1: string = ""
  address2: string = ""
  address3: string = ""
  appointmentDate: string = ""
  companyNo: string = ""
  designationCode: string = ""
  dob: string = ""
  idNo: string = ""
  idType: string = ""
  name: string = ""
  officerInfo: string = ""
  postcode: string = ""
  resignDate: string = ""
  startDate: string = ""
  state: string = ""
  town: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CorporateProfileJsonOfficerInfo) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.address1 = data.address1
    this.address2 = data.address2
    this.address3 = data.address3
    this.appointmentDate = data.appointmentDate
    this.companyNo = data.companyNo
    this.designationCode = data.designationCode
    this.dob = DateUtil.getDateString(data.dob)
    this.idNo = data.idNo
    this.idType = data.idType
    this.name = data.name
    this.officerInfo = data.officerInfo
    this.postcode = data.postcode
    this.resignDate = data.resignDate
    this.startDate = DateUtil.getDateString(data.startDate)
    this.state = data.state
    this.town = data.town
  }

  clone(data: CorporateProfileJsonOfficerInfo): void {
    this.address1 = data.address1
    this.address2 = data.address2
    this.address3 = data.address3
    this.appointmentDate = data.appointmentDate
    this.companyNo = data.companyNo
    this.designationCode = data.designationCode
    this.dob = data.dob
    this.idNo = data.idNo
    this.idType = data.idType
    this.name = data.name
    this.officerInfo = data.officerInfo
    this.postcode = data.postcode
    this.resignDate = data.resignDate
    this.startDate = data.startDate
    this.state = data.state
    this.town = data.town
  }
}

export class CorporateProfileJsonDocumentLodge {
  companyNo: string = ""
  documentDate: string = ""
  formTrx: string = ""
  updateDate: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CorporateProfileJsonDocumentLodge) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.companyNo = data.companyNo
    this.documentDate = DateUtil.getDateString(data.documentDate)
    this.formTrx = data.formTrx
    this.updateDate = data.updateDate
  }

  clone(data: CorporateProfileJsonDocumentLodge): void {
    this.companyNo = data.companyNo
    this.documentDate = data.documentDate
    this.formTrx = data.formTrx
    this.updateDate = data.updateDate
  }
}

export class CorporateProfileJsonProfitLoss {
  errorMsg: string = ""
  infoId: string = ""
  lastUpdateDate: string | null = null
  successCode: string = ""
  accrualAccount: string = ""
  companyNo: string = ""
  extraOrdinaryItem: number = 0
  financialReportType: string = ""
  financialYearEndDate: string = ""
  grossDividendRate: number = 0
  inappropriateProfitBf: number = 0
  inappropriateProfitCf: number = 0
  minorityInterest: number = 0
  netDividend: number = 0
  others: number = 0
  priorAdjustment: number = 0
  profitAfterTax: number = 0
  profitBeforeTax: number = 0
  profitShareholder: number = 0
  revenue: number = 0
  surplusAfterTax: number = 0
  surplusBeforeTax: number = 0
  surplusDeficitAfterTax: number = 0
  surplusDeficitBeforeTax: number = 0
  totalExpenditure: number = 0
  totalIncome: number = 0
  totalRevenue: number = 0
  transferred: number = 0
  turnover: number = 0

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CorporateProfileJsonProfitLoss) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.errorMsg = data.errorMsg
    this.infoId = data.infoId
    this.lastUpdateDate = data.lastUpdateDate ? DateUtil.getDateString(data.lastUpdateDate) : null
    this.successCode = data.successCode
    this.accrualAccount = data.accrualAccount
    this.companyNo = data.companyNo
    this.extraOrdinaryItem = data.extraOrdinaryItem
    this.financialReportType = data.financialReportType
    this.financialYearEndDate = DateUtil.getDateString(data.financialYearEndDate)
    this.grossDividendRate = data.grossDividendRate
    this.inappropriateProfitBf = data.inappropriateProfitBf
    this.inappropriateProfitCf = data.inappropriateProfitCf
    this.minorityInterest = data.minorityInterest
    this.netDividend = data.netDividend
    this.others = data.others
    this.priorAdjustment = data.priorAdjustment
    this.profitAfterTax = data.profitAfterTax
    this.profitBeforeTax = data.profitBeforeTax
    this.profitShareholder = data.profitShareholder
    this.revenue = data.revenue
    this.surplusAfterTax = data.surplusAfterTax
    this.surplusBeforeTax = data.surplusBeforeTax
    this.surplusDeficitAfterTax = data.surplusDeficitAfterTax
    this.surplusDeficitBeforeTax = data.surplusDeficitBeforeTax
    this.totalExpenditure = data.totalExpenditure
    this.totalIncome = data.totalIncome
    this.totalRevenue = data.totalRevenue
    this.transferred = data.transferred
    this.turnover = data.turnover
  }

  clone(data: CorporateProfileJsonProfitLoss): void {
    this.errorMsg = data.errorMsg
    this.infoId = data.infoId
    this.lastUpdateDate = data.lastUpdateDate
    this.successCode = data.successCode
    this.accrualAccount = data.accrualAccount
    this.companyNo = data.companyNo
    this.extraOrdinaryItem = data.extraOrdinaryItem
    this.financialReportType = data.financialReportType
    this.financialYearEndDate = data.financialYearEndDate
    this.grossDividendRate = data.grossDividendRate
    this.inappropriateProfitBf = data.inappropriateProfitBf
    this.inappropriateProfitCf = data.inappropriateProfitCf
    this.minorityInterest = data.minorityInterest
    this.netDividend = data.netDividend
    this.others = data.others
    this.priorAdjustment = data.priorAdjustment
    this.profitAfterTax = data.profitAfterTax
    this.profitBeforeTax = data.profitBeforeTax
    this.profitShareholder = data.profitShareholder
    this.revenue = data.revenue
    this.surplusAfterTax = data.surplusAfterTax
    this.surplusBeforeTax = data.surplusBeforeTax
    this.surplusDeficitAfterTax = data.surplusDeficitAfterTax
    this.surplusDeficitBeforeTax = data.surplusDeficitBeforeTax
    this.totalExpenditure = data.totalExpenditure
    this.totalIncome = data.totalIncome
    this.totalRevenue = data.totalRevenue
    this.transferred = data.transferred
    this.turnover = data.turnover
  }
}

export class CorporateProfileJsonAddress {
  errorMsg: any | null = null // Not sure what the structure is for this yet
  infoId: any | null = null // Not sure what the structure is for this yet
  lastUpdateDate: string | null = null
  successCode: string = ""
  address1: string = ""
  address2: string = ""
  address3: string = ""
  companyNo: string = ""
  postcode: string = ""
  state: string = ""
  town: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CorporateProfileJsonAddress) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.errorMsg = data.errorMsg
    this.infoId = data.infoId
    this.lastUpdateDate = data.lastUpdateDate ? DateUtil.getDateString(data.lastUpdateDate) : null
    this.successCode = data.successCode
    this.address1 = data.address1
    this.address2 = data.address2
    this.address3 = data.address3
    this.companyNo = data.companyNo
    this.postcode = data.postcode
    this.state = data.state
    this.town = data.town
  }

  clone(data: CorporateProfileJsonAddress): void {
    this.errorMsg = data.errorMsg
    this.infoId = data.infoId
    this.lastUpdateDate = data.lastUpdateDate
    this.successCode = data.successCode
    this.address1 = data.address1
    this.address2 = data.address2
    this.address3 = data.address3
    this.companyNo = data.companyNo
    this.postcode = data.postcode
    this.state = data.state
    this.town = data.town
  }
}

export class CorporateProfileJsonShareCapital {
  errorMsg: any | null = null // Not sure what the structure is for this yet
  infoId: any | null = null // Not sure what the structure is for this yet
  lastUpdateDate: string | null = null
  successCode: string = ""
  authorisedCapital: number = 0
  companyNo: string = ""
  currency: string = ""
  currenyNominal: string = ""
  ordAIssuedCash: number = 0
  ordAIssuedNominal: number = 0
  ordAIssuedNonCash: number = 0
  ordANominalValue: number = 0
  ordANumberOfShares: number = 0
  ordAmountAValue: number = 0
  ordAmountBValue: number = 0
  ordAmountValue: number = 0
  ordBIssuedCash: number = 0
  ordBIssuedNominal: number = 0
  ordBIssuedNonCash: number = 0
  ordBNominalValue: number = 0
  ordBNumberOfShares: number = 0
  ordIssuedCash: number = 0
  ordIssuedNominal: number = 0
  ordIssuedNonCash: number = 0
  ordNominalValue: number = 0
  ordNumberOfShares: number = 0
  othAIssuedCash: number = 0
  othAIssuedNonCash: number = 0
  othAmountValue: number = 0
  othBIssuedCash: number = 0
  othBIssuedNonCash: number = 0
  othIssuedCash: number = 0
  othIssuedNominal: number = 0
  othIssuedNonCash: number = 0
  othNominalValue: number = 0
  othNumberOfShares: number = 0
  prefAIssuedCash: number = 0
  prefAIssuedNominal: number = 0
  prefAIssuedNonCash: number = 0
  prefANominalValue: number = 0
  prefANumberOfShares: number = 0
  prefAmountAValue: number = 0
  prefAmountBValue: number = 0
  prefAmountValue: number = 0
  prefBIssuedCash: number = 0
  prefBIssuedNominal: number = 0
  prefBIssuedNonCash: number = 0
  prefBNominalValue: number = 0
  prefBNumberOfShares: number = 0
  prefIssuedCash: number = 0
  prefIssuedNominal: number = 0
  prefIssuedNonCash: number = 0
  prefNominalValue: number = 0
  prefNumberOfShares: number = 0
  totalIssued: number = 0

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CorporateProfileJsonShareCapital) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.errorMsg = data.errorMsg
    this.infoId = data.infoId
    this.lastUpdateDate = data.lastUpdateDate ? DateUtil.getDateString(data.lastUpdateDate) : null
    this.successCode = data.successCode
    this.authorisedCapital = data.authorisedCapital
    this.companyNo = data.companyNo
    this.currency = data.currency
    this.currenyNominal = data.currenyNominal
    this.ordAIssuedCash = data.ordAIssuedCash
    this.ordAIssuedNominal = data.ordAIssuedNominal
    this.ordAIssuedNonCash = data.ordAIssuedNonCash
    this.ordANominalValue = data.ordANominalValue
    this.ordANumberOfShares = data.ordANumberOfShares
    this.ordAmountAValue = data.ordAmountAValue
    this.ordAmountBValue = data.ordAmountBValue
    this.ordAmountValue = data.ordAmountValue
    this.ordBIssuedCash = data.ordBIssuedCash
    this.ordBIssuedNominal = data.ordBIssuedNominal
    this.ordBIssuedNonCash = data.ordBIssuedNonCash
    this.ordBNominalValue = data.ordBNominalValue
    this.ordBNumberOfShares = data.ordBNumberOfShares
    this.ordIssuedCash = data.ordIssuedCash
    this.ordIssuedNominal = data.ordIssuedNominal
    this.ordIssuedNonCash = data.ordIssuedNonCash
    this.ordNominalValue = data.ordNominalValue
    this.ordNumberOfShares = data.ordNumberOfShares
    this.othAIssuedCash = data.othAIssuedCash
    this.othAIssuedNonCash = data.othAIssuedNonCash
    this.othAmountValue = data.othAmountValue
    this.othBIssuedCash = data.othBIssuedCash
    this.othBIssuedNonCash = data.othBIssuedNonCash
    this.othIssuedCash = data.othIssuedCash
    this.othIssuedNominal = data.othIssuedNominal
    this.othIssuedNonCash = data.othIssuedNonCash
    this.othNominalValue = data.othNominalValue
    this.othNumberOfShares = data.othNumberOfShares
    this.prefAIssuedCash = data.prefAIssuedCash
    this.prefAIssuedNominal = data.prefAIssuedNominal
    this.prefAIssuedNonCash = data.prefAIssuedNonCash
    this.prefANominalValue = data.prefANominalValue
    this.prefANumberOfShares = data.prefANumberOfShares
    this.prefAmountAValue = data.prefAmountAValue
    this.prefAmountBValue = data.prefAmountBValue
    this.prefAmountValue = data.prefAmountValue
    this.prefBIssuedCash = data.prefBIssuedCash
    this.prefBIssuedNominal = data.prefBIssuedNominal
    this.prefBIssuedNonCash = data.prefBIssuedNonCash
    this.prefBNominalValue = data.prefBNominalValue
    this.prefBNumberOfShares = data.prefBNumberOfShares
    this.prefIssuedCash = data.prefIssuedCash
    this.prefIssuedNominal = data.prefIssuedNominal
    this.prefIssuedNonCash = data.prefIssuedNonCash
    this.prefNominalValue = data.prefNominalValue
    this.prefNumberOfShares = data.prefNumberOfShares
    this.totalIssued = data.totalIssued
  }

  clone(data: CorporateProfileJsonShareCapital): void {
    this.errorMsg = data.errorMsg
    this.infoId = data.infoId
    this.lastUpdateDate = data.lastUpdateDate
    this.successCode = data.successCode
    this.authorisedCapital = data.authorisedCapital
    this.companyNo = data.companyNo
    this.currency = data.currency
    this.currenyNominal = data.currenyNominal
    this.ordAIssuedCash = data.ordAIssuedCash
    this.ordAIssuedNominal = data.ordAIssuedNominal
    this.ordAIssuedNonCash = data.ordAIssuedNonCash
    this.ordANominalValue = data.ordANominalValue
    this.ordANumberOfShares = data.ordANumberOfShares
    this.ordAmountAValue = data.ordAmountAValue
    this.ordAmountBValue = data.ordAmountBValue
    this.ordAmountValue = data.ordAmountValue
    this.ordBIssuedCash = data.ordBIssuedCash
    this.ordBIssuedNominal = data.ordBIssuedNominal
    this.ordBIssuedNonCash = data.ordBIssuedNonCash
    this.ordBNominalValue = data.ordBNominalValue
    this.ordBNumberOfShares = data.ordBNumberOfShares
    this.ordIssuedCash = data.ordIssuedCash
    this.ordIssuedNominal = data.ordIssuedNominal
    this.ordIssuedNonCash = data.ordIssuedNonCash
    this.ordNominalValue = data.ordNominalValue
    this.ordNumberOfShares = data.ordNumberOfShares
    this.othAIssuedCash = data.othAIssuedCash
    this.othAIssuedNonCash = data.othAIssuedNonCash
    this.othAmountValue = data.othAmountValue
    this.othBIssuedCash = data.othBIssuedCash
    this.othBIssuedNonCash = data.othBIssuedNonCash
    this.othIssuedCash = data.othIssuedCash
    this.othIssuedNominal = data.othIssuedNominal
    this.othIssuedNonCash = data.othIssuedCash
    this.othNominalValue = data.othNominalValue
    this.othNumberOfShares = data.othNumberOfShares
    this.prefAIssuedCash = data.prefAIssuedCash
    this.prefAIssuedNominal = data.prefAIssuedNominal
    this.prefAIssuedNonCash = data.prefAIssuedNonCash
    this.prefANominalValue = data.prefANominalValue
    this.prefANumberOfShares = data.prefANumberOfShares
    this.prefAmountAValue = data.prefAmountAValue
    this.prefAmountBValue = data.prefAmountBValue
    this.prefAmountValue = data.prefAmountValue
    this.prefBIssuedCash = data.prefBIssuedCash
    this.prefBIssuedNominal = data.prefBIssuedNominal
    this.prefBIssuedNonCash = data.prefBIssuedNonCash
    this.prefBNominalValue = data.prefBNominalValue
    this.prefBNumberOfShares = data.prefBNumberOfShares
    this.prefIssuedCash = data.prefIssuedCash
    this.prefIssuedNominal = data.prefIssuedNominal
    this.prefIssuedNonCash = data.prefIssuedNonCash
    this.prefNominalValue = data.prefNominalValue
    this.prefNumberOfShares = data.prefNumberOfShares
    this.totalIssued = data.totalIssued
  }
}

export class CorporateProfileJsonShareInfo {
  companyNo: string = ""
  dob: string = ""
  idNo: string = ""
  idType: string = ""
  name: string = ""
  share: number = 0
  shareVol: string = ""
  newFormatRegNo: string | null = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CorporateProfileJsonShareInfo) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.companyNo = data.companyNo
    this.dob = DateUtil.getDateString(data.dob)
    this.idNo = data.idNo
    this.idType = data.idType
    this.name = data.name
    this.share = data.share
    this.shareVol = data.shareVol
    this.newFormatRegNo = data.newFormatRegNo
  }

  clone(data: CorporateProfileJsonShareInfo): void {
    this.companyNo = data.companyNo
    this.dob = data.dob
    this.idNo = data.idNo
    this.idType = data.idType
    this.name = data.name
    this.share = data.share
    this.shareVol = data.shareVol
    this.newFormatRegNo = data.newFormatRegNo
  }
}
