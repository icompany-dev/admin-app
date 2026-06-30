<template>
  <div
    id="forms-searchable-dropdown"
    class="searchable-dropdown"
    :class="{ disabled: props.isDisabled }"
  >
    <div
      class="dropdown selected"
      :class="{ 'menu-showing': controller.isShowOptions.value }"
      @click="controller.onShowItemsClicked()"
    >
      <span class="label">{{ props.selectedItemName ?? props.placeholder }}</span>
      <i
        class="fa-solid fa-caret-down"
        :class="{ rotate: controller.isShowOptions.value }"
      ></i>
    </div>
    <div
      class="dropdown-menu"
      :class="{ show: controller.isShowOptions.value, 'drop-up': props.isDropUp }"
    >
      <div
        class="search-field"
        v-if="props.isSearchable"
      >
        <input
          type="text"
          class="search-input form-control"
          v-model="controller.searchQuery.value"
          @input="controller.onKeywordInput()"
          @change="controller.onKeywordChanged()"
          @keydown.enter="controller.onKeywordChanged()"
        />
      </div>
      <div class="divider" />
      <div
        class="dropdown-item"
        v-for="(option, index) in controller.options.value"
        :key="index"
        @click="controller.onItemClicked(option[props.valueKey])"
      >
        {{ option[props.labelKey] }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { SearchableDropdownController } from "~/scripts/components/forms/SearchableDropdownController"

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
    isDropUp: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(["selected", "search", "filter"])

  const controller = new SearchableDropdownController(props.options, emit)

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

  onMounted(() => {
    window.addEventListener("click", controller.handleMouseClick.bind(controller))
    window.addEventListener("keydown", controller.handleKeydown.bind(controller))
  })

  onBeforeMount(() => {
    window.removeEventListener("click", controller.handleMouseClick.bind(controller))
    window.removeEventListener("keydown", controller.handleKeydown.bind(controller))
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Forms/SearchableDropdown" as *;
</style>
