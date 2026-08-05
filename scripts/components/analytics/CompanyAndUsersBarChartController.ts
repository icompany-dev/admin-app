export class CompanyAndUsersBarChartController {
  emitEvents: any | null = null

  totalNumberOfCompanies: Ref<number> = ref<number>(0)
  companiesByIncorpDate: Ref<any> = ref<any>({})
  companiesByLocation: Ref<any> = ref<any>({})
  totalIncorporated: Ref<number> = ref<number>(0)
  totalSwitched: Ref<number> = ref<number>(0)
  companiesByDateJoined: Ref<any> = ref<any>({})

  totalNumberOfUsers: Ref<number> = ref<number>(0)
  usersByAgeGroup: Ref<any> = ref<any>({})
  usersByCitizenship: Ref<any> = ref<any>({})
  usersByGender: Ref<any> = ref<any>({})
  usersByRace: Ref<any> = ref<any>({})
  usersByDateJoined: Ref<any> = ref<any>({})
  totalSignUpsThisMonth: Ref<number> = ref<number>(0)

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

      await Promise.allSettled([this.fetchCompanyAnalytics(), this.fetchUserAnalytics()])
    } catch (e) {
      //
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchCompanyAnalytics(): Promise<void> {
    let repository = useAnalyticsStore()
    let response = await repository.fetchCompanyCounts()

    this.totalNumberOfCompanies.value = response?.number_of_compnies ?? 0
    this.companiesByIncorpDate.value = response.by_incorp_date ?? 0
    this.companiesByLocation.value = response.by_location ?? 0
    this.totalIncorporated.value = response.number_incorp_with_icompany ?? 0
    this.totalSwitched.value = response.number_switch_to_icompany ?? 0
    this.companiesByDateJoined.value = response.by_date_joined ?? 0
  }

  async fetchUserAnalytics(): Promise<void> {
    let repository = useAnalyticsStore()
    let response = await repository.fetchUserCounts()

    this.totalNumberOfUsers.value = response.number_of_users
    this.usersByAgeGroup.value = response.by_age_group
    this.usersByCitizenship.value = response.by_citizenship
    this.usersByGender.value = response.by_gender
    this.usersByRace.value = response.by_race
    this.usersByDateJoined.value = response.by_date_joined

    let dayjs = useDayjs()
    let thisMonth = dayjs().format("YYYY-MM")
    this.totalSignUpsThisMonth = response.by_date_joined[thisMonth] ?? 0
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

  get byJoinChartOptions(): any {
    const xaxis = [
      {
        x: new Date("01 Feb 2023").getTime(),
        x2: new Date("10 Apr 2023").getTime(),
        fillColor: "#f1734f",
        opacity: 0.2,
        label: {
          offsetY: -10,
          text: "Migrations & First Launch",
        },
      },
      {
        x: new Date("06 Nov 2023").getTime(),
        fillColor: "#f1734f",
        opacity: 0.2,
        label: {
          offsetY: -10,
          text: "Keluar Sekejap Collab",
        },
      },
    ]

    return {
      chart: {
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      title: {
        text: "iCompany Users and Companies",
      },
      annotations: {
        xaxis,
      },
      stroke: {
        width: [2, 2, 2, 2, 2, 2],
        curve: "smooth",
      },
      colors: ["#5B73E880", "#530247BF", "#F1734FBF", "#34C38FBF"],
      labels: this.dateJoinedLabels.map((d: string) => {
        let dayjs = useDayjs()
        return dayjs(d).format("D MMM YY")
      }),
      markers: { size: 0 },

      xaxis: { type: "datetime" },
      yaxis: [
        {
          title: {
            text: "No. of Companies",
          },
          opposite: false,
          labels: {
            formatter: (value: any) => value.toFixed(0),
          },
        },
        {
          title: {
            text: "No. of Users",
          },
          opposite: true,
          labels: {
            formatter: (value: any) => value.toFixed(0),
          },
        },
      ],
      tooltip: {
        shared: true,
        intersect: false,
        x: {
          formatter(x: any) {
            if (!x) {
              return
            }
            let dayjs = useDayjs()
            return dayjs(x).format("MMMM YYYY")
          },
        },
        y: {
          formatter(y: any) {
            if (typeof y !== "undefined") {
              return y.toFixed(0)
            }
            return y
          },
        },
      },
      grid: { borderColor: "#000000" },
    }
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
