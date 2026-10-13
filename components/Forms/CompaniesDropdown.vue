<template>
  <div
    id="forms-companies-dropdown"
    class="searchable-dropdown"
    :class="{ multiselect: controller.isMultipleSelect.value }"
  >
    <div
      class="dropdown selected"
      :class="{ 'menu-showing': controller.isShowOptions.value }"
      @click.self="controller.onShowItemsClicked()"
    >
      <template v-if="controller.hasSelectedAny">
        <span
          class="selected-option"
          v-for="(companyName, index) in controller.selectedNames"
        >
          <label>{{ companyName.label }}</label>
          <i
            class="fa-solid fa-xmark"
            @click.self="controller.onRemoveSelected(companyName.id as string)"
          />
        </span>
      </template>
      <template v-if="!controller.hasSelectedAny">
        <span class="placeholder">{{ controller.placeholder }}</span>
      </template>
    </div>
    <div
      class="dropdown-menu"
      :class="{ show: controller.isShowOptions.value }"
    >
      <div class="search-field">
        <input
          type=" text"
          class="form-control"
          v-model="controller.searchText.value"
        />
      </div>
      <div class="divider" />
      <div
        class="dropdown-item"
        v-for="(option, index) in controller.companyOptions"
        @click="controller.onOptionClicked(option.id as string)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { control } from "leaflet"
  import { CompaniesDropdownController } from "~/scripts/components/forms/CompaniesDropdownController"
  import type { IPropsCompaniesDropdown } from "~/scripts/props/PropsCompaniesDropdown"

  const props = defineProps<IPropsCompaniesDropdown>()

  const emit = defineEmits(["selected"])

  const controller = new CompaniesDropdownController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Forms/CompaniesDropdown" as *;
</style>
