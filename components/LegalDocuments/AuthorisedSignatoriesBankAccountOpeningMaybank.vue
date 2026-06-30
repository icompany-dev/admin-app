<template>
  <div id="authorised-signatories-bank-account-opening-maybank">
    <Paper
      v-if="controller.isLoading.value"
      :paper-orientation="PaperOrientation.Portrait"
      :total-pages="1"
      :page-number="1"
      :show-ear-mark="false"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
      :is-loader="true"
    >
      <template #paperContent>
        <LoaderPrepare
          :label="controller.loaderLabel()"
          :sublabel="controller.loaderSublabel()"
        />
      </template>
    </Paper>
    <Paper
      v-if="!controller.isLoading.value"
      :paper-orientation="PaperOrientation.Portrait"
      :additional-css-class="'print legal-document'"
      :total-pages="1"
      :page-number="1"
      :show-ear-mark="false"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
    >
      <template
        v-if="controller.isDocumentEditable() && props.isShowTags"
        #paperMargins
      >
        <div class="paper-tag select-branch"><span>Insert Information</span></div>
        <div class="paper-tag signatory-type"><span>Insert Information</span></div>
      </template>
      <template #paperContent>
        <div class="letter-head company-details align-center">
          <div class="name">
            {{ controller.companyName() }}
          </div>
          <div class="registration-number">
            Company No. {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
          </div>
          <div class="company-incorporated-in">(Incorporated in Malaysia)</div>
          <div>(the "Company")</div>
        </div>
        <div class="document-content">
          <div
            class="content"
            v-html="controller.resolutionContent.value"
          />
          <div class="signature-section">
            <Signature
              :signature-item="controller.signatureItem.value"
              :is-tinted="true"
              :tint-label="'WET INK REQUIRED'"
              @signed="emit('signed', $event)"
            />
          </div>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script setup lang="ts">
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "../Papers/Paper.vue"
  import Signature from "~/components/Signatures/Signature.vue"
  import { AuthorisedSignatoriesBankAccountOpeningMaybankController } from "~/scripts/components/legal-documents/AuthorisedSignatoriesBankAccountOpeningMaybankController"
  import { PaperOrientation } from "~/scripts/constants/Paper"
  import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: [String, null],
      default: null,
    },
    application: {
      type: [CompanyBankAccountOpening, null],
      default: null,
    },
    isInPreviewMode: {
      type: Boolean,
      default: true,
    },
    showWatermark: {
      type: Boolean,
      default: false,
    },
    watermarkText: {
      type: String,
      default: "DRAFT",
    },
    isShowTags: {
      type: Boolean,
      default: true,
    },
  })

  const documentContent = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed", "updated"])

  const controller = new AuthorisedSignatoriesBankAccountOpeningMaybankController(
    props.companyId,
    props.applicationId,
    props.isInPreviewMode,
    emit
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
      controller.setSignatureItem()
      controller.setContent()
    }
  )

  watch(
    () => controller.resolutionContent.value,
    async () => {
      await nextTick()
      controller.attachEventListeners()
    },
    { immediate: true }
  )

  watch(
    () => props.application,
    (newVal) => {
      if (!newVal) {
        return
      }

      controller.updateApplicationData(newVal)
    },
    { deep: true }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    getBranchId: controller.getBranchId.bind(controller),
    getSignatories: controller.getSignatories.bind(controller),
    getSignatoryType: controller.getSignatoryType.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/BankAccountOpeningMaybank" as *;
</style>
