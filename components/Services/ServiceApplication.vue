<template>
  <TransitionGroup
    id="services-service-application"
    tag="div"
    name="expand"
    @click="controller.onPanelClicked()"
  >
    <div class="application-name">
      {{ controller.serviceName.value }}
    </div>
    <div
      class="panel-content"
      v-if="!controller.isCollapsed.value"
    >
      <slot name="application"></slot>
    </div>
  </TransitionGroup>
</template>

<script lang="ts" setup>
  import type { IPropsServiceApplication } from "~/scripts/props/PropsServiceApplication"
  import { ServiceApplicationController } from "~/scripts/components/services/ServiceApplicationController"

  const props = defineProps<IPropsServiceApplication>()

  const emit = defineEmits([])

  const controller = new ServiceApplicationController(props, emit)

  watch(
    () => props.serviceName,
    (newVal) => {
      controller.setServiceName(newVal)
    }
  )

  watch(
    () => props.hasApplication,
    (newVal) => {
      controller.setHasApplication(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/ServiceApplication" as *;
</style>
