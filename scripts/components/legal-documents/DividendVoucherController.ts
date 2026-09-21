import type { PropsDividendVoucher } from "~/scripts/props/PropsDividendVoucher"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { CompanyDividendDeclaration } from "~/scripts/models/CompanyDividendDeclaration"
import { Shareholder } from "~/scripts/models/Shareholder"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { DividendType } from "~/scripts/constants/DividendAndSolvency"
import { ShareType } from "~/scripts/constants/Shareholder"
import { NumberUtil } from "~/scripts/utils/Number"
import { User } from "~/scripts/models/User"
import { UserDetail } from "~/scripts/models/UserDetail"
import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"

export class DividendVoucherController extends SdnBhdLegalDocumentController {
  applicationId: Ref<string> = ref<string>("")
  application = ref<CompanyDividendDeclaration>(new CompanyDividendDeclaration())

  shareholders: Ref<Shareholder[]> = ref<Shareholder[]>([])

  isLoading: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  additionalCssClass: string = "dividend-voucher"

  dividendCategory: Ref<string> = ref<string>("EXEMPT DIVIDEND")
  legalProvisionForExemption: Ref<string> = ref<string>("")

  dayjs = useDayjs()
  time = useLocalTime()

  constructor(props: PropsDividendVoucher, emitEvents: any) {
    super("Dividend Voucher", "", PaperOrientation.Landscape)

    this.setDataFromProps(props)

    this.emitEvents = emitEvents
  }

  async setDataFromProps(props: PropsDividendVoucher): Promise<void> {
    try {
      this.isLoading.value = true

      let promises = []
      if (props.companyId !== this.companyId.value) {
        promises.push(this.setCompanyId(props.companyId))
      }

      if (props.applicationId !== this.applicationId.value) {
        this.applicationId.value = props.applicationId
        promises.push(this.fetchApplication())
      }

      await Promise.allSettled(promises)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  override async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId
    await Promise.allSettled([this.fetchCompany(), this.fetchShareholders()])
  }

  async fetchShareholders(): Promise<void> {
    this.shareholders.value = []

    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useShareholderStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)
    this.shareholders.value = response.map((s: Shareholder) => {
      return new Shareholder(s)
    })

    let promise = this.shareholders.value.map((s: Shareholder) => {
      return s.getRegisteredUser(useUserStore()).then((r) => {
        s.user = new User(r)
      })
    })

    await Promise.allSettled(promise)
  }

  async fetchApplication(): Promise<void> {
    this.application.value = new CompanyDividendDeclaration()

    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyDividendDeclarationStore()
    let response = await repository.fetch(this.applicationId.value)
    this.application.value = new CompanyDividendDeclaration(response)
  }

  getShareholding(shareholder: Shareholder): string {
    if (this.application.value.shareType === ShareType.Ordinary) {
      return NumberUtil.thousandSeparator(shareholder.ordinaryShares)
    }

    return NumberUtil.thousandSeparator(shareholder.preferenceShares)
  }

  getShareholderAddress(shareholder: Shareholder): string {
    if (shareholder.isCorporateRepresentative()) {
      return ""
    }

    let userDetail = shareholder.user?.detail ?? new UserDetail()

    return userDetail.location?.getMultilineAddress() ?? ""
  }

  totalPages(): number {
    return this.shareholders.value.length
  }

  getDividendRate(shareholder: Shareholder): number {
    let totalShares =
      this.application.value.shareType === ShareType.Ordinary
        ? shareholder.ordinaryShares
        : shareholder.preferenceShares
    let totalCompanyShares = this.shareholders.value
      .map((s: Shareholder) => {
        return this.application.value.shareType === ShareType.Ordinary ? s.ordinaryShares : s.preferenceShares
      })
      .reduce((a: number, b: number) => {
        return a + b
      }, 0)

    return (totalShares / totalCompanyShares) * 100
  }

  getGrossAmount(shareholder: Shareholder): string {
    let totalShares =
      this.application.value.shareType === ShareType.Ordinary
        ? shareholder.ordinaryShares
        : shareholder.preferenceShares
    let totalAmount = (this.application.value.amount * this.getDividendRate(shareholder)) / 100

    return NumberUtil.currency(totalAmount)
  }

  get loaderLabel(): string {
    return "Preparing the"
  }

  get loaderSublabel(): string {
    return "Vouchers"
  }

  get typeOfDividend(): string {
    switch (this.application.value.dividendType) {
      case DividendType.Final:
        return "FINAL"
      case DividendType.Interim:
        return "INTERIM"
    }

    return "INTERIM"
  }

  get fye(): string {
    if (StringUtil.isNullOrEmpty(this.application.value.financialYearEndDate)) {
      return ""
    }

    return this.time.formatDateOnlyShort(this.application.value.financialYearEndDate)
  }

  get dateRegisterOfMembers(): string {
    if (StringUtil.isNullOrEmpty(this.application.value.dateOfRegisterOfMembers)) {
      return ""
    }

    return this.time.formatDateOnlyShort(this.application.value.dateOfRegisterOfMembers)
  }

  get dateOfPayment(): string {
    if (StringUtil.isNullOrEmpty(this.application.value.dividendPaymentDate)) {
      return ""
    }

    return this.time.formatDateOnlyShort(this.application.value.dividendPaymentDate)
  }

  get cosecName(): string {
    return SecretaryInformation.SECRETARY_NAME_LIST[0].name
  }
}
