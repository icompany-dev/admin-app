<template>
  <div id="management-accounts-all"></div>
</template>

<script lang="ts" setup>
  import { AllController } from "~/scripts/components/management-accounts/AllController"
  import type { IPropsManagementAccounts } from "~/scripts/props/PropsManagementAccounts"

  const props = defineProps<IPropsManagementAccounts>()

  const emit = defineEmits([])

  const controller = new AllController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/ManagementAccounts/All" as *;
</style>
