<template>
  <div
    id="company-service-lodge-annual-return"
    class="company-services"
  >
    <CompanyServiceWrapper
      ref="wrapperRef"
      v-bind="controller.serviceWrapperProps"
      @go-to-page="controller.goToPage($event)"
      @back="controller.onBackButtonClicked()"
      @pay="emit('pay', $event)"
      @refresh="controller.initializeData()"
      @minimized="controller.onWrapperMinimized($event)"
      @preview="controller.onPreview()"
      @goToNew="emit(EmitMessages.GO_TO_NEW)"
      @goToExisting="emit(EmitMessages.GO_TO_EXISTING)"
      @shrouded="controller.onShrouded()"
      @view-mode-changed="controller.onViewModeChanged($event)"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <Section68
            :company-id="controller.companyId"
            :annual-return-year="controller.yearToLodge.value"
          />
        </TransitionGroup>
      </template>
      <template #step-status>
        <div v-if="controller.isStepStatusVisible()">
          <div v-if="!controller.isSubmittedToSSM()">
            {{ controller.processingLabel() }}
            <i class="fa-solid fa-loader fa-spin"></i>
          </div>

          <div v-if="controller.isSubmittedToSSM()">
            <b>{{ controller.submittedToSsmLabel() }}:</b>
            <div class="step-date">
              {{ controller.getSubmissionDate() }}
              <i class="check-icon fa-solid fa-circle-check"></i>
            </div>

            <div class="step-buttons">
              <button
                class="btn btn-submit"
                @click="controller.onPayForAccess()"
              >
                {{ controller.payForAccessLabel() }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </CompanyServiceWrapper>
  </div>
</template>

<script setup lang="ts">
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import Section68 from "../LegalDocuments/Section68.vue"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import { Section68ServiceController } from "~/scripts/components/company-services/Section68ServiceController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    showOptionButtons: {
      type: Boolean,
      default: true,
    },
    yearToLodge: {
      type: String,
      required: true,
    },
    viewType: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(EmitMessages.COMPANY_SERVICES)

  const dcrRef = ref(null)
  const mcrRef = ref(null)
  const wrapperRef = ref(null)

  const controller = new Section68ServiceController(props.companyId, props.yearToLodge, props.viewType, emit)

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
    () => props.viewType,
    (newVal) => {
      controller.setViewType(newVal)
    }
  )

  watch(
    dcrRef,
    (newVal) => {
      controller.setDcrRef(newVal)
    },
    { immediate: true }
  )

  watch(
    mcrRef,
    (newVal) => {
      controller.setMcrRef(newVal)
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

  watch(
    () => props.yearToLodge,
    (newVal) => {
      controller.setYearToLodge(newVal)
    }
  )

  watch(
    () => controller.eventManager.isItemRemovedFromCart,
    (newVal) => {
      controller.handlePostDelete()
    }
  )

  defineExpose({
    isDoneLoading: controller.isDoneLoading.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
  @use "~/assets/scss/components/CompanyServices/LodgeAnnualReturn" as *;
</style>
