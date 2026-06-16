<template>
  <div
    ref="declarationRef"
    id="company-no-constitution-declaration"
  >
    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :is-use-letter-head="controller.isPaid()"
      :additional-css-class="controller.paperClasses()"
      :show-page-number="true"
      :total-pages="1"
      :page-number="1"
    >
      <template #paperContent>
        <div class="document-date">Date: {{ controller.documentDate() }}</div>
        <div
          class="letter-title"
          @click="controller.onTitleClicked($event)"
        >
          <p v-html="controller.declarationTitle.value" />
        </div>
        <div class="letter-content">
          <p v-html="controller.declarationContent.value" />
        </div>
        <div class="letter-sign-off">
          <div class="sign-off-title">Yours faithfully,</div>
          <div class="signature-image">
            <img
              v-if="controller.isPaid()"
              src="https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/signatures/cosec-signature.png"
            />
          </div>
          <div class="cosec-name">
            {{ SecretaryInformation.SECRETARY_NAME }}
            <br />
            <span class="cosec-role">Company Secretary</span>
          </div>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script setup lang="ts">
  import Paper from "../Papers/Paper.vue"
  import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"
  import { NoConstitutionDeclarationController } from "~/scripts/components/legal-documents/NoConstitutionDeclarationController"
  import { PaperOrientation } from "~/scripts/constants/Paper"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: String,
      default: null,
    },
    isInPreviewMode: {
      type: Boolean,
      default: true,
    },
  })

  const emit = defineEmits(["applicationLoaded"])

  const declarationRef = ref(null)

  const controller = new NoConstitutionDeclarationController(props.companyId, props.applicationId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
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
    }
  )

  watch(
    declarationRef,
    (newVal) => {
      controller.setDeclarationRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    getPaperElements: controller.getPaperElements.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/NoConstitutionDeclaration" as *;
</style>
