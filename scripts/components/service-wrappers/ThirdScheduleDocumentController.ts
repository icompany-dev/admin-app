import { CompanyAmendmentConstitution } from "~/scripts/models/CompanyAmendmentConstitution"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { CompanyConstants } from "~/scripts/constants/Company"

export class ThirdScheduleDocumentController
  extends ServiceController
  implements IServiceController<CompanyAmendmentConstitution, ReturnType<typeof useCompanyAmendmentConstitutionStore>>
{
  application: CompanyAmendmentConstitution = new CompanyAmendmentConstitution()
  applicationId: string | null = null

  canSubmit = ref<boolean>(true)
  canRemove = ref<boolean>(false)

  eventManager = useEventManagerStore()

  repository = useCompanyAmendmentConstitutionStore()
  companyRepository = useCompanyStore()

  constructor(companyId: string, emitEvents: any | null) {
    super(CompanyConstants.TARGET_THIRD_SCHEDULE, companyId, emitEvents)
  }

  async setApplication(companyId: string): Promise<void> {
    // do nothing
  }

  async onSubmitClicked(): Promise<void> {
    // do nothing
  }

  async onCreate(): Promise<void> {
    // do nothing
  }

  async onUpdate(): Promise<void> {
    // do nothing
  }

  async onRemove(): Promise<void> {
    this.emitEvents("back")
  }

  showWatermark(): boolean {
    return false
  }

  watermarkText(): string {
    return ""
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Jadual Ketiga" : "Third Schedule"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Jadual Ketiga Akta Syarikat 2016 menetapkan peraturan dalaman asas bagi syarikat persendirian berhad menurut syer 
        yang belum menerima pakai Perlembagaannya sendiri.
        <br><br>
        Jika syarikat anda tidak mempunyai Perlembagaan, Jadual Ketiga secara automatik akan mengawal selia perkara-perkara 
        seperti:
        <ul>
          <li>kuasa dan mesyuarat pengarah</li>
          <li>pindah milik dan peruntukan syer</li>
          <li>dividen dan pengagihan</li>
          <li>mesyuarat agung dan prosedur pengundian</li>
        </ul>
        Sebaik sahaja Perlembagaan diterima pakai, Jadual Ketiga tidak lagi terpakai, kecuali setakat mana yang diperbadankan 
        secara nyata dalam Perlembagaan tersebut.
        <br>
        Asas perundangan: Akta Syarikat 2016, seksyen 31(3) dan Jadual Ketiga.
      `
    }

    return `
      The Third Schedule to the Companies Act 2016 sets out the default internal rules for a private company limited by shares 
      that has not adopted its own Constitution.
      <br><br>
      If your company does not have a Constitution, the Third Schedule automatically governs matters such as:
      <ul>
        <li>directors’ powers and meetings</li>
        <li>share transfers and allotments</li>
        <li>dividends and distributions</li>
        <li>general meetings and voting procedures</li>
      </ul>
      Once a Constitution is adopted, the Third Schedule no longer applies, except to the extent expressly incorporated.
      <br>
      Legal basis: Companies Act 2016, section 31(3) and Third Schedule.
    `
  }
}
