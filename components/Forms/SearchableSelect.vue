<template>
  <div
    class="searchable-select"
    :class="{ disabled: props.isDisabled }"
  >
    <BDropdown
      size="md"
      toggle-class="toggler"
      menu-class="select-options"
      offset="-42"
      :placement="props.placement"
    >
      <template #button-content>
        <div
          class="button-content"
          :class="{ 'not-selected': !props.selectedItemName }"
        >
          <div class="button-label">
            {{ props.selectedItemName ?? props.placeholder }}
          </div>
          <div class="icon">
            <i class="fa-solid fa-caret-down" />
          </div>
        </div>
      </template>
      <BDropdownForm
        @submit.prevent
        @click.stop.prevent
        v-if="props.isSearchable"
      >
        <div class="input-group">
          <input
            type="text"
            name="search"
            :placeholder="props.searchTextPlaceholder"
            v-model="controller.searchQuery.value"
            @keydown.enter="controller.onKeywordChanged()"
            @change="controller.onKeywordChanged()"
            @input="controller.onKeywordInput()"
            class="select-search-input"
          />
          <i class="fa-solid fa-search" />
        </div>
      </BDropdownForm>
      <BDropdownItem
        href="#"
        @click.stop.prevent
        v-if="props.selectedItemName !== null"
        :class="'removable'"
      >
        <div class="selected-item"></div>
        <div
          class="remove"
          @click.prevent="emit('selected', '')"
        >
          Remove Selection
        </div>
      </BDropdownItem>
      <BDropdownItem
        href="#"
        v-for="(option, index) in controller.options.value"
        :key="index"
        @click.prevent="emit('selected', option[props.valueKey])"
      >
        {{ option[props.labelKey] }}
      </BDropdownItem>
      <BDropdownItem
        href="#"
        @click.stop.prevent
        v-if="controller.options.value.length <= 0"
        :class="'no-result'"
      >
        {{ controller.instructions() }}
      </BDropdownItem>
    </BDropdown>
  </div>
</template>

<script setup lang="ts">
  import { SearchableSelectController } from "~/scripts/components/forms/SearchableSelectController"

  const props = defineProps({
    options: {
      type: Array<any>,
      required: true,
    },
    selectedItemName: {
      type: [String, null],
      default: null,
    },
    placeholder: {
      type: String,
      default: "Select one",
    },
    labelKey: {
      type: String,
      default: "name",
    },
    valueKey: {
      type: String,
      default: "id",
    },
    isSearchable: {
      type: Boolean,
      default: true,
    },
    placement: {
      type: String,
      default: "bottom",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    searchTextPlaceholder: {
      type: String,
      default: "Search",
    },
    isSearching: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(["selected", "search", "filter"])

  const controller = new SearchableSelectController(props.options, emit)

  watch(
    () => props.options,
    (newVal) => {
      controller.setOptions(newVal)
    },
    { deep: true }
  )

  watch(
    () => props.isSearching,
    (newVal) => {
      controller.setIsSearching(newVal)
    }
  )
</script>
