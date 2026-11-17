<template>
  <div id="pricings-all">
    <LoaderPrepare
      v-if="controller.isLoading.value"
      :label="controller.loaderLabel"
      :sublabel="controller.loaderSublabel"
    />
    <div v-if="!controller.isLoading.value">
      <div class="labels">
        <div
          class="label-wrapper"
          v-for="(label, i) in controller.modules.value"
          :class="{ selected: controller.isViewingApplications(label) }"
        >
          <div class="label">
            <div class="label-title">
              {{ label.name }}
            </div>
            <div class="action-buttons">
              <button
                class="btn btn-danger"
                @click="controller.onRemoveModule(label)"
              >
                Remove
              </button>
              <button
                class="btn btn-submit"
                @click="controller.onViewApplications(label)"
              >
                {{ controller.isViewingApplications(label) ? "Hide" : "View" }}
              </button>
            </div>
          </div>
          <div class="application-wrapper">
            <ModuleApplications
              v-bind="controller.getPricingsModuleApplicationsProps(label)"
              @addApplication="controller.onAddApplicationsClicked()"
              @editApplication="controller.onEditApplicationClicked($event)"
            />
          </div>
        </div>
        <div
          class="label empty"
          :class="{ 'in-focus': controller.isAddingNewModule.value }"
          @click.self="controller.onAddNewModuleClicked()"
        >
          <div class="label-title">
            <span
              v-if="!controller.isAddingNewModule.value"
              @click="controller.onAddNewModuleClicked()"
            >
              + Create New Module
            </span>
            <template v-if="controller.isAddingNewModule.value">
              <span>New Module :</span>
              <input
                type="text"
                class="form-control"
                placeholder="Your New Module"
                v-model="controller.newModule.value.name"
              />
              <div class="action-buttons">
                <button
                  class="btn btn-danger"
                  @click="controller.onCancelAddNewModule()"
                >
                  Cancel
                </button>
                <button
                  class="btn btn-submit"
                  :disabled="!controller.newModule.value.canSubmit()"
                  :class="{ 'is-loading': controller.isSubmittingNewModule.value }"
                  @click="controller.onProceedAddNewModule()"
                >
                  Create
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
      <Editor
        v-bind="controller.editorProps"
        ref="editorRef"
        @updated="controller.onServicePricingUpdated($event)"
      />
      <ConfirmToDelete
        :remove-item-name="controller.itemToRemoveName"
        ref="confirmToDeleteRef"
        @proceed="controller.onProceedRemove()"
      />
      <Grouped
        ref="groupedThemeRef"
        v-bind="controller.groupedServicePricingProps"
        @add-pricing="controller.onAddNewApplication()"
        @hide="controller.onCancelModuleClicked()"
        @label-updated="controller.onModuleUpdated($event)"
        @applications-added="controller.onApplicationsUpdated($event)"
        @application-removed="controller.onApplicationRemoved($event)"
      />
      <Services
        ref="servicesRef"
        @edit="controller.onEditServices($event)"
        @create="controller.addNewPricing()"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import ConfirmToDelete from "../Popups/ConfirmToDelete.vue"
  import Editor from "./Editor.vue"
  import Grouped from "./Grouped.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import ModuleApplications from "./ModuleApplications.vue"
  import NoRecord from "../Placeholders/NoRecord.vue"
  import SearchableDropdown from "../Forms/SearchableDropdown.vue"
  import Services from "./Services.vue"
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
  const groupedThemeRef = ref(null)
  const servicesRef = ref(null)

  const controller = new AllController(emit)

  // watch(
  //   () => props.searchText,
  //   (newVal) => {
  //     controller.setSearch(newVal)
  //   }
  // )

  // watch(
  //   () => props.sortOrder,
  //   (newVal) => {
  //     controller.setSortOrder(newVal)
  //   }
  // )

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

  // watch(
  //   confirmToDeleteLabelRef,
  //   (newVal) => {
  //     controller.setConfirmToDeleteLabelRef(newVal)
  //   },
  //   { immediate: true }
  // )

  watch(
    groupedThemeRef,
    (newVal) => {
      controller.setGroupedThemeRef(newVal)
    },
    { immediate: true }
  )

  watch(
    servicesRef,
    (newVal) => {
      controller.setServicesRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    addNewPricing: controller.addNewPricing.bind(controller),
    showServices: controller.showServices.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Pricings/All" as *;
</style>
