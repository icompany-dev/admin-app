<template>
  <div
    id="company-service-section-219-and-221"
    class="company-services"
  >
    <div
      class="loader-container"
      v-if="controller.isLoading.value"
    >
      <LoaderPrepare
        :label="controller.loaderLabel()"
        :sublabel="controller.loaderSublabel()"
      />
    </div>
    <CompanyServiceWrapper
      v-if="!controller.isLoading.value"
      ref="wrapperRef"
      v-bind="controller.serviceWrapperProps"
      @go-to-page="controller.goToPage($event)"
      @back="controller.onBackButtonClicked()"
      @proceed="controller.onProceedClicked()"
      @pay="emit('pay')"
      @refresh="controller.initializeData()"
      @preview="controller.onPreview()"
      @shrouded="controller.onShrouded()"
      @minimized="controller.setApplicationData($event)"
      @view-mode-changed="controller.onViewModeChanged($event)"
      @goToNew="emit(EmitMessages.GO_TO_NEW)"
      @goToExisting="emit(EmitMessages.GO_TO_EXISTING)"
      @application-updated="controller.onApplicationUpdated($event)"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <Section219and221
            ref="section219and221Ref"
            :company-id="props.companyId"
            :director-id="props.directorId"
            :application-id="controller.section219and221.value.id"
            :show-watermark="controller.showWatermark()"
            :watermark-text="controller.watermarkText()"
            :is-in-preview-mode="controller.isInPreviewMode.value"
          />
        </TransitionGroup>
      </template>
      <template #cornerButton>
        <button
          v-if="controller.showCornerButton()"
          class="btn btn-standard btn-pay"
          @click="controller.onProceedClicked()"
        >
          {{ controller.payLabel() }}
        </button>
      </template>
    </CompanyServiceWrapper>

    <ActionTray
      ref="actionTrayRef"
      v-if="controller.isShowFudter()"
      :actions="controller.actionTrayElements.value"
    />
  </div>
</template>

<script setup lang="ts">
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Section219and221 from "@/components/LegalDocuments/Section219and221.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import { Section219and221ServiceController } from "~/scripts/components/company-services/Section219and221ServiceController"
  import { PaperOrientation } from "~/scripts/constants/Paper"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    directorId: {
      type: String,
      required: true,
    },
    viewType: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(EmitMessages.COMPANY_SERVICES)

  const wrapperRef = ref(null)
  const section219and221Ref = ref(null)
  const actionTrayRef = ref(null)

  const controller = new Section219and221ServiceController(props.companyId, props.directorId, props.viewType, emit)

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
    wrapperRef,
    (newVal) => {
      controller.setWrapperRef(newVal)
    },
    { immediate: true }
  )

  watch(
    section219and221Ref,
    (newVal) => {
      if (newVal) {
        controller.setSection219and221Ref(newVal)
      }
    },
    { immediate: true }
  )

  watch(
    () => props.directorId,
    (newVal) => {
      controller.setDirectorId(newVal)
    }
  )

  watch(
    () => props.viewType,
    (newVal) => {
      controller.setViewType(newVal)
    }
  )

  watch(
    actionTrayRef,
    (newVal) => {
      controller.setActionTrayRef(newVal)
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
