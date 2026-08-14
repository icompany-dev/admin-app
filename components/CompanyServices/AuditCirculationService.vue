<template>
  <div
    id="company-service-change-of-name"
    class="company-services"
  >
    <CompanyServiceWrapper
      ref="wrapperRef"
      v-bind="controller.serviceWrapperProps"
      @go-to-page="controller.goToPage($event)"
      @back="controller.onBackButtonClicked()"
      @proceed="controller.onProceedClicked()"
      @pay="emit('pay')"
      @refresh="controller.initializeData()"
      @preview="controller.onPreview()"
      @shrouded="controller.onShrouded()"
      @view-mode-changed="controller.onViewModeChanged($event)"
      @minimized="controller.setApplicationData($event)"
      @application-updated="controller.onApplicationUpdated($event)"
      @goToNew="emit(EmitMessages.GO_TO_NEW)"
      @go-to-existing="emit(EmitMessages.GO_TO_EXISTING)"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <DcrAuditCirculation
            ref="dcrRef"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
          />
        </TransitionGroup>
      </template>
      <template #step-status>
        <div v-if="controller.isStepStatusVisible()">
          <div>
            {{ controller.processingLabel() }}
            <i class="fa-solid fa-loader fa-spin"></i>
          </div>

          <!-- <div v-if="controller.isSubmittedToSSM()">
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
          </div> -->
        </div>
      </template>
    </CompanyServiceWrapper>
  </div>
</template>

<script setup lang="ts">
  import DcrAuditCirculation from "../Resolutions/DcrAuditCirculation.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import { AuditCirculationServiceController } from "~/scripts/components/company-services/AuditCirculationServiceController"
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
    viewType: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(EmitMessages.COMPANY_SERVICES)

  const dcrRef = ref(null)
  const mcrRef = ref(null)
  const wrapperRef = ref(null)

  const controller = new AuditCirculationServiceController(props.companyId, props.viewType, emit)

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

  defineExpose({
    isDoneLoading: controller.isDoneLoading.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
</style>
