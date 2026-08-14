<template>
  <div id="legal-document-section-132">
    <div
      class="paper-wrapper"
      v-for="(director, index) in controller.directorUsers.value"
      :key="index"
      :id="`dcr-${props.startPageNumber + index}`"
    >
      <div
        class="paper print legal-document section-132"
        :class="controller.paperOrientation"
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
        <div class="registration-number">
          Registration No.
          <div class="box">
            {{ controller.company.value.registrationNumberNew }} ({{ controller.company.value.registrationNumberOld }})
          </div>
        </div>
        <div class="document-header">
          <div>Companies Act 2016</div>
          <div>Section 132</div>
          <div>Declaration of Solvency</div>
        </div>
        <div class="company-details">
          <div class="detail">
            <div class="label">Company name:</div>
            <div>:</div>
            <div class="info">{{ controller.companyName() }}</div>
          </div>
          <div class="detail">
            <div class="label">Registration No.:</div>
            <div>:</div>
            <div class="info">
              {{ controller.company.value.registrationNumberNew }} ({{
                controller.company.value.registrationNumberOld
              }})
            </div>
          </div>
        </div>
        <div class="document-title">Declaration</div>
        <div class="document-content">
          <p>
            I {{ director.name }} (MyKad No / Passport No: {{ controller.getDirectorIdentification(director) }}) of
            {{ controller.getDirectorAddress(director) }}.
          </p>
          <p>
            Being *all/*majority of the Director of {{ controller.companyName() }} [{{
              controller.company.value.registrationNumberNew
            }}
            ({{ controller.company.value.registrationNumberOld }})] have vide a Directors' Resolution in Writing of the
            Company declare that -
          </p>
          <ol class="alpha-list">
            <li>I have made an inquiry into the affairs of the company;</li>
            <li>
              I have formed the opinion that there will be no ground on which the Company could be found to be unable to
              pay its debts;
            </li>
            <li>
              the Company will be able to pay its debts in full as and when the debts become due during the period of
              twelve (12) months immediately following the payment of dividend; and
            </li>
            <li>
              the assets of the Company are more than the liabilities of the Company as at the date of this statement.
            </li>
          </ol>
          <p>
            <b>
              Declared on
              <span :class="{ placeholder: !controller.hasDirectorSigned(director) }">
                {{ controller.getDirectorSignatureDate(director) }}
              </span>
            </b>
          </p>
        </div>
        <div class="signature-container">
          <div class="sign-off">Signed By</div>
          <Signature
            v-if="!controller.isLoading.value"
            :signature-item="controller.getDirectorSignatureItem(director)"
            @signed="controller.onSigned($event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Signature from "../Signatures/Signature.vue"
  import { Section132Controller } from "~/scripts/components/legal-documents/Section132Controller"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: String,
      default: "",
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
    startPageNumber: {
      type: Number,
      default: 1,
    },
  })

  const emit = defineEmits(["update", "signed", "totalPageChanged"])

  const controller = new Section132Controller(props.companyId, props.applicationId, props.isInPreviewMode, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
      controller.onCompanyIdChanged()
    }
  )

  watch(
    () => props.applicationId,
    async (newVal) => {
      await controller.setApplicationId(newVal)
      controller.setSignatureItems()
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
      controller.setSignatureItems()
    }
  )

  watch(
    () => controller.directors.value,
    () => {
      emit("totalPageChanged")
    },
    { deep: true }
  )

  defineExpose({
    totalPages: () => controller.directors.value.length,
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/Section132" as *;
</style>
