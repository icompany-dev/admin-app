import { StatusConstants } from "~/scripts/constants/Status"
import { CompanyServiceController } from "./CompanyServiceController"
import { Model } from "~/scripts/models/Model"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { ViewMode } from "~/scripts/constants/ViewMode"

export class ThirdScheduleActServiceController extends CompanyServiceController<Model> {
  noConstitution = ref<Model>(new Model())

  wrapperRef: any | null = null

  constructor(companyId: string, emitEvents: any | null) {
    super(companyId, false, false, Model, null, emitEvents)

    this.target = CompanyConstants.TARGET_THIRD_SCHEDULE
    this.totalPages.value = 3
    this.noConstitution.value.status = StatusConstants.PAID //This is to override rules.
    this.setViewType(ViewMode.New)
  }

  async initializeData(): Promise<void> {
    // Do nothing.
  }

  override handleScroll(): void {
    if (this.currentPage.value + 1 > this.totalPages.value) {
      this.currentPage.value = 1
    } else {
      this.currentPage.value += 1
    }

    this.handleDisplayedPage()
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "ArrowLeft") {
      this.previousPage()
    } else if (event.key === "ArrowRight") {
      this.nextPage()
    }
  }

  nextPage(): void {
    if (this.currentPage.value + 1 > this.totalPages.value) {
      this.currentPage.value = 1
    } else {
      this.currentPage.value += 1
    }

    this.handleDisplayedPage()
  }

  previousPage(): void {
    if (this.currentPage.value - 1 <= 0) {
      this.currentPage.value = 3
    } else {
      this.currentPage.value -= 1
    }

    this.handleDisplayedPage()
  }

  override handleDisplayedPage(): void {
    let parentComponent = document.querySelector(".documents") as HTMLElement
    if (!parentComponent) {
      return
    }

    let page = this.currentPage.value

    let paperIdToDisplay = `third-schedule-${page}`

    let allPapers = parentComponent.querySelectorAll(".paper-wrapper")
    allPapers.forEach((paper: Element) => {
      if (!paper.id) {
        return
      }

      let paperElement = paper as HTMLElement
      if (paper.id === paperIdToDisplay) {
        paperElement.style.display = "block"
      } else {
        paperElement.style.display = "none"
      }
    })
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
  }

  isDoneLoading(): boolean {
    return true
  }

  //copywritings
  slipCaseTitle(): string {
    return this.language.isMalay() ? "Jadual Ketiga" : "Third Schedule"
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

  get serviceWrapperProps() {
    return new PropsCompanyServiceWrapper(
      this.noConstitution.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      false,
      false,
      this.application.value?.id,
      this.currentPage.value,
      this.totalPages.value,
      "DCR",
      false,
      true,
      this.price.value, // changed this
      this.haveAllSigned(),
      this.hasSigned(),
      this.userSignatureDate(),
      this.hasDcr.value,
      this.hasMcr.value,
      this.totalNumberOfDirectors.value,
      this.totalNumberOfShareholders.value,
      false,
      true,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      true,
      this.isSubmitting.value,
      Model,
      useCompanyStore()
    )
  }
}
