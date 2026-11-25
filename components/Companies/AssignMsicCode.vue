<template>
  <div id="companies-assign-msic-code">
    <SearchableDropdown
      :options="controller.msicCodeOptions"
      :selected-item-name="controller.selectedMsicCodeName"
      :value-key="'value'"
      :label-key="'label'"
      @search="controller.onSearchText($event)"
      @selected="controller.onSelectedMsicCode($event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import SearchableDropdown from "@/components/Forms/SearchableDropdown.vue"
  import { AssignMsicCodeController } from "~/scripts/components/companies/AssignMsicCodeController"
  import type { IPropsAssignMsicCode } from "~/scripts/props/PropsAssignMsicCode"

  const props = defineProps<IPropsAssignMsicCode>()
  const emit = defineEmits(["selected"])

  const controller = new AssignMsicCodeController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/AssignMsicCode" as *;
</style>
