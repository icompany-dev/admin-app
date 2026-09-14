<template>
  <div id="companies-directors">
    <LoaderPrepare
      v-if="controller.isLoading.value"
      :label="controller.loaderLabel"
      :sublabel="controller.loaderSublabel"
    />
    <div
      v-if="!controller.isLoading.value"
      class="companies-documents"
    >
      <NoRecord
        v-if="controller.tableDataFetcher.value.data.length === 0"
        :title="controller.noRecordTitle"
        :subtitle="controller.noRecordSubtitle"
      />
      <div class="sdn-bhd-container">
        <div class="directors">
          <div
            class="director-details"
            v-for="(director, index) in controller.tableDataFetcher.value.data"
            @click="controller.onDirectorSelected(director.id)"
          >
            <div class="director-name">
              {{ director.user?.name }}
            </div>
            <div class="company-name">
              {{ director.company?.getFullName() }}
            </div>
          </div>
        </div>
        <TablePagination
          v-bind="controller.tablePaginationProps"
          @go-to-page="controller.tableDataFetcher.value.goToPage($event)"
        />
      </div>
      <TransitionGroup name="slide-left">
        <div
          class="document-in-view"
          v-if="controller.isShowSelectedSdnBhd"
        >
          <Section201ForDirectorService :application-id="controller.selectedDirectorId.value" />
          <!-- <button
            class="btn btn-submit"
            @click="controller.onDownloadAll()"
          >
            <i
              class="fa-regular fa-spin fa-spinner"
              v-if="controller.isGeneratingPdf.value"
            />
            Generate for All
          </button> -->
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import NoRecord from "../Placeholders/NoRecord.vue"
  import Section201ForDirectorService from "../CompanyServices/Section201ForDirectorService.vue"
  import TablePagination from "~/components/Paginations/TablePagination.vue"
  import { DirectorsController } from "~/scripts/components/companies/DirectorsController"

  const props = defineProps({
    searchText: {
      type: String,
      default: null,
    },
    sortOrder: {
      type: String,
      default: null,
    },
    isIncludeDemo: {
      type: Boolean,
      default: false,
    },
    isUnselectSdnBhd: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits([])

  const controller = new DirectorsController(emit)

  watch(
    () => props.searchText,
    (newVal) => {
      controller.setSearch(newVal)
    }
  )

  watch(
    () => props.sortOrder,
    (newVal) => {
      controller.setSortOrder(newVal)
    }
  )

  watch(
    () => props.isIncludeDemo,
    (newVal) => {
      controller.setIsIncludeDemo(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/Directors" as *;
</style>
