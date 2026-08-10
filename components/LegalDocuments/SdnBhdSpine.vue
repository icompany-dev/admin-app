<template>
  <div
    id="legal-documents-sdn-bhd-spine"
    ref="documentRef"
  >
    <Paper
      :paper-orientation="controller.paperOrientation"
      :additional-css-class="'sdn-bhd-spine print'"
      :show-page-number="false"
    >
      <template #paperContent>
        <div
          v-for="x in [1, 2, 3]"
          :key="x"
          class="spine"
        >
          <div class="company-name">
            {{ controller.companyName() }}
          </div>
          <div class="registration-number">
            {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
          </div>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script lang="ts" setup>
  import Paper from "../Papers/Paper.vue"
  import { SdnBhdSpineController } from "~/scripts/components/legal-documents/SdnBhdSpineController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new SdnBhdSpineController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/SdnBhdSpine" as *;
</style>
