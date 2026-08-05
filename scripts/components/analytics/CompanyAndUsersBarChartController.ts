import type { PropsAnalyticsDistribution } from "~/scripts/props/PropsAnalyticsDistribution"

export class CompanyAndUsersBarChartController {
  emitEvents: any | null = null

  companiesByDateJoined: Ref<any> = ref<any>({})
  usersByDateJoined: Ref<any> = ref<any>({})

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsAnalyticsDistribution, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  setDataFromProps(props: PropsAnalyticsDistribution): void {
    this.companiesByDateJoined.value = props.companiesByDateJoined
    this.usersByDateJoined.value = props.usersByDateJoined

    this.isLoading.value = props.isLoading
  }

  // computed values
  get dateJoinedLabels(): string[] {
    const labelsFromCompany = Object.keys(this.companiesByDateJoined.value)
    const labelsFromUser = Object.keys(this.usersByDateJoined)
    const allLabels = labelsFromUser.concat(labelsFromCompany)

    return [...new Set(allLabels)]
      .filter((d: string) => {
        let dayjs = useDayjs()

        return dayjs(d).isValid()
      })
      .sort((a: string, b: string) => {
        let dayjs = useDayjs()
        return dayjs(a).isBefore(dayjs(b)) ? -1 : 1
      })
  }

  get accummulatedNumberOfCompanies(): any[] {
    let accumulatedTotal = 0
    const labels = this.dateJoinedLabels
    const data: any[] = []
    labels.forEach((date) => {
      accumulatedTotal += this.companiesByDateJoined.value[date]?.total ?? 0
      data.push(accumulatedTotal)
    })

    return data
  }

  get companyDataSeries(): any[] {
    const labels = this.dateJoinedLabels
    const data: any[] = []
    labels.forEach((date) => {
      const value = this.companiesByDateJoined.value[date]?.total ?? 0
      data.push(value)
    })

    return data
  }

  get accummulatedNumberOfUsers(): any[] {
    let accumulatedTotal = 0
    const labels = this.dateJoinedLabels
    const data: any[] = []
    labels.forEach((date) => {
      accumulatedTotal += this.usersByDateJoined.value[date] ?? 0
      data.push(accumulatedTotal)
    })
    return data
  }

  get userDataSeries(): any[] {
    const labels = this.dateJoinedLabels
    const data: any[] = []
    labels.forEach((date) => {
      const value = this.usersByDateJoined.value[date] ?? 0
      data.push(value)
    })

    return data
  }

  get byJoinSeries(): any[] {
    return [
      {
        label: "No. of New Companies",
        type: "bar",
        data: this.companyDataSeries,
        backgroundColor: "#a3b1f8",
        yAxisID: "y",
      },
      {
        label: "No. of New Users",
        type: "bar",
        data: this.userDataSeries,
        backgroundColor: "#734668",
        yAxisID: "y",
      },
      {
        label: "Total No. of Companies",
        type: "line",
        data: this.accummulatedNumberOfCompanies,
        borderColor: "#ff8a65",
        backgroundColor: "#ff8a65",
        pointRadius: 0,
        tension: 0.3,
        yAxisID: "y1",
      },
      {
        label: "Total No. of Users",
        type: "line",
        data: this.accummulatedNumberOfUsers,
        borderColor: "#4db6ac",
        backgroundColor: "#4db6ac",
        pointRadius: 0,
        tension: 0.3,
        yAxisID: "y1",
      },
    ]
  }

  get dataSeries(): any {
    return {
      labels: this.dateJoinedLabels.map((d: string) => {
        let dayjs = useDayjs()
        return dayjs(d).format("MMM YY")
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
        // Left Y-Axis for Monthly Bar Data
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "No. of Companies / New Users",
          },
          grid: {
            color: "#f0f0f0",
          },
        },
        // Right Y-Axis for Cumulative Line Data
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: "Total Cumulative Count",
          },
          grid: {
            drawOnChartArea: false, // Prevents grid line overlap
          },
        },
      },
    }
  }
}
