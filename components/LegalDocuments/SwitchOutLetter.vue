<template>
  <div id="legal-documents-switch-out-letter">
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
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="true"
        :page-number="1"
        :total-pages="1"
      >
        <template #paperContent>
          <div class="document-header">
            <div class="document-date">
              <input
                type="date"
                class="form-control in-resolution"
              />
            </div>
            <div class="document-company-details">
              <div class="company-name">{{ controller.companyName() }}</div>
              <div
                class="company-address"
                v-html="controller.companyAddress()"
              />
            </div>
          </div>
          <div class="attention-to">
            <input
              type="text"
              class="form-control in-resolution"
              v-model="controller.companySwitchOut.value.newCosecName"
              v-if="controller.isDocumentEditable"
            />
            <span
              v-if="!controller.isDocumentEditable"
              :class="{ 'value-placeholder': !controller.isPaid }"
            >
              {{ controller.newCosecName }}
            </span>
            , Company Secretary
          </div>
          <div class="document-title">
            {{ controller.legalDocumentName.value }}
          </div>
          <div class="document-content">
            <p>May this letter find you well.</p>
            <p class="pre-company-details">We confirm that:</p>
            <div class="company-details">
              <b>{{ controller.companyName() }}</b>
              <br />
              (Company Registration No:
              <b>{{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})</b>
              )
            </div>
            <p class="post-company-details">
              is hereby officially handed over to your office as the newly appointed Company Secretary.
            </p>
            <p>
              All physical copies of any secretarial documents and records in our custody as at the date of this letter
              are enclosed together as
              <b>Annexure A</b>
              and are hereby transferred to you.
            </p>
            <p>
              Please confirm receipt by signing the acknowledgment section below by returning a scanned copy of this
              letter or email us a confirmation of the same to
              <b>connect@icompany.my</b>
              .
            </p>
            <p>
              In the absence of any response within seven (7) days from the date of this letter, we shall deem that all
              documents and records have been received and that all matters are in good order.
            </p>
            <p>
              We shall then have no further obligation or liability in respect of any matters relating to the
              secretarial upkeep and records of the abovementioned company prior to the date thereof.
            </p>
          </div>
          <div class="document-sign-off">
            For and on behalf of
            <br />
            <b>COSEC TECH SOLUTIONS SDN BHD</b>
          </div>
          <div class="acknowledgement-receipt">Acknowledgement of Receipt</div>
          <div class="document-content">
            <p>
              We/I hereby acknowledge receipt of the documents and records as set out in
              <b>Annexure A</b>
              , and confirm that the same have been received. Any discrepancy shall be notified in writing within seven
              (7) days, failing which the records shall be deemed complete and accepted.
            </p>
            <p>
              We/I further acknowledge and accept the transfer of custody of the Company’s secretarial documents and
              records as at the date of this letter.
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
            <div class="recipient-details">
              <span class="label">Designation</span>
              <span class="colon">:</span>
            </div>
            <div class="recipient-details">
              <span class="label">Date</span>
              <span class="colon">:</span>
            </div>
          </div>
        </template>
      </Paper>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import { SwitchOutLetterController } from "~/scripts/components/legal-documents/SwitchOutLetterController"

  const props = defineProps({
    companyId: {
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

  const controller = new SwitchOutLetterController(props.companyId, props.applicationId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
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
  @use "~/assets/scss/components/LegalDocuments/SwitchOutLetter" as *;
</style>
