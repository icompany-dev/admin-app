<template>
  <div id="legal-document-audit-exemption-certificate">
    <div
      class="paper-wrapper"
      ref="documentRef"
    >
      <div
        class="paper print audit-exemption-certificate"
        :class="controller.paperOrientation"
      >
        <div class="document-header">
          <div class="company-name">
            <b>
              {{ controller.companyName() }}
            </b>
          </div>
          <div class="registration-numbers">
            {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
          </div>
        </div>

        <div class="document-section-title certificate">AUDIT EXEMPTION CERTIFICATE</div>
        <div class="document-content">
          <ol>
            <li>
              This is to certify and declared that to the best of our knowledge that this certificate is signed by the
              Director certifying to the best of their knowledge and belief for the financial year ended
              <input
                v-if="controller.isDocumentEditable()"
                v-model="controller.endDate.value"
                type="date"
              />
              <span v-if="!controller.isDocumentEditable()">
                {{ controller.getDisplayDate(controller.endDate.value) }}
              </span>
              , the Company is entitled to exemption from audit under section 267(2) of the Companies Act 2016 relating
              to private companies.
              <br />
              <br />
            </li>
            <li>
              I hereby certify that to the best of my knowledge and belief that:
              <br />
              <br />
              <ol>
                <li>
                  Members have not required the company to perform an audit of its accounts for that year.
                  <br />
                  <br />
                </li>
                <li>
                  The Directors acknowledge their responsibilities for complying with the requirements of the Companies
                  Act 2016 with respect to accounting records and the preparation of financial statements.
                  <br />
                  <br />
                </li>
                <li>
                  These financial statements have been prepared in accordance with applicable approved accounting
                  standards issued by Malaysian Accounting Standards Board (MASB), namely the Malaysian Private Entities
                  Reporting Standard (MPERS) and complies with the requirements of the Companies Act 2016.
                  <br />
                  <br />
                </li>
              </ol>
            </li>
            <li>
              The unaudited financial statements and report made up from
              <input
                v-if="controller.isDocumentEditable()"
                v-model="controller.startDate.value"
                type="date"
              />
              <span v-if="!controller.isDocumentEditable()">
                {{ controller.getDisplayDate(controller.startDate.value) }}
              </span>
              to
              <input
                v-if="controller.isDocumentEditable()"
                v-model="controller.endDate.value"
                type="date"
              />
              <span v-if="!controller.isDocumentEditable()">
                {{ controller.getDisplayDate(controller.endDate.value) }}
              </span>
              required under the Companies Act 2016 have been circulated to the members on

              <input
                v-if="controller.isDocumentEditable()"
                v-model="controller.circulationDate.value"
                type="date"
              />
              <span v-if="!controller.isDocumentEditable()">
                {{ controller.getDisplayDate(controller.circulationDate.value) }}.
              </span>
              <!-- <template v-if="controller.isDocumentEditable">
                <input
                  type="date"
                  class="form-control in-resolution"
                  v-model="controller.application.value.circulationDate"
                />
              </template>
              <template v-if="!controller.isDocumentEditable">
                <span :class="{ placeholder: controller.isPlaceholderRequired }">
                  {{ controller.formattedCirculationDate }}
                </span>
              </template> -->
            </li>
          </ol>
          <div class="signature-section">
            <b>Approved and Certify By the Director</b>
            <Signature :signature-item="controller.signatureItem.value" />
          </div>
        </div>

        <!-- <div class="letter-sign-off">
          <div class="sign-off-title">Yours faithfully,</div>
          <Signature
            :signature-item="controller.signatureItem.value"
            @signed="emit('signed', $event)"
          />
        </div> -->
        <!-- <div class="paper-page-number">Page 1 of 1</div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Signature from "../Signatures/Signature.vue"
  import { AuditExemptionCertificateController } from "~/scripts/components/legal-documents/AuditExemptionCertificateController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    directorId: {
      type: String,
      required: true,
    },

    showWatermark: {
      type: Boolean,
      default: false,
    },
    watermarkText: {
      type: String,
      default: "DRAFT",
    },
    isInPreviewMode: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(["update", "signed"])

  const documentRef = ref(null)

  const controller = new AuditExemptionCertificateController(
    props.companyId,
    props.directorId,
    props.isInPreviewMode,
    emit
  )

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    () => props.directorId,
    (newVal) => {
      controller.setDirectorId(newVal)
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
    }
  )

  watch(
    documentRef,
    (newVal) => {
      if (newVal) {
        controller.setDocumentRef(newVal)
      }
    },
    { immediate: true }
  )

  defineExpose({
    getData: controller.getData.bind(controller),
    getLetterPdfElements: controller.getLetterPdfElements.bind(controller),
    getPdfPages: controller.getPdfPages.bind(controller),
    totalPages: controller.totalPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/AuditExemptionCertificate" as *;
</style>
