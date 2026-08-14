<template>
  <div
    id="service-wrappers-letter-to-existing-cosec"
    class="cosec-service-documents"
  >
    <div class="documents-section">
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <LetterChangeReassignCoSec
          ref="documentRef"
          v-bind="controller.letterChangeReassignCosecProps"
        />
      </TransitionGroup>
    </div>
    <ActionTray :actions="controller.actionTrayElements" />
  </div>
</template>

<script lang="ts" setup>
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import LetterChangeReassignCoSec from "@/components/LegalDocuments/LetterChangeReassignCoSec.vue"
  import { LetterToExistingCosecController } from "~/scripts/components/service-wrappers/LetterToExistingCosecController"

  const props = defineProps({
    applicationSwitchId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(["back"])

  const documentRef = ref(null)

  const controller = new LetterToExistingCosecController(props.applicationSwitchId, emit)

  watch(
    () => props.applicationSwitchId,
    (newVal) => {
      controller.setApplicationSwitchId(newVal)
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
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
  @use "~/assets/scss/components/ServiceWrappers/LetterToExistingCosec" as *;
</style>
