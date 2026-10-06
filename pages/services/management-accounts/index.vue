<template>
  <div id="page-all-sdn-bhd">
    <Document v-bind="pageController.propsManagementAccountDocument" />
  </div>
</template>

<script setup lang="ts">
  import Document from "~/components/ManagementAccounts/Document.vue"
  import { PageSdnBhdManagementAccountNewController } from "~/scripts/pages/PageSdnBhdManagementAccountNewController"

  const props = defineProps({})
  const emit = defineEmits([])

  const pageController = new PageSdnBhdManagementAccountNewController()
</script>

<style lang="scss">
  @use "~/assets/scss/pages/SdnBhd" as *;
</style>
