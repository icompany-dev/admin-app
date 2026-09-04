<template>
  <div id="popups-add-company-auditor">
    <Popup
      ref="popupRef"
      v-bind="controller.popupProps"
    >
      <template #content>
        <div
          class="action"
          v-html="controller.content"
        />
        <div class="action">
          <div class="form-group">
            <label>{{ controller.auditorPartnerLabel }}</label>
            <SearchableDropdown
              :options="controller.auditorPartnerOptions"
              :selected-item-name="controller.selectedAuditorPartnerName"
              :placeholder="'Select an Auditor'"
              :label-key="'label'"
              :value-key="'value'"
              :is-searchable="true"
              @selected="controller.onAuditorPartnerSelected($event)"
              @search="controller.onSearch($event)"
            />
          </div>
          <div class="form-group">
            <label>{{ controller.auditorCompanyNameLabel }}</label>
            <input
              type="text"
              class="form-control"
              v-model="controller.companyAuditor.value.auditorCompanyName"
            />
          </div>
          <div class="form-group">
            <label>{{ controller.auditorLicenseLabel }}</label>
            <input
              type="text"
              class="form-control"
              v-model="controller.companyAuditor.value.auditorLicense"
            />
          </div>
          <div class="form-group">
            <label>{{ controller.auditorContactPersonLabel }}</label>
            <input
              type="text"
              class="form-control"
              v-model="controller.companyAuditor.value.auditorContactPerson"
            />
          </div>
          <div class="form-group">
            <label>{{ controller.auditorEmailLabel }}</label>
            <input
              type="text"
              class="form-control"
              v-model="controller.companyAuditor.value.auditorEmail"
            />
          </div>
          <div class="form-group">
            <label>{{ controller.auditorPhoneLabel }}</label>
            <input
              type="text"
              class="form-control"
              v-model="controller.companyAuditor.value.auditorPhone"
            />
          </div>
        </div>
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
          :disabled="controller.isSubmitting.value"
          @click="controller.addAuditor()"
        >
          {{ controller.proceedLabel }}
        </button>
      </template>
    </Popup>
  </div>
</template>

<script lang="ts" setup>
  import Popup from "./Popup.vue"
  import SearchableDropdown from "../Forms/SearchableDropdown.vue"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import { AddCompanyAuditorController } from "~/scripts/components/popups/AddCompanyAuditorController"
  import type { IPropsAddCompanyAuditor } from "~/scripts/props/PropsAddCompanyAuditor"
  import { control } from "leaflet"

  const props = defineProps<IPropsAddCompanyAuditor>()

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)

  const controller = new AddCompanyAuditorController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataProps(newVal)
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
  @use "~/assets/scss/components/Popups/AddCompanyAuditor" as *;
</style>
