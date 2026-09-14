<template>
  <div
    id="company-services-section201-for-director-service"
    class="company-services"
  >
    <CompanyServiceWrapper
      ref="wrapperRef"
      v-bind="controller.serviceWrapperProps"
      @minimized="controller.fetchApplication()"
      @applicationUpdated="controller.fetchApplication()"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <Section201
            ref="documentRef"
            :company-name="controller.name.value"
            :registration-number="controller.registrationNumber.value"
            :signature-item="controller.signatureItem.value"
            :has-signed="controller.hasSigned()"
            :signature-date="controller.signatureDate()"
          />
        </TransitionGroup>
      </template>
    </CompanyServiceWrapper>
  </div>
</template>

<script lang="ts" setup>
  import Section201 from "../LegalDocuments/Section201.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import { Section201ForDirectorServiceController } from "~/scripts/components/company-services/Section201ForDirectorServiceController"

  const props = defineProps({
    applicationId: {
      type: String,
      required: true,
    },
  })
  const emit = defineEmits([])

  const documentRef = ref(null)
  const wrapperRef = ref(null)

  const controller = new Section201ForDirectorServiceController(props.applicationId, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  watch(
    wrapperRef,
    (newVal) => {
      controller.setWrapperRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    onGenerateClicked: controller.onGenerateClicked.bind(controller),
    onDownloadClicked: controller.onDownloadClicked.bind(controller),
    onExpandDocument: controller.onExpandDocument.bind(controller),
    isPageReady: controller.isPageReady.bind(controller),
    waitForReady: controller.waitForReady.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
  @use "~/assets/scss/components/CompanyServices/Section201ForDirectorService" as *;
</style>
