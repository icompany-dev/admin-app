<template>
  <div id="companies-documents">
    <div
      class="loader-container"
      v-if="controller.isLoadingPage"
    >
      <LoaderPrepare
        :label="controller.loaderLabel"
        :sublabel="controller.loaderSublabel"
      />
    </div>
    <div
      v-if="!controller.isLoadingPage"
      class="company-documents-container"
    >
      <div class="container-header">
        {{ controller.resolutionsLabel }}
      </div>
      <div class="documents is-grid-mode">
        <div
          v-for="(companyDocument, index) in controller.resolutions"
          class="document is-visible"
        >
          <CompanyDocument
            v-bind="controller.getPropsDocument(companyDocument)"
            @is-selected-changed="controller.onSelectionChanged($event, companyDocument)"
            @is-viewing-document="controller.onDocumentClicked(companyDocument)"
          />
        </div>
        <div
          class="document is-visible empty-to-add"
          @click="controller.onUploadDocumentClicked()"
        >
          <i class="fa-solid fa-plus" />
        </div>
      </div>
      <div class="container-header">
        {{ controller.statutoryFormsLabel }}
      </div>
      <div class="documents is-grid-mode">
        <div
          v-for="(companyDocument, index) in controller.statutoryForms"
          class="document is-visible"
        >
          <CompanyDocument
            v-bind="controller.getPropsDocument(companyDocument)"
            @is-selected-changed="controller.onSelectionChanged($event, companyDocument)"
            @is-viewing-document="controller.onDocumentClicked(companyDocument)"
          />
        </div>
        <div
          class="document is-visible empty-to-add"
          @click="controller.onUploadDocumentClicked()"
        >
          <i class="fa-solid fa-plus" />
        </div>
      </div>
      <div class="container-header">
        {{ controller.otherDocumentsLabel }}
      </div>
      <div class="documents is-grid-mode">
        <div
          v-for="(companyDocument, index) in controller.others"
          class="document is-visible"
        >
          <CompanyDocument
            v-bind="controller.getPropsDocument(companyDocument)"
            @is-selected-changed="controller.onSelectionChanged($event, companyDocument)"
            @is-viewing-document="controller.onDocumentClicked(companyDocument)"
          />
        </div>
        <div
          class="document is-visible empty-to-add"
          @click="controller.onUploadDocumentClicked()"
        >
          <i class="fa-solid fa-plus" />
        </div>
      </div>
      <template v-if="controller.hasVouchersOrCerts">
        <div class="container-header">
          {{ controller.vouchersCertsLabel }}
        </div>
        <div class="documents is-grid-mode landscape">
          <div
            v-for="(companyDocument, index) in controller.vouchersAndCerts"
            class="document is-visible"
          >
            <CompanyDocument
              v-bind="controller.getPropsDocument(companyDocument)"
              :paper-orientation="PaperOrientation.Landscape"
              @is-selected-changed="controller.onSelectionChanged($event, companyDocument)"
              @is-viewing-document="controller.onDocumentClicked(companyDocument)"
            />
          </div>
          <div
            class="document is-visible empty-to-add"
            @click="controller.onUploadDocumentClicked()"
          >
            <i class="fa-solid fa-plus" />
          </div>
        </div>
      </template>
    </div>
    <Teleport to="body">
      <ViewDocument
        ref="viewDocumentRef"
        :pdf-url="controller.pdfUrlToView.value"
        @hide="controller.onHideViewDocument()"
      />
      <ActionTray
        :actions="controller.actionTrayElements"
        :is-lock-position="true"
      />
      <UploadDocument
        ref="uploadDocumentRef"
        v-bind="controller.uploadDocumentProps"
        @proceed="controller.postUploadDocument()"
      />
      <EditFilenames
        ref="editFilenamesRef"
        v-bind="controller.editFilenamesProps"
        @back="controller.onCancelUpdateFilenameClicked()"
        @proceed="controller.onCompleteUpdateFilename()"
      />
      <ConfirmToDelete
        ref="confirmDeleteRef"
        :remove-item-name="controller.removeItemName"
        @back="controller.onCancelDelete()"
        @proceed="controller.onProceedDelete()"
      />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import ConfirmToDelete from "../Popups/ConfirmToDelete.vue"
  import LoaderPrepare from "~/components/Loaders/Prepare.vue"
  import ViewDocument from "@/components/Documents/ViewDocument.vue"
  import CompanyDocument from "@/components/Documents/CompanyDocument.vue"
  import EditFilenames from "../Popups/EditFilenames.vue"
  // import PaginationBubble from "@/components/Paginations/Bubbles.vue"
  import NoRecord from "../Placeholders/NoRecord.vue"
  // import Tooltip from "../Tooltips/Tooltip.vue"
  import UploadDocument from "../Popups/UploadDocument.vue"
  import { DocumentsController } from "~/scripts/components/companies/DocumentsController"
  import type { IPropsCompanyDocument } from "~/scripts/props/PropsCompanyDocument"
  import { PaperOrientation } from "~/scripts/constants/Paper"

  const props = defineProps<IPropsCompanyDocument>()

  const emit = defineEmits([])

  const uploadDocumentRef = ref(null)
  const viewDocumentRef = ref(null)
  const editFilenamesRef = ref(null)
  const confirmDeleteRef = ref(null)

  const controller = new DocumentsController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )

  watch(
    uploadDocumentRef,
    (newVal) => {
      controller.setUploadDocumentRef(newVal)
    },
    { immediate: true }
  )

  watch(
    viewDocumentRef,
    (newVal) => {
      controller.setViewDocumentRef(newVal)
    },
    { immediate: true }
  )

  watch(
    editFilenamesRef,
    (newVal) => {
      controller.setEditFilenamesRef(newVal)
    },
    { immediate: true }
  )

  watch(
    confirmDeleteRef,
    (newVal) => {
      controller.setConfirmDeleteRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/Documents" as *;
</style>
