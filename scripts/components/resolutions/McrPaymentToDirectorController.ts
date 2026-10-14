import { CompanyDirectorPayment } from "~/scripts/models/CompanyDirectorPayment"
import { ResolutionController } from "./ResolutionController"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import type { SignatureItem } from "~/scripts/types/SignatureItem"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { TypeOfPaymentToDirectors } from "~/scripts/constants/PaymentToDirectors"
import { NumberUtil } from "~/scripts/utils/Number"

export class McrPaymentToDirectorController extends ResolutionController<CompanyDirectorPayment> {
  companyDirectorPaymentRepository = useCompanyDirectorPaymentStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  typeOfPayment = ref<TypeOfPaymentToDirectors>(TypeOfPaymentToDirectors.Salary)

  originalTemplateContent: string = ""

  private documentTemplateId: string = "56d3dce4-7cc3-4ff9-8b37-cf35cd6c909a"

  time = useLocalTime()

  constructor(props: IPropsResolutionDocument<CompanyDirectorPayment>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyDirectorPayment,
      props.isInPreviewMode,
      false,
      true,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.typeOfPayment.value = props.type as TypeOfPaymentToDirectors

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnOtherPages.value = 4
    this.maxSignatureOnFirstPage.value = 6
  }

  setTypeOfPaymentToDirectors(type: string): void {
    this.typeOfPayment.value = type as TypeOfPaymentToDirectors

    if (this.application.value) {
      this.application.value.typeOfPayment = this.typeOfPayment.value
      this.resolutionContent.value = this.getContent()
    }
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (this.isLoading.value) {
      setTimeout(() => {
        this.setApplicationId(id)
      }, 500)

      return
    }

    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
    } else {
      await this.fetchApplication(id ?? "")
    }

    nextTick(() => {
      this.setContent()
    })
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyDirectorPaymentRepository.fetch(id)
    if (!this.companyDirectorPaymentRepository.error && response !== null) {
      this.application.value = new CompanyDirectorPayment(response)
      this.typeOfPayment.value = this.application.value.typeOfPayment as TypeOfPaymentToDirectors
      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    this.application.value = new CompanyDirectorPayment()
    this.application.value.companyId = this.companyId.value

    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value.company = new Company(response)
    }
    this.application.value.typeOfPayment = this.typeOfPayment.value
    this.initializeData()
  }

  async fetchDocumentTemplate(): Promise<void> {
    try {
      let response = await this.documentTemplateRepository.fetch(this.documentTemplateId)
      if (this.documentTemplateRepository.error) {
        throw this.documentTemplateRepository.error
      }

      this.documentTemplate.value = new DocumentTemplate(response)
      this.originalTemplateContent = this.documentTemplate.value.content
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async otherDataInitiation(): Promise<void> {
    //do nothing
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalTemplateContent

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "%typeOfPaymentTitle%",
      this.typeOfPaymentToDirectors.toUpperCase()
    )

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "%typeOfPayment%",
      this.typeOfPaymentToDirectors
    )

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace("%amount%", this.totalAmount)

    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      "%tfinancialYearEndDate%",
      this.financialYearEndDate
    )

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    let template = null

    if (this.isInPreviewMode.value) {
      if (this.application.value) {
        if (StringUtil.isNullOrEmpty(this.application.value.financialYearEndDate)) {
          this.application.value.financialYearEndDate = "YOUR FINANCIAL YEAR END DATE"
        }
      }
      template = templateProcessor.getContentForPreview(this.application.value)
    } else {
      template = this.isDocumentEditable()
        ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
        : templateProcessor.getContentForPrint(this.application.value)
    }

    return template
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return 1
    }

    return (
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )
    )
  }

  onDataChanged(data: any): void {
    this.application.value = new CompanyDirectorPayment(data)
    this.setContent()
  }

  get financialYearEndDate(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>YOUR FINANCIAL YEAR END DATE</span>`
    }

    if (this.isDocumentEditable() && this.application.value.financialYearEndDate === null) {
      return `<span class='value-placeholder'>COMPLETE THE DCR</span>`
    }

    let time = useLocalTime()
    return time.formatDateOnlyFull(this.application.value.financialYearEndDate ?? "").toUpperCase()
  }

  get typeOfPaymentToDirectors(): string {
    switch (this.typeOfPayment.value) {
      case TypeOfPaymentToDirectors.Salary:
        return "Salary"
      case TypeOfPaymentToDirectors.Fees:
        return "Fees"
      case TypeOfPaymentToDirectors.Bonus:
        return "Bonus"
      case TypeOfPaymentToDirectors.BenefitInKind:
        return "Benefits"
      case TypeOfPaymentToDirectors.Perquisite:
        return "Perquisite"
    }

    return "Salary"
  }

  get totalAmount(): string {
    if (!this.application.value || this.isInPreviewMode.value) {
      return `<span class='value-placeholder'>PROPOSED AMOUNT</span>`
    }

    if (this.isDocumentEditable()) {
      return this.application.value.amount <= 0
        ? `<span class='value-placeholder'>COMPLETE THE DCR</span>`
        : this.application.value.amount.toFixed(2)
    }

    return this.application.value.amount.toFixed(2)
  }
}
