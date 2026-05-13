<template>
  <div id="page-all-sdn-bhd">
    <BreadCrumb v-bind="pageController.breadCrumbProps" />
  </div>
</template>

<script lang="ts" setup>
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import { PageAllSdnBhdController } from "~/scripts/pages/PageAllSdnBhdController"

  const props = defineProps({})
  const emit = defineEmits([])

  const pageController = new PageAllSdnBhdController()
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/All" as *;
</style>
