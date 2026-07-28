<template>
  <div
    id="page-incorporation-drafts"
    class="page-incorporation"
  >
    <BreadCrumb v-bind="pageController.breadCrumbProps" />
  </div>
</template>

<script setup lang="ts">
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import { PageIncorporationsDraftController } from "~/scripts/pages/PageIncorporationsDraftController"

  const pageController = new PageIncorporationsDraftController()
</script>

<style lang="scss">
  @use "~/assets/scss/pages/Incorporation" as *;
</style>
