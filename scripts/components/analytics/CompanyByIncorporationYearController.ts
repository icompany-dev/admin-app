import type { PropsAnalyticsDistribution } from "~/scripts/props/PropsAnalyticsDistribution"

export class CompanyByIncorporationYearController {
  emitEvents: any | null = null

  companiesByIncorpDate: Ref<any> = ref<any>({})

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsAnalyticsDistribution, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  setDataFromProps(props: PropsAnalyticsDistribution): void {
    this.companiesByIncorpDate.value = props.companiesByIncorpDate

    this.isLoading.value = props.isLoading
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
