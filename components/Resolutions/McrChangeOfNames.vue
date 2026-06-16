<template>
  <div id="mcr-change-of-names">
    <Resolution
      v-bind="controller.resolutionProps"
      @total-page-changed="emit('totalPageChanged')"
      @signed="emit('signed', $event)"
    >
      <template #page1>
        <div
          ref="resolutionContent"
          class="resolution-content"
          v-html="controller.resolutionContent.value"
        />
      </template>
      <template
        #accompanying-document
        v-if="controller.hasAccompanyingDocument.value"
      >
        <div v-html="controller.accompanyingDocumentContent.value" />
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import FurtherResolved from "./FurtherResolved.vue"
  import Resolution from "./Resolution.vue"
  import NameReservations from "../NameReservations/NameReservations.vue"
  import { McrChangeOfNamesController } from "~/scripts/components/resolutions/McrChangeOfNamesController"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import type { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"

  const props = defineProps<IPropsResolutionDocument<CompanyAmendmentName>>()

  const emit = defineEmits(["startLoading", "doneLoading", "totalPageChanged", "nameChanged", "signed"])

  const controller = new McrChangeOfNamesController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
    }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller), //Has to plus one always, because there is accompanying document
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/ChangeOfNames" as *;
</style>
