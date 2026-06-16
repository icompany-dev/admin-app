<template>
  <div
    id="services-section105"
    class="cosec-service-documents"
    :class="{ 'full-size': true }"
  >
    <div
      v-if="controller.isLoading.value"
      class="paper-wrapper"
    >
      <div class="paper">
        <LoaderPrepare
          :label="controller.loaderLabel()"
          :sublabel="controller.loaderSublabel()"
        />
      </div>
    </div>
    <div
      v-if="!controller.isLoading.value"
      class="documents-section"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <Section105
          :company-shareholder-transfer="props.application"
          :shareholder-id="controller.shareholderId.value ?? ''"
          :company-share-transfer-detail="controller.transferDetail.value"
          :company-id="controller.companyId.value"
          :show-watermark="false"
          :watermark-text="''"
          :is-in-preview-mode="false"
          @transferorSigned="controller.onTransferorSigned($event)"
          @transferorRepSigned="controller.onTransferorRepSigned($event)"
          @transfereeSigned="controller.onTransfereeSigned($event)"
          @transfereeRepSigned="controller.onTransfereeRepSigned($event)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Section105 from "@/components/LegalDocuments/Section105.vue"
  import { Section105Controller } from "~/scripts/components/service-wrappers/Section105Controller"
  import { CompanyShareTransferDetail } from "~/scripts/models/CompanyShareTransferDetail"
  import { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"

  const props = defineProps({
    application: {
      type: CompanyShareholderTransfer,
      required: true,
    },
    transferDetail: {
      type: CompanyShareTransferDetail,
      required: true,
    },
    companyId: {
      type: String,
      required: true,
    },
  })
  const emit = defineEmits(["back", "applicationUpdated"])

  const controller = new Section105Controller(props.companyId, props.transferDetail, emit)

  watch(
    () => props.transferDetail,
    (newVal) => {
      controller.setTransferDetail(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
  @use "~/assets/scss/components/Services/Section105" as *;
</style>
