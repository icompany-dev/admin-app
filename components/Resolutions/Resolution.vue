<template>
  <div id="resolution">
    <Paper
      v-if="props.isLoading"
      :additional-css-class="'resolution'"
      :is-printable="true"
      :page-number="1"
      :total-pages="props.totalPages"
      :show-page-number="true"
      :show-ear-mark="true"
      :ear-mark-text="props.isDcr ? 'DCR' : 'MCR'"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText.toUpperCase()"
      :is-loader="true"
    >
      <template #paperContent>
        <LoaderPrepare
          :label="controller.loaderLabel()"
          :sublabel="controller.loaderSublabel()"
        />
      </template>
    </Paper>
    <div v-if="!props.isLoading">
      <Paper
        v-for="page in pageRange"
        :additional-css-class="'resolution'"
        :is-printable="true"
        :page-number="page"
        :total-pages="props.totalPages"
        :show-page-number="true"
        :show-ear-mark="true"
        :ear-mark-text="props.isDcr ? 'DCR' : 'MCR'"
        :show-watermark="props.showWatermark"
        :watermark-text="props.watermarkText.toUpperCase()"
      >
        <template #paperMargins>
          <slot :name="`paperMargins${page}`" />
        </template>
        <template #paperContent>
          <div class="company-detail-head">
            <div class="company-name">
              {{ props.companyName }}
            </div>
            <div class="company-registration-number">
              [Company No: {{ props.registrationNumberNew }} ({{ props.registrationNumberOld }})]
            </div>
            ("Company")
            <br />
            <br />
            (Incorporated in Malaysia)
          </div>
          <div class="resolution-title">
            {{ props.resolutionTitle }}
          </div>
          <div class="resolution-content">
            <div
              v-if="page > 1"
              class="continue-page"
            >
              (Continue from Prev. Page)
            </div>
            <slot :name="`page${page}`" />
          </div>
          <div
            class="signature-section"
            v-if="page >= props.signatureStartOnPage"
          >
            <div
              class="signature-title"
              v-if="page === props.signatureStartOnPage"
            >
              {{ props.signatureTitle }}
            </div>
            <div
              class="signature-item"
              v-for="(signatureItem, index) in controller.getSignatureOnPage(page)"
              :key="index"
            >
              <Signature
                :signature-item="signatureItem"
                :is-tinted="props.isSignatureTinted"
                :tint-label="props.signatureTintLabel"
                @is-enlarged="controller.handleEnlargedSignaturePad($event)"
                @signed="emit('signed', $event)"
              />
            </div>
          </div>
          <div
            class="resolution-date"
            v-if="page === props.totalPages"
          >
            Date:
            <br />
            <input
              class="form-control in-resolution no-print"
              type="date"
              v-model="controller.documentDate.value"
            />
            <span class="date print-only">
              {{ controller.formattedDocumentDate }}
            </span>
            <!-- <span
              class="date"
              :class="{ unknown: props.resolutionDate.toLowerCase() === 'to be determined' }"
              v-html="props.resolutionDate"
            /> -->
          </div>
        </template>
      </Paper>
      <div v-if="props.hasAccompanyingDocument && !props.isLoading">
        <StatementAccompanyingMcr
          v-if="!props.isUsingTemplate"
          :company-name="props.companyName"
          :registration-number-new="props.registrationNumberNew"
          :registration-number-old="props.registrationNumberOld"
          :page-number="props.totalPages + 1"
          :total-pages="props.totalPages + 1"
          :show-watermark="props.showWatermark"
          :watermark-text="props.watermarkText"
          :resolution-title="props.resolutionName"
        />
        <Paper
          v-if="props.isUsingTemplate"
          :additional-css-class="'resolution'"
          :is-printable="true"
          :page-number="props.totalPages + 1"
          :total-pages="props.totalPages + 1"
          :show-page-number="true"
          :show-ear-mark="true"
          :ear-mark-text="props.isDcr ? 'DCR' : 'MCR'"
          :show-watermark="props.showWatermark"
          :watermark-text="props.watermarkText.toUpperCase()"
        >
          <template #paperContent>
            <div class="company-detail-head">
              <div class="company-name">
                {{ props.companyName }}
              </div>
              <div class="company-registration-number">
                [Company No: {{ props.registrationNumberNew }} ({{ props.registrationNumberOld }})]
              </div>
              ("Company")
              <br />
              <br />
              (Incorporated in Malaysia)
            </div>
            <div class="resolution-content accompanying-document">
              <slot name="accompanying-document" />
            </div>
          </template>
        </Paper>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LoaderPrepare from "~/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import Signature from "../Signatures/Signature.vue"
  import StatementAccompanyingMcr from "./StatementAccompanyingMcr.vue"
  import { ResolutionSignaturesController } from "~/scripts/components/resolutions/ResolutionSignaturesController"
  import type { IPropsResolution } from "~/scripts/props/PropsResolution"

  const props = defineProps<IPropsResolution>()

  const emit = defineEmits(["totalPageChanged", "signed", "abstain"])

  const pageRange = computed(() => {
    return Array.from({ length: props.totalPages }, (_, i) => i + 1)
  })
  const controller = new ResolutionSignaturesController(
    props.signatureItems,
    props.maxSignatureOnFirstPage,
    props.maxSignatureOnOtherPage,
    props.signatureStartOnPage
  )

  watch(
    () => props.signatureItems,
    (newVal) => {
      controller.signatureItems.value = newVal
    },
    { deep: true }
  )

  watch(
    () => props.maxSignatureOnFirstPage,
    (newVal) => {
      controller.maxSignatureOnFirstPage.value = newVal
    }
  )

  watch(
    () => props.maxSignatureOnOtherPage,
    (newVal) => {
      controller.maxSignatureOnOtherPages.value = newVal
    }
  )

  watch(
    () => props.signatureStartOnPage,
    (newVal) => {
      controller.signatureStartPage.value = newVal
    }
  )

  watch(
    () => props.totalPages,
    (newVal) => {
      emit("totalPageChanged")
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/Resolution" as *;
</style>
