<template>
  <div
    id="service-bank-account-opening"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
      @click="emit('zoomIn')"
      :style="controller.getZoomStyle()"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <component
          ref="dcr"
          :is="activeDocumentComponent"
          :company-id="controller.companyId"
          :resolution-document="controller.resolutionDocumentProps"
          :is-show-all-documents="props.isShowAllDocuments"
          @updated="controller.onDataUpdated()"
        />
      </TransitionGroup>
    </div>
    <ActionTray :actions="controller.actionTrayElements.value" />
    <Teleport to="body">
      <Transition name="slide-left">
        <div
          class="document-auto-saved"
          v-if="controller.isUpdating.value"
        >
          <i
            class="fa-regular fa-spin fa-spinner"
            v-if="!controller.isUpdated.value"
          ></i>
          <div class="label-details">
            <div class="label">{{ controller.updatingLabel }}</div>
            <div class="sublabel">{{ controller.updatingSublabel }}</div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import BankDocuments from "@/components/Banks/Documents/BankDocuments.vue"
  import HongLeongBankDocuments from "@/components/Banks/Documents/HongLeongBankDocuments.vue"
  import MaybankDocuments from "@/components//Banks/Documents/MaybankDocuments.vue"
  import BankIslamDocuments from "../Banks/Documents/BankIslamDocuments.vue"
  import AllianceBankDocuments from "../Banks/Documents/AllianceBankDocuments.vue"
  import AffinBankDocuments from "../Banks/Documents/AffinBankDocuments.vue"
  import { BankAccountOpeningController } from "~/scripts/components/service-wrappers/BankAccountOpeningController"
  import { BankConstants } from "~/scripts/constants/Banks"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: String,
      default: null,
    },
    isDocumentEnlarged: {
      type: Boolean,
      default: false,
    },
    isInPreviewMode: {
      type: Boolean,
      default: true,
    },
    isShowAllDocuments: {
      type: Boolean,
      default: false,
    },
    isShowing: {
      type: Boolean,
      default: false,
    },
  })

  const componentMap: Record<string, any> = {
    [BankConstants.MAYBANK_DETAIL.id]: MaybankDocuments,
    [BankConstants.OCBC_BANK_DETAIL.id]: BankDocuments,
    [BankConstants.UOB_DETAIL.id]: BankDocuments,
    [BankConstants.CIMB_DETAIL.id]: BankDocuments,
    [BankConstants.AFFIN_BANK_DETAIL.id]: AffinBankDocuments,
    [BankConstants.PUBLIC_BANK_DETAIL.id]: BankDocuments,
    [BankConstants.MUAMALAT_DETAIL.id]: BankDocuments,
    [BankConstants.RHB_BANK_DETAIL.id]: BankDocuments,
    [BankConstants.HONG_LEONG_BANK_DETAIL.id]: HongLeongBankDocuments,
    [BankConstants.STANDARD_CHARTERED_DETAIL.id]: BankDocuments,
    [BankConstants.AMBANK_DETAIL.id]: BankDocuments,
    [BankConstants.AGROBANK_DETAIL.id]: BankDocuments,
    [BankConstants.ALLIANCE_BANK_DETAIL.id]: AllianceBankDocuments,
    [BankConstants.BANK_ISLAM_DETAIL.id]: BankIslamDocuments,
    [BankConstants.HSBC_DETAIL.id]: BankDocuments,
    [BankConstants.MBSB_DETAIL.id]: BankDocuments,
    [BankConstants.BANK_RAKYAT_DETAIL.id]: BankDocuments,
    [BankConstants.CDS_TRADING_DETAIL.id]: BankDocuments,
    [""]: BankDocuments,
  }

  const dcr = ref(null)
  const autoSaveAlertRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "back"])

  const controller = new BankAccountOpeningController(props.companyId, emit, props.applicationId)

  const activeDocumentComponent = computed(() => {
    const target = controller.bankId.value
    return target && componentMap[target] ? componentMap[target] : null
  })

  watch(
    dcr,
    (newVal) => {
      controller.setDcrRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.applicationId,
    (newVal) => {
      if (newVal) {
        controller.fetchApplication(newVal)
      }
    }
  )

  watch(
    autoSaveAlertRef,
    (newVal) => {
      controller.setAutoSaveAlertRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.isShowing,
    (newVal) => {
      controller.setIsShowing(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
  @use "~/assets/scss/components/Services/BankAccountOpening" as *;
</style>
