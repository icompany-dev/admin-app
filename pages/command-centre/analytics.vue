<template>
  <div id="page-analytics">
    <div class="page-header">
      <BreadCrumb v-bind="pageController.breadCrumbProps" />
    </div>
    <CompanyUserCount />
    <DistributionMap />
    <CompanyAndUsersBarChart />
    <CompanyByIncorporationYear />
    <UsersByAgeGroup />
  </div>
</template>

<script setup lang="ts">
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import CompanyUserCount from "~/components/Analytics/CompanyUserCount.vue"
  import CompanyAndUsersBarChart from "~/components/Analytics/CompanyAndUsersBarChart.vue"
  import CompanyByIncorporationYear from "@/components/Analytics/CompanyByIncorporationYear.vue"
  import DistributionMap from "~/components/Analytics/DistributionMap.vue"
  import UsersByAgeGroup from "@/components/Analytics/UsersByAgeGroup.vue"
  import { PageAnalyticsController } from "~/scripts/pages/PageAnalyticsController"

  const pageController = new PageAnalyticsController()
</script>

<style lang="scss">
  @use "~/assets/scss/pages/Analytics" as *;
</style>
