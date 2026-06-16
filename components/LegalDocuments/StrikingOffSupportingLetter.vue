<template>
  <div
    id="striking-off-supporting-letter-printables"
    class="legal-document-striking-off-supporting-letter"
  >
  <div
      v-if="controller.isLoading.value"
      class="paper-wrapper striking-off-application"
    >
      <div class="paper">
        <LoaderPrepare
          :label="controller.loaderLabel()"
          :sublabel="controller.loaderSublabel()"
        />
      </div>
    </div>
    <Paper
    v-if="!controller.isLoading.value"
      :total-pages="1"
      :page-number="1"
      :show-page-number="true"
      :additional-css-class="'legal-document striking-off-supporting-letter'"
      :paper-orientation="'portrait'"
      :show-watermark="controller.showWatermark"
      :watermark-text="controller.watermarkText"
    >
      <template #paperContent>
        <div class="letter-head">
          <div class="company-name">
            {{ controller.company.value.getFullName() }}
          </div>
          {{ controller.company.value.registrationNumberNew }} ({{ controller.company.value.registrationNumberOld }})
          <br />
          (Incorporated in Malaysia)
          <br />
          ("The Company")
          <br />
          D-1-6, Block D
          <br />
          Sekitar26 Enterprise Persiaran Hulu Selangor,
          <br />
          40400 Shah Alam Selangor Malaysia
        </div>

        <p>
          Date:
          <span class="value-placeholder">To be determined</span>
        </p>

        <p>
          <b>
              {{ controller.ssmName }}
            </b>
          <div v-html="controller.ssmAddress.location.getMultilineAddress()" />
        </p>

        <p>Dear Sir,</p>

        <div class="document-title">
          STRIKING-OFF COMPANY PURSUANT TO SECTION 550 OF THE COMPANIES ACT, 2016
        </div>

        <p>
          We refer to the subject matter and wish to apply for striking off the Company from the Register under Section
          550 of the Companies Act, 2016.
        </p>
        <p v-if="true">
          Please be informed that the Company has not been in operation since incorporation and has no intention to
          carry on its business in the foreseeable future. The Company is not involved in any legal proceeding within or
          outside Malaysia
        </p>

        <div v-if="controller.isDocumentEditable()">
          <div class="form-check" >
            <input
              v-model="controller.requirement.value.isNotOperating"
              type="checkbox"
              class="form-check-input"
              :disabled="!controller.isDocumentEditable()"
            />
            <div class="detail" :class="{ 'strikedthrough': !controller.requirement.value.isNotOperating }">
              The Company is no longer trading since 
              <input type="date" class="form-control in-resolution" v-model="controller.requirement.value.lastDateOfOperation" :disabled="!controller.isDocumentEditable()">
              and directors has decided that it is in the best interest of the company to strike off.
            </div>
          </div>

          <div class="form-check" >
            <input
              type="checkbox"
              class="form-check-input"
              :checked="!controller.hasOutstandingAssetsLiabilities()"
              :disabled="!controller.isDocumentEditable()"
              @click="controller.onClickNoOutstandingAssetsLiabilities()"
            />
            <div class="detail" :class="{ 'strikedthrough': controller.hasOutstandingAssetsLiabilities() }">
              The company has settled all debts, has no outstanding obligations with its creditors as well as having no
              assets and liabilities.
            </div>
          </div>

          <div class="form-check" >
            <input
              v-model="controller.requirement.value.isAbandoned"
              type="checkbox"
              class="form-check-input"
              :disabled="!controller.isDocumentEditable()"
            />
            <div class="detail" :class="{ 'strikedthrough': !controller.requirement.value.isAbandoned }">
              The specific ventures in which the Company is incorporated for is now completed or abandoned.
            </div>
          </div>
        </div>

        <div v-if="!controller.isDocumentEditable()">
          <span v-if="controller.requirement.value.isNotOperating">
            The Company is no longer trading since 
              <span :class="{ 'value-placeholder' : !controller.hasPaid }">{{ controller.lastOperationDate() }}</span>
              and directors has decided that it is in the best interest of the company to strike off.
          </span>
          <span v-if="!controller.hasOutstandingAssetsLiabilities()">
            The company has settled all debts, has no outstanding obligations with its creditors as well as having no
              assets and liabilities.
          </span>
          <span v-if="controller.requirement.value.isAbandoned">
            The specific ventures in which the Company is incorporated for is now completed or abandoned.
          </span>
        </div>

        <p>
          In view of the above, we trust that the Registrar will give due consideration to the aforesaid application and
          revert to us with a favourable repply.
        </p>

        <p>Thank you.</p>

        <p>Yours faithfully,</p>

        <div class="signature-section">
          <Signature
              :signature-item="controller.applicantSignatureItem.value"
              @signed="emit('signed', $event)"
            />
        </div>
      </template>
    </Paper>
  </div>
</template>

<script setup lang="ts">
import Paper from "../Papers/Paper.vue"
import LoaderPrepare from '@/components/Loaders/Prepare.vue'
  import { StrikingOffSupportingLetterController } from "~/scripts/components/legal-documents/StrikingOffSupportingLetterController"
  import Signature from "~/components/Signatures/Signature.vue"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(["signed"])

  const controller = new StrikingOffSupportingLetterController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  defineExpose({
    getApplicationData: controller.getApplicationData.bind(controller),
    refreshData: controller.refreshData.bind(controller)
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/StrikingOffSupportingLetter" as *;
</style>
