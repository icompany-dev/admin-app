<template>
  <div
    id="company-services-section236-three"
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
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <Section236Three
            ref="documentRef"
            :company-name="controller.companyName.value"
            :company-registration-number-new="controller.registrationNumberNew.value"
            :company-registration-number-old="controller.registrationNumberOld.value"
          />
        </TransitionGroup>
      </template>
    </CompanyServiceWrapper>
  </div>
</template>

<script lang="ts" setup>
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Section236Three from "@/components/LegalDocuments/Section236Three.vue"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import type { IPropsIncorporationDocumentService } from "~/scripts/props/PropsIncorporationDocumentService"
  import type { IPropsSwitchDocumentService } from "~/scripts/props/PropsSwitchDocumentService"
  import { Section236ThreeServiceController } from "~/scripts/components/company-services/Section236ThreeServiceController"

  const props = defineProps<IPropsIncorporationDocumentService | IPropsSwitchDocumentService>()

  const emit = defineEmits(EmitMessages.COMPANY_SERVICES)

  const documentRef = ref(null)

  const controller = new Section236ThreeServiceController(props, emit)

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

  defineExpose({
    onGenerateClicked: controller.onGenerateClicked.bind(controller),
    onDownloadClicked: controller.onDownloadClicked.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
  @use "~/assets/scss/components/CompanyServices/Section236ThreeService" as *;
</style>
