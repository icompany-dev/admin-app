<template>
  <div
    id="company-service-propose-adopt-constitution"
    class="company-services"
  >
    <CompanyServiceWrapper
      ref="wrapperRef"
      v-bind="controller.serviceWrapperProps"
      @go-to-page="controller.goToPage($event)"
      @goToNew="emit(EmitMessages.GO_TO_NEW)"
      @back="controller.onBackButtonClicked()"
      @proceed="controller.onProceedClicked()"
      @pay="emit('pay', $event)"
      @refresh="controller.initializeData()"
      @minimized="controller.onWrapperMinimized($event)"
      @preview="controller.onPreview()"
      @shrouded="controller.onShrouded()"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <DcrPreferenceShareRight
            ref="dcrRef"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
          />
        </TransitionGroup>
      </template>
      <template #documentSlipCaseContent>
        <div class="action-buttons">
          <button
            class="btn btn-standard btn-danger"
            @click="controller.onBackButtonClicked()"
          >
            {{ controller.backLabel() }}
          </button>
          <button
            class="btn btn-standard btn-pay"
            @click="controller.onProceedClicked()"
          >
            {{ controller.payLabel() }}
          </button>
        </div>
      </template>
    </CompanyServiceWrapper>
  </div>
</template>

<script setup lang="ts">
  import DcrPreferenceShareRight from "../Resolutions/DcrPreferenceShareRight.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import { ProposePreferenceShareRightServiceController } from "~/scripts/components/company-services/ProposePreferenceShareRightServiceController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    showOptionButtons: {
      type: Boolean,
      default: true,
    },
  })

  const emit = defineEmits(["pay", "doneLoading", EmitMessages.GO_TO_NEW])

  const dcrRef = ref(null)
  const wrapperRef = ref(null)

  const controller = new ProposePreferenceShareRightServiceController(props.companyId, emit)

  onMounted(async () => {
    await nextTick()
    controller.setTotalPages()
    controller.handleDisplayedPage()
    window.addEventListener("scroll", controller.handleScroll.bind(controller))
  })

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", controller.handleScroll.bind(controller))
  })

  watch(
    dcrRef,
    (newVal) => {
      controller.setDcrRef(newVal)
    },
    { immediate: true }
  )

  watch(
    wrapperRef,
    (newVal) => {
      controller.setWrapperRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    isDoneLoading: controller.isDoneLoading.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
</style>
