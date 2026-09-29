import { PopupTitles, PopupTitlesBm } from "~/scripts/constants/Popups"
import { BasePopupController } from "./BasePopupController"
import { CompanyOutstanding } from "~/scripts/models/CompanyOutstanding"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { Filter } from "~/scripts/library/Filter"
import { SelectOption } from "~/scripts/types/SelectOption"
import { ServiceName, ServiceNames } from "~/scripts/constants/ServiceNames"

export class IssuePaymentOrderController extends BasePopupController {
  companyId: Ref<string> = ref<string>("")

  companyOutstanding: Ref<CompanyOutstanding> = ref<CompanyOutstanding>(new CompanyOutstanding())

  isLoading: Ref<boolean> = ref<boolean>(false)

  servicePricings: Ref<ServicePricing[]> = ref<ServicePricing[]>([])

  selectedServiceTarget: Ref<string> = ref<string>("")

  constructor(companyId: string, emitEvents: any) {
    super(emitEvents)

    this.setCompanyId(companyId)
    this.fetchServicePricings()
  }

  async fetchServicePricings(): Promise<void> {
    try {
      this.isLoading.value = true
      let repository = useServicePricingStore()
      let filter = new Filter()
      filter.takeAll = true

      let response = await repository.fetchAll(filter)
      this.servicePricings.value = response.data.map((d: any) => {
        return new ServicePricing(d)
      })
    } catch (e) {
    } finally {
      this.isLoading.value = false
    }
  }

  setCompanyId(companyId: string): void {
    this.companyId.value = companyId

    this.companyOutstanding.value = new CompanyOutstanding()
    this.companyOutstanding.value.companyId = this.companyId.value
  }

  async onProceedClicked(): Promise<void> {}

  get title(): string {
    return this.language.isMalay() ? PopupTitlesBm.ImportantNotice : PopupTitles.ImportantNotice
  }

  get heading(): string {
    return this.language.isMalay() ? `Terbitkan Perintah Bayaran` : `Issue Payment Order`
  }

  get cta(): string {
    return this.language.isMalay() ? "Ingin teruskan?" : "Would you like to continue?"
  }

  get content(): string {
    if (this.language.isMalay()) {
      return `
        Lengkapkan butiran yang diperlukan untuk terbitkan Perintah Bayaran.
      `
    }

    return `
      Complete the required details below to issue Payment Order.
    `
  }

  get serviceOptions(): SelectOption[] {
    return ServiceNames.names.map((sn: ServiceName) => {
      return new SelectOption(sn.target, sn.target, this.language.isMalay() ? sn.bm : sn.en, false, false)
    })
  }
}
