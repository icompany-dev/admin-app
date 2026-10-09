<template>
  <div id="announcements-all">
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
      <div
        class="announcement-container"
        v-if="controller.tableDataFetcher.value.data.length > 0"
      >
        <div
          class="announcement"
          v-for="(announcement, index) in controller.tableDataFetcher.value.data"
        >
          <div class="title">
            {{ announcement.name }}
          </div>
        </div>
        <TablePagination
          v-bind="controller.tablePaginationProps"
          @go-to-page="controller.tableDataFetcher.value.goToPage($event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import NoRecord from "../Placeholders/NoRecord.vue"
  import TablePagination from "~/components/Paginations/TablePagination.vue"
  import { AllController } from "~/scripts/components/announcements/AllController"

  const props = defineProps({
    searchText: {
      type: String,
      default: null,
    },
    sortOrder: {
      type: String,
      default: null,
    },
  })

  const emit = defineEmits([])

  const controller = new AllController(emit)

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
</script>

<style lang="scss">
  @use "~/assets/scss/components/Announcements/All" as *;
</style>
