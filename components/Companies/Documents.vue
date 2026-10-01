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
      v-if="!controller.isLoading.value"
      class="company-documents-container"
    >
      <div class="container-header">
        {{ controller.resolutionsLabel }}
      </div>
      <div
        class="small-no-record"
        v-if="controller.resolutions.length <= 0"
      >
        <NoRecord
          :title="controller.getNoRecordTitle('Resolutions')"
          :is-show-subtitle="false"
        >
          <template #cta>
            <div class="content">
              {{ controller.getNoRecordSubtitle("Resolutions") }}
              <Tooltip
                :title="controller.getNoRecordTitle('Resolutions')"
                :content="controller.noRecordTooltipDetails"
              >
                <template #trigger>
                  <i class="fa-solid fa-circle-info" />
                </template>
              </Tooltip>
            </div>
          </template>
        </NoRecord>
      </div>
      <div class="documents is-grid-mode">
        <div
          v-for="(companyDocument, index) in controller.resolutions"
          class="document is-visible"
        >
          <CompanyDocument v-bind="controller.getPropsDocument(companyDocument)" />
        </div>
      </div>
      <div class="container-header">
        {{ controller.statutoryFormsLabel }}
      </div>
      <div
        class="small-no-record"
        v-if="controller.statutoryForms.length <= 0"
      >
        <NoRecord
          :title="controller.getNoRecordTitle('Statutory Forms')"
          :is-show-subtitle="false"
        >
          <template #cta>
            <div class="content">
              {{ controller.getNoRecordSubtitle("Statutory Forms") }}
              <Tooltip
                :title="controller.getNoRecordTitle('Statutory Forms')"
                :content="controller.noRecordTooltipDetails"
              >
                <template #trigger>
                  <i class="fa-solid fa-circle-info" />
                </template>
              </Tooltip>
            </div>
          </template>
        </NoRecord>
      </div>
      <div class="documents is-grid-mode">
        <div
          v-for="(companyDocument, index) in controller.statutoryForms"
          class="document is-visible"
        >
          <CompanyDocument v-bind="controller.getPropsDocument(companyDocument)" />
        </div>
      </div>
      <div class="container-header">
        {{ controller.otherDocumentsLabel }}
      </div>
      <div
        class="small-no-record"
        v-if="controller.others.length <= 0"
      >
        <NoRecord
          :title="controller.getNoRecordTitle('Documents')"
          :is-show-subtitle="false"
        >
          <template #cta>
            <div class="content">
              {{ controller.getNoRecordSubtitle("documents") }}
              <Tooltip
                :title="controller.getNoRecordTitle('Documents')"
                :content="controller.noRecordTooltipDetails"
              >
                <template #trigger>
                  <i class="fa-solid fa-circle-info" />
                </template>
              </Tooltip>
            </div>
          </template>
        </NoRecord>
      </div>
      <div class="documents">
        <div
          v-for="(companyDocument, index) in controller.others"
          class="document is-visible"
        >
          <CompanyDocument v-bind="controller.getPropsDocument(companyDocument)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "~/components/Loaders/Prepare.vue"
  // import ViewDocument from "./ViewDocument.vue"
  import CompanyDocument from "@/components/Documents/CompanyDocument.vue"
  // import PaginationBubble from "@/components/Paginations/Bubbles.vue"
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import NoRecord from "../Placeholders/NoRecord.vue"
  // import Tooltip from "../Tooltips/Tooltip.vue"
  import { DocumentsController } from "~/scripts/components/companies/DocumentsController"
  import type { IPropsCompanyDocument } from "~/scripts/props/PropsCompanyDocument"

  const props = defineProps<IPropsCompanyDocument>()

  const emit = defineEmits([])

  const controller = new DocumentsController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/Documents" as *;
</style>
