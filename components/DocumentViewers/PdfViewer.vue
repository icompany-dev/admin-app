<template>
  <div
    id="pdf-viewer"
    :style="controller.getPdfViewerStyle()"
  >
    <div
      class="overlay"
      v-if="controller.isShowOverlay"
    >
      <NoRecord
        v-if="!props.addOverlayWithCta"
        :title="controller.noDocument"
        :subtitle="controller.noDocumentSubtitle"
      />
      <NoRecord
        v-if="props.addOverlayWithCta"
        :title="controller.noDocument"
        :subtitle="controller.noDocumentSubtitle"
      >
        <template #cta>
          <slot name="overlayTemplateCta" />
        </template>
      </NoRecord>
    </div>
    <div
      class="pdf-document-wrapper"
      :class="controller.getEnlargedClass()"
      :style="controller.getDocumentWrapperStyle()"
    >
      <div
        class="pdf-document-container"
        v-keyboard-click
        @click="controller.onDocumentClicked()"
        :class="controller.getEnlargedClass()"
      >
        <div
          id="pdf-canvases"
          class="pdf-canvases"
        >
          <canvas
            v-for="(page, index) in controller.numberOfPages.value"
            :key="page"
            :class="controller.canvasClass(index + 1)"
            :ref="
              (el) => {
                return controller.setPageCanvas(page, el as HTMLCanvasElement | null)
              }
            "
          />
        </div>
      </div>
    </div>
    <!-- <div
      class="pagination-container"
      v-if="controller.numberOfPages.value > 1 && controller.zoomLevel.value === 0 && !props.isShowFirstPageOnly"
    >
      <PaginationBubble
        :total-pages="controller.numberOfPages.value"
        :is-wrap-around="false"
        @go-to-page="controller.onGoToPage($event)"
      />
    </div>
    <div
      class="document-filter-container"
      v-if="props.showActionTray"
    >
      <PdfDocumentFilter
        :company-id="props.companyId"
        :pdf-url="controller.pdfUrl.value"
        :filename="props.filename"
        :can-email="props.canEmail"
        :can-download="props.canDownload"
        :can-certify="props.canCertify"
        :can-certify-ssm="props.canCertifySsm"
        :can-get-latest="props.canGetLatest"
        :i-company-file-id="props.iCompanyFileId"
        :my-data-file-id="props.myDataFileId"
        :total-pages="controller.numberOfPages.value"
        :show-learn-more="props.showLearnMore"
        :learn-more-title="props.learnMoreTitle"
        :learn-more-content="props.learnMoreContent"
        @pay="emit('pay', $event)"
        @certifySsmClicked="emit('certifySsmClicked', $event)"
        @certifyCosecCourierClicked="emit('certifyCosecCourierClicked', $event)"
        @certifyCosecEmailClicked="emit('certifyCosecEmailClicked', $event)"
        @purchaseLatestClicked="emit('purchaseLatestClicked', $event)"
      />
    </div> -->
  </div>
</template>

<script setup lang="ts">
  import NoRecord from "../Placeholders/NoRecord.vue"
  // import PdfDocumentFilter from "../DocumentFilters/PdfDocumentFilter.vue"
  // import PaginationBubble from "@/components/Paginations/Bubbles.vue"
  import { ref, onMounted } from "vue"
  import { PdfViewerController } from "~/scripts/components/document-viewers/PdfViewerController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    showActionTray: {
      type: Boolean,
      default: true,
    },
    canEmail: {
      type: Boolean,
      default: false,
    },
    canDownload: {
      type: Boolean,
      default: false,
    },
    canCertify: {
      type: Boolean,
      default: false,
    },
    canCertifySsm: {
      type: Boolean,
      default: false,
    },
    canGetLatest: {
      type: Boolean,
      default: false,
    },
    iCompanyFileId: {
      type: String,
      default: "",
    },
    myDataFileId: {
      type: String,
      default: "",
    },
    showLearnMore: {
      type: Boolean,
      default: false,
    },
    learnMoreTitle: {
      type: String,
      default: "",
    },
    learnMoreContent: {
      type: String,
      default: "",
    },
    isShowFirstPageOnly: {
      type: Boolean,
      default: false,
    },
    hasToShowOverlay: {
      type: Boolean,
      default: false,
    },
    overlayText: {
      type: String,
      default: "",
    },
    overlaySubtext: {
      type: String,
      default: "",
    },
    addOverlayWithCta: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits([
    "zoom",
    "pay",
    "certifySsmClicked",
    "certifyCosecCourierClicked",
    "certifyCosecEmailClicked",
    "purchaseLatestClicked",
  ])

  const pdfCanvasRef = ref<HTMLCanvasElement | null>(null)
  const controller = new PdfViewerController(
    props.pdfUrl,
    props.hasToShowOverlay,
    props.overlayText,
    props.overlaySubtext,
    emit
  )

  onMounted(async () => {
    if (pdfCanvasRef.value) {
      controller.setPdfCanvas(pdfCanvasRef.value)
    }

    if (props.pdfUrl.length > 0) {
      await controller.renderPdf()
    }
  })

  watch(pdfCanvasRef, (newVal) => {
    if (newVal) {
      controller.setPdfCanvas(newVal)
    }
  })

  watch(
    () => props.pdfUrl,
    async (newVal) => {
      controller.setPdfUrl(newVal)
      await controller.renderPdf()
    }
  )

  watch(
    () => props.hasToShowOverlay,
    (newVal) => {
      controller.setHasToShowOverlay(newVal)
    }
  )

  watch(
    () => props.overlayText,
    (newVal) => {
      controller.setOverlayText(newVal)
    }
  )

  watch(
    () => props.overlaySubtext,
    (newVal) => {
      controller.setOverlaySubtext(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/DocumentViewers/PdfViewer" as *;
</style>
