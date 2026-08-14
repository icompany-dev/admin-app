import { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"
import { CompanyShareholderTransferNotice } from "~/scripts/models/CompanyShareholderTransferNotice"
import { CompanyShareTransferDetail } from "~/scripts/models/CompanyShareTransferDetail"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyShareholderTransferStore } from "~/stores/CompanyShareholderTransfers"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { Shareholder } from "~/scripts/models/Shareholder"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { SignatureUtil } from "~/scripts/utils/Signature"

export class NoticeTransferOfSharesController
  extends ServiceController
  implements IServiceController<CompanyShareholderTransfer, ReturnType<typeof useCompanyShareholderTransferStore>>
{
  application: CompanyShareholderTransfer = new CompanyShareholderTransfer()
  applicationRef = ref<CompanyShareholderTransfer>(new CompanyShareholderTransfer())
  applicationId: string | null = null
  noticeApplication: CompanyShareholderTransferNotice = new CompanyShareholderTransferNotice()
  noticeApplicationRef = ref<CompanyShareholderTransferNotice>(new CompanyShareholderTransferNotice())
  repository = useCompanyShareholderTransferStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  shareholders = ref<Shareholder[]>([])

  transferDetails = ref<CompanyShareTransferDetail[]>([])

  proposalRefs: any[] | null[] = []

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(
    companyId: string,
    emitEvents: any | null,
    applicationId: string | null = null,
    noticeId: string | null = null
  ) {
    super(CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_TRANSFER, companyId, emitEvents)

    this.init(applicationId, noticeId)
    // if (!StringUtil.isNullOrEmpty(applicationId)) {
    //   this.applicationId = applicationId
    //   this.fetchApplication(applicationId ?? "")
    // } else if (!StringUtil.isNullOrEmpty(noticeId)) {
    //   this.fetchNotice(noticeId ?? "")
    // }

    // this.fetchShareholders()
  }

  async init(applicationId: string | null, noticeId: string | null): Promise<void> {
    this.isLoading.value = true

    let promises = [this.fetchShareholders()]
    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.applicationId = applicationId
      promises.push(this.fetchApplication(applicationId ?? ""))
    } else if (!StringUtil.isNullOrEmpty(noticeId)) {
      promises.push(this.fetchNotice(noticeId ?? ""))
    }

    await Promise.all(promises)

    this.isLoading.value = false
  }

  async fetchApplication(id: string): Promise<void> {
    if (!id) {
      return
    }

    try {
      let response = await this.repository.fetch(id)
      if (!this.repository.error && response !== null) {
        this.application = new CompanyShareholderTransfer(response)
        this.applicationRef.value = new CompanyShareholderTransfer(response)
        this.applicationId = id
        this.targetId = id

        this.transferDetails.value = this.application.transferDetails.map((d: CompanyShareTransferDetail) => {
          return new CompanyShareTransferDetail(d)
        })

        let noticeRepository = useCompanyShareholderTransferNoticeStore()
        let noticeResponse = await noticeRepository.fetchForTransfer(id)
        if (!noticeRepository.error) {
          this.noticeApplication = new CompanyShareholderTransferNotice(noticeResponse)
          this.noticeApplicationRef.value = new CompanyShareholderTransferNotice(noticeResponse)
        }
      } else {
        // attempt to check if it is a notice
        await this.fetchNotice(id)
      }
    } catch (e) {
      await this.fetchNotice(id)
    }
  }

  async fetchNotice(noticeId: string): Promise<void> {
    let noticeRepository = useCompanyShareholderTransferNoticeStore()
    let noticeResponse: any = await noticeRepository.fetch(noticeId)
    this.noticeApplication = new CompanyShareholderTransferNotice(noticeResponse)
    if (noticeResponse.share_transfer_application) {
      this.application = new CompanyShareholderTransfer(noticeResponse.share_transfer_application)
      this.applicationId = this.application.id
      this.targetId = this.application.id
      this.transferDetails.value = this.application.transferDetails.map((d: CompanyShareTransferDetail) => {
        return new CompanyShareTransferDetail(d)
      })
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyShareholderTransfer()
      this.application.companyId = companyId
      this.application.company = new Company(response)
      this.application.transferDetails.push(new CompanyShareTransferDetail())
      this.transferDetails.value = this.application.transferDetails.map((d: CompanyShareTransferDetail) => {
        return new CompanyShareTransferDetail(d)
      })
    }
  }

  async setProposalRef(ref: any | null, index: number): Promise<void> {
    this.proposalRefs[index] = ref
  }

  async fetchShareholders(): Promise<void> {
    try {
      let currentUser = await CurrentUser.get()

      let response = await this.shareholderRepository.fetchAllForCompany(this.companyId)
      if (!this.shareholderRepository.error) {
        let temp = response.map((s: Shareholder) => {
          return new Shareholder(s)
        })

        let shareholder = temp.find((s: Shareholder) => {
          return s.email === currentUser.email
        })

        if (shareholder) {
          let others = temp.filter((s: Shareholder) => {
            return s.email !== currentUser.email
          })

          this.shareholders.value = [shareholder, ...others]
        } else {
          this.shareholders.value = temp
        }
      }
    } catch (e: any) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForFetchAll()
      errorMessage.handle()
    }
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  onPreview(): void {
    this.isInPreviewMode.value = true
  }

  onShrouded(): void {
    this.isInPreviewMode.value = false
  }

  showWatermark(): boolean {
    return (
      this.isInPreviewMode.value ||
      (this.application !== null && this.application !== undefined && this.application.signatureGroups.length <= 0)
    )
  }

  watermarkText(): string {
    if (!this.application) {
      return ""
    }

    if (this.isInPreviewMode.value) {
      return "PREVIEW"
    }

    if (this.application.signatureGroups.length <= 0) {
      return "DRAFT"
    }

    return ""
  }

  isDocumentReadOnly(index: number): boolean {
    return index > 0 // get them to fill up only the first one
  }

  onDataUpdated(transferDetails: CompanyShareTransferDetail[], index: number): void {
    if (index > 0) {
      return
    }

    this.application.transferDetails = transferDetails.map((d: any) => {
      return new CompanyShareTransferDetail(d)
    })

    this.transferDetails.value = transferDetails.map((d: any) => {
      return new CompanyShareTransferDetail(d)
    })

    this.proposalRefs.forEach((ref: any, i: number) => {
      if (i === 0) {
        return
      }

      ref.setApplication(this.application)
    })
  }

  async onSubmitClicked(): Promise<void> {
    if (this.isADirector.value) {
      if (this.dcrRef) {
        let updatedData = this.dcrRef.getApplication()
        this.application = new CompanyShareholderTransfer(updatedData)
        this.application.id = this.applicationId ?? ""
      }
    } else if (this.isAShareholder.value) {
      if (this.mcrRef) {
        let updatedData = this.mcrRef.getApplication()
        this.application = new CompanyShareholderTransfer(updatedData)
        this.application.id = this.applicationId ?? ""
      }
    }

    try {
      if (StringUtil.isNullOrEmpty(this.applicationId)) {
        await this.onCreate()
      } else {
        await this.onUpdate()
      }

      if (this.isADirector.value || this.isAShareholder.value) {
        await this.submitSignature()
      }

      if (!this.hasPaid.value) {
        await this.pay()
      }
      this.emitEvents("back")
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

  async onApplicationUpdated(data: any): Promise<void> {
    let isATransferorTransferee =
      this.isAShareholder.value &&
      this.transferDetails.value.some((d: CompanyShareTransferDetail) => {
        return d.transferFromId === this.shareholderId.value || d.transferToId === this.shareholderId.value
      })

    if (!isATransferorTransferee) {
      this.emitEvents("applicationUpdated", data)
    }
  }

  async onTransferorSigned(signatureFileData: any): Promise<void> {
    let transferDetail = this.transferDetails.value.find((d: CompanyShareTransferDetail) => {
      return d.transferFromId === this.shareholderId.value
    })

    this.emitEvents("back")
    if (!transferDetail) {
      return
    }

    let signatureFile = await SignatureUtil.submit(signatureFileData)
    await transferDetail.submitTransferorSignature(signatureFile.id, useCompanyShareholderTransferStore())
    await this.fetchApplication(this.applicationId ?? "")

    this.emitEvents("applicationUpdated", this.application)
  }

  async onTransferorRepSigned(signatureFileData: any): Promise<void> {
    let transferDetail = this.transferDetails.value.find((d: CompanyShareTransferDetail) => {
      return d.transferFromId === this.shareholderId.value
    })

    this.emitEvents("back")
    if (!transferDetail) {
      return
    }

    let signatureFile = await SignatureUtil.submit(signatureFileData)
    await transferDetail.submitTransferorRepSignature(signatureFile.id, useCompanyShareholderTransferStore())
    await this.fetchApplication(this.applicationId ?? "")

    this.emitEvents("applicationUpdated", this.application)
  }

  async onTransfereeSigned(signatureFileData: any): Promise<void> {
    let transferDetail = this.transferDetails.value.find((d: CompanyShareTransferDetail) => {
      return d.transferToId === this.shareholderId.value
    })

    this.emitEvents("back")
    if (!transferDetail) {
      return
    }

    let signatureFile = await SignatureUtil.submit(signatureFileData)
    await transferDetail.submitTransfereeSignature(signatureFile.id, useCompanyShareholderTransferStore())
    await this.fetchApplication(this.applicationId ?? "")

    this.emitEvents("applicationUpdated", this.application)
  }

  async onTransfereeRepSigned(signatureFileData: any): Promise<void> {
    let transferDetail = this.transferDetails.value.find((d: CompanyShareTransferDetail) => {
      return d.transferToId === this.shareholderId.value
    })

    this.emitEvents("back")
    if (!transferDetail) {
      return
    }

    let signatureFile = await SignatureUtil.submit(signatureFileData)
    await transferDetail.submitTransfereeRepSignature(signatureFile.id, useCompanyShareholderTransferStore())
    await this.fetchApplication(this.applicationId ?? "")

    this.emitEvents("applicationUpdated", this.application)
  }

  async onCreate(): Promise<void> {
    this.application.companyId = this.companyId
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
      ? `Resolusi Pengarah & Pemegang Saham untuk Memperuntuk Saham Baharu`
      : "DCR & MCR to Allot New Shares"
  }

  helpDescription(): string {
    //Get more details for help
    return this.language.isMalay()
      ? `Resolusi ini memerlukan:
        <ul>
          <li>Sekurang-kurangnya satu (1) <b>Cadangan Nama</b>. Ketersediaan nama adalah tertakluk kepada SSM.</li>
          <li><b>Resolusi Khas</b> mesti mencapai majoriti sekurang-kurangnya <b>75%</b> daripada Pemegang Saham.</li>
        </ul>
        Anda boleh Beli & Muat Turun Profil Korporat SSM sebagai pengesahan perubahan (pilihan).
        `
      : `This resolution requires:
          <ul>
            <li>At least one (1) <b>Proposed Name</b>. The availability of name is subjected to SSM.</li>
            <li>The <b>Special Resolution</b> must reach a majority of at least <b>75%</b> of the Shareholders.</li>
          </ul>
          You can Purchase & Download SSM Corporate Profile as confirmation of the change (optional).
        `
  }

  loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Menyediakan" : "Preparing Your"
  }

  loaderSublabel(): string {
    return this.language.isMalay() ? "Notis Pemindahan" : "Notice of Transfer"
  }

  get hasInitiatorSigned(): boolean {
    return this.noticeApplicationRef.value.signature !== null
  }
}
