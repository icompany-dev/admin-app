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
      @goToNew="emit(EmitMessages.GO_TO_NEW)"
      @goToExisting="emit(EmitMessages.GO_TO_EXISTING)"
      @preview="controller.onPreview()"
      @shrouded="controller.onShrouded()"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <DcrAdoptionOfConstitution
            ref="dcrRef"
            v-if="controller.isShowAdoptResolution()"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
          />
          <McrAdoptionOfConstitution
            ref="mcrRef"
            v-if="controller.isShowAdoptResolution()"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
          />
          <DcrAmendmentOfConstitution
            ref="dcrRef"
            v-if="controller.isShowAmendResolution()"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
          />
          <McrAmendmentOfConstitution
            ref="mcrRef"
            v-if="controller.isShowAmendResolution()"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
          />
          <DcrAbolishmentOfConstitution
            ref="dcrRef"
            v-if="controller.isShowAbolishResolution()"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
          />
          <McrAbolishmentOfConstitution
            ref="mcrRef"
            v-if="controller.isShowAbolishResolution()"
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
      <template #cornerButton>
        <button
          v-if="controller.showCornerButton()"
          class="btn btn-standard btn-pay"
          @click="controller.onProceedClicked()"
        >
          {{ controller.payLabel() }}
        </button>
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
  import DcrAdoptionOfConstitution from "../Resolutions/DcrAdoptionOfConstitution.vue"
  import McrAdoptionOfConstitution from "../Resolutions/McrAdoptionOfConstitution.vue"
  import DcrAmendmentOfConstitution from "../Resolutions/DcrAmendmentOfConstitution.vue"
  import McrAmendmentOfConstitution from "../Resolutions/McrAmendmentOfConstitution.vue"
  import DcrAbolishmentOfConstitution from "../Resolutions/DcrAbolishmentOfConstitution.vue"
  import McrAbolishmentOfConstitution from "../Resolutions/McrAbolishmentOfConstitution.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import { ChangeOfConstitutionServiceController } from "~/scripts/components/company-services/ChangeOfConstitutionServiceController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    showOptionsButton: {
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

  const controller = new ChangeOfConstitutionServiceController(props.companyId, props.type, props.viewType, emit)

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
    () => controller.eventManager.isItemRemovedFromCart,
    (newVal) => {
      controller.handlePostDelete()
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
</style>
