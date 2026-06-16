<template>
  <div
    class="statement-accompanying-mcr"
    :id="`mcr-${props.totalPages}`"
  >
    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :ear-mark-text="'MCR'"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
      :total-pages="props.totalPages"
      :page-number="props.pageNumber"
      :additional-css-class="'resolution'"
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
          <div class="resolution-title-name">
            <b>Statement Accompanying Proposed Written Resolutions</b>
            <br />
            <b>
              <u>
                {{ controller.resolutionTitle.value }}
              </u>
            </b>
          </div>
          <ol class="padding-zero">
            <li>
              <b>Procedure to Signify Agreement</b>
              <br />
              If you agree with the resolutions proposed by the Director/Members, please indicate your agreement by
              drawing your signature at the signing portion as provided. No other action is required.
            </li>
            <li>
              <b>Return Options</b>
              ,br> You action of drawing your signature at the signing portion as provided shall mean your agreement and
              acceptance to allow the Company Secretary to do all such is necessary to effect this resolutions.
            </li>
            <li>
              <b>Irrevocabilitiy</b>
              <br />
              Once you have indicated your agreement to the written resolutions, you may not revoke your agreement.
            </li>
            <li>
              <b>Lapse Date</b>
              <br />
              If, by the end of the day on
              <span class="placeholder">{{ controller.lapseDate() }}</span>
              , sufficient agreement has not been received for the resolutions to pass, they will lapse.
            </li>
            <li>
              <b>Effects of the Resolutions</b>
              <ul class="padding-zero">
                <li>
                  <b>Ordinary Resolution:</b>
                  Requires agreement from members representing a simple majority (>50%) of the total voting rights.
                </li>
                <li>
                  <b>Special Resolution:</b>
                  Requires agreement from members representing at least 75% of the total voting rights.
                </li>
              </ul>
            </li>
          </ol>
          <p>
            <b>Date:</b>
            <span class="placeholder">{{ controller.circulationDate() }}</span>
          </p>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script setup lang="ts">
  import { PaperOrientation } from "~/scripts/constants/Paper"
  import Paper from "../Papers/Paper.vue"
  import { StatementAccompanyingMcrController } from "~/scripts/components/resolutions/StatementAccompanyingMcrController"

  const props = defineProps({
    resolutionTitle: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    registrationNumberOld: {
      type: String,
      required: true,
    },
    registrationNumberNew: {
      type: String,
      required: true,
    },
    pageNumber: {
      type: Number,
      default: 2,
    },
    totalPages: {
      type: Number,
      default: 2,
    },
    showWatermark: {
      type: Boolean,
      default: false,
    },
    watermarkText: {
      type: String,
      default: "DRAFT",
    },
  })

  const controller = new StatementAccompanyingMcrController(props.resolutionTitle)

  watch(
    () => props.resolutionTitle,
    (newVal) => [controller.setResolutionTitle(newVal)]
  )
</script>
