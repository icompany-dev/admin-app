<template>
  <div class="legal-document-section-85">
    <div class="paper-wrapper" ref="documentRef">
      <div class="paper print legal-document portrait section-85">
        <div v-if="props.showWatermark" class="document-watermark" :class="props.watermarkText.toLowerCase()">
          <div class="watermark-text">
            {{ props.watermarkText }}
          </div>
        </div>
        <div class="letter-head">
          <div class="company-name">
            {{ controller.companyName() }}
          </div>
          <div class="registration-no">
            Company No. {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
          </div>
          <div class="company-incorporated-in">
            (Incorporated in Malaysia)
          </div>
          <div>
            (the "Company")
          </div>
        </div>

        <div class="document-date">
          {{ controller.formattedNotificationDate() }}
        </div>

        <div class="title-address">
          <span>The Shareholders of</span>
          <div class="text-uppercase fw-bold">
            {{ controller.companyName() }}
          </div>
          <div class="company-address">
            <span v-html="controller.companyAddress()" />
          </div>
        </div>

        <div class="attention-to">
          Attention to: {{ controller.shareholderName() }}
        </div>

        <div class="greeting">
          Dear Sirs/Madam,
        </div>

        <div class="title">
          Notice of Pre-Emptive Rights Pursuant to Section 85 of the Companies Act 2016
        </div>

        <div class="content">
          <p>
            We would like to inform you that the Company is planning to issue new shares. As a shareholder, you have the
            right to subscribe to these shares before they are offered to others pursuant to Section 85 of the Companies
            Act 2016. This pre-emptive right allows you to maintain your ownership percentage by purchasing new shares
            in
            proportion to your current holdings.
          </p>
          <p>
            If we receive no response from you by <b>{{ controller.formattedExpiryDate() }}</b>, you hereby
            automatically
            consent to waive your pre-emptive rights to the new shares.
          </p>
          <p>
            Reach out to the Company Secretary at connect@icompany.my.
          </p>
        </div>

        <div class="signature-container">
          <div class="signature">
            Yours faithfully,
            <Signature :signature-item="controller.initiatorSignatureItem.value"
              @signed="controller.onInitiatorSign($event)" />
          </div>
        </div>
        <hr>
        <div class="content">
          <p>
            {{ controller.pronoun() }}, <b>{{ controller.shareholderName() }}</b>, acknowledge receipt of the
            Pre-emptive Rights Notice dated
            {{ controller.formattedNotificationDate() }} (Section 85 of the Companies Act 2016) and:
          </p>
          <div class="form-check">
            <input class="form-check-input" type="checkbox" :disabled="!controller.canRespond()"
              :checked="controller.isSubscribe()" @change="controller.onCheckboxClick(true)">
            <label class="mt-1">
              {{ controller.pronoun() }} wish to subscribe to the new shares offered.
              <span v-if="controller.hasResponseDate()" class="fw-bold">
                (w.e.f {{ controller.formattedResponseDate() }})
              </span>
              <span v-if="!controller.hasResponseDate()" class="fw-bold">(w.e.f <em>(Date of signature)</em>)</span>
            </label>
          </div>
          <div class="form-check">
            <input type="checkbox" class="form-check-input" :disabled="!controller.canRespond()"
              :checked="controller.isWaived()" @change="controller.onCheckboxClick(false)">
            <label class="mt-1">
              {{ controller.pronoun() }} waive {{ controller.possesivePronoun() }} pre-emptive right and do not wish to
              subscribe.
              <span v-if="controller.hasResponseDate()" class="fw-bold">
                (w.e.f {{ controller.formattedResponseDate() }})
              </span>
              <span v-if="!controller.hasResponseDate()" class="fw-bold">(w.e.f <em>(Date of signature)</em>)</span>
            </label>
          </div>
        </div>
        <div class="signature-container">
          <div class="signature">
            <Signature :signature-item="controller.responseSignatureItem.value"
              @signed="controller.onResponseSign($event)" />
            <span v-if="controller.hasResponseDate()" class="post-signature">Date : {{
          controller.formattedResponseDate() }}</span>
            <span v-if="!controller.hasResponseDate()" class="post-signature">Date : <em>(Date of signature)</em></span>
          </div>
        </div>
        <div class="paper-page-number">
          Page 1 of 1
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Signature from '../Signatures/Signature.vue'
import { SignatureItem } from '~/scripts/types/SignatureItem'
import { Section85PreemptiveRightNoticeController } from '~/scripts/components/legal-documents/Section85PreemptiveRightNoticeController'
import { CompanyShareIssuanceResponse } from '~/scripts/models/CompanyShareIssuanceResponse'

const props = defineProps({
  companyId: {
    type: String,
    required: true
  },
  initiatorSignatureItem: {
    type: SignatureItem,
    required: true
  },
  noticeResponse: {
    type: CompanyShareIssuanceResponse,
    required: true
  },
  responseSignatureItem: {
    type: SignatureItem,
    required: true
  },
  notificationDate: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  showWatermark: {
    type: Boolean,
    default: false
  },
  watermarkText: {
    type: String,
    default: 'DRAFT'
  },
  isInPreviewMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['initiatorSigned', 'responseSigned', 'responded'])

const controller = new Section85PreemptiveRightNoticeController(
  props.companyId,
  props.initiatorSignatureItem,
  props.noticeResponse,
  props.responseSignatureItem,
  props.notificationDate,
  props.expiryDate,
  emit
)

watch(() => props.companyId, (newVal) => {
  controller.setCompanyId(newVal)
})

watch(() => props.initiatorSignatureItem, (newVal) => {
  controller.setInitiatorSignatureItem(newVal)
})

watch(() => props.noticeResponse, (newVal) => {
  controller.setNoticeResponse(newVal)
})

watch(() => props.responseSignatureItem, (newVal) => {
  controller.setResponseSignatureItem(newVal)
})

watch(() => props.notificationDate, (newVal) => {
  controller.setNotificationDate(newVal)
})

watch(() => props.expiryDate, (newVal) => {
  controller.setExpiryDate(newVal)
})

defineExpose({
  getInitiatorSignature: controller.getInitiatorSignature.bind(controller),
  getResponseSignature: controller.getResponseSignature.bind(controller),
  getNoticeResponse: controller.getNoticeResponse.bind(controller)
})
</script>

<style lang="scss">
@use '~/assets/scss/components/LegalDocuments/Section85PreemptiveRightNotice' as *;
</style>