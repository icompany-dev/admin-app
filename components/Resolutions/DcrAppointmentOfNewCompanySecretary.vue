<template>
  <div
    id="dcr-appointment-of-new-company-secretary"
    ref="documentRef"
  >
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
            {{ controller.companyName() }}
          </div>
          <div class="company-registration-number">
            [Company No:
            {{ controller.registrationNumberNew() }}
            ({{ controller.registrationNumberOld() }})]
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
          </p>
          <p>
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
            <select
              class="form-control in-resolution"
              v-model="controller.selectedCompanySecretary.value"
              v-if="!controller.isPrinting.value"
            >
              <option
                v-for="(secretary, i) in controller.secretaryOptions"
                :value="secretary"
              >
                <b>{{ secretary.name.toUpperCase() }}</b>
              </option>
            </select>
            <span v-if="controller.isPrinting.value">
              <b>{{ controller.getSecretaryName() }}</b>
            </span>
            <b>
              (NRIC No: {{ controller.getSecretaryIC() }}) ({{ controller.getSecretaryLicense() }} / SSM PC NO.
              {{ controller.getSecretarySsmPcNo() }})
            </b>
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
            v-if="controller.isPrinting.value"
            v-html="controller.resolutionDate()"
          />
          <input
            type="date"
            class="form-control in-resolution"
            v-if="!controller.isPrinting.value"
            v-model="controller.documentDate.value"
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

  const documentRef = ref(null)

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

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(documentRef)
    },
    { immediate: true }
  )

  defineExpose({
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/Resolution" as *;
  @use "~/assets/scss/components/Resolutions/AppointChangeCompanySecretary" as *;
</style>
