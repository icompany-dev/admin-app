<template>
  <div id="page-analytics">
    <div class="page-header">
      <BreadCrumb v-bind="pageController.breadCrumbProps" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import { PageAnalyticsController } from "~/scripts/pages/PageAnalyticsController"

  const pageController = new PageAnalyticsController()
</script>

<style lang="scss">
  @use "~/assets/scss/pages/Analytics" as *;
</style>
