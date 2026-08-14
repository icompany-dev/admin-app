import type {
  PreferenceShareAntiDilutionMethod,
  PreferenceShareCumulativeCapType,
  PreferenceShareDividendCycle,
  PreferenceShareLiquidationPreferenceType,
  PreferenceShareRedemptionPriceMethod,
  PreferenceShareRedemptionTriggerType,
} from "../constants/PreferenceShareTerms"
import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"

export class CompanyPreferenceShareTermFinancial {
  id: string = ""
  termSheetId: string = ""
  dividendRatePercent: number | null = null
  dividendCycle: PreferenceShareDividendCycle | null = null
  isCumulative: boolean | null = null
  cumulativeCapType: PreferenceShareCumulativeCapType | null = null
  cumulativeCapYears: number | null = null
  cumulativeCapPercent: number | null = null
  isDividendPayLumpsum: boolean | null = null
  conversionRatioFormula: string | null = null
  conversionTriggers: string[] | null = null
  antiDilutionMethod: PreferenceShareAntiDilutionMethod | null = null
  redemptionTriggerType: PreferenceShareRedemptionTriggerType | null = null
  redemptionMaturityYears: number | null = null
  redemptionPriceMethod: PreferenceShareRedemptionPriceMethod | null = null
  redemptionPriceCap: string | null = null
  redemptionPriceFormula: string | null = null
  liquidationPreferenceType: PreferenceShareLiquidationPreferenceType | null = null
  otherLiquidationPreference: string | null = null

  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyPreferenceShareTermFinancial) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.termSheetId = data.term_sheet_id ?? ""
    this.dividendRatePercent = data.dividend_rate_percent ? Number(data.dividend_rate_percent) : null
    this.dividendCycle = (data.dividend_cycle as PreferenceShareDividendCycle) ?? null
    this.isCumulative = Boolean(data.is_cumulative)
    this.cumulativeCapType = (data.cumulative_cap_type as PreferenceShareCumulativeCapType) ?? null
    this.cumulativeCapYears = data.cumulative_cap_years ? Number(data.cumulative_cap_years) : null
    this.cumulativeCapPercent = data.cumulative_cap_percent ? Number(data.cumulative_cap_percent) : null
    this.isDividendPayLumpsum = data.is_dividend_pay_lumpsum ?? null
    this.conversionRatioFormula = data.conversion_ratio_formula ?? null
    if (typeof data.conversion_triggers === "string") {
      try {
        this.conversionTriggers = JSON.parse(data.conversion_triggers)
      } catch (e) {
        this.conversionTriggers = []
      }
    } else {
      this.conversionTriggers = data.conversion_triggers ?? null
    }
    this.antiDilutionMethod = (data.anti_dilution_method as PreferenceShareAntiDilutionMethod) ?? null
    this.redemptionTriggerType = (data.redemption_trigger_type as PreferenceShareRedemptionTriggerType) ?? null
    this.redemptionMaturityYears = data.redemption_maturity_years ? Number(data.redemption_maturity_years) : null
    this.redemptionPriceMethod = (data.redemption_price_method as PreferenceShareRedemptionPriceMethod) ?? null
    this.redemptionPriceCap = data.redemption_price_cap ?? null
    this.redemptionPriceFormula = data.redemption_price_formula ?? null
    this.liquidationPreferenceType =
      (data.liquidation_preference_type as PreferenceShareLiquidationPreferenceType) ?? null
    this.otherLiquidationPreference = data.other_liquidation_preference ?? null
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
    this.deletedAt = data.deleted_at ?? null
  }

  clone(data: CompanyPreferenceShareTermFinancial): void {
    this.id = data.id
    this.termSheetId = data.termSheetId
    this.dividendRatePercent = data.dividendRatePercent
    this.dividendCycle = data.dividendCycle
    this.isCumulative = data.isCumulative
    this.cumulativeCapType = data.cumulativeCapType
    this.cumulativeCapYears = data.cumulativeCapYears
    this.cumulativeCapPercent = data.cumulativeCapPercent
    this.isDividendPayLumpsum = data.isDividendPayLumpsum
    this.conversionRatioFormula = data.conversionRatioFormula
    this.conversionTriggers = Array.isArray(data.conversionTriggers) ? [...data.conversionTriggers] : null
    this.antiDilutionMethod = data.antiDilutionMethod
    this.redemptionTriggerType = data.redemptionTriggerType
    this.redemptionMaturityYears = data.redemptionMaturityYears
    this.redemptionPriceMethod = data.redemptionPriceMethod
    this.redemptionPriceCap = data.redemptionPriceCap
    this.redemptionPriceFormula = data.redemptionPriceFormula
    this.liquidationPreferenceType = data.liquidationPreferenceType
    this.otherLiquidationPreference = data.otherLiquidationPreference
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      dividend_rate_percent: this.dividendRatePercent,
      dividend_cycle: this.dividendCycle,
      is_cumulative: this.isCumulative,
      cumulative_cap_type: this.cumulativeCapType,
      cumulative_cap_years: this.cumulativeCapYears,
      cumulative_cap_percent: this.cumulativeCapPercent,
      is_dividend_pay_lumpsum: this.isDividendPayLumpsum,
      conversion_ratio_formula: this.conversionRatioFormula,
      conversion_triggers: this.conversionTriggers,
      anti_dilution_method: this.antiDilutionMethod,
      redemption_trigger_type: this.redemptionTriggerType,
      redemption_maturity_years: this.redemptionMaturityYears,
      redemption_price_method: this.redemptionPriceMethod,
      redemption_price_cap: this.redemptionPriceCap,
      redemption_price_formula: this.redemptionPriceFormula,
      liquidation_preference_type: this.liquidationPreferenceType,
      other_liquidation_preference: this.otherLiquidationPreference,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.termSheetId)
  }

  async update(repository: ReturnType<typeof useCompanyPreferenceShareTermFinancialStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }
}
