<template>
  <div id="pricings-services">
    <Teleport to="body">
      <div
        class="drawer drawer-pricing-services"
        :class="{ show: controller.isShowing.value }"
        @click.self="controller.hide()"
      >
        <Transition name="slide-left-leave-right">
          <div
            class="drawer-wrapper"
            v-if="controller.isShowing.value"
          >
            <div class="drawer-title">{{ controller.heading }}</div>
            <div class="drawer-content">
              <div
                class="loader-container"
                v-if="controller.tableDataFetcher.value.isLoading"
              >
                <LoaderPrepare
                  :label="controller.loaderLabel"
                  :sublabel="controller.loaderSublabel"
                />
              </div>
              <template v-if="!controller.tableDataFetcher.value.isLoading">
                <div class="services-list">
                  <div class="search-container">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Search by Keyword"
                      v-model="controller.searchText.value"
                      @input="controller.onSearchTextInput()"
                    />
                    <button
                      class="btn btn-submit invert"
                      @click="controller.onCreateNew()"
                    >
                      Create Service
                    </button>
                  </div>
                  <div
                    id="services-container"
                    class="services"
                  >
                    <div
                      class="service"
                      v-for="(servicePricing, i) in controller.dataOnPage"
                    >
                      <div class="service-name">
                        <div class="name">#{{ controller.getIndex(i) }} {{ servicePricing.serviceName }}</div>
                        <div
                          class="clickable edit"
                          @click="controller.onEditClicked(servicePricing)"
                        >
                          <i class="fa-regular fa-edit" />
                        </div>
                      </div>
                      <Pricing v-bind="controller.getPropsPricing(servicePricing)" />
                    </div>
                  </div>
                </div>
                <TablePagination
                  v-bind="controller.tablePaginationProps"
                  @go-to-page="controller.onGoToPage($event)"
                />
              </template>
            </div>
          </div>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Pricing from "./Pricing.vue"
  import TablePagination from "../Paginations/TablePagination.vue"
  import { ServicesController } from "~/scripts/components/pricings/ServicesController"

  const props = defineProps({})

  const emit = defineEmits(["edit", "create"])

  const controller = new ServicesController(emit)

  defineExpose({
    show: controller.show.bind(controller),
    hide: controller.hide.bind(controller),
    handlePostCreateUpdate: controller.handlePostCreateUpdate.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Pricings/Services" as *;
</style>
