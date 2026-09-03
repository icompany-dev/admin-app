<template>
  <div id="companies-assign-cosec">
    <div
      v-if="!controller.isLoading.value"
      class="statistics"
    >
      <div
        class="statistic"
        @click="controller.onWithoutSignatureClicked()"
      >
        <div class="header">{{ controller.noSignaturesCompaniesLabel }}</div>
        <div class="statistic-counter">
          <VueCountUp
            class="statistic-count"
            :autoplay="true"
            :duration="3"
            :decimal-places="0"
            :start-val="0"
            :end-val="controller.totalWithoutSignatures.value"
          />
        </div>
      </div>
      <div
        class="statistic"
        @click="controller.onUnassignedStatusClicked()"
      >
        <div class="header">{{ controller.unassignedCompaniesLabel }}</div>
        <div class="statistic-counter">
          <VueCountUp
            class="statistic-count"
            :autoplay="true"
            :duration="3"
            :decimal-places="0"
            :start-val="0"
            :end-val="controller.totalUnassigned.value"
          />
        </div>
      </div>
      <div
        class="statistic"
        @click="controller.onAssignedStatusClicked()"
      >
        <div class="header">{{ controller.assignedCompaniesLabel }}</div>
        <div class="statistic-counter">
          <VueCountUp
            class="statistic-count"
            :autoplay="true"
            :duration="3"
            :decimal-places="0"
            :start-val="0"
            :end-val="controller.totalAssigned.value"
          />
        </div>
      </div>
    </div>
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
            :checked="controller.isCompanySelected(sdnbhd.id)"
            @click="controller.onCompanyCheckboxClicked(sdnbhd.id)"
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
            ref="documentRef"
            :company-id="controller.selectedCompanyId.value"
            :view-type="'new'"
          />
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
      </Transition>
    </div>
    <ActionInProgress
      ref="actionInProgressRef"
      v-bind="controller.actionInProgressProps"
    />
    <ActionTray
      v-if="!controller.tableDataFetcher.value.isLoading"
      :is-lock-position="true"
      :actions="controller.actionTrayElements"
    />
  </div>
</template>

<script lang="ts" setup>
  import ActionInProgress from "../Popups/ActionInProgress.vue"
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import NoRecord from "../Placeholders/NoRecord.vue"
  import AppointJointCompanySecretary from "../CompanyServices/AppointJointCompanySecretary.vue"
  import TablePagination from "~/components/Paginations/TablePagination.vue"
  import VueCountUp from "vue-countup-v3"
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

  const documentRef = ref(null)
  const actionInProgressRef = ref(null)

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

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  watch(
    actionInProgressRef,
    (newVal) => {
      controller.setActionInProgressRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    onCompanyUnselected: controller.onCompanyUnselected.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/AssignCosec" as *;
</style>
