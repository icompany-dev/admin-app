export class ServicePricingConfig {
  id: string = ""
  servicePricingId: string = ""
  isCosecServiceFeeMandatory: boolean = false
  cosecServiceFee: number = 0.0
  isCsfSstApplicable: boolean = false
  isDsfMandatory: boolean = false
  isDsfMandatoryWithDelivery: boolean = false
  isDsfMandatoryWithCtc: boolean = false
  isDsfRoundUpToNearest: boolean = false
  digitalServiceFee: number = 0.0
  isDsfDstApplicable: boolean = false
  isHfMandatoryWithDelivery: boolean = false
  isHfMandatoryWithCtc: boolean = false
  isHfRoundUpToNearest: boolean = false
  handlingFees: number = 0.0
  isHfSstApplicable: boolean = false
  hasPaperPrintingPackaging: boolean | null = null
  nonColouredPrintingFee: number | null = null
  printedDocumentFee: number | null = null
  standardCarePackageDetails: string | null = null
  standardCarePackagePaperLimit: number | null = null
  standardCarePackageFee: number | null = null
  premiumCarePackageDetails: string | null = null
  premiumCarePackagePaperLimit: number | null = null
  premiumCarePackageFee: number | null = null
  bulkCarePackageDetails: string | null = null
  bulkCarePackagePaperLimit: number | null = null
  bulkCarePackageFee: number | null = null
  createdAt: string = ""
  updatedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ServicePricingConfig) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.servicePricingId = data.service_pricing_id
    this.isCosecServiceFeeMandatory = data.is_cosec_service_fee_mandatory
    this.cosecServiceFee = data.cosec_service_fee
    this.isCsfSstApplicable = data.is_csf_sst_applicable
    this.isDsfMandatory = data.is_dsf_mandatory
    this.isDsfMandatoryWithDelivery = data.is_dsf_mandatory_with_delivery
    this.isDsfMandatoryWithCtc = data.is_dsf_mandatory_with_ctc
    this.isDsfRoundUpToNearest = data.is_dsf_round_up_to_nearest
    this.digitalServiceFee = data.digital_service_fee
    this.isDsfDstApplicable = data.is_dsf_dst_applicable
    this.isHfMandatoryWithDelivery = data.is_hf_mandatory_with_delivery
    this.isHfMandatoryWithCtc = data.is_hf_mandatory_with_ctc
    this.isHfRoundUpToNearest = data.is_hf_round_up_to_nearest
    this.handlingFees = data.handling_fees
    this.isHfSstApplicable = data.is_hf_sst_applicable
    this.hasPaperPrintingPackaging = data.has_paper_printing_packaging ?? null
    this.nonColouredPrintingFee = data.non_coloured_printing_fee ?? null
    this.printedDocumentFee = data.printed_document_fee ?? null
    this.standardCarePackageDetails = data.standard_care_package_details ?? null
    this.standardCarePackagePaperLimit = data.standard_care_package_paper_limit ?? null
    this.standardCarePackageFee = data.standard_care_package_fee ?? null
    this.premiumCarePackageDetails = data.premium_care_package_details ?? null
    this.premiumCarePackagePaperLimit = data.premium_care_package_paper_limit ?? null
    this.premiumCarePackageFee = data.premium_care_package_fee ?? null
    this.bulkCarePackageDetails = data.bulk_care_package_details ?? null
    this.bulkCarePackagePaperLimit = data.bulk_care_package_paper_limit ?? null
    this.bulkCarePackageFee = data.bulk_care_package_fee ?? null
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: ServicePricingConfig): void {
    this.id = data.id
    this.servicePricingId = data.servicePricingId
    this.isCosecServiceFeeMandatory = data.isCosecServiceFeeMandatory
    this.cosecServiceFee = data.cosecServiceFee
    this.isCsfSstApplicable = data.isCsfSstApplicable
    this.isDsfMandatory = data.isDsfMandatory
    this.isDsfMandatoryWithDelivery = data.isDsfMandatoryWithDelivery
    this.isDsfMandatoryWithCtc = data.isDsfMandatoryWithCtc
    this.isDsfRoundUpToNearest = data.isDsfRoundUpToNearest
    this.digitalServiceFee = data.digitalServiceFee
    this.isDsfDstApplicable = data.isDsfDstApplicable
    this.isHfMandatoryWithDelivery = data.isHfMandatoryWithDelivery
    this.isHfMandatoryWithCtc = data.isHfMandatoryWithCtc
    this.isHfRoundUpToNearest = data.isHfRoundUpToNearest
    this.handlingFees = data.handlingFees
    this.isHfSstApplicable = data.isHfSstApplicable
    this.hasPaperPrintingPackaging = data.hasPaperPrintingPackaging
    this.nonColouredPrintingFee = data.nonColouredPrintingFee
    this.printedDocumentFee = data.printedDocumentFee
    this.standardCarePackageDetails = data.standardCarePackageDetails
    this.standardCarePackagePaperLimit = data.standardCarePackagePaperLimit
    this.standardCarePackageFee = data.standardCarePackageFee
    this.premiumCarePackageDetails = data.premiumCarePackageDetails
    this.premiumCarePackagePaperLimit = data.premiumCarePackagePaperLimit
    this.premiumCarePackageFee = data.premiumCarePackageFee
    this.bulkCarePackageDetails = data.bulkCarePackageDetails
    this.bulkCarePackagePaperLimit = data.bulkCarePackagePaperLimit
    this.bulkCarePackageFee = data.bulkCarePackageFee
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody() {
    return {
      is_cosec_service_fee_mandatory: this.isCosecServiceFeeMandatory,
      cosec_service_fee: this.cosecServiceFee,
      is_csf_sst_applicable: this.isCsfSstApplicable,
      is_dsf_mandatory: this.isDsfMandatory,
      is_dsf_mandatory_with_delivery: this.isDsfMandatoryWithDelivery,
      is_dsf_mandatory_with_ctc: this.isDsfMandatoryWithCtc,
      is_dsf_round_up_to_nearest: this.isDsfRoundUpToNearest,
      digital_service_fee: this.digitalServiceFee,
      is_dsf_dst_applicable: this.isDsfDstApplicable,
      is_hf_mandatory_with_delivery: this.isHfMandatoryWithDelivery,
      is_hf_mandatory_with_ctc: this.isHfMandatoryWithCtc,
      is_hf_round_up_to_nearest: this.isHfRoundUpToNearest,
      handling_fees: this.handlingFees,
      is_hf_sst_applicable: this.isHfSstApplicable,
    }
  }
}
