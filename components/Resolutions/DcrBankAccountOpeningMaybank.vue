<template>
  <div
    id="dcr-bank-account-opening-maybank"
    ref="documentRef"
  >
    <Paper
      v-for="(page, index) in controller.pages.value"
      :paper-orientation="PaperOrientation.Portrait"
      :additional-css-class="'resolution dcr-bank-account-opening-maybank'"
      :total-pages="controller.totalPages()"
      :page-number="index + 1"
      :show-ear-mark="true"
      :ear-mark-text="'DCR'"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
    >
      <template #paperContent>
        <div class="company-detail-head">
          <div class="company-name">
            {{ controller.companyName() }}
          </div>
          <div class="company-registration-number">
            Company No: {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
          </div>
          <div>
            (Incorporated in Malaysia)
            <br />
            <div v-if="props.isShowCompanyAddress">
              <br />
              <div v-html="controller.companyAddressMultiline()" />
            </div>
            <br />
            (also refered to as the
            <b>“Company”</b>
            )
          </div>
        </div>
        <div class="resolution-title">
          <span
            v-if="index === 0"
            v-html="controller.resolutionTitleRef.value"
          />
          <span v-if="index > 0">{{ controller.otherPageTitle }}</span>
        </div>
        <div class="resolution-content">
          <div v-html="page" />
        </div>
        <div
          class="signature-section"
          v-if="index + 1 >= controller.signatureStartOnPage.value"
        >
          <div
            class="signature-title"
            v-if="controller.maxSignatureOnFirstPage.value > 0"
          >
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

        <div
          class="resolution-date"
          v-if="index + 1 === controller.totalPages()"
        >
          Dated:
          <br />
          <span class="date">
            {{ controller.documentDate }}
          </span>
        </div>
      </template>
    </Paper>
    <Paper
      v-for="(page, index) in controller.pageRangeForSignatures()"
      :paper-orientation="PaperOrientation.Portrait"
      :additional-css-class="'resolution dcr-bank-account-opening-maybank'"
      :total-pages="controller.totalPages()"
      :page-number="page"
      :show-ear-mark="true"
      :ear-mark-text="'DCR'"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
    >
      <template #paperContent>
        <div class="company-detail-head">
          <div class="company-name">
            {{ controller.companyName() }}
          </div>
          <div class="company-registration-number">
            [Company No: {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})]
          </div>
          <div>
            (Incorporated in Malaysia)
            <br />
            <div v-if="props.isShowCompanyAddress">
              <br />
              <div v-html="controller.companyAddressMultiline()" />
            </div>
            <br />
            (also refered to as the
            <b>“Company”</b>
            )
          </div>
        </div>
        <div class="resolution-title">
          (Directors’ Resolution in Writing Re: Opening of bank Account with Malayan Banking Berhad/ Maybank Islamic
          Berhad – cont’d)
        </div>
        <div class="signature-section">
          <div
            class="signature-title"
            v-if="controller.maxSignatureOnFirstPage.value <= 0 && index === 0"
          >
            {{ controller.signatureTitle() }}
          </div>
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

        <div
          class="resolution-date"
          v-if="page === controller.totalPages()"
        >
          Dated:
          <br />
          <span class="date">
            {{ controller.documentDate }}
          </span>
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
    isShowCompanyAddress: {
      type: Boolean,
      default: true,
    },
  })

  const resolutionContent = ref(null)
  const documentRef = ref(null)

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
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
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

  watch(
    () => controller.resolutionTitleRef.value,
    async (newVal) => {
      console.log("changed")

      await nextTick()
      controller.attachEventListeners()
    }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/BankAccountOpening" as *;
</style>
