<template>
  <div id="page-analytics">
    <div class="page-header">
      <BreadCrumb v-bind="pageController.breadCrumbProps" />
    </div>
    <div class="analytics-container">
      <CompanyUserCount v-bind="pageController.analyticDistributionProps" />
      <!-- <DistributionMap /> -->
      <DataDistributionMap />
      <CompanyAndUsersBarChart v-bind="pageController.analyticDistributionProps" />
      <div class="split-container">
        <div class="split-container-item-50">
          <CompanyByIncorporationYear v-bind="pageController.analyticDistributionProps" />
        </div>
        <div class="split-container-item-50">
          <UsersByAgeGroup v-bind="pageController.analyticDistributionProps" />
        </div>
      </div>
      <div class="split-container">
        <div class="split-container-item-50">
          <CompaniesByState v-bind="pageController.analyticDistributionProps" />
        </div>
        <div class="split-container-item-25">
          <UsersByRace v-bind="pageController.analyticDistributionProps" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import CompaniesByState from "~/components/Analytics/CompaniesByState.vue"
  import CompanyUserCount from "~/components/Analytics/CompanyUserCount.vue"
  import CompanyAndUsersBarChart from "~/components/Analytics/CompanyAndUsersBarChart.vue"
  import CompanyByIncorporationYear from "@/components/Analytics/CompanyByIncorporationYear.vue"
  import DataDistributionMap from "~/components/Analytics/DataDistributionMap.vue"
  import DistributionMap from "~/components/Analytics/DistributionMap.vue"
  import UsersByAgeGroup from "@/components/Analytics/UsersByAgeGroup.vue"
  import UsersByRace from "@/components/Analytics/UsersByRace.vue"
  import { PageAnalyticsController } from "~/scripts/pages/PageAnalyticsController"

  const pageController = new PageAnalyticsController()
</script>

<style lang="scss">
  @use "~/assets/scss/pages/Analytics" as *;
</style>
