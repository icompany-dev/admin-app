<template>
  <div
    id="analytics-companies-by-state"
    :class="{ 'is-loading': controller.isLoading.value }"
  >
    <div class="header">Companies by States</div>
    <div class="chart-wrapper">
      <ClientOnly>
        <Chart
          type="bar"
          :data="controller.dataSeries"
          :options="controller.chartOptions"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    BarController,
    LineController,
  } from "chart.js"
  import { Chart } from "vue-chartjs"
  import { CompaniesByStateController } from "~/scripts/components/analytics/CompaniesByStateController"
  import type { IPropsAnalyticsDistribution } from "~/scripts/props/PropsAnalyticsDistribution"

  const props = defineProps<IPropsAnalyticsDistribution>()

  const emit = defineEmits([])

  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    BarController,
    LineController
  )

  const controller = new CompaniesByStateController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Analytics/CompaniesByState" as *;
</style>
