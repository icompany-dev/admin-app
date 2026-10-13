<template>
  <div id="legal-documents-switch-out-handover-document">
    <Paper
      v-if="controller.isLoading.value"
      :show-page-number="false"
      :is-loader="true"
      :paper-orientation="controller.paperOrientation"
    >
      <template #paperContent>
        <LoaderPrepare
          :label="controller.loaderLabel"
          :sublabel="controller.loaderSublabel"
        />
      </template>
    </Paper>
    <div
      v-if="!controller.isLoading.value"
      ref="documentRef"
    >
      <Paper
        v-for="page in controller.pageRanges"
        :key="`page-${page}`"
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="true"
        :page-number="page"
        :total-pages="controller.totalPages"
      >
        <template #paperContent>
          <div class="annexure-details">
            <div class="annexture-title">Annexure A</div>
            <div class="company-name">
              {{ controller.companyName.value }}
            </div>
            <div class="company-registration-number">
              (Company Registration No: {{ controller.registrationNumberNew.value }} ({{
                controller.registrationNumberOld.value
              }}))
            </div>
          </div>
          <div class="document-content">
            <div
              class="heading"
              v-if="page === 1"
            >
              LIST OF DOCUMENTS AVAILABLE AT REGISTERED ADDRESS
            </div>
            <div
              class="notes"
              v-if="page === 1"
            >
              Notes:
              <div class="note-details">
                <span class="label">Incoming:</span>
                <span>
                  Documents and records received by iCompany from a previous CompanySecretary or third party, forming
                  part of the Company’s statutory and administrative records held under iCompany’s custody.
                </span>
              </div>
              <div class="note-details">
                <span class="label">Outgoing:</span>
                <span>
                  Documents and records originated, maintained, or held by iCompany, which are being formally
                  transferred to a succeeding Company Secretary as part of the handover of statutory custody via
                  reassignment or others.
                </span>
              </div>
            </div>
            <table class="document-table">
              <thead v-if="page === 1">
                <tr>
                  <th rowspan="2">No</th>
                  <th rowspan="2">Document / Description</th>
                  <th colspan="2">Status</th>
                  <th rowspan="2">Remarks</th>
                </tr>
                <tr>
                  <th class="subhead">Outgoing</th>
                  <th class="subhead">Incoming</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in controller.getTableRowsForPage(page)"
                  :class="{ 'empty-row': row.isEmptyRow, 'section-row': row.isSectionRow }"
                >
                  <template v-if="row.isEmptyRow">
                    <td colspan="5"></td>
                  </template>
                  <template v-if="!row.isEmptyRow">
                    <td>{{ row.number }}</td>
                    <td :class="{ 'left-to-border': !row.isSectionRow }">
                      {{ row.isSectionRow ? row.sectionTitle : row.document?.documentName }}
                    </td>
                    <td :class="{ 'has-border': !row.isSectionRow, 'top-of-border': row.isSectionRow }"></td>
                    <td :class="{ 'has-border': !row.isSectionRow, 'top-of-border': row.isSectionRow }"></td>
                    <td></td>
                  </template>
                </tr>
                <template v-if="page === controller.totalPages">
                  <tr>
                    <td colspan="5"></td>
                  </tr>
                  <tr class="section-row">
                    <td>H.</td>
                    <td class="top-of-border">API Connection for Transfer of Documents</td>
                    <td colspan="2"></td>
                  </tr>
                  <tr>
                    <td class="left-to-border"></td>
                    <td class="has-border note-content">
                      Where the incoming Company Secretary operates a digital company secretarial system, the option to
                      establish connectivity via API may be made available, subject to request. Any such API connection
                      shall be subject to system compatibility, prior approval, and applicable security requirements,
                      and may require separate implementation arrangements. The availability of API integration is
                      intended to facilitate continuity of access to records maintained within iCompany Systems, where
                      applicable, and reflects the evolving standards of digital corporate administration. For the
                      avoidance of doubt, any API access granted does not, in itself, constitute a transfer of statutory
                      custody, control, or responsibility, unless expressly agreed in writing between the parties.
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </template>
              </tbody>
            </table>
            <template v-if="page === controller.totalPages">
              <div class="acknowledgement-receipt">CONFIRMATION BY RESPONSIBLE DIRECTOR</div>
              <div class="document-content">
                <p>
                  I, the Responsible Director, acknowledge receipt of Annexure A, confirm the documents listed were in
                  iCompany’s custody as at the date of handover (and that any document not listed was not), and accept
                  that responsibility for the Company’s records and ongoing compliance passes to the Company and/or the
                  incoming Company Secretary upon completion.
                </p>
              </div>
              <div class="recipient-section">
                <div class="recipient-details">
                  <span class="label">Signature</span>
                  <span class="colon">:</span>
                  <span class="signature-box"></span>
                </div>
                <div class="recipient-details">
                  <span class="label">Name</span>
                  <span class="colon">:</span>
                </div>
              </div>
            </template>
          </div>
        </template>
      </Paper>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import { SwitchOutHandoverDocumentController } from "~/scripts/components/legal-documents/SwitchOutHandoverDocumentController"

  const props = defineProps({
    targetType: {
      type: String,
      required: true,
    },
    targetId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: [String, null],
      default: null,
    },
  })

  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new SwitchOutHandoverDocumentController(
    props.targetType,
    props.targetId,
    props.applicationId,
    emit
  )

  watch(
    () => props.targetType,
    (newVal) => {
      controller.setTargetType(newVal)
    }
  )

  watch(
    () => props.targetId,
    (newVal) => {
      controller.setTargetId(newVal)
    }
  )

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
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
  @use "~/assets/scss/components/LegalDocuments/SwitchOutHandoverDocument" as *;
</style>
