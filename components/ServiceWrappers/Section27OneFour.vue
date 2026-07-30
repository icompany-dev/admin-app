<template>
  <div
    id="service-wrappers-section27-one-four"
    class="cosec-service-documents"
  >
    <div class="documents-section">
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <Section27OneFour
          ref="documentRef"
          :application-id="controller.applicationNameReservationId.value"
          :application-incorporate-id="controller.applicationIncorporationId.value"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import Section27OneFour from "@/components/LegalDocuments/Section27OneFour.vue"
  import { Section27OneFourController } from "~/scripts/components/service-wrappers/Section27OneFourController"

  const props = defineProps({
    applicationId: {
      type: String,
      required: true,
    },
    applicationIncorporateId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new Section27OneFourController(props.applicationIncorporateId, props.applicationId, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationNameReservationId(newVal)
    }
  )

  watch(
    () => props.applicationIncorporateId,
    (newVal) => {
      controller.setApplicationIncorporationId(newVal)
    }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/ServiceWrappers/Section27OneFour" as *;
</style>
