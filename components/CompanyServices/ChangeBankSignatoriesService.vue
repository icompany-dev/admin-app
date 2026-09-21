<template>
  <div
    id="company-service-change-bank-signatories-service"
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
      @goToExisting="emit(EmitMessages.GO_TO_EXISTING)"
      @minimized="controller.setApplicationData($event)"
      @view-mode-changed="controller.onViewModeChanged($event)"
      @application-updated="controller.onApplicationUpdated($event)"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <DcrChangeBankSignatories
            ref="dcrRef"
            v-bind="controller.resolutionDocumentProps"
          />
        </TransitionGroup>
      </template>
      <template #pasca-custom-affirmation>
        <div class="affirmation-details">
          <b>{{ controller.currentState() }}</b>
          <br />
          {{ controller.currentStateSubnote() }}
        </div>
        <div
          class="affirmation-details"
          v-if="controller.showSignatories()"
        >
          {{ controller.signatoriesLabel() }}
          <div class="authorised-names">
            <i
              v-for="(name, index) in controller.signatories()"
              class="fa-solid fa-user"
              :title="name"
              :key="index"
            />
          </div>
        </div>
        <div v-if="controller.isShowReadyToSubmit">
          <b>{{ controller.readyToSubmitLabel }}</b>
          <br />
          <span v-html="controller.readyToSubmitSublabel" />
          <br />
          <div
            class="step-buttons"
            v-if="!controller.isDocumentLocked"
          >
            <button
              class="btn btn-submit"
              :class="{ 'is-loading': controller.isUpdatingStatus.value }"
              v-keyboard-click
              @click="controller.onSubmitAllInformation()"
            >
              {{ controller.submitLabel }}
            </button>
          </div>
        </div>
      </template>
      <template #step-status>
        <b>{{ controller.status }}</b>
        <br />
        {{ controller.statusSubnote }}
        <br />
        <div
          class="step-buttons"
          v-if="!controller.isDelivered"
        >
          <button
            class="btn btn-submit"
            :class="{ 'is-loading': controller.isUpdatingStatus.value }"
            v-keyboard-click
            @click="controller.onDeliveredClicked()"
          >
            {{ controller.deliveryLabel }}
          </button>
        </div>
      </template>
      <template #pasca-custom-confirmation>
        <b>{{ controller.confirmation }}</b>
        <br />
        {{ controller.confirmationSubnote }}
        <div class="step-buttons">
          <button
            class="btn btn-submit"
            :class="{ 'is-loading': controller.isUpdatingStatus.value }"
            v-keyboard-click
            @click="controller.onCompleteServiceClicked()"
          >
            {{ controller.completedLabel }}
          </button>
        </div>
      </template>
      <template #learnMoreButton>
        <div
          class="learn-more"
          v-keyboard-click
          @click="controller.onMoreInfoClicked()"
        >
          {{ controller.learnMoreLabel() }}
        </div>
      </template>
      <template #cornerButton>
        <div class="action-buttons">
          <button
            class="btn btn-standard btn-learn-more"
            v-keyboard-click
            @click="controller.onMoreInfoClicked()"
          >
            {{ controller.learnMoreLabel() }}
          </button>
          <button
            v-if="controller.showCornerButton()"
            class="btn btn-standard btn-pay"
            v-keyboard-click
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
        @click.self="controller.onMoreInfoClicked()"
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
                {{ controller.alertTitle() }}
              </div>
              <div
                class="content"
                v-html="controller.alertContent()"
              />
            </template>
          </Alert>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import DcrChangeBankSignatories from "../Resolutions/DcrChangeBankSignatories.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import LoaderPrepare from "~/components/Loaders/Prepare.vue"
  import { ChangeBankSignatoriesServiceController } from "~/scripts/components/company-services/ChangeBankSignatoriesServiceController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    companyBankId: {
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
  const wrapperRef = ref(null)

  const controller = new ChangeBankSignatoriesServiceController(
    props.companyId,
    props.companyBankId,
    props.viewType,
    emit
  )

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

  defineExpose({
    onDownloadClicked: controller.onDownloadClicked.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
  @use "~/assets/scss/components/CompanyServices/ChangeBankSignatoriesService" as *;
</style>
