import { CompanyDividendDeclaration } from "~/scripts/models/CompanyDividendDeclaration"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { PropsDividendVoucher } from "~/scripts/props/PropsDividendVoucher"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"

export class DividendVouchersController
  extends ServiceController
  implements IServiceController<CompanyDividendDeclaration, ReturnType<typeof useCompanyDividendDeclarationStore>>
{
  application: CompanyDividendDeclaration = new CompanyDividendDeclaration()
  applicationRef = ref<CompanyDividendDeclaration>(new CompanyDividendDeclaration())
  applicationId: string | null = null
  repository = useCompanyDividendDeclarationStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_DIVIDEND_DECLARATION, companyId, emitEvents)
    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    this.applicationId = id
    this.targetId = id
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyDividendDeclaration(response)
      this.applicationRef.value = new CompanyDividendDeclaration(response)
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyDividendDeclaration()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }
  }

  async onSubmitClicked(): Promise<void> {
    try {
      if (this.dcrRef) {
        let updatedData = this.dcrRef.getApplication()
        this.application = new CompanyDividendDeclaration(updatedData)
        this.application.id = this.applicationId ?? ""
      }

      this.emitEvents("back", this.application)

      await this.onUpdate()

      if (this.isADirector.value) {
        await this.submitSignature()
      }

      this.emitEvents("applicationUpdated", this.application)
    } catch (error: any) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForCUD()
        errorMessage.handle()
      }
    }
  }

  async onCreate(): Promise<void> {
    await this.application.create(this.repository)
    this.applicationId = this.application.id
    this.targetId = this.application.id
  }

  async onUpdate(): Promise<void> {
    await this.application.update(this.repository)
  }

  async onRemove(): Promise<void> {
    if (this.applicationId === null) {
      this.emitEvents("back")
    }
    // TODO: update function
    // Must ask for confirmation before it proceeds to delete
    // await this.application.remove(this.repository)
    this.emitEvents("back")
  }

  override async onDownloadClicked(): Promise<void> {
    if (this.isDownloading.value) {
      return
    }

    this.isDownloading.value = true
    this.setActionTrayElements()
    try {
      let promises = []

      if (this.dcrRef) {
        let dcrPages = await this.dcrRef.getPdfPages()
        promises.push(
          PdfPaperUtil.generatePdfFile(dcrPages, 20, "Dividend Vouchers.pdf", PaperSize.A4, PaperOrientation.Landscape)
        )
      }

      if (promises.length <= 0) {
        return
      }

      await Promise.allSettled(promises)
    } catch (e) {
      console.error(e)
    } finally {
      this.isDownloading.value = false
      this.setActionTrayElements()
    }
  }

  get isDraft(): boolean {
    return this.application.signatureGroups.length <= 0
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyDividendDeclaration>(
      this.companyId,
      this.applicationId,
      this.applicationRef.value as CompanyDividendDeclaration,
      this.isDraft,
      "DRAFT",
      false,
      false,
      null,
      null,
      [],
      null,
      null
    )
  }

  get dividendVoucherProps(): PropsDividendVoucher {
    return new PropsDividendVoucher(this.companyId, this.applicationRef.value.id)
  }
}
