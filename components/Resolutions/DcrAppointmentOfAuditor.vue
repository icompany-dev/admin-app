<template>
  <div id="dcr-appointment-of-auditor">
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
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import { StringUtil } from "~/scripts/utils/String"
  import Resolution from "./Resolution.vue"
  import { DcrAppointmentOfAuditorController } from "~/scripts/components/resolutions/DcrAppointmentOfAuditorController"
  import { AuditorInvitation } from "~/scripts/models/AuditorInvitation"
  import type { CompanyAuditorAppointment } from "~/scripts/models/CompanyAuditorAppointment"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

  const props = defineProps<IPropsResolutionDocument<CompanyAuditorAppointment>>()

  const emit = defineEmits([
    "startLoading",
    "doneLoading",
    "totalPageChanged",
    "auditorInvitationsChanged",
    "financialYearChanged",
    "applicationUpdated",
    "signed",
    "partnerSelected",
  ])

  const resolutionContent = ref(null)

  const controller = new DcrAppointmentOfAuditorController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal ?? "")
    }
  )

  watch(
    () => props.isInPreviewMode,
    async (newVal) => {
      controller.setIsInPreviewMode(newVal)
      controller.setContent()
    }
  )

  // watch(
  //   () => props.auditorInvitations,
  //   (newVal) => {
  //     controller.setAuditorInvitations(newVal)
  //   }
  // )

  watch(
    () => controller.application.value,
    (newVal) => {
      if (newVal) {
        emit("applicationUpdated", newVal)
      }
    },
    { deep: true }
  )

  watch(
    resolutionContent,
    (newVal) => {
      if (newVal) {
        controller.setResolutionContentRef(newVal)
      }
    },
    { immediate: true }
  )

  watch(
    () => controller.resolutionContent.value,
    async () => {
      await nextTick()
      controller.attachEventListeners()
    },
    { immediate: true }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/AppointmentOfAuditor" as *;
</style>
