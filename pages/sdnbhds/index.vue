<template>
  <div id="page-all-sdn-bhd">
    <BreadCrumb v-bind="pageController.breadCrumbProps" />
    <All />
  </div>
</template>

<script lang="ts" setup>
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import All from "@/components/Companies/All.vue"
  import { PageAllSdnBhdController } from "~/scripts/pages/PageAllSdnBhdController"

  const props = defineProps({})
  const emit = defineEmits([])

  const pageController = new PageAllSdnBhdController()
</script>

<style lang="scss">
  @use "~/assets/scss/pages/SdnBhd" as *;
</style>
