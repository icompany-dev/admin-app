import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { Bank } from "~/scripts/models/Bank"
import { DeliveryConstants, PaymentConstants } from "~/scripts/constants/Payment"
import { Filter } from "~/scripts/library/Filter"
import { StatusConstants } from "~/scripts/constants/Status"
import { BankConstants } from "~/scripts/constants/Banks"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import { OnlineBanking } from "~/scripts/types/banks/OnlineBanking"
import { SignatureGroup, SignatureGroupGroup, SignatureGroupTarget } from "~/scripts/models/SignatureGroup"
import { BankOpeningAdditionalRequirements } from "~/scripts/constants/BankDetails"
import { MakePayment } from "~/scripts/library/MakePayment"
import { BankRequirementChecklist } from "~/scripts/library/BankRequirementChecklist"
import type { BankChecklistItem } from "~/scripts/types/banks/BankChecklistItem"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"
import { DocumentScaler } from "~/scripts/library/DocumentScaler"
import { PaperOrientation } from "~/scripts/constants/Paper"
import * as pdfjsLib from "pdfjs-dist"
import type { ComponentPublicInstance } from "vue"
import { ActionTrayDropdown } from "~/scripts/types/action-trays/ActionTrayDropdown"
import { ActionTraySwitch } from "~/scripts/types/action-trays/ActionTraySwitch"
import { Company } from "~/scripts/models/Company"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { FirstBankAccountChecker } from "~/scripts/library/FirstBankAccountChecker"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import type { ServicePricingOptional } from "~/scripts/models/ServicePricingOptional"
import { PaymentCartItemOptional } from "~/scripts/models/PaymentCartItemOptional"

export class BankAccountOpeningServiceController extends CompanyServiceController<CompanyBankAccountOpening> {
  companyBankAccountOpening = ref<CompanyBankAccountOpening>(new CompanyBankAccountOpening())
  bankId: Ref<string> = ref<string>("")
  isDocumentShow: Ref<boolean> = ref<boolean>(true)

  deleteApplicationRef: any | null = null
  companyDocumentsContainerRef: any | null = null
  checklistRef: any | null = null
  wrapperRef: any | null = null
  updateApplicationNoticeRef: any | null = null

  actionTrayRef: any | null = null
  isFilterRequiredAttention: Ref<boolean> = ref<boolean>(false)

  pdfCanvasRefs = ref<HTMLCanvasElement[]>([])
  zoomStatutoryRef: any | null = null
  addOnOpenBankAccountRef: any | null = null

  // Maybank-specific refs
  dcrMaybankRef: any | null = null
  authorisedSignatoriesRef: any | null = null
  dcrOnlineBankingRef: any | null = null
  declarationRef: any | null = null

  // Affin-specific refs
  dcrAffinRef: any | null = null
  appendixAAffinRef: any | null = null
  declarationAffinRef: any | null = null

  // Bank IDs
  private static MAYBANK_ID = "f112c274-f545-4596-830b-50e337aa9ed4"
  private static AFFIN_ID = "7ccda4e9-d883-45bc-be47-6c62ac034065"

  activeDocumentIndex = ref<number>(0)
  isScrolling: boolean = false
  isDragging: boolean = false
  hasDragged: boolean = false
  dragStartPositionY: number = 0
  dragThreshold: number = 50

  isFirstLoad = ref<boolean>(true)
  isDocumentZoomed = ref<boolean>(false)
  zoomedDocumentIndex = ref<number>(0)
  signatureFile: Ref<string | null> = ref<string | null>(null)
  isRenderingDocumentZoom: Ref<boolean> = ref<boolean>(false)

  bankRequirementChecklist = ref<BankRequirementChecklist>(new BankRequirementChecklist(""))
  firstBankAccountChecker = ref<FirstBankAccountChecker>(new FirstBankAccountChecker(""))

  firstBankAccountOpeningPrice = ref<ServicePricing>(new ServicePricing())
  additionalBankAccountOpeningPrice = ref<ServicePricing>(new ServicePricing())

  isAddOnRubberStamp: Ref<boolean> = ref<boolean>(false)
  isAddOnCorporateProfile: Ref<boolean> = ref<boolean>(false)

  isUpdatingStatus: Ref<boolean> = ref<boolean>(false)
  bankAccountNumber: Ref<string> = ref<string>("")

  bankReviewRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null, bankId: string) {
    super(companyId, true, false, CompanyBankAccountOpening, useCompanyBankAccountOpeningStore(), emitEvents)
    this.target = CompanyConstants.TARGET_OPEN_BANK_ACCOUNT
    this.bankId.value = bankId

    this.setViewType(viewType)
    this.initializeData()
    this.setBankRequirementChecklist()
    this.fetchPrice()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    if (this.viewType.value !== ViewMode.Past) {
      await Promise.all([this.fetchPrice(), this.fetchOngoingApplication()])

      if (this.hasOngoingApplication.value) {
        this.viewType.value = ViewMode.Existing // show alert
        this.emitEvents(EmitMessages.GO_TO_EXISTING)
      }
    } else {
      this.isInPreviewMode.value = true
      await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
      this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
    }

    this.init(this.companyBankAccountOpening.value as CompanyBankAccountOpening)
    this.isLoading.value = false

    // setTimeout(() => {
    //   this.isFirstLoad.value = false
    // }, 100)
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let filter = new Filter()
      filter.companyId = this.companyId
      filter.takeAll = true
      filter.statuses.push(
        StatusConstants.PAID,
        StatusConstants.READY,
        StatusConstants.SHIPPED,
        StatusConstants.SUBMITTED
      )

      let response = await this.repository.fetchAll(filter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (response.totalRecords <= 0) {
        this.setEmptyApplication()
        return
      }

      if (StringUtil.isNullOrEmpty(this.bankId.value)) {
        let firstPaid = response.data.find((d: any) => {
          return d.status === StatusConstants.PAID
        })

        if (firstPaid) {
          this.setOngoingApplication(firstPaid)
          this.bankId.value = this.companyBankAccountOpening.value.bankId
          return
        }

        this.setOngoingApplication(response.data[0])
        this.bankId.value = this.companyBankAccountOpening.value.bankId
        return
      }

      let applicationForThisBank = response.data.find((application: any) => {
        return application.bankId === this.bankId.value
      })

      if (!applicationForThisBank) {
        this.setEmptyApplication()
        return
      }

      this.setOngoingApplication(applicationForThisBank)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  setEmptyApplication(): void {
    this.companyBankAccountOpening.value = new CompanyBankAccountOpening()
    this.companyBankAccountOpening.value.companyId = this.companyId
    this.companyBankAccountOpening.value.bankId = this.bankId.value
    this.hasOngoingApplication.value = false
  }

  setOngoingApplication(application: any): void {
    this.companyBankAccountOpening.value = new CompanyBankAccountOpening(application)
    this.application.value = new CompanyBankAccountOpening(application)
    this.hasOngoingApplication.value = true
    this.viewType.value = ViewMode.Existing
    this.isInPreviewMode.value = false
  }

  async fetchPreviousSubmission(): Promise<void> {
    try {
      let response = await this.repository.latestCompleted(this.companyId)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (!response) {
        this.hasSubmittedBefore.value = false
        this.lastApplicationDate.value = ""
        this.hasPastApplications.value = false
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, false)
        return
      }

      let lastApplication = new CompanyBankAccountOpening(response)
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
      this.hasPastApplications.value = true
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, true)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  override async fetchPrice(): Promise<void> {
    let repository = useServicePricingStore()
    const additionalBankAccountOpeningPriceId = "59801960-f265-4ee8-a246-5b5e557df2d8"
    const firstBankAccountOpeningPriceId = "a5a4c1c9-bf27-4647-b27c-12a19a65a2de"

    let promises = [
      repository.fetch(additionalBankAccountOpeningPriceId),
      repository.fetch(firstBankAccountOpeningPriceId),
    ]

    await Promise.all(promises).then((responses) => {
      if (responses[0]) {
        this.additionalBankAccountOpeningPrice.value = new ServicePricing(responses[0])
      }

      if (responses[1]) {
        this.firstBankAccountOpeningPrice.value = new ServicePricing(responses[1])
      }
    })

    let optionalPromises = this.additionalBankAccountOpeningPrice.value.optionals.map(
      (optional: ServicePricingOptional) => {
        return repository.fetch(optional.optionalServiceId ?? "")
      }
    )

    optionalPromises.push(
      ...this.firstBankAccountOpeningPrice.value.optionals.map((optional: ServicePricingOptional) => {
        return repository.fetch(optional.optionalServiceId ?? "")
      })
    )

    await Promise.all(optionalPromises).then((responses) => {
      responses.forEach((response) => {
        if (!response) {
          return
        }

        let optional =
          this.additionalBankAccountOpeningPrice.value.optionals.find((optional: ServicePricingOptional) => {
            return optional.optionalServiceId === response.id
          }) ||
          this.firstBankAccountOpeningPrice.value.optionals.find((optional: ServicePricingOptional) => {
            return optional.optionalServiceId === response.id
          })

        if (optional) {
          optional.optionalServicePrice = new ServicePricing(response)
        }
      })
    })
  }

  setZoomStatutoryRef(zoomStatutoryRef: any | null): void {
    this.zoomStatutoryRef = zoomStatutoryRef
  }

  setAddOnOpenBankAccountRef(addOnOpenBankAccountRef: any): void {
    this.addOnOpenBankAccountRef = addOnOpenBankAccountRef
  }

  setBankReviewRef(bankReviewRef: any): void {
    this.bankReviewRef = bankReviewRef
  }

  async setBankRequirementChecklist(): Promise<void> {
    this.bankRequirementChecklist.value = new BankRequirementChecklist(this.companyId)
    await this.bankRequirementChecklist.value.init()
    this.bankRequirementChecklist.value.statutoryDocuments.forEach((sd, index) => {
      if (sd.fileUrl === null) {
        return
      }

      this.renderPdf(index, sd.fileUrl)
    })
  }

  getStatutoryDocumentList(): BankChecklistItem[] {
    return this.bankRequirementChecklist.value.statutoryDocuments.filter((item) => {
      return !StringUtil.isNullOrEmpty(item.fileUrl)
    })
  }

  setActionTrayRef(ref: any): void {
    this.actionTrayRef = ref
    this.setActionTrayElements()
  }

  override setActionTrayElements(): void {
    if (!this.actionTrayRef) {
      return
    }

    this.actionTrayElements.value = [
      new ActionTrayElement("back", this.onBackButtonClicked.bind(this), {
        label: new ActionTrayLabel("Back", "Back"),
        isHidden: false,
        isIconStart: true,
        iconClass: "icon-large icon-primary fa-solid fa-circle-arrow-left",
      }),

      new ActionTrayElement(
        "all-document",
        () => {
          console.log("Memo Download Function")
        },
        {
          label: new ActionTrayLabel("Memo", "Memo"),
          isDisabled: !this.isFilterRequiredAttention.value,
        }
      ),
      new ActionTrayElement("more-info", this.onMoreInfoClicked.bind(this), {
        label: new ActionTrayLabel("Learn More", "Maklumat Lanjut"),
      }),
      new ActionTrayDropdown(
        "more",
        {
          iconClass: "fa-solid fa-ellipsis",
          isIconOnly: true,
        },
        [
          new ActionTraySwitch(
            "all-document",
            this.onShowAllDocumentClicked.bind(this),
            {
              label: new ActionTrayLabel("All Document:", "All Document:"),
            },
            true
          ),
          new ActionTraySwitch(
            "required-attention",
            this.onShowRequiredAttentionClicked.bind(this),
            {
              label: new ActionTrayLabel("Require Attention:", "Required Attention:"),
            },
            false
          ),

          new ActionTraySwitch(
            "compact",
            this.onShowRequiredAttentionClicked.bind(this),
            {
              label: new ActionTrayLabel("Grid View", "Grid View"),
            },
            false
          ),
        ]
      ),
    ]
  }

  isZoomStatutoryDocument(): boolean {
    let documentCount = this.isMaybank() ? 4 : 1
    return this.zoomedDocumentIndex.value > documentCount - 1
  }

  onDeleteClicked(): void {
    if (!this.deleteApplicationRef) {
      return
    }

    this.deleteApplicationRef.show()
  }

  onDeleteSuccess(): void {
    this.router.push(`/sdnbhd/${this.companyId}/banks`)
  }

  onGoToPreviousPage(): void {
    const previousPageUrl = window.history.state?.back
    if (!previousPageUrl) {
      this.router.push(`/sdnbhd/${this.companyId}/banks/open-bank-account`)
      return
    }

    this.router.push(previousPageUrl)
  }

  onShowAllDocumentClicked(): void {
    this.activeDocumentIndex.value = 0
    this.isFilterRequiredAttention.value = false
    this.setActionTrayElements()
  }

  onShowRequiredAttentionClicked(): void {
    this.activeDocumentIndex.value = 0
    this.isFilterRequiredAttention.value = true
    this.setActionTrayElements()
  }

  onWrapperMinimized(applicationData: any): void {
    if (!applicationData) {
      return
    }

    this.companyBankAccountOpening.value = new CompanyBankAccountOpening(applicationData)
  }

  onApplicationUpdated(applicationData: any): void {
    if (!applicationData) {
      return
    }

    this.companyBankAccountOpening.value = new CompanyBankAccountOpening(applicationData)
  }

  async onProceedToPayment(data: any): Promise<void> {
    this.isAddOnRubberStamp.value =
      data.isCompanyChopSelected === null || data.isCompanyChopSelected === undefined
        ? this.checklistRef.getRubberStamp()
        : data.isCompanyChopSelected
    this.isAddOnCorporateProfile.value =
      data.isCompanyProfileSelected === null || data.isCompanyProfileSelected === undefined
        ? this.checklistRef.getCorporateProfile()
        : data.isCompanyProfileSelected

    await this.makePayment()
  }

  async makePayment(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    try {
      this.isSubmitting.value = true
      await this.submitApplication()

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        this.target,
        this.companyBankAccountOpening.value.id
      )

      await makePayment.setPaymentCart()

      let paymentCart = makePayment.paymentCart
      const isConfirmationNoConstitution = this.checklistRef.getConfirmationNoConstitution()
      const isRubberStamp = this.isAddOnRubberStamp.value //this.checklistRef.getRubberStamp()
      const isCorporateProfile = this.isAddOnCorporateProfile.value //this.checklistRef.getCorporateProfile()

      this.firstBankAccountChecker.value = new FirstBankAccountChecker(this.companyId)
      await this.firstBankAccountChecker.value.init()

      let bankOpeningCartItem = paymentCart.items.find((item) => {
        return item.targetId === this.companyBankAccountOpening.value.id
      })

      if (bankOpeningCartItem) {
        if (this.firstBankAccountChecker.value.isFirst) {
          bankOpeningCartItem.servicePricing = this.firstBankAccountOpeningPrice.value
          bankOpeningCartItem.servicePricingId = this.firstBankAccountOpeningPrice.value.id
          bankOpeningCartItem.discountAmount =
            Number(bankOpeningCartItem.totalBreakdowns()) +
            Number(bankOpeningCartItem.totalMandatories()) +
            Number(bankOpeningCartItem.totalAdditionalServicePricings()) +
            Number(bankOpeningCartItem.cosecServiceFee()) +
            Number(bankOpeningCartItem.digitalServiceFee()) +
            Number(bankOpeningCartItem.handlingFees()) +
            Number(bankOpeningCartItem.ctcAmount ?? 0.0) +
            Number(bankOpeningCartItem.paperPrintPackageCost()) +
            Number(bankOpeningCartItem.totalExpressFiling()) +
            Number(bankOpeningCartItem.lateLodgementFees ?? 0.0)
        } else {
          bankOpeningCartItem.servicePricing = this.additionalBankAccountOpeningPrice.value
          bankOpeningCartItem.servicePricingId = this.additionalBankAccountOpeningPrice.value.id
        }

        bankOpeningCartItem.optionals = []
        bankOpeningCartItem.selectedOptionals = []

        bankOpeningCartItem.servicePricing.optionals.forEach((optional: ServicePricingOptional) => {
          if (!bankOpeningCartItem) {
            return
          }

          let newPaymentCartItemOptional = new PaymentCartItemOptional()
          newPaymentCartItemOptional.servicePricingId = optional.optionalServiceId ?? ""
          newPaymentCartItemOptional.servicePricing = new ServicePricing(optional.optionalServicePrice)
          bankOpeningCartItem?.optionals.push(newPaymentCartItemOptional)

          let isSelectedOptional =
            (isConfirmationNoConstitution && optional.optionalServiceId === "0c9b08b6-7a1d-4158-b816-40b37be5ce41") ||
            (isCorporateProfile && optional.optionalServiceId === "1ddee1cf-aa6e-4794-b413-5822d17c0354") ||
            (isRubberStamp && optional.optionalServiceId === "bd6bc257-7558-4913-886f-681ab3747d49") ||
            optional.optionalServiceId === "09268b9e-bac3-400d-8272-602b1ba5e375" // printed papers
          if (isSelectedOptional) {
            bankOpeningCartItem?.selectedOptionals.push(optional)
          }
        })

        bankOpeningCartItem.deliveryType = DeliveryConstants.DELIVERY_COURIER
      }

      this.emitEvents("pay", paymentCart)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async submitApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyBankAccountOpening.value.id)) {
      if (this.checklistRef) {
        this.companyBankAccountOpening.value.requirements = [BankOpeningAdditionalRequirements.ExtractDcr]

        if (this.checklistRef.getConfirmationNoConstitution()) {
          this.companyBankAccountOpening.value.requirements.push(
            BankOpeningAdditionalRequirements.NoConstitutionDeclaration
          )
        }

        if (this.checklistRef.getRubberStamp()) {
          this.companyBankAccountOpening.value.requirements.push(BankOpeningAdditionalRequirements.RubberStamp)
        }

        if (this.checklistRef.getCorporateProfile()) {
          this.companyBankAccountOpening.value.requirements.push(BankOpeningAdditionalRequirements.CorporateProfile)
        }
      }

      this.companyBankAccountOpening.value.companyId = this.companyId
      this.companyBankAccountOpening.value.bankId = this.bankId.value
      this.companyBankAccountOpening.value.type = "new"

      const bankStore = useBankStore()
      const bankData = await bankStore.fetch(this.bankId.value)
      const bank = new Bank(bankData)
      if (bank.branches.length > 0) {
        // TODo: force add data for now since required
        this.companyBankAccountOpening.value.bankBranchId = bank.branches[0].id
      }

      await this.companyBankAccountOpening.value.create(useCompanyBankAccountOpeningStore())
    } else {
      await this.companyBankAccountOpening.value.update(useCompanyBankAccountOpeningStore())
    }
  }

  setSignatories(): void {
    let signatories: CompanyBankSignatory[] = []

    switch (this.companyBankAccountOpening.value.bankId) {
      case BankConstants.MAYBANK_DETAIL.id:
        if (!this.authorisedSignatoriesRef) {
          return
        }

        signatories = this.authorisedSignatoriesRef.getSignatories()
        break

      default:
        if (this.dcrRef) {
          signatories = this.dcrRef.getSignatories()
        }
    }

    if (signatories.length <= 0) {
      return
    }

    this.companyBankAccountOpening.value.signatories = signatories.map((signatory: CompanyBankSignatory) => {
      return new CompanyBankSignatory(signatory)
    })
  }

  setPdfCanvasRef(canvasRef: Element | ComponentPublicInstance | null): void {
    if (canvasRef === null) {
      return
    }

    this.pdfCanvasRefs.value.push(canvasRef as HTMLCanvasElement)
  }

  setOnlineBanking(): void {
    let authorisedPersonForOnlineBanking: OnlineBanking[] = []

    switch (this.companyBankAccountOpening.value.bankId) {
      case BankConstants.MAYBANK_DETAIL.id:
        if (!this.dcrOnlineBankingRef) {
          return
        }

        authorisedPersonForOnlineBanking = this.dcrOnlineBankingRef.getAuthorisedPersonsForOnlineBanking()
        break

      default:
        if (this.dcrRef) {
          authorisedPersonForOnlineBanking = this.dcrRef.getAuthorisedPersonsForOnlineBanking()
        }
    }

    this.companyBankAccountOpening.value.onlineBanking = authorisedPersonForOnlineBanking.map((b) => {
      return new OnlineBanking(b)
    })
  }

  setSignatoryType(): void {
    let signatoryType: string = "normal"

    switch (this.companyBankAccountOpening.value.bankId) {
      case BankConstants.MAYBANK_DETAIL.id:
        if (!this.authorisedSignatoriesRef) {
          return
        }
        signatoryType = this.authorisedSignatoriesRef.getSignatoryType()
        break

      default:
        if (this.dcrRef) {
          signatoryType = this.dcrRef.getSignatoryType()
        }
    }

    this.companyBankAccountOpening.value.signatoryType = signatoryType
  }

  setBankBranchId(): void {
    let branchId: string = "normal"

    switch (this.companyBankAccountOpening.value.bankId) {
      case BankConstants.MAYBANK_DETAIL.id:
        if (this.authorisedSignatoriesRef) {
          branchId = this.authorisedSignatoriesRef.getBranchId()
        }
        break

      default:
        if (this.dcrRef) {
          branchId = this.dcrRef.getBranchId()
        }
    }

    this.companyBankAccountOpening.value.bankBranchId = branchId
  }

  setAll(): void {
    this.setSignatories()
    this.setSignatoryType()
    this.setOnlineBanking()
    this.setBankBranchId()
  }

  async onSigned(signatureFile: string): Promise<void> {
    this.signatureFile.value = signatureFile

    this.setAll()
    if (!this.isApplicationCompleted()) {
      return
    }

    await Promise.all([this.submitSignature(), this.saveApplication()])

    this.isDocumentZoomed.value = false
  }

  async submitSignature(): Promise<void> {
    if (this.signatureFile.value === null || !this.isADirector.value) {
      return
    }

    let director = this.directors.value.find((d) => {
      return d.email === this.currentUser.value.email
    })

    if (!director) {
      return
    }

    let signatureDate = this.time.formatDateOnlySystem(this.dayjs().format("YYYY-MM-DD"))

    let signatureGroup = new SignatureGroup()
    signatureGroup.target = new SignatureGroupTarget(this.companyBankAccountOpening.value.id, this.target)
    signatureGroup.group = new SignatureGroupGroup(director.id, "director")

    await signatureGroup.create(this.signatureFile.value, useFileStore(), useSignatureStore(), signatureDate)
  }

  async saveApplication(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    this.setSignatories()
    this.setSignatoryType()
    this.setOnlineBanking()
    this.isSubmitting.value = true
    try {
      await this.companyBankAccountOpening.value.update(useCompanyBankAccountOpeningStore())
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage = new Error()
        errorMessage.setForCUD()
        errorMessage.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyBankAccountOpening.value.id) || !this.hasPaid()) {
      if (this.addOnOpenBankAccountRef) {
        this.addOnOpenBankAccountRef.show()
        return
      } else {
        await this.makePayment()
        return
      }
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  onCloseChecklist(): void {
    this.isShowInfo.value = false
    this.setActionTrayElements()
  }

  setCompanyDocumentsContainerRef(ref: any | null): void {
    this.companyDocumentsContainerRef = ref
  }

  setChecklistRef(ref: any | null): void {
    this.checklistRef = ref
  }

  setUpdateApplicationNoticeRef(ref: any | null): void {
    this.updateApplicationNoticeRef = ref
  }

  showUpdateApplicationNotice(): void {
    if (!this.updateApplicationNoticeRef) {
      return
    }
    if (this.viewType.value !== ViewMode.Existing) {
      return
    }
    if (!this.hasPaid() || this.haveAllSigned()) {
      return
    }
    this.updateApplicationNoticeRef.show()
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef

    this.setOptionButtons()
  }

  setOptionButtons(): void {
    if (!this.wrapperRef) {
      return
    }
  }

  isMaybank(): boolean {
    return this.bankId.value === BankAccountOpeningServiceController.MAYBANK_ID
  }

  isAffin(): boolean {
    return this.bankId.value === BankAccountOpeningServiceController.AFFIN_ID
  }

  setDcrMaybankRef(ref: any | null): void {
    this.dcrMaybankRef = ref
  }

  setAuthorisedSignatoriesRef(ref: any | null): void {
    this.authorisedSignatoriesRef = ref
  }

  setDcrOnlineBankingRef(ref: any | null): void {
    this.dcrOnlineBankingRef = ref
  }

  setDeclarationRef(ref: any | null): void {
    this.declarationRef = ref
  }

  // Affin ref setters
  setDcrAffinRef(ref: any | null): void {
    this.dcrAffinRef = ref
  }

  setAppendixAAffinRef(ref: any | null): void {
    this.appendixAAffinRef = ref
  }

  setDeclarationAffinRef(ref: any | null): void {
    this.declarationAffinRef = ref
  }

  onOpenChecklist(): void {
    return this.checklistRef.toggleIsAdditionalShow()
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Pembukaan Akaun Bank" : "Bank Account Opening"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        <b>Pembukaan Akaun Bank</b> memerlukan resolusi pengarah untuk memberi kuasa kepada syarikat membuka dan
        mengekalkan akaun deposit dengan bank yang dipilih.
        <br><br>
        Resolusi ini termasuk butiran bank, penandatangan akaun korporat, dan orang yang diberi kuasa untuk perbankan dalam talian.
        <br><br>
        Resolusi perlu ditandatangani oleh semua pengarah secara <b>tandatangan basah (wet ink)</b>.
      `
    }

    return `
      <b>Bank Account Opening</b> requires a director's resolution to authorise the company to open and
      maintain a deposit account with the selected bank.
      <br><br>
      The resolution includes bank details, corporate account signatories, and authorised persons for online banking.
      <br><br>
      The resolution is required to be <b>signed in wet ink</b> by all directors.
    `
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi untuk Pembukaan Akaun Bank" : "Resolution for Opening of Bank Account"
  }

  isApplicationCreated(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyBankAccountOpening.value.id)
  }

  isDoneLoading(): boolean {
    let isWrapperDoneLoading = this.wrapperRef !== null && this.wrapperRef.isDoneLoading()

    if (this.isMaybank()) {
      let isDcrMaybankDoneLoading = this.dcrMaybankRef !== null && !this.dcrMaybankRef.isLoading
      return isDcrMaybankDoneLoading && isWrapperDoneLoading
    }

    if (this.isAffin()) {
      let isDcrAffinDoneLoading = this.dcrAffinRef !== null && !this.dcrAffinRef.isLoading
      return isDcrAffinDoneLoading && isWrapperDoneLoading
    }

    let isDcrDoneLoading = this.dcrRef !== null && !this.dcrRef.isLoading
    return isDcrDoneLoading && isWrapperDoneLoading
  }

  getResolutionDocumentCount(): number {
    let document = this.isMaybank() ? 4 : 1
    if (this.isFilterRequiredAttention.value) {
      document = this.isMaybank() ? 2 : 1
    }

    return document
  }

  getTotalDocuments(): number {
    let documentCount = 0
    if (this.companyDocumentsContainerRef) {
      const selector = this.isFilterRequiredAttention.value ? ".document:not(.not-required)" : ".document"
      const docsList = this.companyDocumentsContainerRef.querySelectorAll(selector)
      documentCount = docsList.length
    }
    return documentCount
  }

  getDocumentScale(): number {
    const windowWidth = window.innerWidth
    const paperWidthInPx = (170 / 25.4) * 96

    if (windowWidth > paperWidthInPx) {
      return 1
    }

    let documentScaler = new DocumentScaler(PaperOrientation.Portrait)
    return documentScaler.scaleFactor
  }

  getStyleForDocumentWrapper(): string {
    let scale = this.getDocumentScale()
    // Paper dimensions: 170mm x 257mm
    let paperHeightInPx = (257 / 25.4) * 96
    let paperWidthInPx = (170 / 25.4) * 96

    // Set container to scaled size to properly contain the scaled documents
    let width = paperWidthInPx * scale
    let height = paperHeightInPx * scale

    return `width: ${width}px; height: ${height}px;`
  }

  getStyle(index: number): string {
    const totalItems = this.getTotalDocuments()
    const offset = index - this.activeDocumentIndex.value
    const itemsRemaining = totalItems - this.activeDocumentIndex.value - 1
    const baseScale = this.getDocumentScale()

    if (totalItems === 1) {
      return `transform: translateY(20px) scale(${baseScale}); z-index: 5;`
    }

    let topOffset = 500 * baseScale
    let baseRotateX = -45
    const topOffsetPerDiv = 150 * baseScale
    const rotateStep = 5
    let zIndex = 5 - offset

    if (this.isFirstLoad.value) {
      return `transform: translateY(${topOffset}px) scale(${baseScale}) rotateX(${baseRotateX}deg); z-index: ${zIndex};`
    }

    if (offset === 0 && itemsRemaining === 0) {
      return `transform: translateY(-25px) scale(${baseScale}); z-index: 5;`
    }

    if (offset === 0) {
      return `transform: translateY(${topOffset}px) scale(${baseScale}) rotateX(${baseRotateX}deg); z-index: 5;`
    }

    if (offset >= 1 && offset <= 3) {
      let scale = baseScale * (1 - offset * 0.05)
      let top = topOffset - offset * topOffsetPerDiv
      let rotate = baseRotateX + offset * rotateStep
      return `transform: translateY(${top}px) scale(${scale}) rotateX(${rotate}deg); z-index: ${zIndex};`
    }

    if (offset > 3) {
      let scale = baseScale * (1 - offset * 0.05)
      return `opacity: 0; height: 0; transform: translateY(0px) scale(${scale}); z-index: -20;`
    }

    if (offset < 0) {
      return `transform: translateY(200%) scaleY(0); opacity: 0; z-index: 6;`
    }

    return ""
  }

  // Document zoom functionality
  async onDocumentClicked(): Promise<void> {
    if (this.hasDragged) {
      return
    }
    this.zoomedDocumentIndex.value = this.activeDocumentIndex.value
    this.isDocumentZoomed.value = true

    if (this.isZoomStatutoryDocument()) {
      await this.renderStatutoryDocument()
    }
  }

  async closeZoom(): Promise<void> {
    this.isDocumentZoomed.value = false
    await this.saveApplication()
  }

  onMouseScroll(event: WheelEvent): void {
    if (this.isScrolling) {
      return
    }

    this.isScrolling = true
    setTimeout(() => {
      this.isScrolling = false
    }, 1000)

    if (event.deltaY > 0) {
      this.nextDocument()
    } else {
      this.previousDocument()
    }
  }

  async renderPdf(index: number, pdfUrl: string): Promise<void> {
    let canvasRef = this.pdfCanvasRefs.value[index]

    if (!canvasRef) {
      return
    }

    if (!pdfUrl) {
      return
    }

    try {
      const loadingTask = pdfjsLib.getDocument(pdfUrl)
      const pdf = await loadingTask.promise
      const page = await pdf.getPage(1)

      const viewport = page.getViewport({ scale: 1 })
      const context = canvasRef.getContext("2d")

      if (!context || !canvasRef) {
        return
      }

      context.clearRect(0, 0, canvasRef.width, canvasRef.height)

      canvasRef.width = viewport.width
      canvasRef.height = viewport.height

      await page.render({
        canvas: canvasRef,
        canvasContext: context,
        viewport,
      }).promise
    } catch (e) {
      console.error(e)
    }
  }

  async renderStatutoryDocument(): Promise<void> {
    if (!this.zoomStatutoryRef || this.isRenderingDocumentZoom.value) {
      return
    }

    try {
      this.isRenderingDocumentZoom.value = true
      const statutoryDocuments = this.getStatutoryDocumentList()
      const index = this.isMaybank() ? this.zoomedDocumentIndex.value - 4 : this.zoomedDocumentIndex.value - 1
      const statutoryDocument = statutoryDocuments[index] ?? null
      if (statutoryDocument === null) {
        return
      }

      const pdfUrl = statutoryDocument.fileUrl

      if (StringUtil.isNullOrEmpty(pdfUrl) || pdfUrl === null) {
        return
      }

      const loadingTask = pdfjsLib.getDocument(pdfUrl)
      const pdf = await loadingTask.promise
      const page = await pdf.getPage(1)

      const viewport = page.getViewport({ scale: 1.3 })
      const context = this.zoomStatutoryRef.getContext("2d")

      if (!context || !this.zoomStatutoryRef) {
        return
      }

      context.clearRect(0, 0, this.zoomStatutoryRef.width, this.zoomStatutoryRef.height)

      this.zoomStatutoryRef.width = viewport.width
      this.zoomStatutoryRef.height = viewport.height

      await page.render({
        canvas: this.zoomStatutoryRef,
        canvasContext: context,
        viewport,
      }).promise
    } catch (e) {
      console.error(e)
    } finally {
      this.isRenderingDocumentZoom.value = false
    }
  }

  onDragStart(event: MouseEvent | TouchEvent): void {
    this.isDragging = true
    this.hasDragged = false
    this.dragStartPositionY = this.getDragPositionY(event)
  }

  onDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) {
      return
    }

    const currentY = this.getDragPositionY(event)
    const deltaY = currentY - this.dragStartPositionY

    if (Math.abs(deltaY) > 5) {
      this.hasDragged = true
    }

    if (Math.abs(deltaY) > this.dragThreshold) {
      if (deltaY < 0) {
        this.previousDocument()
      } else {
        this.nextDocument()
      }
      this.isDragging = false
    }
  }

  onDragEnd(): void {
    this.isDragging = false
    if (this.hasDragged) {
      setTimeout(() => {
        this.hasDragged = false
      }, 100)
    }
  }

  private getDragPositionY(event: MouseEvent | TouchEvent): number {
    return event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
  }

  previousDocument(): void {
    if (this.activeDocumentIndex.value <= 0) {
      return
    }
    this.isFirstLoad.value = false
    this.activeDocumentIndex.value--
  }

  nextDocument(): void {
    if (this.activeDocumentIndex.value >= this.getTotalDocuments() - 1) {
      return
    }
    this.isFirstLoad.value = false
    this.activeDocumentIndex.value++
  }

  override handleDisplayedPage(): void {
    return
  }

  override onBackButtonClicked(): void {
    if (this.isSubmitting.value) {
      return
    }

    console.log("called??")
    this.emitEvents(EmitMessages.BACK)
  }

  isShowNoRecord(): boolean {
    if (this.isLoading.value) {
      return false
    }

    if (this.viewType.value === ViewMode.New) {
      return false
    }

    return (
      (this.viewType.value === ViewMode.Existing && !this.hasOngoingApplication.value) ||
      (this.viewType.value === ViewMode.Past && !this.hasPastApplications.value)
    )
  }

  setDisplayDocument(isDocumentShow: boolean): void {
    this.isDocumentShow.value = isDocumentShow
  }

  showChecklist(): boolean {
    if (this.isLoading.value) {
      return false
    }

    return (
      this.viewType.value === ViewMode.New ||
      (this.viewType.value === ViewMode.Existing && this.hasOngoingApplication.value)
    )
  }

  showResolution(): boolean {
    if (this.isLoading.value) {
      return false
    }

    return (
      (this.viewType.value === ViewMode.New && this.isDocumentShow.value) ||
      (this.viewType.value === ViewMode.Existing && this.hasOngoingApplication.value)
    )
  }

  isSignatoriesCompleted(): boolean {
    if (this.companyBankAccountOpening.value.signatories.length <= 0) {
      return false
    }

    return this.companyBankAccountOpening.value.signatories.every((signatory: CompanyBankSignatory) => {
      return (
        !StringUtil.isNullOrEmpty(signatory.name) &&
        !StringUtil.isNullOrEmpty(signatory.type) &&
        !StringUtil.isNullOrEmpty(signatory.role)
      )
    })
  }

  isOnlineBankingCompleted(): boolean {
    if (this.companyBankAccountOpening.value.onlineBanking.length <= 0) {
      return false
    }

    return this.companyBankAccountOpening.value.onlineBanking.every((ob: OnlineBanking) => {
      return !StringUtil.isNullOrEmpty(ob.name) && !StringUtil.isNullOrEmpty(ob.role)
    })
  }

  isSignatoryTypeComplete(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyBankAccountOpening.value.signatoryType)
  }

  isApplicationCompleted(): boolean {
    return (
      this.isSignatoryTypeComplete() &&
      this.isOnlineBankingCompleted() &&
      this.isSignatoriesCompleted() &&
      !StringUtil.isNullOrEmpty(this.companyBankAccountOpening.value.bankBranchId)
    )
  }

  isShowProcessing(): boolean {
    return this.isApplicationCompleted() && this.viewType.value === ViewMode.Existing
  }

  noRecordFoundTitle(): string {
    if (this.viewType.value === ViewMode.Existing) {
      return this.language.isMalay() ? "Tiada Permohonan Sediada" : "No Existing Application"
    }

    return this.language.isMalay() ? "Tiada Permohonan Terdahulu" : "No Record of Past Applications"
  }

  noRecordFoundSubtitle(): string {
    if (this.viewType.value === ViewMode.Existing) {
      return this.language.isMalay()
        ? "Tiada permohonan aktif buat masa ini.<br>Sila buat bayaran untuk memulakan permohonan baharu."
        : "There is no ongoing application.<br>Please make payment to create a new application."
    }

    return this.language.isMalay()
      ? "Permohonan terdahulu akan disenaraikan di sini apabila proses selesai."
      : "Past applications will be listed here when the process is completed."
  }

  override loaderLabel(): string {
    if (this.viewType.value === ViewMode.New) {
      return this.language.isMalay() ? "Menyediakan Dokumen Untuk" : "Preparing Document For"
    }

    if (this.viewType.value === ViewMode.Existing) {
      return this.language.isMalay() ? "Menyambung Semula" : "Resume Your"
    }

    if (this.viewType.value === ViewMode.Past) {
      return this.language.isMalay() ? "Sedang Mengambil" : "Getting Your"
    }

    return this.language.isMalay() ? "Menyediakan" : "Preparing Your"
  }

  override loaderSublabel(): string {
    if (this.viewType.value === ViewMode.New) {
      return this.language.isMalay() ? "Permohonan Pembukaan Akaun Bank Anda" : "Bank Account Opening"
    }

    if (this.viewType.value === ViewMode.Existing) {
      return this.language.isMalay() ? "Pembukaan Akaun Bank" : "Bank Account Opening"
    }

    if (this.viewType.value === ViewMode.Past) {
      return this.language.isMalay() ? "Permohonan yang Lalu" : "Past Applications"
    }

    return this.language.isMalay() ? "Pembukaan Akaun Bank Anda" : "Bank Account Opening"
  }

  alertTitle(): string {
    return this.language.isMalay()
      ? "Maklumat Lanjut: Permohonan Pembukaan Akaun Bank"
      : "Learn More: Bank Account Opening Application"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        <p>
          <b>1. Pengesahan Penerimaan Dokumen</b>
          <br>
          Mohon bantuan pihak anda untuk membuat pengesahan sebaik sahaja dokumen fizikal, Salinan Sah Benar 
          (CTC), borang bank, atau dokumen sokongan telah selamat diterima oleh pihak, cawangan, atau pegawai bank 
          yang berkenaan.
        </p>
        <p>
          <b>2. Kos Pentadbiran & Permohonan Semula</b>
          <br>
          Sila ambil maklum bahawa sebaik sahaja permohonan pembukaan akaun bank bermula, kerja-kerja pentadbiran, 
          penyediaan dokumen, penyelarasan, pengesahan, masa pemprosesan, dan usaha pematuhan berkaitan mungkin 
          telah pun dilaksanakan.
        </p>
        <p>
          Bagi keadaan di mana pembukaan akaun bank pertama disediakan secara percuma, diskaun, pakej terikat, promosi, 
          atau sebagai pelengkap kepada perkhidmatan lain, sebarang permohonan susulan atau ulangan akan dianggap 
          sebagai permohonan baharu dan dikenakan bayaran berasingan berdasarkan kadar bayaran semasa, walaupun jika:
        </p>
        <ul>
          <li>anda menukar bank atau cawangan;</li>
          <li>memutuskan untuk tidak meneruskan permohonan;</li>
          <li>permohonan ditolak oleh pihak bank; atau</li>
          <li>pihak bank meminta penyerahan dokumen yang baharu.</li>
        </ul>
        <p>
          <b>3. Sila Masukkan Nombor Akaun Bank</b>
          <br>
          Sebaik sahaja akaun bank telah berjaya dibuka, mohon bantuan pihak anda untuk mengemas kini dan 
          memasukkan Nombor Akaun Bank ke dalam bahagian yang berkaitan bagi tujuan rekod, pematuhan, jejak audit, 
          dan rujukan masa hadapan.
        </p>
        <p>
          <b>4. Usaha Wajar Pelanggan (CDD) & Usaha Wajar Ditingkatkan (EDD)</b>
          <br>
          Bank-bank di Malaysia adalah tertakluk kepada kewajipan kawal selia yang ditetapkan oleh Bank Negara 
          Malaysia termasuk Usaha Wajar Pelanggan, Usaha Wajar Ditingkatkan, kawalan anti-pengubahan wang haram, 
          saringan sekatan, dan keperluan Kenali Pelanggan Anda. Pengguna diharapkan dapat memberikan kerjasama 
          sepenuhnya serta mengemukakan maklumat yang tepat, lengkap, dan benar.
        </p>
        <p>
          <b>5. Hadkan Akses Kepada Orang yang Diberi Kuasa Sahaja</b>
          <br>
          Sila pastikan bahawa akses kepada akaun bank, kelayakan perbankan dalam talian, token, kata laluan, 
          peranti perbankan, buku cek, dan kemudahan berkaitan hanya diberikan kepada orang yang diberi kuasa 
          dengan sewajarnya dan diluluskan oleh Syarikat. Pengarah dan kakitangan yang diberi kuasa hendaklah 
          mengekalkan kawalan dalaman dan tadbir urus yang betul ke atas semua kemudahan perbankan.
        </p>
        <p>
          <b>6. Jangan Benarkan Akaun Anda Menjadi Akaun Keldai</b>
          <br>
          Akaun bank Syarikat anda tidak bersandarkan atau tidak boleh digunakan sebagai akaun keldai, 
          akaun pelapisan, akaun proksi, akaun transit, atau untuk sebarang transaksi yang menyalahi undang-undang, 
          mencurigakan, mengelirukan, atau tidak dibenarkan. Membenarkan pihak ketiga menyalahgunakan akaun bank 
          anda boleh mendedahkan Syarikat, Pengarah, penandatangan yang diberi kuasa, pemilik benefisial, dan pengguna 
          kepada implikasi kawal selia, sivil, atau jenayah yang serius termasuk siasatan di bawah undang-undang 
          anti-pengubahan wang haram dan undang-undang lain yang berkuat kuasa di Malaysia.
        </p>
        <p>
          Sentiasa pantau transaksi dan aktiviti yang dijalankan melalui akaun bank Syarikat anda dan laporkan dengan 
          segera sebarang aktiviti yang mencurigakan kepada pihak berkuasa yang berkaitan dan pihak Bank.
        </p>
      `
    }

    return `
      <p>
        <b>1. Confirmation of Delivery</b>
        <br>
        Please assist to confirm once the physical documents, Certified True Copies (CTC), bank forms, or supporting 
        documents have been safely received by the relevant party, branch, or bank officer.
      </p>
      <p>
        <b>2. Administrative Cost & Reapplication</b>
        <br>
        Please note that once a bank account opening application has commenced, administrative work, document preparation, 
        coordination, certification, processing time, and related compliance efforts may already have been expended.
      </p>
      <p>
        Where the first bank account opening was provided free, discounted, bundled, promotional, or complimentary as 
        part of another service, any subsequent or repeated application is treated as a new application and charged 
        separately based on the prevailing payment rates, even if:
      </p>
      <ul>
        <li>you change your bank or branch;</li>
        <li>decide not to proceed;</li>
        <li>the application is rejected by the bank; or</li>
        <li>the bank requests a fresh submission.</li>
      </ul>
      <p>
        <b>3. Please Insert the Bank Account Number</b>
        <br>
        Once the bank account has been successfully opened, please assist to update and insert the Bank Account 
        Number into the relevant section for record, compliance, audit trail, and future reference purposes.
      </p>
      <p>
        <b>4. Customer Due Diligence (CDD) & Enhanced Due Diligence (EDD)</b>
        <br>
        Banks in Malaysia are subject to regulatory obligations imposed by Bank Negara Malaysia including Customer 
        Due Diligence (CDD), Enhanced Due Diligence (EDD), anti-money laundering controls, sanctions screening, and 
        Know Your Customer (KYC) requirements. Users are expected to cooperate fully and provide accurate, complete, 
        and truthful information.
      </p>
      <p>
        <b>5. Restrict Access to Authorised Persons Only</b>
        <br>
        Please ensure that access to the bank account, online banking credentials, tokens, passwords, banking devices, 
        cheque books, and related facilities are only provided to properly authorised persons approved by the Company. 
        Directors and authorised personnel should maintain proper internal controls and governance over all banking 
        facilities.
      </p>
      <p>
        <b>6. Do Not Allow Your Account to Become a Mule Account</b>
        <br>
        Your Company’s bank account must not be used as a mule account, layering account, proxy account, transit account, 
        or for any unlawful, suspicious, misleading, or unauthorised transactions. Allowing third parties to misuse your 
        bank account may expose the Company, Directors, authorised signatories, beneficial owners, and users to serious 
        regulatory, civil, or criminal consequences including investigations under anti-money laundering laws and other 
        applicable laws in Malaysia.
      </p>
      <p>
        Always monitor the transactions and activities conducted through your Company’s bank account and immediately report 
        any suspicious activities to the relevant authorities and the Bank.
      </p>
    `
  }

  //PASCA
  currentState(): string {
    if (StringUtil.isNullOrEmpty(this.companyBankAccountOpening.value.bankId)) {
      return this.language.isMalay() ? "Bank Diperlukan" : "Bank Required"
    }

    if (StringUtil.isNullOrEmpty(this.companyBankAccountOpening.value.bankBranchId)) {
      return this.language.isMalay() ? "Maklumat Cawangan Diperlukan" : "Branch Information Required"
    }

    if (this.companyBankAccountOpening.value.signatories.length <= 0) {
      return this.language.isMalay() ? "Maklumat Signatories Diperlukan" : "Signatories Information Required"
    }

    if (this.companyBankAccountOpening.value.onlineBanking.length <= 0) {
      return this.language.isMalay()
        ? "Butiran Akses Pembankan Atas Talian Diperlukan"
        : "Online Banking Access Details Required"
    }

    return this.language.isMalay() ? "Semua Maklumat Lengkap" : "All Information Completed"
  }

  currentStateSubnote(): string {
    if (StringUtil.isNullOrEmpty(this.companyBankAccountOpening.value.bankId)) {
      return this.language.isMalay() ? "Pilih Bank" : "Select Bank"
    }

    if (StringUtil.isNullOrEmpty(this.companyBankAccountOpening.value.bankBranchId)) {
      return this.language.isMalay() ? "Pilih Cawangan" : "Select Branch"
    }

    if (this.companyBankAccountOpening.value.signatories.length <= 0) {
      return this.language.isMalay() ? "Pilih Signatories anda" : "Choose your Signatories"
    }

    if (this.companyBankAccountOpening.value.onlineBanking.length <= 0) {
      return this.language.isMalay() ? "Lengkapkan Dokumen" : "Complete Document"
    }

    return ""
  }

  showSignatories(): boolean {
    return this.companyBankAccountOpening.value.signatories.length > 0
  }

  showOnlineBanking(): boolean {
    return this.companyBankAccountOpening.value.onlineBanking.length > 0
  }

  signatoriesLabel(): string {
    return this.language.isMalay() ? "Authorised Signatories" : "Authorised Signatories"
  }

  signatories(): string[] {
    if (this.companyBankAccountOpening.value.signatories.length <= 0) {
      return []
    }

    return this.companyBankAccountOpening.value.signatories.map((d: CompanyBankSignatory) => {
      return d.name ?? ""
    })
  }

  onlineBankingAccessLabel(): string {
    return this.language.isMalay() ? "Akses ke Pembankan Atas Talian" : "Access to Online Banking"
  }

  onlineBanking(): string[] {
    if (this.companyBankAccountOpening.value.onlineBanking.length <= 0) {
      return []
    }

    return this.companyBankAccountOpening.value.onlineBanking.map((d: OnlineBanking) => {
      return `${d.name} (${d.role.toUpperCase()})`
    })
  }

  get isDelivered(): boolean {
    return (
      this.companyBankAccountOpening.value.status !== StatusConstants.DRAFT &&
      this.companyBankAccountOpening.value.status !== StatusConstants.PENDING &&
      this.companyBankAccountOpening.value.status !== StatusConstants.PAID
    )
  }

  get isInformationCompleted(): boolean {
    let isBasicCompleted =
      !StringUtil.isNullOrEmpty(this.companyBankAccountOpening.value.bankId) &&
      !StringUtil.isNullOrEmpty(this.companyBankAccountOpening.value.bankBranchId) &&
      this.companyBankAccountOpening.value.signatories.length > 0 &&
      this.companyBankAccountOpening.value.onlineBanking.length > 0

    if (this.companyBankAccountOpening.value.bankId === BankConstants.AFFIN_BANK_DETAIL.id) {
      if (!this.companyBankAccountOpening.value.affinBankApplicationDetails) {
        return false
      }

      if (!this.companyBankAccountOpening.value.affinBankApplicationDetails.isInformationCompleted()) {
        return false
      }
    }

    return isBasicCompleted
  }

  get isShowReadyToSubmit(): boolean {
    return this.isInformationCompleted && !this.isDocumentLocked
  }

  get readyToSubmitLabel(): string {
    return this.language.isMalay() ? "Sedia untuk serah?" : "Ready to submit?"
  }

  get readyToSubmitSublabel(): string {
    return this.language.isMalay()
      ? "Klik '<b>Serah</b>' untuk tandakan permohonan ini sedia untuk diproses."
      : "Click on '<b>Submit</b>' to mark this application as ready for processing."
  }

  get submitLabel(): string {
    return this.language.isMalay() ? "Serah" : "Submit"
  }

  async onSubmitAllInformation(): Promise<void> {
    if (!this.isInformationCompleted) {
      return
    }

    this.isUpdatingStatus.value = true
    this.companyBankAccountOpening.value.status = StatusConstants.READY
    await this.companyBankAccountOpening.value.update(useCompanyBankAccountOpeningStore())
    this.isUpdatingStatus.value = false
  }

  get isDocumentLocked(): boolean {
    return (
      this.companyBankAccountOpening.value.status !== StatusConstants.PAID &&
      this.companyBankAccountOpening.value.status !== StatusConstants.DRAFT &&
      this.companyBankAccountOpening.value.status !== StatusConstants.PENDING
    )
  }

  get status(): string {
    return this.language.isMalay()
      ? "Status Penghantaran Dokumen Sokongan Pembankan"
      : "Banking Supporting Documents Delivery Status"
  }

  get statusSubnote(): string {
    if (this.companyBankAccountOpening.value.status === StatusConstants.READY) {
      return this.language.isMalay() ? "Permohonan anda sedang diproses." : "Your application is being processed."
    }

    if (this.isDelivered) {
      return this.language.isMalay() ? "Telah Dihantar" : "Delivered"
    }

    return this.language.isMalay()
      ? "Sila sahkan bahawa salinan fizikal yang diperlukan oleh pihak Bank telah dihantar."
      : "Please confirm that the physical copies required by the Bank have been delivered."
  }

  get deliveryLabel(): string {
    return this.language.isMalay() ? "Telah Dihantar" : "Delivered"
  }

  async onDeliveredClicked(): Promise<void> {
    if (this.companyBankAccountOpening.value.status !== StatusConstants.PAID) {
      return
    }

    this.isUpdatingStatus.value = true
    this.companyBankAccountOpening.value.status = StatusConstants.SUBMITTED
    await this.companyBankAccountOpening.value.update(useCompanyBankAccountOpeningStore())
    this.isUpdatingStatus.value = false
  }

  get confirmation(): string {
    return this.language.isMalay() ? "Status Pembukaan Akaun Bank" : "Bank Account Opening Status"
  }

  get confirmationSubnote(): string {
    if (this.companyBankAccountOpening.value.status === StatusConstants.COMPLETED) {
      return this.language.isMalay() ? "Selesai" : "Completed"
    }

    return this.language.isMalay()
      ? "Sila sahkan perkara ini jika Akaun Bank Sdn Bhd anda telah diaktifkan:"
      : "Confirm this if Your Sdn Bhd Bank Account is activated:"
  }

  get isComplete(): boolean {
    return this.companyBankAccountOpening.value.status === StatusConstants.COMPLETED
  }

  get bankAccountNoLabel(): string {
    return this.language.isMalay() ? "No. Akaun Bank" : "Bank Account No."
  }

  get completedLabel(): string {
    return this.language.isMalay() ? "Selesai" : "Completed"
  }

  async onCompleteServiceClicked(): Promise<void> {
    if (this.companyBankAccountOpening.value.status !== StatusConstants.SUBMITTED) {
      return
    }

    if (StringUtil.isNullOrEmpty(this.bankAccountNumber.value)) {
      let error = new Error()
      error.setForIncompleteData()
      error.handle()
      return
    }

    // do something
    this.isUpdatingStatus.value = true
    if (this.bankReviewRef) {
      this.bankReviewRef.show()
    }

    await this.companyBankAccountOpening.value.addBankAccountNumber(
      this.bankAccountNumber.value,
      useCompanyBankAccountOpeningStore()
    )
    this.isUpdatingStatus.value = false
    let router = useRouter()
    router.push(`/sdnbhd/${this.companyId}/banks`)
  }

  //getters
  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New ? new CompanyBankAccountOpening() : this.companyBankAccountOpening.value

    if (this.viewType.value === ViewMode.New) {
      application.companyId = this.companyId
    }
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companyBankAccountOpening.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyBankAccountOpening.value.id,
      this.currentPage.value,
      this.totalPages.value,
      "DCR",
      showPasca,
      this.hasPaid(),
      this.price.value,
      this.isDocumentLocked,
      this.hasSigned(),
      this.userSignatureDate(),
      this.hasDcr.value,
      this.hasMcr.value,
      this.totalNumberOfDirectors.value,
      this.totalNumberOfShareholders.value,
      false,
      false,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      this.isInPreviewMode.value,
      this.isSubmitting.value,
      CompanyBankAccountOpening,
      useCompanyBankAccountOpeningStore(),
      false,
      true,
      true
    )
  }

  get resolutionDocumentProps() {
    let props = new PropsResolutionDocument<CompanyBankAccountOpening>(
      this.companyId,
      this.companyBankAccountOpening.value.id,
      this.companyBankAccountOpening.value as CompanyBankAccountOpening,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false,
      null,
      this.bankId.value
    )

    props.isShowTag = false

    return props
  }

  get applicationValue(): CompanyBankAccountOpening {
    return this.companyBankAccountOpening.value as CompanyBankAccountOpening
  }
}
