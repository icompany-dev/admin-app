<template>
  <div id="declaration-bank-account-opening-maybank">
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
      :additional-css-class="'print legal-document maybank-declaration'"
      :total-pages="1"
      :page-number="1"
      :show-ear-mark="false"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
    >
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
          <div class="document-title">DECLARATION</div>
          <div
            class="content"
            v-html="controller.documentContent.value"
          />
          <div class="declaration-signature-section">
            <div class="signature-title">
              {{ controller.signatureTitle() }}
            </div>
            <div
              class="signature-item"
              v-for="(signatureItem, index) in controller.getSignatureOnPage(1)"
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
        </div>
      </template>
    </Paper>
  </div>
</template>

<script setup lang="ts">
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "../Papers/Paper.vue"
  import Signature from "~/components/Signatures/Signature.vue"
  import { DeclarationBankAccountOpeningMaybankController } from "~/scripts/components/legal-documents/DeclarationBankAccountOpeningMaybankController"
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
    isInPreviewMode: {
      type: Boolean,
      default: true,
    },
    bankId: {
      type: String,
      default: "",
    },
    showWatermark: {
      type: Boolean,
      default: false,
    },
    watermarkText: {
      type: String,
      default: "DRAFT",
    },
  })

  const documentContent = ref(null)

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const controller = new DeclarationBankAccountOpeningMaybankController(
    props.companyId,
    props.applicationId,
    props.isInPreviewMode,
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
      controller.setSignatureItems()
      controller.setContent()
    }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/BankAccountOpeningMaybank" as *;
</style>
