<template>
  <div id="companies-sdn-bhd-dashboard">
    <iframe :scr="controller.iframeUrl" />
  </div>
</template>

<script lang="ts" setup>
  import { SdnBhdDashboardController } from "~/scripts/components/companies/SdnBhdDashboardController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })
  const emit = defineEmits([])

  const controller = new SdnBhdDashboardController(props.companyId, emit)

  onMounted(() => {
    controller.setCookie()
  })

  onBeforeUnmount(() => {
    controller.removeCookie()
  })

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/SdnBhdDashboard" as *;
</style>
