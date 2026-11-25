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
        <span
          class="name"
          v-html="controller.serviceName.value"
        />
        <div class="payment-info">
          <div
            class="payment-details"
            @click.self="controller.onPaymentNodeClicked()"
          >
            {{ controller.paymentLabel }}
            <Transition name="fade">
              <span
                v-if="controller.hasPaid"
                class="paid"
                @click="controller.onDownloaReceiptClicked()"
              >
                <i class="fa-solid fa-circle-check" />
              </span>
            </Transition>
          </div>
        </div>
      </div>
      <Transition name="fade">
        <div
          class="panel-content"
          v-if="!controller.isCollapsed.value"
        >
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

  const emit = defineEmits(["documentSelected", "paymentNodeSelected", "download", "show", "hide"])

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
