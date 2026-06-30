<template>
  <div
    id="company-service-no-constitution-service"
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
      @goToNew="emit(EmitMessages.GO_TO_NEW)"
      @goToExisting="emit(EmitMessages.GO_TO_EXISTING)"
      @view-mode-changed="controller.onViewModeChanged($event)"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <NoConstitutionDeclaration
            ref="declarationRef"
            :company-id="controller.companyId"
            :application-id="controller.noConstitution.value.id"
            :is-in-preview-mode="controller.isInPreviewMode.value"
            @applicationLoaded="controller.onDeclarationLoaded()"
          />
        </TransitionGroup>
      </template>
      <template #step-status>
        <div>
          {{ controller.processingLabel() }}
        </div>
      </template>
      <template #pasca-custom-confirmation>
        <div>
          {{ controller.confirmationLabel() }}
          <div class="document-download-buttons">
            <button
              class="btn btn-sm btn-submit"
              :class="{ 'is-loading': controller.isDownloading.value }"
              :disabled="controller.isDownloading.value"
              @click="controller.onDownloadClicked()"
            >
              {{ controller.downloadButton() }}
            </button>
          </div>
        </div>
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
  </div>
</template>

<script setup lang="ts">
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import NoConstitutionDeclaration from "../LegalDocuments/NoConstitutionDeclaration.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import { NoConstitutionServiceController } from "~/scripts/components/company-services/NoConstitutionServiceController"

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
  const declarationRef = ref(null)

  const controller = new NoConstitutionServiceController(props.companyId, props.viewType, emit)

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
    wrapperRef,
    (newVal) => {
      controller.setWrapperRef(newVal)
    },
    { immediate: true }
  )

  watch(
    declarationRef,
    (newVal) => {
      controller.setDeclarationRef(newVal)
    },
    { immediate: true }
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
  @use "~/assets/scss/components/CompanyServices/NoConstitutionService" as *;
</style>
