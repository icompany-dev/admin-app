import type { PropsAnalyticsDistribution } from "~/scripts/props/PropsAnalyticsDistribution"

export class CompaniesByStateController {
  emitEvents: any | null = null

  companiesByLocation: Ref<any> = ref<any>({})

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsAnalyticsDistribution, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  setDataFromProps(props: PropsAnalyticsDistribution): void {
    this.companiesByLocation.value = props.companiesByLocation

    this.isLoading.value = props.isLoading
  }

  get dateJoinedLabels(): string[] {
    const labelsFromCompany = Object.keys(this.companiesByLocation.value)

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
    return Object.values(this.companiesByLocation.value)
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
      labels: this.labels,
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
        tooltip: {
          callbacks: {
            title: (tooltipItems: any[]): string => {
              const index = tooltipItems[0]?.dataIndex
              const fullName = Object.keys(this.companiesByLocation.value ?? {})[index]
              if (!fullName) return ""
              return this.stateMapping[fullName.toLowerCase()] || fullName
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            callback: (value: any, index: any) => {
              const target = this.companiesByLocation.value ?? {}
              const keys = Object.keys(target)
              const fullName = keys[index]

              if (!fullName) return ""

              const mapping = this.stateMapping || {}
              return mapping[fullName.toLowerCase()] ?? fullName
            },
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

  get stateMapping(): any {
    return {
      johor: "Johor",
      kedah: "Kedah",
      kelantan: "Kelantan",
      melaka: "Melaka",
      "negeri sembilan": "Negeri Sembilan",
      pahang: "Pahang",
      perak: "Perak",
      perlis: "Perlis",
      "pulau pinang": "Pulau Pinang",
      penang: "Pulau Pinang",
      selangor: "Selangor",
      terengganu: "Terengganu",
      sabah: "Sabah",
      sarawak: "Sarawak",
      "kuala lumpur": "Kuala Lumpur",
      labuan: "Labuan",
      putrajaya: "Putrajaya",
    }
  }

  get labels() {
    const labels = Object.keys(this.companiesByLocation.value)

    return labels.map((l) => {
      const abbreviationMap: any = {
        johor: "JOH",
        kedah: "KDH",
        kelantan: "KEL",
        melaka: "MLK",
        "negeri sembilan": "NSN",
        pahang: "PHG",
        perak: "PRK",
        perlis: "PLS",
        "pulau pinang": "PNG",
        penang: "PNG",
        selangor: "SGR",
        terengganu: "TRG",
        sabah: "SBH",
        sarawak: "SWK",
        "kuala lumpur": "KUL",
        labuan: "LBN",
        putrajaya: "PJY",
      }
      return abbreviationMap[l.toLowerCase()] || "X"
    })
  }
}
