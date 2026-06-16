import { CompanyPostShareTransfer } from "~/scripts/models/CompanyPostShareTransfer"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyPostShareTransferStore } from "~/stores/CompanyPostShareTransfers"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"

export class RegisterTransferOfSharesController
  extends ServiceController
  implements IServiceController<CompanyPostShareTransfer, ReturnType<typeof useCompanyPostShareTransferStore>>
{
  application: CompanyPostShareTransfer = new CompanyPostShareTransfer()
  applicationId: string | null = null
  repository = useCompanyPostShareTransferStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyPostShareTransfer(response)
      this.applicationId = this.application.id
      this.targetId = this.application.id
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyPostShareTransfer()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  async onSubmitClicked(): Promise<void> {
    if (this.isADirector.value) {
      if (this.dcrRef) {
        let updatedData = this.dcrRef.getApplication()
        this.application = new CompanyPostShareTransfer(updatedData)
        this.application.id = this.applicationId ?? ""
      }
    } else if (this.isAShareholder.value) {
      if (this.mcrRef) {
        let updatedData = this.mcrRef.getApplication()
        this.application = new CompanyPostShareTransfer(updatedData)
        this.application.id = this.applicationId ?? ""
      }
    }

    try {
      this.emitEvents("back", this.application)
      await this.onUpdate()

      if (this.isADirector.value || this.isAShareholder.value) {
        await this.submitSignature()
      }

      this.emitEvents("applicationUpdated", this.application)
    } catch (error: any) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
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

  helpTitle(): string {
    return this.language.isMalay()
      ? `Resolusi Pengarah untuk Meluluskan/Menangguhkan/Menolak Pendaftaran Pemindahan Saham`
      : "DCR to Approve/Delay/Refuse Registration of Transfer of Shares"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Resolusi ini adalah dokumen bertulis rasmi yang digunakan oleh Lembaga Pengarah untuk merekodkan 
        keputusan mereka secara formal bagi meluluskan, menangguhkan, atau menolak pindah milik saham. 
        Bagi meluluskan pindah milik, Pengarah menandatangani dokumen ini sebagai kebenaran kepada Setiausaha 
        Syarikat untuk mengemas kini Daftar Ahli dan mengeluarkan sijil saham baharu kepada pemilik baharu.
        <br><br>
        Sekiranya Pengarah memutuskan untuk menangguhkan atau menolak pendaftaran tersebut (biasanya kerana 
        pemegang saham masih berhutang ke atas saham tersebut atau Perlembagaan Syarikat melarang pindah 
        milik berkenaan), Resolusi ini mestilah diluluskan dalam tempoh <b>30 hari</b> selepas menerima 
        permohonan pindah milik. Apa yang penting, dokumen ini mestilah menyatakan dengan jelas sebab-sebab 
        khusus penolakan tersebut, dan syarikat kemudiannya mesti memaklumkan sebab-sebab ini kepada pembeli 
        dan penjual dalam tempoh <b>7 hari</b> selepas resolusi diluluskan.
      `
    }

    return `
      This Resolution is the official written document used by the Board of Directors to formally 
      record their decision to approve, delay, or refuse a share transfer. To say "yes" to a transfer, 
      the Directors sign this document to authorize the company secretary to update the Register 
      of Members and issue a new share certificate to the new owner.
      <br><br>
      If the Directors decide to delay or refuse the registration (usually because the shareholder 
      owes money on the shares or the Company Constitution forbids the transfer), this DCR must be 
      passed within <b>30 days</b> of receiving the transfer application. Crucially, this document must 
      clearly state the specific reasons for the refusal, and the company must then notify the buyer 
      and seller of these reasons within <b>7 days</b> of the resolution being passed.
    `
  }
}
