<template>
  <div
    ref="actionTrayElementRef"
    class="action-tray-element"
    v-if="!controller.element.value.isHidden"
  >
    <div
      v-if="!controller.isSearchOpen.value"
      class="action-cta"
      :class="{
        disabled: controller.element.value.isDisabled,
        'is-select-element': controller.element.value.isSelectElement,
      }"
      v-keyboard-click
      @click="controller.onClick()"
    >
      <i
        v-if="controller.element.value.isIconStart"
        class="action-tray-icon"
        :class="controller.getIconClass()"
      />

      <div v-if="controller.isLabelVisible()">
        <div class="action-tray-element-label">
          {{ controller.getlabel() }}
        </div>
        <div
          class="action-tray-element-sublabel"
          v-if="controller.hasSublabel()"
        >
          {{ controller.getSublabel() }}
        </div>
      </div>

      <div
        class="action-tray-element-badge"
        v-if="controller.hasBadge()"
      >
        {{ controller.getBadge() }}
      </div>

      <div
        v-if="controller.isSelectVisible()"
        class="action-tray-element-select"
      >
        <select
          v-model="controller.optionSelected.value"
          class="form-control"
          @change="controller.onSelectChanged()"
        >
          <option
            :key="option.id"
            :value="option.value"
            :selected="option.isSelected"
            :disabled="option.isDisabled"
            v-for="option in controller.element.value.selectElementOptions"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <i
        v-if="!controller.element.value.isIconStart"
        class="action-tray-icon"
        :class="controller.getIconClass()"
      />

      <div
        class="action-tray-toggle"
        v-if="controller.isSwitchButtonVisible()"
        @click.stop
      >
        <label class="switch switch-sm">
          <input
            type="checkbox"
            v-model="controller.element.value.isActive"
            @change="controller.onSwitchChange()"
          />
          <span class="slider round" />
        </label>
      </div>
    </div>

    <div
      class="action-tray-dropdowns"
      v-if="controller.isDropdownVisible()"
    >
      <div
        class="action-tray-dropdown-action"
        v-for="dropdownElement in controller.getDropdownElements()"
        :class="{
          disabled: dropdownElement.isDisabled,
          'is-select-element': dropdownElement.isSelectElement,
        }"
      >
        <ActionElement
          :action="dropdownElement"
          @onClick="controller.element.value.close()"
        />
      </div>
    </div>

    <div
      class="action-tray-search"
      v-if="controller.isSearchOpen.value"
    >
      <div class="action-asearch-icon">
        <i class="fa-regular fa-magnifying-glass" />
      </div>

      <input
        class="action-search-input"
        v-model="controller.searchQuery.value"
        @keydown.enter="controller.onClick()"
      />

      <div
        class="action-search-close-button"
        v-keyboard-click
        @click="controller.onSearchClose()"
        title="Close"
      >
        <i class="fa-regular fa-circle-x" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ActionElement from "@/components/ActionTrays/ActionTrayElement.vue"
  import { ActionTrayElement } from "~/scripts/types/action-trays/ActionTrayElement"
  import { ActionTrayElementController } from "~/scripts/components/action-trays/ActionTrayElementController"

  const props = defineProps({
    action: {
      type: ActionTrayElement,
      required: true,
    },
  })

  const actionTrayElementRef = ref(null)

  const emit = defineEmits(["onClick", "closeSearch", "openSearch"])

  const controller = new ActionTrayElementController(props.action, emit)

  watch(
    () => props.action,
    (newVal) => {
      controller.setAction(newVal)
    },
    { deep: true }
  )

  watch(
    actionTrayElementRef,
    (newVal) => {
      controller.setActionTrayElementRef(newVal)
    },
    { immediate: true }
  )

  // EventListener Section
  const handleClickOutside = controller.handleClickOutside.bind(controller)

  onMounted(() => {
    window.addEventListener("click", handleClickOutside)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("click", handleClickOutside)
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/ActionTrays/ActionTrayElement" as *;
</style>
