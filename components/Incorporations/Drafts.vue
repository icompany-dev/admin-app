<template>
  <div id="incorporations-drafts">
    <div
      class="loader-container"
      v-if="controller.isLoading.value"
    >
      <LoaderPrepare
        :label="controller.loaderLabel"
        :sublabel="controller.loaderSublabel"
      />
    </div>
    <div
      class="applications"
      v-if="!controller.isLoading.value"
    >
      <div
        class="application"
        v-for="(application, i) in controller.applications.value"
        :key="i"
      >
        {{ application }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import { DraftsController } from "~/scripts/components/incorporations/DraftsController"
  import type { IPropsIncorporationsDraft } from "~/scripts/props/PropsIncorporationsDraft"

  const props = defineProps<IPropsIncorporationsDraft>()

  const emit = defineEmits([])

  const controller = new DraftsController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Incorporations/Drafts" as *;
</style>
