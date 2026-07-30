<template>
  <div
    id="company-services-section27-one-four-service"
    class="company-services"
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
    <CompanyServiceWrapper
      v-if="!controller.isLoading.value"
      ref="wrapperRef"
      v-bind="controller.serviceWrapperProps"
      @application-updated="controller.onApplicationUpdated()"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <Section27OneFour
            ref="documentRef"
            :application-id="controller.applicationNameReservationId.value"
            :application-incorporate-id="controller.applicationIncorporationId.value"
          />
        </TransitionGroup>
      </template>
    </CompanyServiceWrapper>
  </div>
</template>

<script lang="ts" setup>
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Section27OneFour from "@/components/LegalDocuments/Section27OneFour.vue"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import type { IPropsIncorporationDocumentService } from "~/scripts/props/PropsIncorporationDocumentService"
  import { Section27OneFourServiceController } from "~/scripts/components/company-services/Section27OneFourServiceController"

  const props = defineProps<IPropsIncorporationDocumentService>()

  const emit = defineEmits(EmitMessages.COMPANY_SERVICES)

  const documentRef = ref(null)

  const controller = new Section27OneFourServiceController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
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
  @use "~/assets/scss/components/CompanyServices/Service" as *;
  @use "~/assets/scss/components/CompanyServices/Section27OneFourService" as *;
</style>
