<template>
  <div id="declaration-bank-account-opening-affin">
    <Paper :paper-orientation="PaperOrientation.Portrait"
      :additional-css-class="'print legal-document affin-declaration'" :total-pages="1" :page-number="1"
      :show-ear-mark="false" :show-watermark="props.showWatermark" :watermark-text="props.watermarkText">
      <template #paperContent>
        <div class="letter-head company-details align-center">
          <div class="name">
            {{ controller.companyName() }}
          </div>
          <div class="registration-number">
            Company No. {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
          </div>
          <div class="company-incorporated-in">
            (Incorporated in Malaysia)
          </div>
          <div>
            (the "Company")
          </div>
        </div>
        <div class="document-content">
          <div class="document-title">
            DECLARATION
          </div>
          <div class="content" v-html="controller.documentContent.value" />
          <div class="signature-section">
            <div class="signature-title">
              {{ controller.signatureTitle() }}
            </div>
            <div class="signature-item" v-for="(signatureItem, index) in controller.getSignatureOnPage(1)" :key="index">
              <Signature :signature-item="signatureItem" @is-enlarged="controller.handleEnlargedSignaturePad($event)"
                @signed="emit('signed', $event)" />
            </div>
          </div>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script setup lang="ts">
import Paper from '../Papers/Paper.vue'
import Signature from '~/components/Signatures/Signature.vue'
import { DeclarationBankAccountOpeningAffinController } from '~/scripts/components/legal-documents/DeclarationBankAccountOpeningAffinController'
import { PaperOrientation } from '~/scripts/constants/Paper'

const props = defineProps({
  companyId: {
    type: String,
    required: true
  },
  applicationId: {
    type: [String, null],
    default: null
  },
  isInPreviewMode: {
    type: Boolean,
    default: true
  },
  bankId: {
    type: String,
    default: ""
  },
  showWatermark: {
    type: Boolean,
    default: false
  },
  watermarkText: {
    type: String,
    default: 'DRAFT'
  },
})

const documentContent = ref(null)

const emit = defineEmits(['startLoading', 'doneLoading', 'signed'])

const controller = new DeclarationBankAccountOpeningAffinController(
  props.companyId,
  props.applicationId,
  props.isInPreviewMode,
  emit,
  props.bankId
)

watch(() => props.applicationId, (newVal) => {
  controller.setApplicationId(newVal)
})

watch(() => props.isInPreviewMode, (newVal) => {
  controller.setIsInPreviewMode(newVal)
  controller.setContent()
})

defineExpose({
  totalPages: controller.totalPages.bind(controller),
  updateApplicationContent: controller.updateApplicationContent.bind(controller)
})
</script>

<style lang="scss">
@use '~/assets/scss/components/LegalDocuments/BankAccountOpeningAffin' as *;
</style>