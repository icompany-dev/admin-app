<template>
  <div id="legal-documents-nomination-of-auditor">
    <Paper
      :total-pages="1"
      :page-number="1"
      :additional-css-class="'legal-document auditor-nomination-letter'"
      :show-page-number="true"
    >
      <template #paperContent>
        <div v-if="controller.isLoading.value">
          <LoaderPrepare
            :label="controller.loaderLabel"
            :sublabel="controller.loaderSublabel"
          />
        </div>
        <div v-if="!controller.isLoading.value">
          <div
            class="company-letter-header"
            v-html="controller.letterHeader.value"
          />
          <div
            class="letter-title"
            v-html="controller.letterTitle.value"
          />
          <div
            class="letter-content"
            v-html="controller.letterContent.value"
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
  import Paper from "@/components/Papers/Paper.vue"
  import Signature from "@/components/Signatures/Signature.vue"
  import { NominationOfAuditorController } from "~/scripts/components/legal-documents/NominationOfAuditorController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: String,
      default: "",
    },
    isInPreviewMode: {
      type: Boolean,
      default: false,
    },
  })
  const emit = defineEmits(["signed"])

  const controller = new NominationOfAuditorController(
    props.companyId,
    props.applicationId,
    props.isInPreviewMode,
    emit
  )

  defineExpose({
    setApplicationData: controller.setApplicationData.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/NominationOfAuditor" as *;
</style>
