import { CompanyPreferenceShareRight } from "~/scripts/models/CompanyPreferenceShareRight"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyPreferenceShareRightStore } from "~/stores/CompanyPreferenceShareRights"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"

export class PreferenceShareRightController
  extends ServiceController
  implements IServiceController<CompanyPreferenceShareRight, ReturnType<typeof useCompanyPreferenceShareRightStore>>
{
  application: CompanyPreferenceShareRight = new CompanyPreferenceShareRight()
  applicationId: string | null = null
  repository = useCompanyPreferenceShareRightStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_PREFERENCE_SHARE_RIGHT, companyId, emitEvents)
    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    } else {
      this.setApplication(companyId)
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyPreferenceShareRight(response)
      this.applicationId = this.application.id
      this.targetId = this.application.id
    }
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyPreferenceShareRight()
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
    return this.language.isMalay() ? "Peniaan Hak-Hak Kelas" : "Variations of Class Rights"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `
        Di bawah Seksyen 90 Akta Syarikat 2016, undang-undang bertindak sebagai penentu ketat bagi klasifikasi saham Sdn Bhd 
        anda. Ia menetapkan bahawa anda tidak boleh menerbitkan Syer Keutamaan (Preference Shares) melainkan <b>Perlembagaan 
        Syarikat anda menyenaraikan dengan jelas hak-hak yang dimiliki oleh pemegang saham ini</b>. Secara khusus, Perlembagaan 
        Sdn Bhd anda mesti menyatakan dengan nyata kelayakan mereka terhadap:
        <ul>
          <li>Bayaran balik modal;</li>
          <li>Penyertaan dalam aset lebihan;</li>
          <li>Pembayaran dividen (sama ada kumulatif atau bukan kumulatif); dan</li>
          <li>Hak mengundi.</li>
        </ul>
        Memandangkan Seksyen 90 mengunci hak-hak ini di dalam Perlembagaan demi melindungi pemegang saham, sebarang percubaan 
        untuk mengubahnya memerlukan anda meminda Perlembagaan secara rasmi.
      `
    }

    return `
      Under Section 90 of Companies Act 2016, the law acts as a strict "label maker" for your Sdn Bhd's shares. It 
      mandates that you cannot issue Preference Shares unless your <b>Company's Constitution clearly lists exactly 
      what rights these shareholders possess</b>. Specifically, the Constitution must explicitly state their entitlement 
      to: 
      <ul>
        <li>repayment of capital,</li>
        <li>participation in surplus assets,</li>
        <li>dividend payments (whether cumulative or non-cumulative), and</li>
        <li>voting rights</li>
      </ul>
      Since Section 90 locks these rights into the Constitution to protect the shareholders, any attempt to change them 
      requires you to formally amend the Constitution.
    `
  }
}
