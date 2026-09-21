import { ShareType } from "~/scripts/constants/Shareholder"
import { CompanyShareIssuance } from "~/scripts/models/CompanyShareIssuance"
import { CompanyShareholderAllotment } from "~/scripts/models/CompanyShareholderAllotment"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Shareholder } from "~/scripts/models/Shareholder"
import { Filter } from "./Filter"
import { StatusConstants } from "~/scripts/constants/Status"
import { Director } from "~/scripts/models/Director"
import { User } from "~/scripts/models/User"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import type { CompanyShareIssuanceResponse } from "../models/CompanyShareIssuanceResponse"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { MakePayment } from "~/scripts/library/MakePayment"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { CompanyConstants } from "~/scripts/constants/Company"
import type { PaymentCartItem } from "../models/PaymentCartItem"
import type { PaymentCart } from "../models/PaymentCart"
import { CompanyShareAuthorization } from "../models/CompanyShareAuthorization"
import { ServicePricingMandatory } from "../models/ServicePricingMandatory"
import { ServicePricingOptional } from "../models/ServicePricingOptional"
import { PaymentCartItemOptional } from "../models/PaymentCartItemOptional"

export class AllotShares {
  companyId: string = ""
  shareType: string = ShareType.Ordinary

  user: User = new User()
  company: Company = new Company()
  shareholders: Shareholder[] = []
  directors: Director[] = []

  existingApplication: CompanyShareholderAllotment = new CompanyShareholderAllotment()
  existingIssuance: CompanyShareIssuance = new CompanyShareIssuance()
  existingShareAuthorization: CompanyShareAuthorization = new CompanyShareAuthorization()

  companyShareIssuance: CompanyShareIssuance = new CompanyShareIssuance()
  companyShareholderAllotment: CompanyShareholderAllotment = new CompanyShareholderAllotment()
  companyShareAuthorization: CompanyShareAuthorization = new CompanyShareAuthorization()

  isLoading: boolean = false
  isSubmitting: boolean = false

  language = useLanguage()

  private targetServicePricingId: string = "d4c9818b-f320-4d58-924f-190e7bc206eb"
  private termSheetServicePricingId: string = "1bea7db6-dd7b-488e-8736-bfebe2a5817d"
  private prnServicePricingId: string = "9e595bcd-290d-4c8c-8844-e23dd57e86d9"
  private perAllotteeServicePricingId: string = "6924dbd9-5e3b-409d-8430-9fd9d5bf5c32"
  private targetServicePricing: ServicePricing = new ServicePricing()
  private prnServicePricing: ServicePricing = new ServicePricing()
  private termSheetServicePricing: ServicePricing = new ServicePricing()
  private perAllotteeServicePricing: ServicePricing = new ServicePricing()

  price: number = 199

  constructor(companyId: string, shareType: string) {
    this.companyId = companyId
    this.shareType = shareType
  }

  async init(): Promise<void> {
    this.isLoading = true
    await Promise.all([
      this.setUser(),
      this.fetchCompany(),
      this.fetchShareholders(),
      this.fetchDirectors(),
      this.fetchExistingIssuance(),
      this.fetchExistingAllotment(),
      this.fetchExistingAuthorization(),
      this.fetchPrice(),
    ]).finally(() => {
      this.isLoading = false
    })
  }

  async setUser(): Promise<void> {
    this.user = await CurrentUser.get()
  }

  async fetchCompany(): Promise<void> {
    let repository = useCompanyStore()
    let response = await repository.fetch(this.companyId)
    this.company = new Company(response)
  }

  async fetchShareholders(): Promise<void> {
    let repository = useShareholderStore()
    let response = await repository.fetchAllForCompany(this.companyId)
    this.shareholders = response.map((shareholder: any) => {
      return new Shareholder(shareholder)
    })
  }

  async fetchDirectors(): Promise<void> {
    let repository = useDirectorStore()
    let response = await repository.fetchAllForCompany(this.companyId)
    this.directors = response.map((director: any) => {
      return new Director(director)
    })
  }

  async fetchExistingIssuance(): Promise<void> {
    let repository = useCompanyShareIssuanceStore()
    let filter = new Filter()
    filter.companyId = this.companyId
    filter.statuses = [
      StatusConstants.PAID,
      StatusConstants.SUBMITTED,
      StatusConstants.APPROVED,
      StatusConstants.NAME_REJECTED,
      StatusConstants.RESPONDED,
      StatusConstants.ONGOING,
    ]
    filter.take = 1
    filter.orderBy = "created_at"
    filter.sortOrder = "desc"

    let response = await repository.fetchAll(filter)
    if (response.totalRecords <= 0) {
      this.existingIssuance = new CompanyShareIssuance()
      return
    }

    this.existingIssuance = new CompanyShareIssuance(response.data[0])
  }

