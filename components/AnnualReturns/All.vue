<template>
  <div id="annual-returns-all">
    <LoaderPrepare
      v-if="controller.tableDataFetcher.value.isLoading"
      :label="controller.loaderLabel"
      :sublabel="controller.loaderSublabel"
    />
    <div v-if="!controller.tableDataFetcher.value.isLoading">
      <NoRecord
        v-if="controller.tableDataFetcher.value.data.length === 0"
        :title="controller.noRecordTitle"
        :subtitle="controller.noRecordSubtitle"
      />
      <div class="sdn-bhd-container">
        <TransitionGroup name="fade">
          <template v-if="!controller.isShowSelectedSdnBhd">
            ////
            <TablePagination
              v-bind="controller.tablePaginationProps"
              @go-to-page="controller.tableDataFetcher.value.goToPage($event)"
            />
          </template>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import NoRecord from "../Placeholders/NoRecord.vue"
  import TablePagination from "~/components/Paginations/TablePagination.vue"
  import { AllController } from "~/scripts/components/annual-returns/AllController"

  const props = defineProps({})

  const emit = defineEmits([])

  const controller = new AllController(emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/AnnualReturns/All" as *;
</style>
