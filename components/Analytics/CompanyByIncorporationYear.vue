<template>
  <div id="analytics-company-by-incorporation-year">
    <div class="header">No. of Companies by Incorporation Year</div>
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
  import { CompanyByIncorporationYearController } from "~/scripts/components/analytics/CompanyByIncorporationYearController"

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

  const controller = new CompanyByIncorporationYearController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Analytics/CompanyByIncorporationYear" as *;
</style>
