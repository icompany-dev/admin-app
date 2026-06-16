<template>
  <div
    id="company-service-terms-of-reference"
    class="company-services"
  >
    <CompanyServiceWrapper
      ref="wrapperRef"
      v-bind="controller.serviceWrapperProps"
      @go-to-page="controller.goToPage($event)"
      @back="controller.onBackButtonClicked()"
      @proceed="controller.onProceedClicked()"
      @pay="controller.onProceedClicked()"
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
          <TermsOfReferences
            ref="termsOfReferencesRef"
            :company-id="props.companyId"
            :is-in-preview-mode="controller.isInPreviewMode.value"
            :show-watermark="controller.showWatermark()"
            :watermark-text="controller.watermarkText()"
          />
        </TransitionGroup>
      </template>
      <template #learnMoreButton>
        <div
          class="learn-more"
          @click="controller.onMoreInfoClicked()"
        >
          {{ controller.learnMoreLabel() }}
        </div>
      </template>
      <template #cornerButton>
        <div class="action-buttons">
          <button
            class="btn btn-standard btn-primary"
            @click="controller.onMoreInfoClicked()"
          >
            {{ controller.learnMoreLabel() }}
          </button>
          <button
            v-if="controller.showCornerButton()"
            class="btn btn-standard btn-pay"
            @click="controller.onProceedClicked()"
          >
            {{ controller.payLabel() }}
          </button>
        </div>
      </template>
    </CompanyServiceWrapper>
    <Teleport to="body">
      <div
        class="alert-tray"
        :class="{ show: controller.isShowInfo.value }"
      >
        <Transition name="alert-appear">
          <Alert
            :is-dismissible="true"
            :type="'default'"
            :is-show="controller.isShowInfo.value"
            @hide="controller.onMoreInfoClicked()"
          >
            <template #alertContent>
              <div
                class="title"
                v-html="controller.alertTitle()"
              />
              <div class="content">
                <ul>
                  <li>
                    <span v-html="controller.alertContentPointOne()" />
                  </li>
                  <li>
                    <Tooltip
                      :title="controller.tooltipTitle()"
                      :content="controller.tooltipContent()"
                    >
                      <template #trigger>{{ controller.alertContentPointTwoTooltip() }}</template>
                    </Tooltip>
                    <span v-html="controller.alertContentPointTwo()" />
                  </li>
                </ul>
              </div>
            </template>
          </Alert>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import Alert from "../Alerts/Alert.vue"
  import Tooltip from "@/components/Tooltips/Tooltip.vue"
  import TermsOfReferences from "@/components/LegalDocuments/TermsOfReferences.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import { TermsOfReferenceServiceController } from "~/scripts/components/company-services/TermsOfReferenceServiceController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"

  const props = defineProps({
    companyId: {
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
  const termsOfReferencesRef = ref(null)

  const controller = new TermsOfReferenceServiceController(props.companyId, props.viewType, emit)

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
    termsOfReferencesRef,
    (newVal) => {
      if (newVal) {
        controller.setTermsOfReferencesRef(newVal)
      }
    },
    { immediate: true }
  )

  watch(
    () => props.viewType,
    (newVal) => {
      controller.setViewType(newVal)
    }
  )

  defineExpose({
    isDoneLoading: controller.isDoneLoading.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
  @use "~/assets/scss/components/CompanyServices/TermsOfReferenceService" as *;
</style>
