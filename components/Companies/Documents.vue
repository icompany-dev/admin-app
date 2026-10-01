<template>
  <div id="companies-documents">// All documents will be here</div>
</template>

<script lang="ts" setup>
  import { DocumentsController } from "~/scripts/components/companies/DocumentsController"
  import type { IPropsCompanyDocument } from "~/scripts/props/PropsCompanyDocument"

  const props = defineProps<IPropsCompanyDocument>()

  const emit = defineEmits([])

  const controller = new DocumentsController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/Documents" as *;
</style>
