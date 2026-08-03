<template>
  <div
    id="legal-document-section-201"
    ref="documentRef"
  >
    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :additional-css-class="'legal-document section-201'"
      :is-include-logo="false"
      :show-page-number="false"
    >
      <template #paperContent>
        <div class="company-number">
          <div class="label">Company No.</div>
          <div class="value">{{ props.registrationNumber }}</div>
        </div>

        <div class="document-header">
          <div class="act-title">COMPANIES ACT 2016</div>
          <div class="section-number">Section 201</div>
        </div>

        <div class="document-subtitle">
          DECLARATION BY A PERSON BEFORE APPOINTMENT AS DIRECTOR, OR BY A PROMOTER BEFORE INCORPORATION OF CORPORATION
        </div>

        <div class="company-name">
          {{ controller.companyName.value }}
        </div>

        <div class="declaration-content">
          <table class="declaration-table">
            <tbody>
              <tr>
                <td
                  colspan="2"
                  class="declaration-header"
                >
                  Declaration
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="declaration-intro"
                >
                  I solemnly and sincerely declare that:
                </td>
              </tr>
              <tr>
                <td class="item-number">1.</td>
                <td class="item-content">I am not an undischarged bankrupt.</td>
              </tr>
              <tr>
                <td class="item-number">2.</td>
                <td class="item-content text-justify">
                  I have not been convicted whether within or outside Malaysia of any offence:
                  <ol type="a">
                    <li>in connection with the promotion, formation or management of a corporation;</li>
                    <li>involving bribery, fraud or dishonesty; or</li>
                    <li>
                      under section 231, 217, 218, 228 or 539, within a period of 5 years preceding the date of this
                      declaration.
                    </li>
                  </ol>
                </td>
              </tr>
              <tr>
                <td class="item-number">3.</td>
                <td class="item-content text-justify">
                  I have not been imprisoned for any offence referred to in paragraph 2 within the period of five years
                  immediately preceding the date of this declaration.
                </td>
              </tr>
              <tr>
                <td class="item-number">4.</td>
                <td
                  class="item-content text-justify"
                  :class="{ strikethrough: controller.showStrikethrough() }"
                >
                  *I am an undischarged bankrupt but have been granted leave by the court under section 198(3)(b) to act
                  as a director of ....................................................... (name of corporation)
                </td>
              </tr>
              <tr>
                <td class="item-number">5.</td>
                <td class="item-content text-justify">
                  <div :class="{ strikethrough: controller.showStrikethrough() }">
                    *I have been granted leave by Court under section 198 to be a director of
                    ............................. (name of corporation) or a promoter of a proposeed corporation
                    ............................. (name of corporation) or both a director of
                    ............................. (name of corporation) and a promoter of .............................
                    (name of corporation). I attach herewith an office copy of the court order.
                  </div>
                  <div
                    v-if="!controller.showStrikethrough()"
                    class="strikethrough-notice"
                  >
                    <i>*Item No 4 and 5 will strike out when you affix your signature.</i>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="item-number">6.</td>
                <td class="item-content">
                  I hereby consent to act as director of
                  <span class="company-name-inline">{{ controller.companyName.value }}</span>
                  .
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="confirmation-section"
                >
                  <div class="confirmation-text">
                    I confirm that the facts and information stated in this document are true.
                  </div>
                  <div class="signature-label">Sign by Director(s)/Promoter(s):</div>
                  <div class="signature-container">
                    <Signature
                      :signature-item="controller.signatureItem.value"
                      @signed="controller.onSignatureCompleted($event)"
                    />
                  </div>
                  <div class="declaration-date">
                    Date of Declaration:
                    <span :class="{ 'date-placeholder': !props.hasSigned }">
                      {{ props.signatureDate }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script setup lang="ts">
  import Paper from "../Papers/Paper.vue"
  import Signature from "../Signatures/Signature.vue"
  import { PaperOrientation } from "~/scripts/constants/Paper"
  import { SignatureItem } from "~/scripts/types/SignatureItem"
  import { Section201Controller } from "~/scripts/components/legal-documents/Section201Controller"

  const props = defineProps({
    companyName: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      default: "",
    },
    signatureItem: {
      type: SignatureItem,
      required: true,
    },
    hasSigned: {
      type: Boolean,
      default: false,
    },
    signatureDate: {
      type: String,
      default: "Your Signing Date",
    },
  })

  const emit = defineEmits(["signed"])

  const documentRef = ref(null)

  const controller = new Section201Controller(props.companyName, props.signatureItem, emit)

  watch(
    () => props.signatureItem,
    (newVal) => {
      controller.setSignatureItem(newVal)
    },
    { deep: true }
  )

  watch(
    () => props.companyName,
    (newVal) => {
      controller.setCompanyName(newVal)
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
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/Section201" as *;
</style>
