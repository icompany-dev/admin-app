<template>
  <div
    id="company-service-beneficial-ownership"
    class="company-services"
  >
    <LoaderPrepare
      v-if="controller.isLoading.value"
      :label="controller.loaderLabel()"
      :sublabel="controller.loaderSublabel()"
    />
    <CompanyServiceWrapper
      v-if="!controller.isLoading.value"
      ref="wrapperRef"
      v-bind="controller.serviceWrapperProps"
      @go-to-page="controller.goToPage($event)"
      @back="controller.onBackButtonClicked()"
      @pay="emit('pay')"
      @refresh="controller.initializeData()"
      @preview="controller.onPreview()"
      @shrouded="controller.onShrouded()"
      @view-mode-changed="controller.onViewModeChanged($event)"
      @goToNew="emit(EmitMessages.GO_TO_NEW)"
      @goToExisting="emit(EmitMessages.GO_TO_EXISTING)"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <NotificationOfBeneficialOwnership
            ref="beneficialOwnershipRef"
            :declaration-id="controller.beneficialOwnership.value.id"
          />
        </TransitionGroup>
      </template>
    </CompanyServiceWrapper>
    <ActionTray
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
  import Alert from "../Alerts/Alert.vue"
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import NotificationOfBeneficialOwnership from "@/components/LegalDocuments/NotificationOfBeneficialOwnership.vue"
  import { NotificationOfBOServiceController } from "~/scripts/components/company-services/NotificationOfBOServiceController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    shareholderId: {
      type: String,
      required: false,
      default: null,
    },
    viewType: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(EmitMessages.COMPANY_SERVICES)

  const wrapperRef = ref(null)
  const beneficialOwnershipRef = ref(null)
  const actionTrayRef = ref(null)

  const controller = new NotificationOfBOServiceController(props.companyId, props.shareholderId, props.viewType, emit)

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
      console.log("has changed?", newVal)
      controller.setViewType(newVal)
    }
  )

  watch(
    () => props.shareholderId,
    async (newVal) => {
      await controller.setShareholderId(newVal)
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
    beneficialOwnershipRef,
    (newVal) => {
      controller.setBeneficialOwnershipRef(newVal)
    },
    { immediate: true }
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