  async fetchExistingAllotment(): Promise<void> {
    let repository = useCompanyShareholderAllotmentStore()

    let filter = new Filter()
    filter.companyId = this.companyId
    filter.statuses = [
      StatusConstants.PAID,
      StatusConstants.SUBMITTED,
      StatusConstants.APPROVED,
      StatusConstants.NAME_REJECTED,
      StatusConstants.RESPONDED,
      StatusConstants.ONGOING,
    ]
    filter.take = 1
    filter.orderBy = "created_at"
    filter.sortOrder = "desc"

    let response = await repository.fetchAll(filter)
    if (response.totalRecords <= 0) {
      this.existingApplication = new CompanyShareholderAllotment()
      return
    }

    this.existingApplication = new CompanyShareholderAllotment(response.data[0])
    this.shareType = this.existingApplication.details.typeOfShares
  }

  async fetchExistingAuthorization(): Promise<void> {
    let repository = useCompanyShareAuthorizationStore()

    let filter = new Filter()
    filter.companyId = this.companyId

    filter.take = 1
    filter.orderBy = "created_at"
    filter.sortOrder = "desc"

    let response = await repository.fetchAll(filter)
    if (response.totalRecords <= 0) {
      this.existingShareAuthorization = new CompanyShareAuthorization()
      return
    }

    this.existingShareAuthorization = new CompanyShareAuthorization(response.data[0])
  }

  async fetchPrice(): Promise<void> {
    try {
      let repository = useServicePricingStore()

      let promises = [
        repository.fetch(this.targetServicePricingId).then((response) => {
          this.targetServicePricing = new ServicePricing(response)
        }),
        repository.fetch(this.termSheetServicePricingId).then((response) => {
          this.termSheetServicePricing = new ServicePricing(response)
        }),
        repository.fetch(this.prnServicePricingId).then((response) => {
          this.prnServicePricing = new ServicePricing(response)
        }),
        repository.fetch(this.perAllotteeServicePricingId).then((response) => {
          this.perAllotteeServicePricing = new ServicePricing(response)
        }),
      ]

      await Promise.all(promises)

      this.price =
        Number(this.targetServicePricing.baseGrandTotal) + Number(this.targetServicePricing.config.handlingFees ?? 0)
    } catch (e) {
      console.error("error?", e)
      this.price = 199
    }
  }

