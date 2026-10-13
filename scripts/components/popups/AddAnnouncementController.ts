import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import { BasePopupController } from "./BasePopupController"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { Company } from "~/scripts/models/Company"
import { PublicServiceAnnouncement } from "~/scripts/models/PublicServiceAnnouncement"
import { PropsCompaniesDropdown } from "~/scripts/props/PropsCompaniesDropdown"
import { SelectOption } from "~/scripts/types/SelectOption"
import { PublicServiceAnnouncementType } from "~/scripts/constants/PublicServiceAnnouncements"

export class AddAnnouncementController extends BasePopupController {
  publicServiceAnnouncement: Ref<PublicServiceAnnouncement> = ref<PublicServiceAnnouncement>(
    new PublicServiceAnnouncement()
  )

  constructor(emitEvents: any) {
    super(emitEvents)
  }

  onSelectedCompaniesToShow(selectedCompanyIds: string[]): void {
    this.publicServiceAnnouncement.value.targetCompanyIds = selectedCompanyIds
  }

  onSelectedCompaniesToExclude(selectedCompanyIds: string[]): void {
    this.publicServiceAnnouncement.value.excludeCompanyIds = selectedCompanyIds
  }

  onProceedClicked(): void {
    this.emitEvents(EmitMessages.PROCEED)
    this.hide()
  }

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? `Tambah Pengumuman` : `Add New Announcement`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
        Lengkapkan butiran yang diperlukan dibawah.
      `
    }

    return `
      Complete the Required Details Below
    `
  }

  get typeLabel(): string {
    return this.language.isMalay() ? "Jenis Pengumuman" : "Type of Announcement"
  }

  get typeOptions(): SelectOption[] {
    return [
      new SelectOption(
        PublicServiceAnnouncementType.SystemWarning,
        PublicServiceAnnouncementType.SystemWarning,
        "System Warning"
      ),
      new SelectOption(
        PublicServiceAnnouncementType.ImportantNotice,
        PublicServiceAnnouncementType.ImportantNotice,
        "Important Notice"
      ),
      new SelectOption(
        PublicServiceAnnouncementType.ComplianceAlert,
        PublicServiceAnnouncementType.ComplianceAlert,
        "Compliance Alert"
      ),
    ]
  }

  get nameLabel(): string {
    return this.language.isMalay() ? "Nama" : "Name"
  }

  get descriptionLabel(): string {
    return this.language.isMalay() ? "Butiran" : "Description"
  }

  get descriptionNote(): string {
    return this.language.isMalay()
      ? "Tinggalkan kosong jika hanya imej diperlukan."
      : "Leave this empty to show only the image uploaded."
  }

  get imageLabel(): string {
    return this.language.isMalay() ? "Muat Naik Gambar" : "Upload Image"
  }

  get imageNote(): string {
    return this.language.isMalay()
      ? "Imej diperlukan jika butiran ditinggalkan kosong."
      : "This is required if description is empty."
  }

  get targetCompaniesLabel(): string {
    return this.language.isMalay() ? "Tunjuk pada Syarikat terpilih sahaja" : "Show to Selected Companies only"
  }

  get excludeCompniesLabel(): string {
    return this.language.isMalay() ? "Jangan Tunjuk pada Syarikat berikut" : "Do Not Show to the following Companies"
  }

  get selectedCompanyNote(): string {
    return this.language.isMalay() ? "Tinggalkan kosong untuk kepada semua" : "Leave blank to show to all"
  }

  get propsCompaniesDropdownToTarget(): PropsCompaniesDropdown {
    return new PropsCompaniesDropdown(
      true,
      this.publicServiceAnnouncement.value.targetCompanyIds,
      this.language.isMalay() ? "Pilih Syarikat untuk Ditunjuk" : "Select Companies to Show"
    )
  }

  get propsCompaniesDropdownToExclude(): PropsCompaniesDropdown {
    return new PropsCompaniesDropdown(
      true,
      this.publicServiceAnnouncement.value.targetCompanyIds,
      this.language.isMalay() ? "Pilih Syarikat untuk Diasingkan" : "Select Companies to Exclude"
    )
  }
}
