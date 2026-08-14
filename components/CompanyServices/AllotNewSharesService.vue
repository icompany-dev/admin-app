<template>
  <div
    id="company-service-allot-new-shares"
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
      @goToNew="emit(EmitMessages.GO_TO_NEW)"
      @goToExisting="emit(EmitMessages.GO_TO_EXISTING)"
      @minimized="controller.setApplicationData($event)"
      @application-updated="controller.onApplicationUpdated($event)"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <DcrAllotmentOfShares
            ref="dcrRef"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
          />
          <McrAllotmentOfShares
            ref="mcrRef"
            v-bind="controller.resolutionDocumentProps"
            @total-page-changed="controller.handleDoneLoading()"
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
    <ActionTray
      v-if="controller.showActionTray()"
      ref="actionTrayRef"
      :actions="controller.actionTrayElements.value"
    />
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
              <div class="title">
                {{ controller.slipCaseTitle() }}
              </div>
              <div class="content">
                <ul>
                  <li
                    v-for="(point, i) in controller.slipCaseContentPoints()"
                    :key="i"
                  >
                    <span v-html="point" />
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
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import DcrAllotmentOfShares from "../Resolutions/DcrAllotmentOfShares.vue"
  import McrAllotmentOfShares from "../Resolutions/McrAllotmentOfShares.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import { AllotNewSharesServiceController } from "~/scripts/components/company-services/AllotNewSharesServiceController"

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

  const dcrRef = ref(null)
  const mcrRef = ref(null)
  const wrapperRef = ref(null)

  const controller = new AllotNewSharesServiceController(props.companyId, props.viewType, emit)

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
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
  @use "~/assets/scss/components/CompanyServices/AllotNewShares" as *;
</style>
