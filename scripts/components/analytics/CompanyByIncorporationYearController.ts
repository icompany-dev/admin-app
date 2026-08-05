export class CompanyByIncorporationYearController {
  emitEvents: any | null = null

  companiesByIncorpDate: Ref<any> = ref<any>({})

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents

    this.init()
  }

  async init(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      await this.fetchCompanyAnalytics()
    } catch (e) {
      //
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchCompanyAnalytics(): Promise<void> {
    let repository = useAnalyticsStore()
    let response = await repository.fetchCompanyCounts()

    this.companiesByIncorpDate.value = response.by_incorp_date ?? 0
  }

  get dateJoinedLabels(): string[] {
    const labelsFromCompany = Object.keys(this.companiesByIncorpDate.value)

    return [...new Set(labelsFromCompany)]
      .filter((d: string) => {
        let dayjs = useDayjs()

        return dayjs(d).isValid()
      })
      .sort((a: string, b: string) => {
        let dayjs = useDayjs()
        return dayjs(a).isBefore(dayjs(b)) ? -1 : 1
      })
  }

  get companyDataSeries(): any[] {
    // const labels = this.dateJoinedLabels
    // const data: any[] = []
    // labels.forEach((date) => {
    //   const value = this.companiesByIncorpDate.value[date]?.total ?? 0
    //   data.push(value)
    // })

    // return data
    return Object.values(this.companiesByIncorpDate.value)
  }

  get byJoinSeries(): any[] {
    return [
      {
        label: "No. of Companies",
        type: "bar",
        data: this.companyDataSeries,
        backgroundColor: "#734668",
        yAxisID: "y",
      },
    ]
  }

  get dataSeries(): any {
    return {
      labels: this.dateJoinedLabels.map((d: string) => {
        let dayjs = useDayjs()
        return dayjs(d).format("YYYY")
      }),
      datasets: this.byJoinSeries,
    }
  }

  get chartOptions(): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            boxWidth: 8,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "No. of Companies",
          },
          grid: {
            color: "#f0f0f0",
          },
        },
      },
    }
  }
}
