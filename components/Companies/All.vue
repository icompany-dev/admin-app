<template>
  <div id="companies-all">
    <div v-if="!controller.tableDataFetcher.value.isLoading">
      <div class="sdn-bhd-container">
        <SdnBhd
          v-for="(sdnbhd, index) in controller.tableDataFetcher.value.dataOnPage"
          :company="sdnbhd"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import SdnBhd from "@/components/Companies/SdnBhd.vue"
  import { AllController } from "~/scripts/components/companies/AllController"

  const props = defineProps({})
  const emit = defineEmits([])

  const controller = new AllController(emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/All" as *;
</style>
