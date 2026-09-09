<template>
  <div id="companies-sdn-bhd-dashboard">
    <LoaderPrepare
      v-if="controller.isLoading.value"
      :label="controller.loaderLabel"
      :sublabel="controller.loaderSublabel"
    />
    <template v-if="!controller.isLoading.value">
      <iframe
        :src="controller.iframeUrl"
        width="100%"
        height="100%"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import { SdnBhdDashboardController } from "~/scripts/components/companies/SdnBhdDashboardController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })
  const emit = defineEmits([])

  const controller = new SdnBhdDashboardController(props.companyId, emit)

  // onMounted(() => {
  //   controller.setCookie()
  // })

  // onBeforeUnmount(() => {
  //   controller.removeCookie()
  // })

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
