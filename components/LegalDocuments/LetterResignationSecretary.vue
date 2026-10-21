<template>
  <div
    id="legal-documents-letter-resignation-secretary"
    ref="documentRef"
  >
    <Paper
      :additional-css-class="controller.additionalCssClass"
      :paper-orientation="controller.paperOrientation"
      :show-page-number="false"
    >
      <template #paperContent>
        <div class="secretary-letter-head">
          <div class="secretary-name">{{ controller.selectedSecretaryName }}</div>
          <div
            class="secretary-address"
            v-html="controller.selectedSecretaryAddress"
          />
        </div>
        <div class="docuemnt-date">
          <input
            type="date"
            class="form-control in-resolution"
            v-model="controller.documentDate.value"
          />
        </div>
        <p>
          The Directors,
          <br />
          <b>{{ controller.companyName() }}</b>
        </p>
        <p>Dear Sirs,</p>
        <p>
          <u><b>RESIGNATION AS COMPANY SECRETARY</b></u>
        </p>
        <p>
          I,
          <select
            v-if="!controller.isPrinting.value"
            class="form-control in-resolution"
            v-model="controller.selectedSecretaryNric.value"
          >
            <option
              v-for="(secretary, i) in controller.secretaryOptions"
              :value="secretary.value"
            >
              {{ secretary.label }}
            </option>
          </select>
          <span v-if="controller.isPrinting.value">
            <b>{{ controller.selectedSecretaryName }} ({{ controller.selectedSecretaryLicense }})</b>
          </span>
          hereby tender my resignation as Company Secretary of the Company with effect from the date above and shall
          have no position and whatsoever responsibility for the Company.
        </p>
        <p></p>
        <p></p>
        <p>Thank you.</p>
        <div class="signature-section">
          Yours Sincerely,
          <div class="signature-image">
            <img :src="controller.selectedSecretarySignature" />
          </div>
          <div class="sign-off">
            {{ controller.selectedSecretaryName }}
            <br />
            ({{ controller.selectedSecretaryLicense }})
          </div>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script lang="ts" setup>
  import Paper from "@/components/Papers/Paper.vue"
  import { LetterResignationSecretaryController } from "~/scripts/components/legal-documents/LetterResignationSecretaryController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new LetterResignationSecretaryController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
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
  @use "~/assets/scss/components/LegalDocuments/LetterResignationSecretary" as *;
</style>
