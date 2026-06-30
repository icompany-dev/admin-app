<template>
  <div id="company-services-section201-service">
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
  import { Section201ServiceController } from "~/scripts/components/company-services/Section201ServiceController"

  const props = defineProps({
    applicationId: {
      type: String,
      required: true,
    },
  })
  const emit = defineEmits([])

  const controller = new Section201ServiceController(props.applicationId, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Section201Service" as *;
</style>
