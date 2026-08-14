<template>
  <div id="dcr-bank-account-opening-maybank">
    <Paper
      v-for="(page, index) in controller.pages.value"
      :paper-orientation="PaperOrientation.Portrait"
      :additional-css-class="'resolution'"
      :total-pages="controller.totalPages()"
      :page-number="index + 1"
      :show-ear-mark="true"
      :ear-mark-text="'DCR'"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
    >
      <template #paperContent>
        <div
          class="company-detail-head"
          :class="{ 'maybank-other-pages': index > 0 }"
        >
          <div class="company-name">
            {{ controller.companyName() }}
          </div>
          <div class="company-registration-number">
            [Company No: {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})]
          </div>
          <div v-if="index === 0">
            ("Company")
            <br />
            <br />
            (Incorporated in Malaysia)
          </div>
        </div>
        <div
          class="resolution-title"
          :class="{ 'maybank-other-pages': index > 0 }"
        >
          <span v-if="index === 0">
            {{ controller.resolutionTitle() }}
          </span>
          <span v-if="index > 0">
            (Directors’ Resolution in Writing Re: Opening of bank Account with Malayan Banking Berhad/ Maybank Islamic
            Berhad – cont’d)
          </span>
        </div>
        <div class="resolution-content">
          <div v-html="page" />
        </div>
        <div
          class="signature-section"
          v-if="index + 1 >= controller.signatureStartOnPage.value"
        >
          <div class="signature-title">
            {{ controller.signatureTitle() }}
          </div>
          <div
            class="signature-item"
            v-for="(signatureItem, i) in controller.getSignatureOnCurrentPage(index + 1)"
            :key="index"
          >
            <Signature
              :signature-item="signatureItem"
              :is-tinted="true"
              :tint-label="'Wet Ink Required'"
              @is-enlarged="controller.handleEnlargedSignaturePad($event)"
              @signed="emit('signed', $event)"
            />
          </div>
        </div>
      </template>
    </Paper>
    <Paper
      v-for="(page, index) in controller.pageRangeForSignatures()"
      :paper-orientation="PaperOrientation.Portrait"
      :additional-css-class="'resolution'"
      :total-pages="controller.totalPages()"
      :page-number="page"
      :show-ear-mark="true"
      :ear-mark-text="'DCR'"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
    >
      <template #paperContent>
        <div class="company-detail-head maybank-other-pages">
          <div class="company-name">
            {{ controller.companyName() }}
          </div>
          <div class="company-registration-number">
            [Company No: {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})]
          </div>
        </div>
        <div class="resolution-title maybank-other-pages">
          (Directors’ Resolution in Writing Re: Opening of bank Account with Malayan Banking Berhad/ Maybank Islamic
          Berhad – cont’d)
        </div>
        <div class="signature-section">
          <div
            class="signature-item"
            v-for="(signatureItem, i) in controller.getSignatureOnCurrentPage(page)"
            :key="index"
          >
            <Signature
              :signature-item="signatureItem"
              :is-tinted="true"
              :tint-label="'Wet Ink Required'"
              @is-enlarged="controller.handleEnlargedSignaturePad($event)"
              @signed="emit('signed', $event)"
            />
          </div>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script setup lang="ts">
  import Paper from "@/components/Papers/Paper.vue"
  import Signature from "../Signatures/Signature.vue"
  import { DcrBankAccountOpeningMaybankController } from "~/scripts/components/resolutions/DcrBankAccountOpeningMaybankController"
  import { PaperOrientation } from "~/scripts/constants/Paper"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: [String, null],
      default: null,
    },
    showWatermark: {
      type: Boolean,
      default: false,
    },
    watermarkText: {
      type: String,
      default: "DRAFT",
    },
    isInPreviewMode: {
      type: Boolean,
      default: true,
    },
    bankId: {
      type: String,
      default: "",
    },
  })

  const resolutionContent = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const controller = new DcrBankAccountOpeningMaybankController(
    props.companyId,
    props.applicationId,
    null,
    props.isInPreviewMode,
    props.showWatermark,
    props.watermarkText,
    emit,
    props.bankId
  )

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
      controller.setContent()
    }
  )

  watch(
    resolutionContent,
    (newVal) => {
      if (newVal) {
        controller.setResolutionContentRef(newVal)
      }
    },
    { immediate: true }
  )

  watch(
    () => props.showWatermark,
    (newVal) => {
      controller.setShowWatermark(newVal)
    }
  )

  watch(
    () => props.watermarkText,
    (newVal) => {
      controller.setWatermarkText(newVal)
    }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/BankAccountOpening" as *;
</style>