  async makePayment(
    companyShareIssuance: CompanyShareIssuance,
    companyShareholderAllotment: CompanyShareholderAllotment
  ): Promise<PaymentCart | null> {
    if (this.isSubmitting) {
      return null
    }

    try {
      this.isSubmitting = true
      this.companyShareIssuance = new CompanyShareIssuance(companyShareIssuance)
      this.companyShareholderAllotment = new CompanyShareholderAllotment(companyShareholderAllotment)
      await this.submitApplication()

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        CompanyConstants.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES,
        this.companyShareholderAllotment.id
      )
      await makePayment.setPaymentCart()

      let paymentCartItem = makePayment.paymentCart.items.find((pci: PaymentCartItem) => {
        return (
          pci.targetType === CompanyConstants.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES &&
          pci.targetId === this.companyShareholderAllotment.id
        )
      })

      if (paymentCartItem) {
        let servicePricing = this.targetServicePricing

        if (this.isPrnRequired()) {
          let newMandatoryService = new ServicePricingMandatory()
          newMandatoryService.mandatoryServiceId = this.prnServicePricingId
          newMandatoryService.mandatoryServicePrice = new ServicePricing(this.prnServicePricing)
          newMandatoryService.basePrice = this.prnServicePricing.baseGrandTotal
          servicePricing.mandatoryServices.push(newMandatoryService)

          servicePricing.baseGrandTotal = servicePricing.baseGrandTotal + newMandatoryService.basePrice
        }

        if (this.shareType === ShareType.Preference) {
          let newMandatoryService = new ServicePricingMandatory()
          newMandatoryService.mandatoryServiceId = this.termSheetServicePricingId
          newMandatoryService.mandatoryServicePrice = new ServicePricing(this.termSheetServicePricing)
          newMandatoryService.basePrice = 99 //this.termSheetServicePricing.baseGrandTotal
          servicePricing.mandatoryServices.push(newMandatoryService)

          servicePricing.baseGrandTotal = servicePricing.baseGrandTotal + newMandatoryService.basePrice
        }

        let paymentCartItemOptionals: PaymentCartItemOptional[] = []
        let optionals: ServicePricingOptional[] = []
        servicePricing.optionals.forEach((spo: ServicePricingOptional) => {
          if (spo.optionalServiceId === this.perAllotteeServicePricingId) {
            spo.optionalServicePrice.serviceName = "per Allottee"
            let price =
              spo.optionalServicePrice.baseGrandTotal *
              this.companyShareholderAllotment.details.maxShareholderAfterAllotment
            spo.optionalServicePrice.baseGrandTotal = price

            let clonedOptional = new ServicePricingOptional(spo)
            optionals.push(clonedOptional)
            let newPaymentCartItemOptional = new PaymentCartItemOptional()
            newPaymentCartItemOptional.servicePricing = new ServicePricing(clonedOptional.optionalServicePrice)
            newPaymentCartItemOptional.servicePricingId = clonedOptional.optionalServiceId ?? ""
            newPaymentCartItemOptional.total = clonedOptional.optionalServicePrice.baseGrandTotal
            paymentCartItemOptionals.push(newPaymentCartItemOptional)
          }
        })

        paymentCartItem.optionals = paymentCartItemOptionals.map((pcio: PaymentCartItemOptional) => {
          return new PaymentCartItemOptional(pcio)
        })

        paymentCartItem.selectedOptionals = optionals.map((opt: ServicePricingOptional) => {
          return new ServicePricingOptional(opt)
        })

        paymentCartItem.servicePricingId = servicePricing.id
        paymentCartItem.servicePricing = new ServicePricing(servicePricing)
      }

      return makePayment.paymentCart
    } catch (e: any) {
      if (!StringUtil.isNullOrEmpty(this.companyShareIssuance.id)) {
        this.companyShareIssuance.remove(useCompanyShareIssuanceStore())
      }

      if (!StringUtil.isNullOrEmpty(this.companyShareholderAllotment.id)) {
        this.companyShareholderAllotment.remove(useCompanyShareholderAllotmentStore())
      }

      throw e
    } finally {
      this.isSubmitting = false
    }
  }

  async submitApplication(): Promise<void> {
    let promises = []

    if (StringUtil.isNullOrEmpty(this.companyShareIssuance.id)) {
      promises.push(this.companyShareIssuance.create(useCompanyShareIssuanceStore()))
    } else {
      promises.push(this.companyShareIssuance.update(useCompanyShareIssuanceStore()))
    }

    if (StringUtil.isNullOrEmpty(this.companyShareholderAllotment.id)) {
      promises.push(this.companyShareholderAllotment.create(useCompanyShareholderAllotmentStore()))
    } else {
      promises.push(this.companyShareholderAllotment.update(useCompanyShareholderAllotmentStore()))
    }

    await Promise.all(promises)

    this.companyShareIssuance.allotmentId = this.companyShareholderAllotment.id // tie them together
    await this.companyShareIssuance.update(useCompanyShareIssuanceStore())
  }

  sharePercentage(shareholder: Shareholder): number {
    let shareType = !StringUtil.isNullOrEmpty(this.shareType) ? this.shareType : ShareType.Ordinary
    let amountOfShares = shareType === ShareType.Ordinary ? shareholder.ordinaryShares : shareholder.preferenceShares

    return amountOfShares / this.totalCompanyShares
  }

  // conditions
  hasAnyPreferenceShare(): boolean {
    return this.shareholders.some((shareholder: Shareholder) => {
      return shareholder.preferenceShares > 0
    })
  }

  isPrnRequired(): boolean {
    if (this.company.hasConstitution) {
      return this.company.companySetting?.isPrnRequired ?? true // set it to true if not specified
    }

    return this.shareType === ShareType.Ordinary || this.hasAnyPreferenceShare()
  }

  hasPaid(): boolean {
    return !StringUtil.isNullOrEmpty(this.existingApplication.id) && this.existingApplication.isPaid
  }

  get hasOngoingAllotment(): boolean {
    return !StringUtil.isNullOrEmpty(this.existingIssuance.id) || !StringUtil.isNullOrEmpty(this.existingApplication.id)
  }

  get isDirector(): boolean {
    return this.directors.some((d: Director) => {
      return d.email === this.user.email
    })
  }

  get isShareholder(): boolean {
    return this.shareholders.some((s: Shareholder) => {
      return s.email === this.user.email
    })
  }

  get hasAnyDirectorSignedProposal(): boolean {
    return this.existingIssuance.signatureGroups.some((sg: SignatureGroup) => {
      return sg.group?.target === "director"
    })
  }

  get totalCompanyShares(): number {
    let shareType = !StringUtil.isNullOrEmpty(this.shareType) ? this.shareType : ShareType.Ordinary
    return this.shareholders
      .map((s: Shareholder) => {
        return shareType === ShareType.Ordinary ? s.ordinaryShares : s.preferenceShares
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0)
  }

  get isUserPrnResponseRequired(): boolean {
    if (!this.isShareholder) {
      return false
    }

    let shareholder = this.shareholders.find((s: Shareholder) => {
      return s.email === this.user.email
    })

    if (!shareholder) {
      return false
    }

    let hasResponded = this.existingIssuance.responses.some((c: CompanyShareIssuanceResponse) => {
      if (!shareholder) {
        return false
      }

      return c.shareholder.id === shareholder.id && c.responseDate !== null
    })

    return !hasResponded
  }

  get isFullyExercised(): boolean {
    return this.existingIssuance.responses.every((c: CompanyShareIssuanceResponse) => {
      return c.responseDate !== null && !c.isWaived
    })
  }

  get isPartiallyExercised(): boolean {
    return this.existingIssuance.responses.some((c: CompanyShareIssuanceResponse) => {
      return c.responseDate !== null && !c.isWaived
    })
  }

  get isFullyWaived(): boolean {
    return this.existingIssuance.responses.every((c: CompanyShareIssuanceResponse) => {
      return c.responseDate !== null && c.isWaived
    })
  }

  get isPartiallyWaived(): boolean {
    return this.existingIssuance.responses.some((c: CompanyShareIssuanceResponse) => {
      return c.responseDate !== null && c.isWaived
    })
  }

  get totalNumberOfShareholders(): number {
    return this.shareholders.length
  }

  get respondedShareholders(): number {
    return this.existingIssuance.responses.filter((response: CompanyShareIssuanceResponse) => {
      return response.responseDate !== null
    }).length
  }

  get prnStatuses(): string[] {
    let items: string[] = []

    let numberOfRespondedShareholders = this.respondedShareholders

    let numberOfPendingShareholders = this.totalNumberOfShareholders - numberOfRespondedShareholders
    if (numberOfPendingShareholders > 0) {
      items.push(
        this.language.isMalay()
          ? `Menunggu Maklum Balas dari ${numberOfPendingShareholders} Pemegang Saham`
          : `Awaiting ${numberOfPendingShareholders} Shareholder${numberOfPendingShareholders > 1 ? "s" : ""} Response`
      )
    }

    let numberOfShareholdersWaived = this.existingIssuance.responses.filter(
      (response: CompanyShareIssuanceResponse) => {
        return response.responseDate !== null && response.isWaived
      }
    ).length

    if (numberOfShareholdersWaived > 0) {
      items.push(
        this.language.isMalay()
          ? `dilepaskan oleh ${numberOfShareholdersWaived} Pemegang Saham`
          : `waived by ${numberOfShareholdersWaived} Shareholder${numberOfShareholdersWaived > 1 ? "s" : ""}`
      )
    }

    let numberOfShareholdersAccepted = this.existingIssuance.responses.filter(
      (response: CompanyShareIssuanceResponse) => {
        return response.responseDate !== null && !response.isWaived
      }
    ).length

    if (numberOfShareholdersAccepted > 0) {
      items.push(
        this.language.isMalay()
          ? `diterima oleh ${numberOfShareholdersAccepted} Pemegang Saham`
          : `accepted by ${numberOfShareholdersAccepted} Shareholder${numberOfShareholdersAccepted > 1 ? "s" : ""}`
      )
    }

    return items
  }

  get hasExpired(): boolean {
    if (
      this.existingIssuance.status === StatusConstants.RESPONDED ||
      this.existingIssuance.status === StatusConstants.ISSUED
    ) {
      return true
    }

    let dayjs = useDayjs()
    let expiryDate = dayjs(this.existingIssuance.expiryDate).endOf("day")

    return dayjs().isAfter(expiryDate)
  }

  get noticeExpiryDate(): string {
    let dayjs = useDayjs()
    let time = useLocalTime()

    return time.formatDateOnlyShort(this.existingIssuance.expiryDate)
  }
}
