<template>
  <div class="address-inputs">
    <template v-if="props.isPreviewMode">
      <div class="preview-text">YOUR ADDRESS LINE 1</div>
      <div class="preview-text">YOUR ADDRESS LINE 2</div>
      <div class="form-row">
        <div class="postcode preview-text">POSTCODE</div>
        <div class="city preview-text">CITY</div>
      </div>
      <div class="form-row">
        <div class="state preview-text">STATE</div>
        <div class="country preview-text">COUNTRY</div>
      </div>
    </template>
    <template v-if="!props.isPreviewMode">
      <input
        v-if="!props.isPreviewMode"
        type="text"
        v-model="controller.addressLine1.value"
        class="form-control text-uppercase"
        placeholder="Address Line 1"
        @input="emit('updateAddressLine1', controller.addressLine1.value)"
        :disabled="props.isDisabled"
      />
      <input
        v-if="!props.isPreviewMode"
        type="text"
        v-model="controller.addressLine2.value"
        class="form-control text-uppercase"
        placeholder="Address Line 2"
        @input="emit('updateAddressLine2', controller.addressLine2.value)"
        :disabled="props.isDisabled"
      />
      <div class="form-row">
        <div class="postcode form-group">
          <label
            v-if="props.isShowLabels"
            class="required"
          >
            Postcode
          </label>
          <input
            type="text"
            v-model="controller.postcode.value"
            class="form-control"
            placeholder="Postcode"
            @input="emit('updatePostcode', controller.postcode.value)"
            @change="controller.onPostcodeChanged()"
            :disabled="props.isDisabled"
          />
        </div>
        <div class="city form-group">
          <label
            v-if="props.isShowLabels"
            class="required"
          >
            City
          </label>
          <SearchableDropdown
            :options="controller.cities.value"
            :label-key="'name'"
            :value-key="'id'"
            :placeholder="'Select a city'"
            :selected-item-name="controller.selectedCity.value?.name"
            :is-searchable="true"
            @selected="controller.onCitySelected($event)"
            @search="controller.onSearchCity($event)"
            :is-disabled="props.isDisabled"
          />
        </div>
        <div class="state form-group">
          <label
            v-if="props.isShowLabels"
            class="required"
          >
            State
          </label>
          <SearchableDropdown
            :options="controller.states.value"
            :label-key="'name'"
            :value-key="'id'"
            :placeholder="'Select a state'"
            :selected-item-name="controller.selectedState.value?.name"
            :is-searchable="false"
            @selected="controller.onStateSelected($event)"
            :is-disabled="props.isDisabled"
          />
        </div>
        <div class="country form-group">
          <label
            v-if="props.isShowLabels"
            class="required"
          >
            Country
          </label>
          <SearchableDropdown
            :options="controller.countries.value"
            :label-key="'name'"
            :value-key="'id'"
            :placeholder="'Select a country'"
            :selected-item-name="controller.selectedCountry.value?.name"
            :is-searchable="false"
            @selected="controller.onCountrySelected($event)"
            :is-disabled="props.isDisabled"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { Location } from "~/scripts/models/Location"
  import SearchableSelect from "./SearchableSelect.vue"
  import SearchableDropdown from "./SearchableDropdown.vue"
  import { AddressInputController } from "~/scripts/components/forms/AddressInputController"

  const props = defineProps({
    location: {
      type: Location,
      default: null,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isPreviewMode: {
      type: Boolean,
      default: false,
    },
    isShowLabels: {
      type: Boolean,
      default: true,
    },
  })

  const emit = defineEmits([
    "updateAddressLine1",
    "updateAddressLine2",
    "updateState",
    "updateCity",
    "updatePostcode",
    "updateCountry",
  ])

  const controller = new AddressInputController(emit, props.location)

  watch(
    () => props.location,
    (newLocation) => {
      if (newLocation) {
        controller.setLocation(newLocation)
      }
    },
    { deep: true }
  )
</script>
