<template>
  <div
    id="banks-documents-maybank-documents"
    class="bank-documents"
  >
    <div class="documents">
      <AuthorisedSignatoriesBankAccountOpeningMaybank
        ref="authorisedSignatoryRef"
        :company-id="controller.companyId.value"
        :application-id="props.resolutionDocument.applicationId"
        :application="props.resolutionDocument.application"
        :bank-id="controller.bankId"
        :is-in-preview-mode="props.resolutionDocument.isInPreviewMode"
        :is-show-tags="props.resolutionDocument.isShowTag"
        @updated="emit('updated')"
      />
      <template v-if="props.isShowAllDocuments">
        <DcrOnlineBankingBankAccountOpeningMaybank
          ref="onlineBankingRef"
          v-bind="props.resolutionDocument"
          @updated="emit('updated')"
        />
        <DcrBankAccountOpeningMaybank
          ref="accountOpeningRef"
          :company-id="controller.companyId.value"
          :application-id="props.resolutionDocument.applicationId"
          :bank-id="controller.bankId"
          :is-in-preview-mode="props.resolutionDocument.isInPreviewMode"
        />
        <DeclarationBankAccountOpeningMaybank
          ref="declarationRef"
          :company-id="controller.companyId.value"
          :application-id="props.resolutionDocument.applicationId"
          :bank-id="controller.bankId"
          :is-in-preview-mode="props.resolutionDocument.isInPreviewMode"
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
  import DcrBankAccountOpeningMaybank from "@/components/Resolutions/DcrBankAccountOpeningMaybank.vue"
  import DcrOnlineBankingBankAccountOpeningMaybank from "@/components/Resolutions/DcrOnlineBankingBankAccountOpeningMaybank.vue"
  import AuthorisedSignatoriesBankAccountOpeningMaybank from "@/components/LegalDocuments/AuthorisedSignatoriesBankAccountOpeningMaybank.vue"
  import DeclarationBankAccountOpeningMaybank from "@/components/LegalDocuments/DeclarationBankAccountOpeningMaybank.vue"
  import { MaybankDocumentsController } from "~/scripts/components/banks/documents/MaybankDocumentsController"
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

  const authorisedSignatoryRef = ref(null)
  const onlineBankingRef = ref(null)
  const accountOpeningRef = ref(null)
  const declarationRef = ref(null)

  const controller = new MaybankDocumentsController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    authorisedSignatoryRef,
    (newVal) => {
      controller.setAuthorisedSignatoryRef(newVal)
    },
    { immediate: true }
  )

  watch(
    onlineBankingRef,
    (newVal) => {
      controller.setOnlineBankingRef(newVal)
    },
    { immediate: true }
  )

  watch(
    accountOpeningRef,
    (newVal) => {
      controller.setAccountOpeningRef(newVal)
    },
    { immediate: true }
  )

  watch(
    declarationRef,
    (newVal) => {
      controller.setDeclarationRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    getBranchId: controller.getBranchId.bind(controller),
    getSignatories: controller.getSignatories.bind(controller),
    getSignatoryType: controller.getSignatoryType.bind(controller),
    getAuthorisedPersonsForOnlineBanking: controller.getAuthorisedPersonsForOnlineBanking.bind(controller),
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Banks/Documents/BankDocuments" as *;
  @use "~/assets/scss/components/Banks/Documents/MaybankDocuments" as *;
</style>
