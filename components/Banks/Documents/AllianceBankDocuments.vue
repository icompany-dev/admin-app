<template>
  <div
    id="banks-documents-alliance-bank-documents"
    class="bank-documents"
  >
    <div class="documents">
      <DcrBankAccountOpeningAllianceBank
        ref="dcrRef"
        v-bind="props.resolutionDocument"
        @updated="emit('updated')"
      />
      <template v-if="props.isShowAllDocuments">
        <DcrBankAccountOpeningCurrent
          ref="currentRef"
          v-bind="props.resolutionDocument"
          @updated="emit('updated')"
        />
        <div
          class="document pdf-file"
          v-for="(document, index) in controller.documentsToDisplay"
          :key="index"
          :class="{
            'no-document-display': !controller.hasDocument(index),
          }"
        >
          <div
            class="overlay"
            v-if="!controller.hasDocument(index)"
          >
            <span
              class="click-to-preview"
              v-html="controller.documentName(index)"
            />
          </div>
          <canvas
            :ref="
              (el) => {
                return controller.setCanvasesForDocument(index, 1, el as HTMLCanvasElement | null)
              }
            "
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import DcrBankAccountOpeningAllianceBank from "~/components/Resolutions/DcrBankAccountOpeningAllianceBank.vue"
  import DcrBankAccountOpeningCurrent from "~/components/Resolutions/DcrBankAccountOpeningCurrent.vue"
  import { AllianceBankDocumentsController } from "~/scripts/components/banks/documents/AllianceBankDocumentsController"
  import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    resolutionDocument: {
      type: PropsResolutionDocument<CompanyBankAccountOpening>,
      required: true,
    },
    isShowAllDocuments: {
      type: Boolean,
      default: false,
    },
  })
  const emit = defineEmits(["updated"])

  const dcrRef = ref(null)
  const currentRef = ref(null)

  const controller = new AllianceBankDocumentsController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    dcrRef,
    (newVal) => {
      controller.setDcrRef(newVal)
    },
    { immediate: true }
  )

  watch(
    currentRef,
    (newVal) => {
      controller.setCurrentRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    getBranchId: controller.getBranchId.bind(controller),
    getSignatories: controller.getSignatories.bind(controller),
    getSignatoryType: controller.getSignatoryType.bind(controller),
    getAuthorisedPersonsForOnlineBanking: controller.getAuthorisedPersonsForOnlineBanking.bind(controller),
    getOtherDetails: controller.getOtherDetails.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Banks/Documents/BankDocuments" as *;
  @use "~/assets/scss/components/Banks/Documents/AllianceBankDocuments" as *;
</style>
