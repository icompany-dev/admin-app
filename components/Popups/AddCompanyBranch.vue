<template>
  <div id="popups-add-company-branch"></div>
</template>

<script lang="ts" setup>
  import { AddCompanyBranchController } from "~/scripts/components/popups/AddCompanyBranchController"
  import type { IPropsAddCompanyBranch } from "~/scripts/props/PropsAddCompanyBranch"

  const props = defineProps<IPropsAddCompanyBranch>()

  const emit = defineEmits([])

  const controller = new AddCompanyBranchController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/Popups/AddCompanyBranch" as *;
</style>
