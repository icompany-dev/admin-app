<template>
  <div
    class="paper-wrapper"
    :class="`${props.paperOrientation} ${props.isLoader ? 'loader' : ''}`"
  >
    <slot name="paperMargins" />
    <div
      class="paper"
      :class="`${props.paperOrientation} ${props.additionalCssClass} ${props.isPrintable ? 'print' : ''}`"
    >
      <div
        v-if="props.showWatermark"
        class="document-watermark no-print"
        :class="props.watermarkText.toLowerCase()"
      >
        <div class="watermark-text">
          {{ props.watermarkText }}
        </div>
      </div>
      <div
        class="document-ear-mark"
        v-if="props.showEarMark"
      >
        <div class="document-text">
          {{ props.earMarkText }}
        </div>
      </div>
      <div
        class="icompany-logo"
        v-if="props.isIncludeLogo"
      />
      <div
        v-if="props.isUseLetterHead"
        class="icompany-letter-head"
      >
        <div class="logo" />
        <div class="qr">
          <img src="https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/logo/icompany_qr_official.png" />
        </div>
      </div>
      <div class="paper-content">
        <slot name="paperContent" />
      </div>
      <div
        v-if="props.showPageNumber"
        class="paper-page-number"
      >
        Page {{ props.pageNumber }} of {{ props.totalPages }}
      </div>
      <div
        class="icompany-footer"
        v-if="props.isUseLetterHead"
      >
        <div class="icon-sections">
          <div class="icon-section">
            <div class="icon">
              <i class="fa-solid fa-mobile-screen" />
            </div>
            <div class="text-detail">
              +6017 778 3260
              <span class="sub-text">(10am to 12pm & 3pm to 5pm)</span>
            </div>
          </div>
          <div class="icon-section">
            <div class="icon">
              <i class="fa-solid fa-location-pin" />
            </div>
            <div class="text-detail">
              D-1-6 Blok D Sekitar26 Enterprise 40400
              <br />
              Shah Alam Selangor Darul Ehsan Malaysia
            </div>
          </div>
          <div class="icon-section">
            <div class="icon">
              <i class="fa-solid fa-envelope" />
            </div>
            <div class="text-detail">
              connect@icompany.my
              <span class="sub-text">for general enquiries and collaborations.</span>
            </div>
          </div>
        </div>
        <div class="subtitle">
          a brand under
          <b>Cosec Tech Solutions Sdn Bhd</b>
          Company No. 202301032770 (1526693-W)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PaperController } from "~/scripts/components/papers/PaperController"
  import { PaperOrientation } from "~/scripts/constants/Paper"

  const props = defineProps({
    paperOrientation: {
      type: String,
      default: PaperOrientation.Portrait,
    },
    additionalCssClass: {
      type: String,
      default: "",
    },
    isIncludeLogo: {
      type: Boolean,
      default: false,
    },
    isUseLetterHead: {
      type: Boolean,
      default: false,
    },
    isPrintable: {
      type: Boolean,
      default: true,
    },
    pageNumber: {
      type: Number,
      default: 1,
    },
    totalPages: {
      type: Number,
      default: 1,
    },
    showPageNumber: {
      type: Boolean,
      default: true,
    },
    showEarMark: {
      type: Boolean,
      default: false,
    },
    earMarkText: {
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
    isLoader: {
      type: Boolean,
      defaul: false,
    },
  })

  const controller = new PaperController()
</script>
