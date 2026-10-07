import { CompanyShareAllotTo, CompanyShareholderAllotment } from "~/scripts/models/CompanyShareholderAllotment"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { ShareType } from "~/scripts/constants/Shareholder"
import { NumberUtil } from "~/scripts/utils/Number"
import type { CompanyShareholderAllotmentDetail } from "~/scripts/models/CompanyShareholderAllotmentDetail"
import { ConsiderationType } from "~/scripts/constants/AllotmentOfShares"
import { Shareholder } from "~/scripts/models/Shareholder"

export class OrdinaryShareSubscriptionAgreementController extends SdnBhdLegalDocumentController {
  applicationId: Ref<string> = ref<string>("")
  companyShareholderAllotment = ref<CompanyShareholderAllotment>(new CompanyShareholderAllotment())

  emitEvents: any | null = null

  isFetchingApplication: Ref<boolean> = ref<boolean>(false)

  additionalCssClass: string = "ordinary-share-subscription-agreement"

  dateOfAgreement: Ref<string> = ref<string>("")

  constructor(companyId: string, applicationId: string | null, isInPreviewMode: boolean, emitEvents: any) {
    super("Share Subscription Agreement", companyId, PaperOrientation.Portrait)
    this.emitEvents = emitEvents

    this.setIsInPreviewMode(isInPreviewMode)
    this.setApplicationId(applicationId ?? "")
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.applicationId.value = applicationId
    await this.fetchCompanyShareholderAllotment()
  }

  async fetchCompanyShareholderAllotment(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    this.isFetchingApplication.value = true

    try {
      let repository = useCompanyShareholderAllotmentStore()
      let response = await repository.fetch(this.applicationId.value)
      if (repository.error !== null) {
        throw repository.error
      }

      this.companyShareholderAllotment.value = new CompanyShareholderAllotment(response)

      let promises = this.companyShareholderAllotment.value.shareAllotTos.map((a: CompanyShareAllotTo) => {
        let repository = useUserStore()

        if (a.isAllotToNew) {
          return a.shareholderInvitation?.setUser(repository)
        }

        if (a.shareholder === null) {
          let shareholderRepository = useShareholderStore()
          return shareholderRepository.fetch(a.shareholderId ?? "").then(async (r: any) => {
            a.shareholder = new Shareholder(r)
            await a.shareholder.setRegisteredUser(repository)
          })
        }

        return a.shareholder?.setRegisteredUser(repository)
      })

      await Promise.allSettled(promises)
    } catch (error: any) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    } finally {
      this.isFetchingApplication.value = false
    }
  }

  override companyAddress(): string {
    if (!this.company.value.businessAddressLocation) {
      return this.company.value.registeredAddressLocation?.getOnelineAddress() ?? ""
    }

    let address = this.company.value.businessAddressLocation.getOnelineAddress()

    if (address === "-") {
      return `
        D-1-5, SEKITAR26 ENTERPRISE, 
        PERSIARAN HULU SELANGOR, 
        40400 SHAH ALAM, 
        SELANGOR MALAYSIA
      `
    }

    return address
  }

  get isLoading(): boolean {
    return this.isFetchingCompany.value || this.isFetchingApplication.value
  }

  get loaderLabel(): string {
    return "Preparing Your"
  }

  get loaderSublabel(): string {
    return "Share Subscription Agreement"
  }

  get subscribers(): CompanyShareAllotTo[] {
    if (this.companyShareholderAllotment.value.shareAllotTos.length <= 0) {
      return [new CompanyShareAllotTo()]
    }

    return this.companyShareholderAllotment.value.shareAllotTos
  }

  get partyOrParties(): string {
    return this.subscribers.length > 1 ? "PARTIES" : "PARTY"
  }

  get subscribersLabel(): string {
    return this.subscribers.length > 1 ? "Subscribers" : "Subscriber"
  }

  get subscriberHasLabel(): string {
    return this.subscribers.length > 1 ? "have" : "has"
  }

  get totalPages(): number {
    return 8
  }

  get hasConstitution(): boolean {
    return this.company.value.hasConstitution
  }

  get allotmentDetails(): CompanyShareholderAllotmentDetail {
    return this.companyShareholderAllotment.value.details
  }

  get typeOfShares(): string {
    if (this.allotmentDetails.typeOfShares === ShareType.Ordinary) {
      return "Ordinary Shares"
    }

    return "Preference Shares"
  }

  get numberOfShares(): string {
    return NumberUtil.thousandSeparator(this.allotmentDetails.numberOfShares)
  }

  get issuePricePerShare(): string {
    return NumberUtil.currency(this.allotmentDetails.considerationPerShare)
  }

  get totalSubscription(): string {
    return NumberUtil.currency(this.allotmentDetails.proposedTotalSubscriptionAmount)
  }

  get totalPaid(): string {
    if (this.allotmentDetails.considerationType === ConsiderationType.FullyPaid) {
      return NumberUtil.currency(this.allotmentDetails.proposedTotalSubscriptionAmount)
    }

    return NumberUtil.currency(this.allotmentDetails.amountPaid)
  }

  get outstandingAmount(): string {
    if (this.allotmentDetails.considerationType === ConsiderationType.FullyPaid) {
      return "0.00"
    }

    let outstanding =
      Number(this.allotmentDetails.proposedTotalSubscriptionAmount) - Number(this.allotmentDetails.amountPaid)

    return NumberUtil.currency(outstanding)
  }

  get paymentDueDate(): string {
    if (StringUtil.isNullOrEmpty(this.allotmentDetails.paymentDueDate)) {
      return ""
    }

    let time = useLocalTime()

    return time.formatDateOnlyFull(this.allotmentDetails.paymentDueDate ?? "")
  }

  get basisOfIssue(): string {
    return ""
  }

  get natureOfShares(): string {
    switch (this.allotmentDetails.considerationType) {
      case ConsiderationType.FullyPaid:
        return "Fully Paid"
      case ConsiderationType.PartiallyPaid:
        return "Partially Paid"
      default:
        return "Unpaid"
    }
  }

  get rightsAttachingToShares(): string {
    return ""
  }

  get conditionsPrecedent(): string {
    return ""
  }

  get conditionsSubsequent(): string {
    return ""
  }
}
