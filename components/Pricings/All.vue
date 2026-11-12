<template>
  <div id="pricings-all">
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
      <div class="pricings">
        <div
          class="pricing"
          v-for="(pricing, index) in controller.tableDataFetcher.value.data"
        >
          <div class="name-price">
            <div class="service-name">
              {{ pricing.serviceName }}
            </div>
            <div class="service-price">
              {{ controller.grandTotalLabel }}: RM {{ controller.getGrandTotal(pricing) }}
            </div>
            <div
              class="service-price-details"
              v-if="controller.hasPricingBreakdowns(pricing)"
            >
              <div class="service-price-detail">
                <div class="item"></div>
                <div class="price"><b>RM</b></div>
              </div>
              <div
                class="service-price-detail"
                v-for="(detail, index) in controller.getPricingDetails(pricing)"
              >
                <div class="item">{{ detail.name }}</div>
                <div class="price">{{ detail.formattedPrice }}</div>
              </div>
              <div
                class="optional-title"
                v-if="controller.hasPricingOptionalDetails(pricing)"
              >
                <b>Other Requirements / Optionals</b>
              </div>
              <div
                class="service-price-detail optional"
                v-for="(detail, index) in controller.getPricingOptionalDetails(pricing)"
              >
                <div class="item">{{ detail.name }}</div>
                <div class="price">{{ detail.formattedPrice }}</div>
              </div>
              <div
                class="service-price-configuration"
                v-for="(detail, index) in controller.getConfigurationDetails(pricing)"
                :class="{ first: index === 0 && controller.hasPricingDetails(pricing) }"
              >
                <div class="item">{{ detail.name }}</div>
                <div class="price">{{ detail.formattedPrice }}</div>
              </div>
            </div>
          </div>
          <div class="action-buttons">
            <button class="btn btn-submit btn-pill">View</button>
            <button class="btn btn-danger btn-pill">Remove</button>
          </div>
        </div>
      </div>
      <TablePagination
        v-bind="controller.tablePaginationProps"
        @go-to-page="controller.tableDataFetcher.value.goToPage($event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import NoRecord from "../Placeholders/NoRecord.vue"
  import TablePagination from "~/components/Paginations/TablePagination.vue"
  import { AllController } from "~/scripts/components/pricings/AllController"
  import { NumberUtil } from "~/scripts/utils/Number"

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
  @use "~/assets/scss/components/Pricings/All" as *;
</style>
