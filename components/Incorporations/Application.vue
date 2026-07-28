<template>
  <div id="incorporations-application">
    <div class="application-summary">
      <div class="proposed-name">
        {{ controller.application.value.getName() }}
        <span
          class="name-approved"
          v-if="controller.isNameApproved"
        >
          <i class="fa-solid fa-circle-check" />
        </span>
      </div>
      <div class="applicant-details">
        <div class="applicant-name">//</div>
      </div>
    </div>
    <ServiceApplication v-bind="controller.serviceApplicationProps" />
  </div>
</template>

<script lang="ts" setup>
  import ServiceApplication from "@/components/Services/ServiceApplication.vue"
  import { ApplicationController } from "~/scripts/components/incorporations/ApplicationController"
  import type { IPropsIncorporationApplication } from "~/scripts/props/PropsIncorporationApplication"

  const props = defineProps<IPropsIncorporationApplication>()

  const emit = defineEmits(["back"])

  const controller = new ApplicationController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Incorporations/Application" as *;
</style>
