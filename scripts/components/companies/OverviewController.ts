import { Error } from "~/scripts/library/Error"
import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Director } from "~/scripts/models/Director"
import { Shareholder } from "~/scripts/models/Shareholder"
import type { CompanyBank } from "~/scripts/models/CompanyBank"
import { ObjectUtil } from "~/scripts/utils/Object"
import type { ChartData, ChartOptions } from "chart.js"

export class OverviewController {
  companyId: Ref<string> = ref<string>("")
  company: Ref<Company> = ref<Company>(new Company())

  directors: Ref<Director[]> = ref<Director[]>([])
  shareholders: Ref<Shareholder[]> = ref<Shareholder[]>([])

  isLoading: Ref<boolean> = ref<boolean>(false)
  isShowShareDistribution: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  language = useLanguage()

  constructor(companyId: string, emitEvents: any) {
    this.setCompanyId(companyId)
    this.emitEvents = emitEvents
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.companyId.value = companyId

    await this.init()
  }

  async init(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      let error = new Error()
      error.setForFetch()
      error.handle()
      return
    }

    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      await Promise.all([this.fetchCompany(), this.fetchDirectors(), this.fetchShareholders()])
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value
    }
  }

  async fetchCompany(): Promise<void> {
    let repository = useCompanyStore()
    let response = await repository.fetch(this.companyId.value)
    if (repository.error !== null) {
      throw repository.error
    }

    this.company.value = new Company(response)
  }

  async fetchDirectors(): Promise<void> {
    let repository = useDirectorStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)
    if (repository.error !== null) {
      throw repository.error
    }

    this.directors.value = response.map((d: any) => {
      return new Director(d)
    })
  }

  async fetchShareholders(): Promise<void> {
    let repository = useShareholderStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)
    if (repository.error !== null) {
      throw repository.error
    }

    this.shareholders.value = response.map((d: any) => {
      return new Shareholder(d)
    })
  }

  onShowSharePercentageClicked(): void {
    this.isShowShareDistribution.value = !this.isShowShareDistribution.value
  }

  // getters
  get noneText(): string {
    return this.language.isMalay() ? "TIADA" : "NONE"
  }

  get businessDetailsLabel(): string {
    return this.language.isMalay() ? "Butiran Perniagaan" : "Business Details"
  }

  get businessAddressLabel(): string {
    return this.language.isMalay() ? "Alamat Perniagaan" : "Business Address"
  }

  get businessAddress(): string {
    return this.company.value.businessAddressLocation?.getMultilineAddress() ?? "No Business Address"
  }

  get registeredAddressLabel(): string {
    return this.language.isMalay() ? "Alamat Berdaftar" : "Registered Address"
  }

  get registeredAddress(): string {
    return this.company.value.registeredAddressLocation?.getMultilineAddress() ?? "No Registered Address"
  }

  get businessBranchesLabel(): string {
    return this.language.isMalay() ? "Cawangan Perniagaan" : "Business Branch"
  }

  get branchAddresses(): string[] {
    return [] // need to pull the data
  }

  get bankDetailLabel(): string {
    return this.language.isMalay() ? "Akaun Bank" : "Bank Accounts"
  }

  get bankDetails(): CompanyBank[] {
    return []
  }

  get directorsLabel(): string {
    return this.language.isMalay() ? "Lembaga Pengarah" : "Board of Directors"
  }

  get directorsDetails(): Director[] {
    return ObjectUtil.sort<Director>(this.directors.value, "dateAppointed", "asc")
  }

  get shareholdersLabel(): string {
    return this.language.isMalay() ? "Pemegang Saham" : "Board of Members"
  }

  get shareholdersDetails(): Shareholder[] {
    return ObjectUtil.sort<Shareholder>(this.shareholders.value, "dateAppointed", "asc")
  }

  get nameLabel(): string {
    return this.language.isMalay() ? "Nama" : "Name"
  }

  get emailLabel(): string {
    return this.language.isMalay() ? "Alamat Emel" : "Email Address"
  }

  get phoneLabel(): string {
    return this.language.isMalay() ? "No. Telefon" : "Contact Number"
  }

  get totalSharesLabel(): string {
    return this.language.isMalay() ? "Jumlah Saham" : "Total Shares"
  }

  get ordinarySharesLabel(): string {
    return this.language.isMalay() ? "Ordinary" : "Ordinary"
  }

  get preferenceSharesLabel(): string {
    return this.language.isMalay() ? "Preference" : "Preference"
  }

  get shareDistributionChartOptions(): ChartOptions<"pie"> {
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 20,
          },
        },
      },
    }
  }

  get shareDistributionChartData(): ChartData<"pie"> {
    return {
      labels: this.shareholdersDetails.map((s: Shareholder) => {
        return s.name
      }),
      datasets: [
        {
          backgroundColor: ["#491f4680", "#f6905580", "#0d6efd80", "#00683780"],
          hoverOffset: 6,
          data: this.shareholdersDetails.map((s: Shareholder) => {
            return s.ordinaryShares + s.preferenceShares
          }),
        },
      ],
    }
  }

  get showDistributionLabel(): string {
    if (this.isShowShareDistribution.value) {
      return this.language.isMalay() ? "Tunjuk Butiran" : "Show Details"
    }

    return this.language.isMalay() ? "Tunjuk Percentage" : "Show Percentage"
  }
}
