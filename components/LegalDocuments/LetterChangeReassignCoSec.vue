<template>
  <!--
    NOTE: We cannot use Template set in Admin for this because we rely on the input to purchase the Corporate Profile.
    Until there is a stable method to fetch Corporate Profile data automatically, we have to keep this.
  -->
  <div id="legal-document-letter-change-reassign-cosec">
    <div
      class="paper-wrapper"
      ref="documentRef"
    >
      <div class="paper print legal-document portrait letter-change-reassign-cosec">
        <div
          v-if="props.showWatermark"
          class="document-watermark"
          :class="{ preview: props.isInPreviewMode }"
        >
          <div class="watermark-text">
            {{ props.watermarkText.toUpperCase() }}
          </div>
        </div>
        <div class="letter-head">
          <div class="company-name">
            <InputGroupText
              :input-value="controller.companyName.value"
              :is-input-valid="props.areValuesValid"
              :is-warning-required="false"
              :placeholder="'FULL NAME OF YOUR COMPANY'"
              :pre-or-append-value="'SDN BHD'"
              :is-append-value="true"
              v-if="controller.isDocumentEditable.value"
              :is-readonly="controller.isReadOnlyMode.value"
              @updated="controller.onNameChanged($event)"
            />
            <span v-if="!controller.isDocumentEditable.value">
              <span
                v-html="controller.getCompanyName()"
                :class="{ 'value-placeholder': controller.isDataEmpty() }"
              />
              SDN BHD
            </span>
          </div>
          <div class="company-registration-number">
            <InputGroupDualField
              :first-input-value="controller.registrationNumberNew.value"
              :second-input-value="controller.registrationNumberOld.value"
              :is-input-valid="true"
              :is-warning-required="false"
              :first-placeholder="'123456789'"
              :second-placeholder="'123456-X'"
              :pre-or-append-value="'Company No:'"
              :is-append-value="false"
              :is-prepend-value="true"
              v-if="controller.isDocumentEditable.value"
              :is-readonly="controller.isReadOnlyMode.value"
              @updatedFirst="controller.onRegistrationNumberNewUpdated($event)"
              @updatedSecond="controller.onRegistrationNumberOldUpdated($event)"
            >
              <template #divider1>(</template>
              <template #divider2>)</template>
            </InputGroupDualField>
            <span v-if="!controller.isDocumentEditable.value">
              <b>Company No:</b>
              <span :class="{ 'value-placeholder': controller.isDataEmpty() }">
                {{ controller.getRegistrationNumberNew() }} ({{ controller.getRegistrationNumberOld() }})
              </span>
            </span>
          </div>
          <div
            class="validated-message"
            v-if="!props.areValuesValid"
          >
            {{ props.validationMessage }}
          </div>
          <div class="incorporated-location">(Incorporated in Malaysia)</div>
        </div>
        <div class="document-date">
          <span class="label">Date:</span>
          <span :class="{ placeholder: !controller.hasDocumentDate() }">
            {{ controller.formattedDocumentDate() }}
          </span>
        </div>
        <div class="cosec-company-address">
          <div class="input-field">
            <input
              type="text"
              class="form-control"
              v-model="controller.cosecCompanyName.value"
              :readonly="controller.isReadOnlyMode.value"
              :placeholder="'NAME OF FIRM'"
              v-if="controller.isDocumentEditable.value"
            />
            <span
              class="cosec-company-name"
              v-if="!controller.isDocumentEditable.value"
            >
              {{ controller.cosecCompanyName.value }}
            </span>
          </div>
          <div class="input-field">
            <input
              type="text"
              class="form-control"
              v-model="controller.cosecAddressLine1.value"
              :readonly="controller.isReadOnlyMode.value"
              :placeholder="'Address Line 1'"
              v-if="controller.isDocumentEditable.value"
            />
            <span
              class="cosec-address"
              v-if="!controller.isDocumentEditable.value"
            >
              {{ controller.cosecAddressLine1.value }}
            </span>
          </div>
          <div class="input-field">
            <input
              type="text"
              class="form-control"
              v-model="controller.cosecAddressLine2.value"
              :readonly="controller.isReadOnlyMode.value"
              :placeholder="'Address Line 2'"
              v-if="controller.isDocumentEditable.value"
            />
            <span
              class="cosec-address"
              v-if="!controller.isDocumentEditable.value"
            >
              {{ controller.cosecAddressLine2.value }}
            </span>
          </div>
          <div class="input-field">
            <input
              type="text"
              class="form-control postcode"
              v-model="controller.cosecAddressPostCode.value"
              :readonly="controller.isReadOnlyMode.value"
              :placeholder="'Postcode'"
              v-if="controller.isDocumentEditable.value"
            />
            <input
              type="text"
              class="form-control city"
              v-model="controller.cosecAddressCity.value"
              :readonly="controller.isReadOnlyMode.value"
              :placeholder="'City'"
              v-if="controller.isDocumentEditable.value"
            />
            <span
              class="cosec-address"
              v-if="!controller.isDocumentEditable.value"
            >
              {{ controller.cosecAddressPostCode.value }} {{ controller.cosecAddressCity.value }}
            </span>
          </div>
          <div class="input-field">
            <input
              type="text"
              class="form-control"
              v-model="controller.cosecAddressState.value"
              :readonly="controller.isReadOnlyMode.value"
              :placeholder="'State'"
              v-if="controller.isDocumentEditable.value"
            />
            <span
              class="cosec-address"
              v-if="!controller.isDocumentEditable.value"
            >
              {{ controller.cosecAddressState.value }}
            </span>
          </div>
        </div>
        <div class="attention-to">
          <div
            class="non-editable-details"
            v-if="!controller.isDocumentEditable.value"
          >
            <div class="label">Attention:</div>
            <div class="details">
              <span class="cosec-name">{{ controller.cosecName.value }}</span>
              <span>{{ controller.cosecPhone.value }}</span>
              <span>{{ controller.cosecEmail.value }}</span>
            </div>
          </div>
          <div
            class="cosec-name"
            v-if="controller.isDocumentEditable.value"
          >
            <InputGroupText
              :input-value="controller.cosecName.value"
              :placeholder="'Name of Your Company Secretary'"
              :pre-or-append-value="'Attention:'"
              :is-append-value="false"
              :is-prepend-value="true"
              :is-input-valid="true"
              :is-warning-required="false"
              :is-readonly="controller.isReadOnlyMode.value"
              @updated="controller.cosecName.value = $event"
            />
          </div>
          <div
            class="cosec-contact-details"
            v-if="controller.isDocumentEditable.value"
          >
            <InputGroupText
              :input-value="controller.cosecPhone.value"
              :placeholder="'Any number that we can contact'"
              :pre-or-append-value="'Contact No:'"
              :is-append-value="false"
              :is-prepend-value="true"
              :is-input-valid="true"
              :is-warning-required="false"
              :is-readonly="controller.isReadOnlyMode.value"
              @updated="controller.cosecPhone.value = $event"
            />
          </div>
          <div
            class="cosec-contact-details"
            v-if="controller.isDocumentEditable.value"
          >
            <InputGroupText
              :input-value="controller.cosecEmail.value"
              :placeholder="`Your Company Secretary's Email`"
              :pre-or-append-value="'Email:'"
              :is-append-value="false"
              :is-prepend-value="true"
              :is-input-valid="true"
              :is-warning-required="false"
              :is-readonly="controller.isReadOnlyMode.value"
              @updated="controller.cosecEmail.value = $event"
            />
          </div>
        </div>
        <div class="greeting">Dear Sir/Madam,</div>
        <div class="letter-title">RE: CHANGE AND/OR REASSIGNMENT OF COMPANY SECRETARY</div>
        <div class="letter-content">
          <p>We wish to change and reassign our Company Secretary to iCompany Malaysia ("iCompany").</p>
          <p>
            Therefore, as the current Company Secretary on record, we appreciate your assistance to provide the
            following documents (or its equivalent) to this email:
            <span class="link">connect@icompany.my</span>
            .
          </p>
          <ol>
            <li>Section 14;</li>
            <li>Latest Section 46(3);</li>
            <li>All Available Section 58;</li>
            <li>Latest Section 78 or Section 51; and</li>
            <li>Memorandum & Articles of Association / Constitution of the Company (if any).</li>
          </ol>
          <p>
            iCompany will contact you to arrange the collection of any physical items or documents belonging to the
            Company, or any other related matters
          </p>
          <p>Please do advise us on all the outstanding bills due to you for settlement, if any.</p>
          <p>We thank you for the past services rendered.</p>
          <p>Thank you.</p>
        </div>
        <div class="letter-sign-off">
          <div class="sign-off-title">
            For and on behalf of
            <div class="company-name">
              <span :class="{ placeholder: controller.companyName.value.length <= 0 }">
                {{ controller.getCompanyNameForSignOff() }}
              </span>
              SDN BHD
            </div>
          </div>
          <Signature
            :signature-item="controller.signatureItem.value"
            :is-readonly="props.isInPreviewMode"
            @signed="emit('signed', $event)"
          />
        </div>
        <div class="paper-page-number">Page 1 of 1</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import InputGroupText from "../Forms/InputGroupText.vue"
  import InputGroupDualField from "../Forms/InputGroupDualField.vue"
  import Signature from "../Signatures/Signature.vue"
  import { LetterChangeReassignCoSecController } from "~/scripts/components/legal-documents/LetterChangeReassignCoSecController"
  import type { IPropsLetterChangeReassignCosec } from "~/scripts/props/PropsLetterChangeReassignCosec"

  const props = defineProps<IPropsLetterChangeReassignCosec>()

  const emit = defineEmits(["update", "nameChanged", "registrationNoNewUpdated", "registrationNoOldUpdated", "signed"])

  const documentRef = ref(null)

  const controller = new LetterChangeReassignCoSecController(
    props.companyName,
    props.registrationNumberNew,
    props.registrationNumberOld,
    props.cosecCompanyName,
    props.cosecAddressLine1,
    props.cosecAddressLine2,
    props.cosecAddressPostCode,
    props.cosecAddressCity,
    props.cosecAddressState,
    props.cosecName,
    props.cosecEmail,
    props.cosecPhone,
    props.directorName,
    props.isDocumentEditable,
    props.isReadonly,
    props.signatureUrl,
    props.documentDate,
    props.hasSigned,
    props.isSignatureEditable,
    props.isSignatureHidden,
    emit
  )

  watch(
    () => props.companyName,
    (newVal) => {
      controller.setCompanyName(newVal)
    }
  )

  watch(
    () => props.registrationNumberNew,
    (newVal) => {
      controller.setRegistrationNumberNew(newVal)
    }
  )

  watch(
    () => props.registrationNumberOld,
    (newVal) => {
      controller.setRegistrationNumberOld(newVal)
    }
  )

  watch(
    () => props.cosecCompanyName,
    (newVal) => {
      controller.setCosecCompanyName(newVal)
    }
  )

  watch(
    () => props.cosecAddressLine1,
    (newVal) => {
      controller.setCosecAddressLine1(newVal)
    }
  )

  watch(
    () => props.cosecAddressLine2,
    (newVal) => {
      controller.setCosecAddressLine2(newVal)
    }
  )

  watch(
    () => props.cosecAddressPostCode,
    (newVal) => {
      controller.setCosecAddressPostCode(newVal)
    }
  )

  watch(
    () => props.cosecAddressCity,
    (newVal) => {
      controller.setCosecAddressCity(newVal)
    }
  )

  watch(
    () => props.cosecAddressState,
    (newVal) => {
      controller.setCosecAddressState(newVal)
    }
  )

  watch(
    () => props.cosecName,
    (newVal) => {
      controller.setCosecName(newVal)
    }
  )

  watch(
    () => props.cosecEmail,
    (newVal) => {
      controller.setCosecEmail(newVal)
    }
  )

  watch(
    () => props.cosecPhone,
    (newVal) => {
      controller.setCosecPhone(newVal)
    }
  )

  watch(
    () => props.directorName,
    (newVal) => {
      controller.setDirectorName(newVal)
    }
  )

  watch(
    () => props.isDocumentEditable,
    (newVal) => {
      controller.setIsDocumentEditable(newVal)
    }
  )

  watch(
    () => props.isReadonly,
    (newVal) => {
      controller.setIsReadOnly(newVal)
    }
  )

  watch(
    () => props.signatureUrl,
    (newVal) => {
      controller.setSignatureUrl(newVal)
    }
  )

  watch(
    () => props.documentDate,
    (newVal) => {
      controller.setDocumentDate(newVal)
    }
  )

  watch(
    () => props.hasSigned,
    (newVal) => {
      controller.setHasSigned(newVal)
    }
  )

  watch(
    () => props.isSignatureEditable,
    (newVal) => {
      controller.setIsSignatureEditable(newVal)
    }
  )

  watch(
    () => props.isSignatureHidden,
    (newVal) => {
      controller.setIsSignatureHidden(newVal)
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
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/LetterChangeReassignCosec" as *;
</style>
