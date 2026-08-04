<template>
  <div
    id="company-services-switch-appoint-company-secretary"
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
          <DcrAppointmentOfNewCompanySecretary
            ref="documentRef"
            :application="controller.application.value"
          />
        </TransitionGroup>
      </template>
    </CompanyServiceWrapper>
  </div>
</template>

<script lang="ts" setup>
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import DcrAppointmentOfNewCompanySecretary from "../Resolutions/DcrAppointmentOfNewCompanySecretary.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import type { IPropsSwitchDocumentService } from "~/scripts/props/PropsSwitchDocumentService"
  import { SwitchAppointCompanySecretaryController } from "~/scripts/components/company-services/SwitchAppointCompanySecretaryController"

  const props = defineProps<IPropsSwitchDocumentService>()

  const emit = defineEmits(EmitMessages.COMPANY_SERVICES)

  const documentRef = ref(null)

  const controller = new SwitchAppointCompanySecretaryController(props, emit)

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
    onDownloadClicked: controller.onDownloadClicked.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
  @use "~/assets/scss/components/CompanyServices/SwitchAppointCompanySecretary" as *;
</style>
