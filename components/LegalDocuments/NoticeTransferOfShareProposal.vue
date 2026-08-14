<template>
  <div id="legal-document-notice-transfer-of-share-proposal">
    <div class="paper-wrapper">
      <LoaderPrepare
        v-if="controller.isLoading.value"
        :label="`Retrieving Details`"
        :sublabel="`of Notice`"
      />
      <div
        v-if="!controller.isLoading.value"
        class="paper print legal-document portrait notice-of-share-transfer"
      >
        <div
          v-if="props.showWatermark"
          class="document-watermark"
          :class="{ preview: controller.isInPreviewMode.value }"
        >
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
          <div class="company-incorporated-in">(Incorporated in Malaysia)</div>
          <div>(the "Company")</div>
        </div>
        <div
          class="document-date"
          :class="{ placeholder: !controller.hasNoticeDate() }"
        >
          Date: {{ controller.noticeDate() }}
        </div>
        <div class="title-address">
          <div>The Shareholders of</div>
          <div class="company-name">
            {{ controller.companyName() }}
          </div>
          <div
            class="company-address"
            v-html="controller.companyAddress()"
          />
        </div>
        <div class="attention-to">
          Attention to:
          <span class="text-uppercase">
            {{ controller.attentionTo() }}
          </span>
        </div>
        <div class="greeting">Dear Sirs/Madam,</div>
        <div class="title">
          <div class="company-name">
            {{ controller.companyName() }}
          </div>
          <div>[Company No: {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})]</div>
          <div>Notice of Proposed Share Transfer</div>
        </div>
        <div class="content">
          <p>
            This notice is to inform you that a Proposed Transfer of Shares is initiated for
            <span class="company-name">{{ controller.companyName() }}</span>
            , which is currently under review.
          </p>
          <p>The details of the proposed transfer are as follows:</p>
          <table class="notice-table with-border">
            <thead>
              <tr>
                <td>Transferor</td>
                <td>Transferee</td>
                <td>No. of {{ controller.typeOfShares() }} Shares</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(transferDetail, index) in controller.transferDetails.value"
                :key="index"
              >
                <td>
                  <select
                    class="form-control in-resolution"
                    v-if="controller.isDocumentEditable()"
                    v-model="transferDetail.transferFromId"
                    :disabled="!controller.canEdit()"
                    @change="controller.onAssignToTransferFrom(index, $event)"
                  >
                    <option
                      v-for="(shareholder, i) in controller.shareholders.value"
                      :key="`select-${i}`"
                      :value="shareholder.id"
                    >
                      {{ shareholder.fullName().toUpperCase() }} (Total Shares: {{ shareholder.ordinaryShares }})
                    </option>
                  </select>
                  <span v-if="!controller.isDocumentEditable()">
                    {{ transferDetail.transferFromName }}
                  </span>
                </td>
                <td>
                  <div v-if="controller.isDocumentEditable()">
                    <template v-if="!controller.isTransferToNew(transferDetail)">
                      <select
                        class="form-control in-resolution"
                        v-if="!transferDetail.isNewTransferee"
                        v-model="transferDetail.transferToId"
                        :disabled="!controller.canEdit()"
                        @change="controller.onAssignToTransferTo(index, $event)"
                      >
                        >
                        <option
                          v-for="(shareholder, i) in controller.shareholders.value"
                          :key="`select-${i}`"
                          :value="shareholder.id"
                        >
                          {{ shareholder.fullName().toUpperCase() }}
                        </option>
                      </select>
                      <span
                        class="add-more change-type"
                        @click="controller.onTransferToNew(transferDetail)"
                      >
                        Transfer to New Shareholder
                      </span>
                    </template>
                    <template v-if="controller.isTransferToNew(transferDetail)">
                      <select
                        class="form-control in-resolution"
                        v-model="transferDetail.transferToType"
                      >
                        <option :value="ShareholdingType.Individual">Individual</option>
                        <option :value="ShareholdingType.Representative">Corporate Body</option>
                      </select>
                      <div class="form-group">
                        <input
                          type="text"
                          class="form-control in-resolution"
                          :placeholder="controller.placeholderForName(transferDetail)"
                          v-model="transferDetail.transferToName"
                        />
                      </div>
                      <div class="form-group">
                        <input
                          type="text"
                          class="form-control in-resolution"
                          :placeholder="controller.placeholderForIdentification(transferDetail)"
                          v-model="transferDetail.transferToIdentification"
                        />
                      </div>
                      <div
                        class="form-group"
                        v-if="controller.isTransferToCorporateBody(transferDetail)"
                      >
                        <input
                          type="text"
                          class="form-control in-resolution"
                          :placeholder="controller.placeholderForIdentificationOld(transferDetail)"
                          v-model="transferDetail.transferToIdentificationAdditional"
                        />
                      </div>
                      <div class="form-group">
                        <input
                          type="text"
                          class="form-control in-resolution"
                          :placeholder="controller.placeholderForEmail(transferDetail)"
                          @change="controller.onSetEmail($event, transferDetail)"
                        />
                      </div>
                      <span
                        class="add-more change-type"
                        @click="controller.onTransferToExisting(transferDetail)"
                      >
                        Transfer to Existing Shareholder
                      </span>
                    </template>
                  </div>
                  <span v-if="!controller.isDocumentEditable()">
                    {{ transferDetail.transferToName }}
                  </span>
                </td>
                <td class="unit-shares">
                  <span
                    v-if="controller.canRemoveTransferDetails()"
                    class="remove"
                  >
                    <i
                      class="fa-solid fa-xmark"
                      @click="controller.onRemoveTransferDetail(transferDetail.id)"
                    ></i>
                  </span>
                  <input
                    type="number"
                    class="form-control in-resolution"
                    v-model="transferDetail.unitsOfShare"
                    :disabled="!controller.canEdit()"
                    v-if="controller.isDocumentEditable()"
                    @change="controller.onAmountUpdated(index)"
                  />
                  <span v-if="!controller.isDocumentEditable()">
                    {{ transferDetail.unitsOfShare }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-if="controller.canAddTransferDetails()">
            <span
              class="add-more"
              @click="controller.onAddTransferDetail()"
            >
              + Add More
            </span>
          </p>
          <p>
            This transfer is subject to approval and the necessary requirements as outlined in the Companies Act 2016.
            Reach out to the Company Secretary at connect@icompany.my.
          </p>
          <p>Thank you.</p>
        </div>
        <div class="signature-container">
          <div class="sign-off">Your faithfully,</div>
          <Signature
            :signature-item="controller.initiatorSignatureItem.value"
            @signed="controller.onInitiatorSigned($event)"
          />
        </div>
        <div
          class="divider"
          v-if="controller.showAcknowledgementOnFirstPage()"
        />
        <div
          class="notice-acknowledged"
          v-if="controller.showAcknowledgementOnFirstPage()"
        >
          <div class="acknowledge-title">
            {{ controller.acknowledgementTitle() }}
          </div>
          <div class="acknowledge-content">
            {{ controller.pronoun() }}, {{ controller.shareholderName() }}, acknowledge receipt of the notice dated
            <span
              class="date"
              :class="{ placeholder: !controller.hasNoticeDate() }"
            >
              {{ controller.noticeDate() }}
            </span>
            regarding the proposed transfer of shares{{ controller.isConsentRequired() ? " and" : "." }}
          </div>
          <div
            class="acknowledge-consent"
            v-if="controller.isConsentRequired()"
          >
            <div class="form-check">
              <input
                type="checkbox"
                class="form-control"
                :checked="controller.isConsented.value"
                @click="controller.onConsentClicked()"
              />
              <label>
                {{ controller.pronoun() }} consent and will affix {{ controller.possessivePronoun() }} signature to the
                Share Transfer.
                <span v-if="controller.isConsented.value">
                  (
                  <b>w.ef.</b>
                  <span
                    class="date"
                    :class="{ placeholder: !controller.hasNoticeDate() }"
                  >
                    {{ controller.signatureDate() }}
                  </span>
                  )
                </span>
              </label>
            </div>
            <div class="form-check">
              <input
                type="checkbox"
                class="form-control"
                :checked="!controller.isConsented.value"
                :disabled="!controller.canRespond()"
                @click="controller.onConsentClicked()"
              />
              <label>
                {{ controller.pronoun() }} do not consent to the Proposed Share Transfer.
                <span v-if="!controller.isConsented.value">
                  (
                  <b>w.ef.</b>
                  <span
                    class="date"
                    :class="{ placeholder: !controller.hasNoticeDate() }"
                  >
                    {{ controller.signatureDate() }}
                  </span>
                  )
                </span>
              </label>
            </div>
          </div>
          <div class="signature-container">
            <Signature
              :signature-item="controller.shareholderSignatureItem.value"
              @signed="controller.onShareholderSigned($event)"
            />
            <div class="signature-date">
              Date:
              <span
                class="date"
                :class="{ placeholder: !controller.hasNoticeDate() }"
              >
                {{ controller.signatureDate() }}
              </span>
            </div>
          </div>
        </div>
        <div class="paper-page-number">Page 1 of 1</div>
      </div>
    </div>
    <div
      class="paper-wrapper"
      v-if="!controller.showAcknowledgementOnFirstPage() && !controller.isLoading.value"
    >
      <div class="paper print legal-document portrait notice-of-share-transfer">
        <div
          v-if="props.showWatermark"
          class="document-watermark"
          :class="{ preview: controller.isInPreviewMode.value }"
        >
          <div class="watermark-text">
            {{ props.watermarkText }}
          </div>
        </div>
        <div class="divider" />
        <div class="notice-acknowledged">
          <div class="acknowledge-title">
            {{ controller.acknowledgementTitle() }}
          </div>
          <div class="acknowledge-content">
            {{ controller.pronoun() }}, {{ controller.shareholderName() }}, acknowledge receipt of the notice dated
            <span
              class="date"
              :class="{ placeholder: !controller.hasNoticeDate() }"
            >
              {{ controller.noticeDate() }}
            </span>
            regarding the proposed transfer of shares{{ controller.isConsentRequired() ? " and" : "." }}
          </div>
          <div
            class="acknowledge-consent"
            v-if="controller.isConsentRequired()"
          >
            <div class="form-check">
              <input
                type="checkbox"
                class="form-control"
                :checked="controller.isConsented.value"
                @click="controller.onConsentClicked()"
              />
              <label>
                {{ controller.pronoun() }} consent and will affix {{ controller.possessivePronoun() }} signature to the
                Share Transfer.
                <span v-if="controller.isConsented.value">
                  (
                  <b>w.ef.</b>
                  <span
                    class="date"
                    :class="{ placeholder: !controller.hasNoticeDate() }"
                  >
                    {{ controller.signatureDate() }}
                  </span>
                  )
                </span>
              </label>
            </div>
            <div class="form-check">
              <input
                type="checkbox"
                class="form-control"
                :checked="!controller.isConsented.value"
                :disabled="!controller.canRespond()"
                @click="controller.onConsentClicked()"
              />
              <label>
                {{ controller.pronoun() }} do not consent to the Proposed Share Transfer.
                <span v-if="!controller.isConsented.value">
                  (
                  <b>w.ef.</b>
                  <span
                    class="date"
                    :class="{ placeholder: !controller.hasNoticeDate() }"
                  >
                    {{ controller.signatureDate() }}
                  </span>
                  )
                </span>
              </label>
            </div>
          </div>
          <div class="signature-container">
            <Signature
              :signature-item="controller.shareholderSignatureItem.value"
              @signed="controller.onShareholderSigned($event)"
            />
            <div class="signature-date">
              Date:
              <span
                class="date"
                :class="{ placeholder: !controller.hasNoticeDate() }"
              >
                {{ controller.signatureDate() }}
              </span>
            </div>
          </div>
          <div class="paper-page-number">Page 1 of 1</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LoaderPrepare from "~/components/Loaders/Prepare.vue"
  import Signature from "~/components/Signatures/Signature.vue"
  import { NoticeTransferOfShareProposalController } from "~/scripts/components/legal-documents/NoticeTransferOfShareProposalController"
  import { ShareholdingType } from "~/scripts/constants/Shareholder"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    transferId: {
      type: String,
      default: "",
    },
    shareholderId: {
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
    isReadOnly: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(["update", "signed", "back", "transferDetailsUpdated"])

  const documentRef = ref(null)

  const controller = new NoticeTransferOfShareProposalController(
    props.companyId,
    props.transferId,
    props.shareholderId,
    props.isReadOnly,
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
    () => props.transferId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
  )

  watch(
    () => props.shareholderId,
    (newVal) => {
      controller.setShareholderId(newVal)
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
      controller.setInitiatorSignatureItem()
      controller.setShareholderSignatureItem()
    }
  )

  watch(
    () => props.isReadOnly,
    (newVal) => {
      controller.setIsReadOnly(newVal)
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
    setApplication: controller.setApplication.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/NoticeTransferOfShareProposal" as *;
</style>
