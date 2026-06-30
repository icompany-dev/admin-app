<template>
  <div
    v-if="controller.company.value"
    id="striking-off-clearrance-letter-printables"
    class="legal-document-striking-off-clearance-letter"
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
      :additional-css-class="'legal-document striking-off-clearance-letter'"
      :paper-orientation="'portrait'"
      :show-watermark="controller.showWatermark"
      :watermark-text="controller.watermarkText"
    >
      <template #paperContent>
        <div class="letter-date">
          <span :class="{ 'value-placeholder': !controller.hasPaid }">
            {{ controller.signatureDate() }}
          </span>
        </div>

        <div class="letter-from">
          <div>from:</div>
          <div>
            <b>
              {{ controller.companyName() }}
            </b>
          </div>
          <div>{{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})</div>
          <div v-html="controller.application.value.company?.getAddress()" />
        </div>

        <div class="letter-to">
          <div>to:</div>
          <div class="text-uppercase">
            <b>COSEC TECH SOLUTIONS SDN BHD</b>
          </div>
          <div class="text-uppercase">
            D-1-6, BLOCK D, SEKITAR26 ENTERPRISE,
            <br />
            PERSIARAN HULU SELANGOR,
            <br />
            40400 SHAH ALAM,
            <br />
            SELANGOR
          </div>
        </div>

        <div class="letter-greetings">Dear Sirs,</div>

        <div class="letter-title">APPLICATION TO STRIKE OFF COMPANY – CLEARANCE AND DISCLAIMER LETTER</div>

        <p>
          We,
          <span class="name">{{ controller.company.value.getFullName() }}</span>
          , hereby issue this letter formally acknowledge and confirm that we have applied for the strike-off of
          <span class="name">{{ controller.company.value.getFullName() }}</span>
          with Suruhanjaya Syarikat Malaysia. This letter is intended to serve as a disclaimer and clearance letter,
          absolving you and your affiliates from any present or future liabilities, claims, disputes, or damages arising
          from the secretarial services privided by you. We hereby declare that we have no outstanding grievances,
          issues, or concerns related to the said services.
        </p>

        <p>
          Please be informed that any past disputes or concerns have been duly resolved, and we consider the matter
          fully closed. This disclaimer and clearance letter apply to all aspects of the secretarial services and/or
          products, including but not limited to consultation, documentation and ongoing support.
        </p>

        <p>
          Further,
          <span class="name">{{ controller.company.value.getFullName() }}</span>
          agrees to indemnify and hold harmless
          <span class="name">COSEC TECH SOLUTIONS SDN BHD</span>
          its officers, directors, employees, agents, and affiliates from any claims, damages, loss, liabilities, costs,
          or expenses, incurred as a result of any third-party claims arising from the services delivered to us.
        </p>

        <p>
          This letter is legally binding and enforced under the applicable lay and regulation governing our
          relationship. It supersedes any prior agreements, understandings, or representations, whether wirtten or oral,
          between
          <span class="name">{{ controller.company.value.getFullName() }}</span>
          and
          <span class="name">{{ controller.selectedFirmName }}</span>
          regarding the subject matter herein.
        </p>

        <p>
          Kindly countersign this letter to acknowledge your agreement with the contents and confirm the receipt of this
          disclaimer and clearance letter.
        </p>

        <p>Thank you.</p>

        <p>Your sincerely,</p>

        <div class="signature-section">
          <Signature
            :signature-item="controller.applicantSignatureItem.value"
            @signed="controller.onApplicantSigned($event)"
          />
        </div>

        <p>Agreed and accepted:</p>

        <div class="signature-section">
          <Signature
            :signature-item="controller.acceptanceSignatureItem.value"
            @signed="controller.onApplicantSigned($event)"
          />
          <div>
            Date:
            <span class="value-placeholder">To be determined</span>
          </div>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script setup lang="ts">
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "../Papers/Paper.vue"
  import { StrikingOffClearanceLetterController } from "~/scripts/components/legal-documents/StrikingOffClearanceLetterController"
  import Signature from "~/components/Signatures/Signature.vue"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(["signed"])

  const controller = new StrikingOffClearanceLetterController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  defineExpose({
    refreshData: controller.refreshData.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/StrikingOffClearanceLetter" as *;
</style>
