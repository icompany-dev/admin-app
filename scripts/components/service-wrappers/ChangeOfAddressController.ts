import { CompanyAmendmentAddress } from "~/scripts/models/CompanyAmendmentAddress"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyAmendmentAddressStore } from "~/stores/CompanyAmendmentAddresses"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"

export class ChangeOfAddressController
  extends ServiceController
  implements IServiceController<CompanyAmendmentAddress, ReturnType<typeof useCompanyAmendmentAddressStore>>
{
  application: CompanyAmendmentAddress = new CompanyAmendmentAddress()
  applicationId: string | null = null
  repository = useCompanyAmendmentAddressStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_AMENDMENT_ADDRESS, companyId, emitEvents)
    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyAmendmentAddress(response)
      this.applicationId = this.application.id
      this.targetId = this.application.id
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyAmendmentAddress()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }
  }

  async onSubmitClicked(): Promise<void> {
    try {
      if (this.dcrRef) {
        let updatedData = this.dcrRef.getApplication()
        this.application = new CompanyAmendmentAddress(updatedData)
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
      ? `Resolusi Pengarah untuk Menukar Alamat Perniagaan`
      : "DCR to Change Business Address"
  }

  helpDescription(): string {
    return this.language.isMalay()
      ? `Resolusi ini memerlukan:
        <ul>
          <li>Semua Pengarah <b>mesti menandatangani</b> untuk pengesahan (<i>boleh dilakukan secara elektronik di sini</i>).</li>
          <li>Pilih: <b>Express Filing</b> atau <b>Normal Filing</b> (harga berbeza mengikut SSM).</li>
          <li>Setelah pendaftaran diluluskan oleh SSM, Sistem iCompany akan memberitahu semua Pengarah.</li>
          <li>Beli & Muat Turun Profil Korporat SSM sebagai pengesahan perubahan (pilihan).</li>
        </ul>
        `
      : `This DCR requires:
          <ul>
            <li>All Directors <b>must sign</b> for confirmation (<i>can be done electronically here</i>).</li>
            <li>Choose: <b>Express Filing</b> or <b>Normal Filing</b> (price varies based on SSM Fees).</li>
            <li>Once filing is approved by SSM, iCompany System will notify all Directors.</li>
            <li>Purchase & Download SSM Corporate Profile as confirmation of the change (optional).</li>
          </ul>
        `
  }
}
