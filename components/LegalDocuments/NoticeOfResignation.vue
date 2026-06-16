<template>
  <div id="legal-document-notice-of-resignation">
    <div
      class="paper-wrapper"
      ref="documentRef"
    >
      <div
        class="paper print legal-document notice-of-resignation"
        :class="controller.paperOrientation"
      >
        <div
          v-if="props.showWatermark"
          class="document-watermark"
          :class="{ preview: controller.isInPreviewMode.value }"
        >
          <div class="watermark-text">
            {{ props.watermarkText }}
          </div>
        </div>
        <div
          class="document-date"
          :class="{ placeholder: !controller.hasDocumentDate() }"
        >
          {{ controller.dateOfSubmission() }}
        </div>
        <div class="recipient">
          <div class="recipient-name">The Board of Directors</div>
          <div class="company-name">
            {{ controller.company.value.getFullName() }}
          </div>
          <div
            class="address"
            v-html="controller.registeredAddress()"
          />
        </div>
        <div class="greeting">Dear Directors,</div>
        <div class="letter-title">
          RESIGNATION AS DIRECTOR OF {{ controller.company.value.getFullName().toUpperCase() }} (COMPANY)
        </div>
        <div class="letter-content">
          <p>
            I, {{ controller.application.value.resigningDirectorName().toUpperCase() }},
            {{ controller.application.value.resigningDirectorIdentificationType() }}
            No: {{ controller.application.value.resigningDirectorIdentificationNo() }}, hereby give written notice of my
            resignation as Director in the Company pursuant to Section 208(2) of the Companies Act 2016.
          </p>
          <p>
            My resignation shall take effect
            <span v-if="!controller.isDocumentEditable()">{{ controller.selectedEffectType() }} on this Notice.</span>
          </p>
          <div
            v-if="controller.isDocumentEditable()"
            class="form-check"
            v-for="(type, index) in controller.effectTypes()"
            :key="index"
          >
            <input
              type="checkbox"
              class="form-check-input"
              :checked="type.isSelected"
              @click="controller.onTypeClick(type.value as string)"
              :disabled="props.isInPreviewMode"
            />
            <label>{{ type.label }}</label>
          </div>
          <p>I confirm that this resignation is tendered voluntarily.</p>
          <p>
            Please update the Register of Directors and lodge the necessary notification with the Companies Commission
            of Malaysia (SSM) in accordance with Sections 57 and 58 of the Act.
          </p>
          <p>Thank you.</p>
        </div>
        <div class="letter-sign-off">
          <div class="sign-off-title">Yours faithfully,</div>
          <Signature
            :signature-item="controller.signatureItem.value"
            @signed="emit('signed', $event)"
          />
        </div>
        <div class="paper-page-number">Page 1 of 1</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Signature from "../Signatures/Signature.vue"
  import { NoticeOfResignationController } from "~/scripts/components/legal-documents/NoticeOfResignationController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    directorId: {
      type: String,
      required: true,
    },
    applicationId: {
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
    isInPreviewMode: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(["update", "signed"])

  const documentRef = ref(null)

  const controller = new NoticeOfResignationController(
    props.companyId,
    props.directorId,
    props.applicationId,
    props.isInPreviewMode,
    emit
  )

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    () => props.directorId,
    (newVal) => {
      controller.setDirectorId(newVal)
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
    documentRef,
    (newVal) => {
      if (newVal) {
        controller.setDocumentRef(newVal)
      }
    },
    { immediate: true }
  )

  defineExpose({
    getData: controller.getData.bind(controller),
    getLetterPdfElements: controller.getLetterPdfElements.bind(controller),
    totalPages: controller.totalPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/NoticeOfResignation" as *;
</style>
