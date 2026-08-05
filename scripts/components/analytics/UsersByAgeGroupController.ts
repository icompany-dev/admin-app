import type { PropsAnalyticsDistribution } from "~/scripts/props/PropsAnalyticsDistribution"

export class UsersByAgeGroupController {
  emitEvents: any | null = null

  usersByAgeGroup: Ref<any> = ref<any>({})

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsAnalyticsDistribution, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  setDataFromProps(props: PropsAnalyticsDistribution): void {
    this.usersByAgeGroup.value = props.usersByAgeGroup

    this.isLoading.value = props.isLoading
  }

  get byJoinSeries(): any[] {
    return [
      {
        label: "No. of Users",
        type: "bar",
        data: Object.values(this.usersByAgeGroup.value),
        backgroundColor: "#734668",
        yAxisID: "y",
      },
    ]
  }

  get dataSeries(): any {
    return {
      labels: Object.keys(this.usersByAgeGroup.value),
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
            text: "No. of Users",
          },
          grid: {
            color: "#f0f0f0",
          },
        },
      },
    }
  }
}
