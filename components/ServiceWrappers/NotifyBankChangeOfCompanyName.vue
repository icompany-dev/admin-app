<template>
  <div
    id="services-notify-bank-change-of-company-name"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="documents-section"
      :class="{ invert: controller.showMcrFirst.value }"
      @click="emit('zoomIn')"
      :style="controller.getZoomStyle()"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <NotifyBankChangeOfCompanyName
          ref="dcrRef"
          :companyId="controller.companyId"
          :previousName="''"
          :applicationId="controller.applicationRef.value.id"
          :isInPreviewMode="controller.isInPreviewMode.value"
          :showWatermark="controller.isDraft()"
          :watermarkText="'Draft'"
          :isShowTags="true"
          @signed="controller.onSigned($event)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import NotifyBankChangeOfCompanyName from "@/components/LegalDocuments/NotifyBankChangeOfCompanyName.vue"
  import { NotifyBankChangeOfCompanyNameController } from "~/scripts/components/service-wrappers/NotifyBankChangeOfCompanyNameController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: String,
      default: null,
    },
    isDocumentEnlarged: {
      type: Boolean,
      default: false,
    },
    isInPreviewMode: {
      type: Boolean,
      default: true,
    },
  })

  const dcrRef = ref(null)
  const mcrRef = ref(null)

  const emit = defineEmits(["zoomOut", "zoomIn", "back", "applicationUpdated"])

  const controller = new NotifyBankChangeOfCompanyNameController(props.companyId, emit, props.applicationId)

  watch(
    dcrRef,
    (newVal) => {
      controller.setDcrRef(newVal)
    },
    { immediate: true }
  )

  watch(
    mcrRef,
    (newVal) => {
      controller.setMcrRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
</style>
