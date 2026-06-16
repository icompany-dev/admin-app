<template>
  <div id="appendix-a-bank-account-opening-affin">
    <Paper :paper-orientation="PaperOrientation.Portrait" :additional-css-class="'print legal-document'"
      :total-pages="1" :page-number="1" :show-ear-mark="false" :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText">
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
          <div class="content" v-html="controller.resolutionContent.value" />
        </div>
      </template>
    </Paper>
  </div>
</template>

<script setup lang="ts">
import Paper from '../Papers/Paper.vue'
import { AppendixABankAccountOpeningAffinController } from '~/scripts/components/legal-documents/AppendixABankAccountOpeningAffinController'
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
  showWatermark: {
    type: Boolean,
    default: false
  },
  watermarkText: {
    type: String,
    default: 'DRAFT'
  },
})

const emit = defineEmits(['startLoading', 'doneLoading'])

const controller = new AppendixABankAccountOpeningAffinController(
  props.companyId,
  props.applicationId,
  props.isInPreviewMode,
  emit
)

watch(() => props.applicationId, (newVal) => {
  controller.setApplicationId(newVal)
})

watch(() => props.isInPreviewMode, (newVal) => {
  controller.setIsInPreviewMode(newVal)
  controller.setContent()
})

watch(() => controller.resolutionContent.value, async () => {
  await nextTick()
  controller.attachEventListeners()
}, { immediate: true })

defineExpose({
  totalPages: controller.totalPages.bind(controller),
  updateApplicationContent: controller.updateApplicationContent.bind(controller),
  getSignatories: controller.getSignatories.bind(controller),
  getAuthorisedPersonsForOnlineBanking: controller.getAuthorisedPersonsForOnlineBanking.bind(controller)
})
</script>

<style lang="scss">
@use '~/assets/scss/components/LegalDocuments/BankAccountOpeningAffin' as *;
</style>