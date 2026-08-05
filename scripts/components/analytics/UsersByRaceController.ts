import type { PropsAnalyticsDistribution } from "~/scripts/props/PropsAnalyticsDistribution"
import { StringUtil } from "~/scripts/utils/String"

export class UsersByRaceController {
  emitEvents: any | null = null

  usersByRace: Ref<any> = ref<any>({})

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsAnalyticsDistribution, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  setDataFromProps(props: PropsAnalyticsDistribution): void {
    this.usersByRace.value = props.usersByRace

    this.isLoading.value = props.isLoading
  }

  get byJoinSeries(): any[] {
    return [
      {
        label: "No. of Users",
        type: "pie",
        data: Object.values(this.usersByRace.value),
        backgroundColor: ["#734668", "#A8577E", "#D07B93", "#E8A8B6", "#F5D5DC", "#9B6B8E"],
        borderWidth: 1,
      },
    ]
  }

  get dataSeries(): any {
    return {
      labels: Object.keys(this.usersByRace.value).map((l: string) => {
        return StringUtil.capitalize(l)
      }),
      datasets: this.byJoinSeries,
    }
  }

  get chartOptions(): any {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          direction: "row",
          labels: {
            usePointStyle: true,
            boxWidth: 8,
            padding: 15,
            generateLabels: (chart: any) => {
              const data = chart.data
              if (!data.labels?.length || !data.datasets?.length) return []

              const dataset = data.datasets[0]
              const bgColors = dataset.backgroundColor || []

              return data.labels.map((label: string, index: number) => ({
                text: label,
                fillStyle: Array.isArray(bgColors) ? bgColors[index] : bgColors,
                strokeStyle: "#fff",
                lineWidth: 1,
                hidden: !chart.getDataVisibility(index),
                index: index,
              }))
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (context: any): string => {
              const label = context.label || ""
              const value = context.raw || 0
              return `${label}: ${value} Users`
            },
          },
        },
      },
    }
  }
}
