<template>
  <div
    id="notice-removal-of-director"
    ref="documentRef"
  >
    <Paper
      v-if="controller.isLoading.value"
      :show-page-number="false"
      :is-loader="true"
    >
      <template #paperContent>
        <LoaderPrepare
          :label="controller.loaderLabel"
          :sublabel="controller.loaderSublabel"
        />
      </template>
    </Paper>
    <template v-if="!controller.isLoading.value">
      <Paper
        v-for="page in controller.signaturePages"
        :show-ear-mark="false"
        :show-watermark="props.showWatermark"
        :watermark-text="props.watermarkText"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="true"
        :page-number="page + 1"
        :total-pages="controller.totalPages"
      >
        <template #paperContent>
          <div
            class="notice-header"
            v-html="controller.documentHeader.value"
          />
          <div
            class="notice-subheader"
            v-if="page > 0"
          >
            (Continue from previous page)
          </div>
          <div
            class="notice-title"
            v-html="controller.documentTitle.value"
            v-if="page === 0"
          />
          <div
            class="notice-date"
            v-if="page === 0"
          >
            <b>Date:</b>
            &nbsp;
            <span v-html="controller.noticeDate" />
          </div>
          <div
            class="notice-content"
            v-html="controller.documentContent.value"
            v-if="page === 0"
          />
          <div class="signature-section">
            <div
              class="signature-title"
              v-if="page === 0"
            >
              SIGNED BY THE SHAREHOLDER{{ controller.shareholders.value.length > 1 ? "S" : "" }}:
            </div>
            <div class="signatures">
              <Signature
                v-for="(signatureItem, index) in controller.signatureOnPage(page)"
                :signature-item="signatureItem"
                @signed="emit('signed', $event)"
              />
            </div>
          </div>
        </template>
      </Paper>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import Signature from "@/components/Signatures/Signature.vue"
  import { NoticeRemovalOfDirectorController } from "~/scripts/components/legal-documents/NoticeRemovalOfDirectorController"

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

  const emit = defineEmits(["signed"])

  const documentRef = ref(null)

  const controller = new NoticeRemovalOfDirectorController(
    props.companyId,
    props.applicationId,
    props.isInPreviewMode,
    emit
  )

  watch(
    () => props.companyId,
    async (newVal) => {
      controller.companyId.value = newVal
      await controller.initializeCompanyData()
      controller.setSignatureItems()
      controller.setContent()
    }
  )

  watch(
    () => props.applicationId,
    async (newVal) => {
      await controller.setApplicationId(newVal ?? "")
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
      controller.setContent()
      controller.setSignatureItems()
    }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/NoticeRemovalOfDirector" as *;
</style>
