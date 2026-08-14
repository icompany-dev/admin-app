import { CompanyDividendDeclaration } from "~/scripts/models/CompanyDividendDeclaration"
import { useCompanyDividendDeclarationStore } from "~/stores/CompanyDividendDeclarations"
import { useCompanyStore } from "#imports"
import { ResolutionController } from "./ResolutionController"
import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"
import { SelectOption } from "~/scripts/types/SelectOption"
import { DividendPaymentMethod, DividendType } from "~/scripts/constants/DividendAndSolvency"
import { ShareType } from "~/scripts/constants/Shareholder"
import { NumberToWords, NumberUtil } from "~/scripts/utils/Number"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrDeclarationOfSolvencyDividendController extends ResolutionController<CompanyDividendDeclaration> {
  companyDividendDeclarationRepository = useCompanyDividendDeclarationStore()
  companyRepository = useCompanyStore()

  selectedDividendType: Ref<string> = ref<string>(DividendType.Interim)
  dividendTypes: SelectOption[] = [
    new SelectOption(DividendType.Interim, DividendType.Interim, DividendType.Interim),
    new SelectOption(DividendType.Final, DividendType.Final, DividendType.Final),
  ]

  selectedShareType: Ref<string> = ref<string>(ShareType.Ordinary)
  shareTypes: SelectOption[] = [
    new SelectOption(ShareType.Ordinary, ShareType.Ordinary, "Ordinary"),
    new SelectOption(ShareType.Preference, ShareType.Preference, "Preference"),
  ]

  selectedDividendPaymentMethod: Ref<string> = ref<string>(DividendPaymentMethod.BankTransfer)
  dividendPaymentMethods: SelectOption[] = [
    new SelectOption(DividendPaymentMethod.BankTransfer, DividendPaymentMethod.BankTransfer, "Bank Transfer"),
    new SelectOption(DividendPaymentMethod.Cheque, DividendPaymentMethod.Cheque, "Cheque"),
  ]

  pricePerShare: Ref<number> = ref<number>(1)
  amountInWords: Ref<string> = ref<string>("")
  amount: Ref<number> = ref<number>(1)
  financialYearEndDate: Ref<string> = ref<string>("")
  dateOfRegisterOfMembers: Ref<string> = ref<string>("")
  dividendPaymentDate: Ref<string> = ref<string>("")

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanyDividendDeclaration>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyDividendDeclaration,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.signatureStartOnPage.value = 2
    this.maxSignatureOnFirstPage.value = 4
    this.maxSignatureOnOtherPages.value = 6
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyDividendDeclarationRepository.fetch(id)
    if (!this.companyDividendDeclarationRepository.error) {
      this.application.value = new CompanyDividendDeclaration(response)

      this.selectedDividendType.value = this.application.value.dividendType
      this.selectedShareType.value = this.application.value.shareType
      this.selectedDividendPaymentMethod.value = this.application.value.dividendPaymentMethod
      this.pricePerShare.value = this.application.value.pricePerShare
      this.amountInWords.value = this.application.value.amountInWords
      this.amount.value = this.application.value.amount
      this.financialYearEndDate.value = this.application.value.financialYearEndDate
      this.dateOfRegisterOfMembers.value = this.application.value.dateOfRegisterOfMembers
      this.dividendPaymentDate.value = this.application.value.dividendPaymentDate
    }
  }

  async setApplication(): Promise<void> {
    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyDividendDeclaration()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(response)
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  async otherDataInitiation(): Promise<void> {
    // do nothing
  }

  setContent(): void {
    // do nothing
  }

  onSelectedDividendType(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.dividendType = this.selectedDividendType.value
  }
  onSelectedShareType(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.shareType = this.selectedShareType.value
  }
  onSelectedDividendPaymentMethod(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.dividendPaymentMethod = this.selectedDividendPaymentMethod.value
  }

  onTotalAmountInput(): void {
    this.amountInWords.value = NumberToWords.apply(this.amount.value)

    if (!this.application.value) {
      return
    }

    this.application.value.amountInWords = this.amountInWords.value
  }

  onPricePerShareChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.pricePerShare = this.pricePerShare.value
  }

  onAmountInWordsChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.amountInWords = this.amountInWords.value
  }

  onAmountChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.amount = this.amount.value
  }

  onFinancialYearEndDateChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.financialYearEndDate = this.financialYearEndDate.value
  }

  onDateOfRegisterOfMembersChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.dateOfRegisterOfMembers = this.dateOfRegisterOfMembers.value
  }

  onDividendPaymentDateChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.dividendPaymentDate = this.dividendPaymentDate.value
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return 2
    }

    return (
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )
    )
  }

  //Copywriting
  dividendType(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return "INTERIM / FINAL"
    }

    return this.application.value.dividendType === DividendType.Interim ? "interim" : "final"
  }

  dateOfRegister(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return "YOUR CUT OFF DATE"
    }

    return this.time.formatDateOnlyFull(this.application.value.dateOfRegisterOfMembers)
  }

  formattedDividendPaymentDate(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return "DIVIDEND PAYMENT DATE"
    }

    return this.time.formatDateOnlyFull(this.application.value.dividendPaymentDate)
  }

  anOrA(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return "An"
    }

    return this.application.value.dividendType === DividendType.Interim ? "An" : "A"
  }

  dividendPricePerShare(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return "PRICE PER SHARE"
    }

    return NumberUtil.thousandSeparator(this.application.value.pricePerShare)
  }

  dividendAmountInWords(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return "DIVIDEND AMOUNT IN WORDS"
    }

    return this.application.value.amountInWords
  }

  dividendTotal(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return "TOTAL DIVIDEND"
    }

    return NumberUtil.thousandSeparator(this.application.value.amount)
  }

  fye(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return "FINANCIAL YEAR END DATE"
    }

    let time = useLocalTime()
    return time.formatDateOnlyFull(this.application.value.financialYearEndDate)
  }

  shareType(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return "ORDINARY / PREFERENCE"
    }

    return this.application.value.shareType === ShareType.Ordinary ? "Ordinary" : "Preference"
  }

  dividendPaymentMethod(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return "YOUR PAYMENT METHOD"
    }

    return this.application.value.dividendPaymentMethod === DividendPaymentMethod.BankTransfer
      ? "bank transfer"
      : "cheque"
  }
}
