<template>
  <div id="services-change-of-name-application">
    <ServiceApplication v-bind="controller.serviceApplicationProps">
      <template #application>// the pasca steps here</template>
    </ServiceApplication>
  </div>
</template>

<script lang="ts" setup>
  import ServiceApplication from "./ServiceApplication.vue"
  import { ChangeOfNameApplicationController } from "~/scripts/components/services/ChangeOfNameApplicationController"
  import type { IPropsApplication } from "~/scripts/props/PropsApplication"

  const props = defineProps<IPropsApplication>()

  const emit = defineEmits([])

  const controller = new ChangeOfNameApplicationController(props, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/ChangeOfNameApplication" as *;
</style>
