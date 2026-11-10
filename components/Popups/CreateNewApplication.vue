<template>
  <div id="popups-create-new-application">
    <Popup
      ref="popupRef"
      v-bind="controller.popupProps"
      @back="emit(EmitMessages.BACK)"
    >
      <template #content>
        <div v-if="controller.isFetchingCompanies.value">
          <LoaderPrepare
            :label="controller.loaderLabel"
            :sublabel="controller.loaderSublabel"
          />
        </div>
        <template v-if="!controller.isFetchingCompanies.value">
          <div
            class="action"
            v-html="controller.content"
          />
          <div class="action">
            <div class="form-group">
              <SearchableDropdown
                :options="controller.companyOptions"
                :selected-item-name="controller.selectedCompanyName"
                :value-key="'value'"
                :label-key="'label'"
                @selected="controller.onSelected($event)"
                @search="controller.onSearch($event)"
              />
            </div>
          </div>
        </template>
      </template>
      <template #actionButtons>
        <button
          class="btn btn-danger"
          :disabled="controller.isSubmitting.value"
          @click="controller.onCancelClicked()"
        >
          {{ controller.cancelLabel }}
        </button>
        <button
          class="btn btn-submit"
          :class="{ 'is-loading': controller.isSubmitting.value }"
          :disabled="controller.isSubmitting.value || !controller.canProceed"
          @click="controller.onProceedClicked()"
        >
          {{ controller.proceedLabel }}
        </button>
      </template>
    </Popup>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Popup from "./Popup.vue"
  import SearchableDropdown from "../Forms/SearchableDropdown.vue"
  import { CreateNewApplicationController } from "~/scripts/components/popups/CreateNewApplicationController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import type { IPropsCreateNewApplication } from "~/scripts/props/PropsCreateNewApplication"

  const props = defineProps<IPropsCreateNewApplication>()

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)

  const controller = new CreateNewApplicationController(props, emit)

  watch(
    () => props,
    (newVal) => {
      console.log("calledd??")
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )

  watch(
    popupRef,
    (newVal) => {
      controller.setPopupRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    show: controller.show.bind(controller),
    hide: controller.hide.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Popups/CreateNewApplication" as *;
</style>
