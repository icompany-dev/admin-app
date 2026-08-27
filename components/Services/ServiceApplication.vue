<template>
  <div
    class="services-service-application"
    name="expand"
  >
    <div
      class="application-steps"
      @click.self="controller.onPanelClicked()"
    >
      <div class="application-name">
        <span class="name">{{ controller.serviceName.value }}</span>
        <slot name="titleOptions" />
      </div>
      <Transition name="fade">
        <div
          class="panel-content"
          v-if="!controller.isCollapsed.value"
        >
          <ApplicationNode
            v-bind="controller.receiptApplicationNodeProps"
            @click="controller.onPaymentNodeClicked()"
          >
            <template #nodeContent>
              <div class="application-container">
                <div class="node-title">{{ controller.paymentLabel }}</div>
                <div class="node-subtitle">({{ controller.paymentSublabel }})</div>
              </div>
            </template>
            <template #nodeOptions>
              <button
                class="btn btn-pill btn-primary"
                :class="{ 'is-loading': controller.isDownloadingReceipt.value }"
                @click="controller.onDownloaReceiptClicked()"
              >
                {{ controller.downloadLabel }}
              </button>
            </template>
          </ApplicationNode>
          <slot name="application"></slot>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import ApplicationNode from "./ApplicationNode.vue"
  import type { IPropsServiceApplication } from "~/scripts/props/PropsServiceApplication"
  import { ServiceApplicationController } from "~/scripts/components/services/ServiceApplicationController"

  const props = defineProps<IPropsServiceApplication>()

  const emit = defineEmits(["documentSelected", "paymentNodeSelected", "show", "hide"])

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

  watch(
    () => props.application,
    (newVal) => {
      controller.setApplication(newVal)
    },
    { deep: true }
  )

  watch(
    () => props.isShowPaymentStep,
    (newVal) => {
      controller.setIsShowReceipt(newVal)
    }
  )

  defineExpose({
    expand: controller.expand.bind(controller),
    collapse: controller.collapse.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/ServiceApplication" as *;
</style>
