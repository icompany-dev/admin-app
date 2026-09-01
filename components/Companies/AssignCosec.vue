<template>
  <div id="companies-assign-cosec">
    <LoaderPrepare
      v-if="controller.tableDataFetcher.value.isLoading"
      :label="controller.loaderLabel"
      :sublabel="controller.loaderSublabel"
    />
    <div
      class="companies-document"
      v-if="!controller.tableDataFetcher.value.isLoading"
    >
      <NoRecord
        v-if="controller.tableDataFetcher.value.data.length === 0"
        :title="controller.noRecordTitle"
        :subtitle="controller.noRecordSubtitle"
      />
      <div class="sdn-bhd-container">
        <div
          class="form-check"
          v-for="(sdnbhd, index) in controller.tableDataFetcher.value.data"
        >
          <input
            type="checkbox"
            class="form-control form-check-input"
          />
          <div
            class="company-name"
            @click="controller.onCompanySelected(sdnbhd.id)"
          >
            {{ sdnbhd.getFullName() }}
            <div class="registration-numbers">
              {{ sdnbhd.registrationNumberNew }} ({{ sdnbhd.registrationNumberOld }})
            </div>
          </div>
        </div>
        <TablePagination
          v-bind="controller.tablePaginationProps"
          @go-to-page="controller.tableDataFetcher.value.goToPage($event)"
        />
      </div>
      <Transition class="slide-left">
        <div
          class="document-in-view"
          v-if="controller.isShowDocument"
        >
          <AppointJointCompanySecretary
            :company-id="controller.selectedCompanyId.value"
            :view-type="'new'"
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import NoRecord from "../Placeholders/NoRecord.vue"
  import SdnBhd from "@/components/Companies/SdnBhd.vue"
  import AppointJointCompanySecretary from "../CompanyServices/AppointJointCompanySecretary.vue"
  import TablePagination from "~/components/Paginations/TablePagination.vue"
  import { AssignCosecController } from "~/scripts/components/companies/AssignCosecController"

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

  const emit = defineEmits(["sdnbhdSelected"])

  const controller = new AssignCosecController(emit)

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

  watch(
    () => props.isUnselectSdnBhd,
    (newVal) => {
      if (newVal) {
        controller.onCompanyUnselected()
      }
    }
  )

  defineExpose({
    onCompanyUnselected: controller.onCompanyUnselected.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/AssignCosec" as *;
</style>
