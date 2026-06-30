import { CompanyAmendmentConstitution } from "~/scripts/models/CompanyAmendmentConstitution"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyAmendmentConstitutionStore } from "~/stores/CompanyAmendmentConstitutions"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { ConstitutionAmendmentTypes } from "~/scripts/constants/AmendmentTypes"

export class ChangeOfConstitutionController
  extends ServiceController
  implements IServiceController<CompanyAmendmentConstitution, ReturnType<typeof useCompanyAmendmentConstitutionStore>>
{
  application: CompanyAmendmentConstitution = new CompanyAmendmentConstitution()
  applicationId: string | null = null
  repository = useCompanyAmendmentConstitutionStore()
  companyRepository = useCompanyStore()

  applicationType = ref<string>(ConstitutionAmendmentTypes.Adopt)

  showMcrFirst = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_AMENDMENT_CONSTITUTION, companyId, emitEvents)
    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    } else {
      this.setApplication(companyId)
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyAmendmentConstitution(response)
      this.applicationId = this.application.id
      this.targetId = this.application.id
      this.applicationType.value = this.application.type
    }
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  isShowAdoptResolution(): boolean {
    return this.applicationType.value === ConstitutionAmendmentTypes.Adopt
  }

  isShowAmendResolution(): boolean {
    return this.applicationType.value === ConstitutionAmendmentTypes.Amend
  }

  isShowAbolishResolution(): boolean {
    return this.applicationType.value === ConstitutionAmendmentTypes.Abolish
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyAmendmentConstitution()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }
  }

  async onSubmitClicked(): Promise<void> {
    try {
      if (StringUtil.isNullOrEmpty(this.applicationId)) {
        await this.onCreate()
      } else {
        await this.onUpdate()
      }

      if (this.isADirector.value) {
        await this.submitSignature()
      }

      if (!this.hasPaid.value) {
        await this.pay()
      }
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
    let typeOfChange = this.language.isMalay() ? "Menerima Pakai" : "Adopt"
    if (this.applicationType.value === ConstitutionAmendmentTypes.Amend) {
      typeOfChange = this.language.isMalay() ? "Menukar" : "Change"
    } else if (this.applicationType.value === ConstitutionAmendmentTypes.Abolish) {
      typeOfChange = this.language.isMalay() ? "Memansuhkan" : "Abolish"
    }

    return this.language.isMalay()
      ? `Resolusi Pengarah & Pemegang Saham untuk ${typeOfChange} Perlembagaan Perniagaan`
      : `DCR & MCR to ${typeOfChange} Constitution`
  }

  helpDescription(): string {
    if (this.applicationType.value === ConstitutionAmendmentTypes.Adopt) {
      return this.language.isMalay()
        ? `
            Proses ini bermula dengan Resolusi Edaran Pengarah (DCR). Daripada perlu berkumpul untuk mesyuarat lembaga, para 
            pengarah akan mengedarkan dokumen bertulis sesama mereka untuk mengusulkan Perlembagaan baharu secara rasmi. Dengan 
            menandatangani dokumen ini, para pengarah secara rasmi meluluskan draf "buku peraturan" tersebut dan memberi kuasa 
            untuk mengedarkannya kepada pemegang saham bagi undian akhir. Langkah ini memastikan kepimpinan syarikat adalah 
            selari sebelum membentangkan perubahan tersebut kepada pemilik syarikat.
            <br><br>
            Keputusan akhir terletak di tangan pemegang saham, yang dilaksanakan melalui Resolusi Edaran Ahli (MCR). Memandangkan 
            penerimaan pakai Perlembagaan memerlukan Resolusi Khas, kebiasaannya sekurang-kurangnya 75% daripada ahli yang layak 
            mengundi mesti menandatangani dokumen ini untuk meluluskannya. Ini membolehkan syarikat persendirian menerima pakai 
            Perlembagaan baharu secara sah semata-mata melalui dokumentasi, tanpa kerumitan atau kos untuk mengadakan Mesyuarat 
            Agung yang formal.
          `
        : `
            The process begins with the Directors' Circular Resolution (DCR). Instead of gathering for a boardroom meeting, 
            the directors circulate a written document among themselves to formally propose the new Constitution. By signing 
            this document, the directors officially approve the draft "rulebook" and authorise its circulation to the shareholders for 
            the final vote. This step ensures the company's leadership is aligned before presenting the change to the owners.
            <br><br>
            The final decision lies with the shareholders, executed through a Members' Circular Resolution (MCR). Since adopting 
            a Constitution requires a Special Resolution, usually at least 75% of the eligible voting members must sign 
            this document to pass it. This allows private companies to legally adopt the new Constitution purely through paperwork, 
            without the hassle or expense of convening a formal General Meeting.
          `
    }

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
