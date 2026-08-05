<template>
  <div id="analytics-users-by-age-group">
    <div class="header">Users by Age Group</div>
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
  import { UsersByAgeGroupController } from "~/scripts/components/analytics/UsersByAgeGroupController"

  const props = defineProps({})
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

  const controller = new UsersByAgeGroupController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Analytics/UsersByAgeGroup" as *;
</style>
