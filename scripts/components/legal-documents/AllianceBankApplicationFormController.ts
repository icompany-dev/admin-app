import { BankConstants } from "~/scripts/constants/Banks"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import { OnlineBanking } from "~/scripts/types/banks/OnlineBanking"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
import { StringUtil } from "~/scripts/utils/String"

export class AllianceBankApplicationFormController extends SdnBhdLegalDocumentController {
  companyBankAccountOpeningRepository = useCompanyBankAccountOpeningStore()
  documentTemplateRepository = useDocumentTemplateStore()
  bankRepository = useBankStore()
  directorRepository = useDirectorStore()

  emitEvents: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  applicationId: Ref<string> = ref<string>("")
  application = ref<CompanyBankAccountOpening>(new CompanyBankAccountOpening())

  language = useLanguage()
  time = useLocalTime()

  additionalCssClass: string = "alliance-bank-application-form narrow-margin"

  constructor(companyId: string, applicationId: string | null, isInPreviewMode: boolean, emitEvents: any | null) {
    super("AuthorisedSignatoriesBankAccountOpeningMaybank", companyId, PaperOrientation.Portrait)
    this.isInPreviewMode.value = isInPreviewMode
    this.setApplicationId(applicationId ?? "")
    this.emitEvents = emitEvents
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.applicationId.value = applicationId
    await this.fetchApplication()
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      this.application.value = new CompanyBankAccountOpening()
      return
    }

    const response = await this.companyBankAccountOpeningRepository.fetch(this.applicationId.value)
    this.application.value = new CompanyBankAccountOpening(response)
  }

  //copywriting
  loaderLabel(): string {
    return this.language.isMalay() ? "Sedang memuat" : "Loading the"
  }

  loaderSublabel(): string {
    return this.language.isMalay() ? "Borang Permohonan" : "Application Form"
  }

  companyAddressPostcode(index: number): string {
    if (!this.company.value.businessAddressLocation) {
      return ""
    }

    return this.company.value.businessAddressLocation.postcode[index] ?? ""
  }

  //getters
  get dateOfIncorporation(): string {
    if (StringUtil.isNullOrEmpty(this.company.value.incorporatedAt)) {
      return ""
    }

    return this.time.formatDateOnlyFull(this.company.value.incorporatedAt ?? "").toUpperCase()
  }

  get companyAddressLine1(): string {
    if (!this.company.value.businessAddressLocation) {
      return ""
    }

    return this.company.value.businessAddressLocation.addressLine1
  }

  get companyAddressLine2(): string {
    if (!this.company.value.businessAddressLocation) {
      return ""
    }

    return this.company.value.businessAddressLocation.addressLine2 ?? ""
  }

  get companyAddressCity(): string {
    if (!this.company.value.businessAddressLocation) {
      return ""
    }

    return this.company.value.businessAddressLocation.city?.name ?? ""
  }

  get companyAddressState(): string {
    if (!this.company.value.businessAddressLocation) {
      return ""
    }

    return this.company.value.businessAddressLocation.state?.name ?? ""
  }
}
