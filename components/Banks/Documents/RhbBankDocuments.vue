<template>
  <div
    id="banks-documents-rhb-bank-documents"
    class="bank-documents"
  >
    <div class="documents">
      <DcrBankAccountOpeningRhbBank
        ref="dcrRef"
        v-bind="props.resolutionDocument"
        @updated="emit('updated')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import DcrBankAccountOpeningRhbBank from "~/components/Resolutions/DcrBankAccountOpeningRhbBank.vue"
  import { RhbBankDocumentsController } from "~/scripts/components/banks/documents/RhbBankDocumentsController"
  import type { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
  import type { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

  const props = defineProps<{
    companyId: string
    resolutionDocument: PropsResolutionDocument<CompanyBankAccountOpening>
    isShowAllDocuments?: boolean
  }>()

  const emit = defineEmits(["updated"])

  const dcrRef = ref<InstanceType<typeof DcrBankAccountOpeningRhbBank> | null>(null)

  const controller = new RhbBankDocumentsController(props.companyId, emit)

  watch(
    () => props.companyId,
    (companyId) => {
      controller.setCompanyId(companyId)
    }
  )

  watch(
    dcrRef,
    (document) => {
      controller.setDcrRef(document)
    },
    { immediate: true }
  )

  defineExpose({
    getApplication: controller.getApplication.bind(controller),
    getBranchId: controller.getBranchId.bind(controller),
    getSignatories: controller.getSignatories.bind(controller),
    getSignatoryType: controller.getSignatoryType.bind(controller),
    getAuthorisedPersonsForOnlineBanking: controller.getAuthorisedPersonsForOnlineBanking.bind(controller),
    getPdfPages: controller.getPdfPages.bind(controller),
    downloadPdfs: controller.downloadPdfs.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Banks/Documents/BankDocuments" as *;
  @use "~/assets/scss/components/Banks/Documents/RhbBankDocuments" as *;
</style>
