<template>
  <div id="dcr-appointment-of-new-company-secretary">
    <Paper
      v-for="page in pageRange"
      :key="page"
      :id="`dcr-${page}`"
      :additional-css-class="'resolution'"
      :paper-orientation="PaperOrientation.Portrait"
      :total-pages="controller.totalPages()"
      :page-number="page"
      :show-page-number="true"
    >
      <template #paperContent>
        <div class="company-detail-head">
          <div class="company-name">
            <InputGroupText
              :input-value="controller.application.value.name"
              :is-input-valid="true"
              :is-warning-required="false"
              :placeholder="'FULL NAME OF YOUR COMPANY'"
              :pre-or-append-value="'SDN BHD'"
              :is-append-value="true"
              v-if="controller.isDocumentEditable()"
              :is-readonly="false"
              @updated="controller.onNameChanged($event)"
            />
            <span v-if="!controller.isDocumentEditable()">
              {{ controller.companyName() }}
            </span>
          </div>
          <div class="company-registration-number">
            <InputGroupDualField
              :first-input-value="controller.application.value.registrationNumberNew"
              :second-input-value="controller.application.value.registrationNumberOld"
              :is-input-valid="true"
              :is-warning-required="false"
              :first-placeholder="'123456789'"
              :second-placeholder="'123456-X'"
              :pre-or-append-value="'Company No:'"
              :is-append-value="false"
              :is-prepend-value="true"
              v-if="controller.isDocumentEditable()"
              :is-readonly="false"
              @updatedFirst="controller.onRegistrationNumberNewUpdated($event)"
              @updatedSecond="controller.onRegistrationNumberOldUpdated($event)"
            >
              <template #divider1>(</template>
              <template #divider2>)</template>
            </InputGroupDualField>
            <span v-if="!controller.isDocumentEditable()">
              [Company No:
              {{ controller.registrationNumberNew() }}
              ({{ controller.registrationNumberOld() }})]
            </span>
          </div>
          ("Company")
          <br />
          <br />
          (Incorporated in Malaysia)
        </div>
        <div class="resolution-title">
          {{ controller.resolutionTitle() }}
        </div>
        <div class="resolution-content">
          <div
            v-if="page > 1"
            class="continue-page"
          >
            (Continue from Prev. Page)
          </div>
          <p>
            <b>RESOLVED:</b>
            <br />
            <b>{{ controller.resolutionName().toUpperCase() }}</b>
          </p>
          <!--NOTE: We get all these details automatically from the purchase of corporate profile. Users cannot change them.-->
          <p v-if="!controller.isAppointNew()">
            THAT the resignation of
            <span
              class="prev-cosec-details"
              :class="{ placeholder: controller.isPlaceholder() }"
            >
              <b>
                {{ controller.previousCompanySecretaryName().toUpperCase() }}
                (NRIC No. {{ controller.previousCompanySecretaryNRIC() }})
              </b>
            </span>
            as the Secretary of the Company be and is hereby accepted.
          </p>
          <p>
            THAT the appointment of
            <span :class="{ 'value-placeholder': controller.showPlaceholder() }">
              <b>
                {{ controller.getSecretaryName() }} (NRIC No: {{ controller.getSecretaryIC() }}) ({{
                  controller.getSecretaryLicense()
                }}
                / SSM PC NO. {{ controller.getSecretarySsmPcNo() }})
              </b>
            </span>
            as the Secretary of the Company be and is hereby be accepted with immediate effect.
          </p>
          <p>
            FURTHER RESOLVED that the Company Secretary be and is hereby authorised to file the relevant documents and
            take all necessary steps as may be necessary to give effect to this Resolution.
          </p>
        </div>
        <div
          class="signature-section"
          v-if="page >= controller.signatureStartOnPage.value"
        >
          <div class="signature-title">
            {{ controller.signatureTitle() }}
          </div>
          <div
            class="signature-item"
            v-for="(signatureItem, index) in signatureController.getSignatureOnPage(page)"
            :key="index"
          >
            <Signature
              :signature-item="signatureItem"
              :is-readonly="props.isOnPreview"
              @is-enlarged="signatureController.handleEnlargedSignaturePad($event)"
              @signed="emit('signed', $event)"
            />
          </div>
        </div>
        <div
          class="resolution-date"
          v-if="page === controller.totalPages()"
        >
          Date:
          <span
            class="date"
            :class="{ unknown: controller.resolutionDate().toLowerCase() === 'to be determined' }"
            v-html="controller.resolutionDate()"
          />
        </div>
      </template>
    </Paper>
  </div>
</template>

<script setup lang="ts">
  import Paper from "@/components/Papers/Paper.vue"
  import InputGroupText from "../Forms/InputGroupText.vue"
  import InputGroupDualField from "../Forms/InputGroupDualField.vue"
  import Signature from "../Signatures/Signature.vue"
  import { DcrAppointmentOfNewCompanySecretaryController } from "~/scripts/components/resolutions/DcrAppointmentOfNewCompanySecretaryController"
  import { ApplicationSwitch } from "~/scripts/models/ApplicationSwitch"
  import { ResolutionSignaturesController } from "~/scripts/components/resolutions/ResolutionSignaturesController"
  import { PaperOrientation } from "~/scripts/constants/Paper"

  const props = defineProps({
    application: {
      type: ApplicationSwitch,
      required: true,
    },
    isOnPreview: {
      type: Boolean,
      default: false,
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

  const emit = defineEmits(["signed", "onNameChanged", "registrationNoNewUpdated", "registrationNoOldUpdated"])

  const controller = new DcrAppointmentOfNewCompanySecretaryController(props.application, emit)
  const signatureController = new ResolutionSignaturesController(
    controller.signatureItems.value,
    controller.maxSignatureOnFirstPage.value,
    controller.maxSignatureOnOtherPages.value,
    1
  )

  const pageRange = computed(() => {
    return Array.from({ length: controller.totalPages() }, (_, i) => i + 1)
  })

  watch(
    () => props.application,
    (newVal) => {
      controller.setApplication(newVal)
    },
    { deep: true }
  )

  watch(
    () => controller.signatureItems.value,
    (newVal) => {
      signatureController.signatureItems.value = newVal
    },
    { deep: true }
  )

  watch(
    () => controller.maxSignatureOnFirstPage.value,
    (newVal) => {
      signatureController.maxSignatureOnFirstPage.value = newVal
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/Resolution" as *;
  @use "~/assets/scss/components/Resolutions/AppointChangeCompanySecretary" as *;
</style>
