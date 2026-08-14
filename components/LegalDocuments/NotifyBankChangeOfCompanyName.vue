<template>
  <div id="legal-documents-notify-bank-change-of-company-name">
    <Paper
      v-if="controller.isLoading.value"
      :paper-orientation="controller.paperOrientation"
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
      :paper-orientation="controller.paperOrientation"
      :additional-css-class="'print legal-document notify-change-of-name'"
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
        <div class="paper-tag header-fields point-right"><span>Insert Information</span></div>
        <div class="paper-tag bank-account-number point-right"><span>Insert Information</span></div>
      </template>
      <template #paperContent>
        <div
          class="document-header"
          v-html="controller.documentHeader.value"
        />
        <div
          class="document-title"
          v-html="controller.documentTitle.value"
        />
        <div class="document-content">
          <div
            class="content"
            v-html="controller.documentContent.value"
          />
          <div class="signature-section">
            <Signature
              :signature-item="controller.signatureItem.value"
              @signed="emit('signed', $event)"
            />
          </div>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "../Papers/Paper.vue"
  import Signature from "~/components/Signatures/Signature.vue"
  import { NotifyBankChangeOfCompanyNameController } from "~/scripts/components/legal-documents/NotifyBankChangeOfCompanyNameController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    previousName: {
      type: String,
      required: true,
    },
    applicationId: {
      type: [String, null],
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

  const emit = defineEmits(["startLoading", "doneLoading", "signed", "updated"])

  const controller = new NotifyBankChangeOfCompanyNameController(
    props.companyId,
    props.applicationId,
    props.previousName,
    props.isInPreviewMode,
    emit
  )

  watch(
    () => props.companyId,
    async (newVal) => {
      await controller.setCompanyId(newVal)
      await controller.init()
    }
  )

  watch(
    () => props.previousName,
    (newVal) => {
      controller.setPreviousName(newVal)
    }
  )

  watch(
    () => props.applicationId,
    async (newVal) => {
      await controller.setApplicationId(newVal)
      controller.setContent()
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
      controller.setContent()
    }
  )
</script>
