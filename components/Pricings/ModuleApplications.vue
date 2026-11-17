<template>
  <div id="pricings-module-applications">
    <Transition name="fade">
      <div
        class="module-applications"
        v-if="controller.isShowing.value"
      >
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
            v-for="(servicePricing, i) in controller.servicePricings.value"
          >
            <Pricing v-bind="controller.getPropsPricing(servicePricing)" />
          </div>
          <div
            class="application empty"
            @click="emit('addApplication')"
          >
            <i class="fa-solid fa-plus" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Pricing from "./Pricing.vue"
  import { ModuleApplicationsController } from "~/scripts/components/pricings/ModuleApplicationsController"
  import type { IPropsPricingsModuleApplications } from "~/scripts/props/PropsPricingsModuleApplications"

  const props = defineProps<IPropsPricingsModuleApplications>()

  const emit = defineEmits(["addApplication"])

  const controller = new ModuleApplicationsController(props, emit)

  watch(
    () => props.applications,
    (newVal) => {
      controller.setApplications(newVal)
    },
    { deep: true }
  )

  watch(
    () => props.isShowing,
    (newVal) => {
      controller.setIsShowing(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Pricings/ModuleApplications" as *;
</style>
