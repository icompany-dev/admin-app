<template>
  <div id="pricings-all">
    <LoaderPrepare
      v-if="controller.isRetrievingData"
      :label="controller.loaderLabel"
      :sublabel="controller.loaderSublabel"
    />
    <div v-if="!controller.isRetrievingData">
      <!-- <NoRecord
        v-if="controller.tableDataFetcher.value.data.length === 0"
        :title="controller.noRecordTitle"
        :subtitle="controller.noRecordSubtitle"
      /> -->
      <div class="labels">
        <div
          class="label"
          v-for="(label, i) in controller.labels.value"
        >
          <div class="label-title">
            {{ label.name }}
          </div>
          <Transition name="fade">
            <div
              class="expanded-details"
              v-if="controller.isLabelExpanded(label)"
            >
              <div class="pricings">
                <div
                  class="pricing"
                  v-for="(price, i) in controller.getPricingsUnderLabel(label)"
                >
                  <div class="service-price-details">
                    <div class="service-price-detail">
                      <div class="item">{{ price.serviceName }}</div>
                      <div class="price">{{ price.serviceName }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="add-to-theme">+ Add Pricing</div>
            </div>
          </Transition>
          <div class="action-buttons">
            <button
              class="btn btn-danger"
              @click="controller.onRemoveLabel(label)"
            >
              Remove
            </button>
            <button
              class="btn btn-primary"
              @click="controller.onLabelClicked(label)"
            >
              {{ controller.isLabelExpanded(label) ? "Hide" : "Show" }} Details
            </button>
          </div>
        </div>
        <div
          class="label empty"
          :class="{ 'in-focus': controller.isAddingNewLabel.value }"
          @click.self="controller.onAddNewLabelClicked()"
        >
          <div class="label-title">
            <span
              v-if="!controller.isAddingNewLabel.value"
              @click="controller.onAddNewLabelClicked()"
            >
              + Create New Theme
            </span>
            <template v-if="controller.isAddingNewLabel.value">
              <span>New Theme :</span>
              <input
                type="text"
                class="form-control"
                placeholder="Your New Theme"
                v-model="controller.newLabel.value.name"
              />
              <div class="action-buttons">
                <button
                  class="btn btn-danger"
                  @click="controller.onCancelAddNewLabel()"
                >
                  Cancel
                </button>
                <button
                  class="btn btn-submit"
                  :disabled="!controller.newLabel.value.canSubmit()"
                  :class="{ 'is-loading': controller.isSubmittingNewLabel.value }"
                  @click="controller.onProceedAddNewLabel()"
                >
                  Create
                </button>
              </div>
            </template>
          </div>
        </div>
        <!-- <div
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
            <button
              class="btn btn-submit btn-pill"
              @click="controller.onViewClicked(pricing)"
            >
              View
            </button>
            <button
              class="btn btn-danger btn-pill"
              @click="controller.onRemoveClicked(pricing)"
            >
              Remove
            </button>
          </div>
        </div> -->
      </div>
      <!-- <TablePagination
        v-bind="controller.tablePaginationProps"
        @go-to-page="controller.tableDataFetcher.value.goToPage($event)"
      /> -->
      <Editor
        v-bind="controller.editorProps"
        ref="editorRef"
        @updated="controller.onPricingUpdated()"
      />
      <ConfirmToDelete
        :remove-item-name="controller.itemToRemoveName"
        ref="confirmToDeleteRef"
        @proceed="controller.onProceedRemove()"
      />
      <ConfirmToDelete
        :remove-item-name="controller.itemToRemoveLabelName"
        ref="confirmToDeleteLabelRef"
        @proceed="controller.onProceedRemoveLabel()"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import ConfirmToDelete from "../Popups/ConfirmToDelete.vue"
  import Editor from "./Editor.vue"
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

  const editorRef = ref(null)
  const confirmToDeleteRef = ref(null)
  const confirmToDeleteLabelRef = ref(null)

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

  watch(
    editorRef,
    (newVal) => {
      controller.setEditorRef(newVal)
    },
    { immediate: true }
  )

  watch(
    confirmToDeleteRef,
    (newVal) => {
      controller.setConfirmToDeleteRef(newVal)
    },
    { immediate: true }
  )

  watch(
    confirmToDeleteLabelRef,
    (newVal) => {
      controller.setConfirmToDeleteLabelRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    addNewPricing: controller.addNewPricing.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Pricings/All" as *;
</style>
