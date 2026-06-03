<template>
  <div id="companies-all">
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
        <SdnBhd
          v-for="(sdnbhd, index) in controller.tableDataFetcher.value.dataOnPage"
          :company="sdnbhd"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import NoRecord from "../Placeholders/NoRecord.vue"
  import SdnBhd from "@/components/Companies/SdnBhd.vue"
  import { AllController } from "~/scripts/components/companies/AllController"

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
      console.log("called??")
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
  @use "~/assets/scss/components/Companies/All" as *;
</style>
