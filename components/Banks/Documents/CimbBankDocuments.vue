<template>
  <div
    id="banks-documents-cimb-bank-documents"
    class="bank-documents"
  >
    <div class="documents">
      <div
        class="cimb-application-overlay"
        v-if="props.isShowAllDocuments && controller.isShowOverlay"
      >
        <div
          class="cimb-overlay-introduction"
          v-if="controller.overlayPage.value === 1"
        >
          <p class="cimb-overlay-title">
            <b>Thank you for your payment!</b>
          </p>
          <p class="cimb-overlay-text">
            We are preparing this Application and
            <br />
            will be sending physical copies to you.
          </p>

          <br />

          <div class="action-buttons">
            <div
              @click="controller.onOverlayNextClick()"
              class="btn btn-submit"
            >
              Understand
            </div>
          </div>
        </div>

        <div
          class="cimb-overlay-choices"
          v-if="controller.overlayPage.value === 2"
        >
          <p class="cimb-overlay-text">
            <b>Please Choose:</b>
          </p>
          <div class="cimb-overlay-option">
            <div class="cimb-overlay-text">
              <i
                class="fa-regular fa-square cimb-overlay-checkbox"
                v-if="controller.typeOfApplicationSelected.value !== 'prefilled-information'"
                @click="controller.onClickTypeOfApplicationOption('prefilled-information')"
              ></i>
              <i
                class="fa-solid fa-check-square cimb-overlay-checkbox"
                v-if="controller.typeOfApplicationSelected.value === 'prefilled-information'"
                @click="controller.onClickTypeOfApplicationOption('prefilled-information')"
              ></i>
            </div>
            <div
              class="cimb-overlay-option-content"
              @click="controller.onClickTypeOfApplicationOption('prefilled-information')"
            >
              <div class="cimb-overlay-text">
                <b>Some Prefilled Information</b>
              </div>
              <div class="cimb-overlay-option-description">
                The application provide are prefilled based on our system information.
                <br />
                You can fill up the application or complete the application via wet ink.
              </div>
            </div>
          </div>

          <div class="cimb-overlay-option">
            <div class="cimb-overlay-text">
              <i
                class="fa-regular fa-square cimb-overlay-checkbox"
                v-if="controller.typeOfApplicationSelected.value !== 'just-resolution'"
                @click="controller.onClickTypeOfApplicationOption('just-resolution')"
              ></i>
              <i
                class="fa-solid fa-check-square cimb-overlay-checkbox"
                v-if="controller.typeOfApplicationSelected.value === 'just-resolution'"
                @click="controller.onClickTypeOfApplicationOption('just-resolution')"
              ></i>
            </div>
            <div
              class="cimb-overlay-option-content"
              @click="controller.onClickTypeOfApplicationOption('just-resolution')"
            >
              <div class="cimb-overlay-text">
                <b>Just the resolution</b>
              </div>
              <div class="cimb-overlay-option-description">
                You will get both Certified Resolution and Extract of the Resolution.
              </div>
            </div>
          </div>

          <br />

          <div class="action-buttons">
            <div
              @click="controller.onOverlayBackClick()"
              class="btn btn-danger"
            >
              Back
            </div>
            <div
              @click="controller.onOverlaySubmitClick()"
              class="btn btn-submit"
            >
              Proceed
            </div>
          </div>
        </div>
      </div>
      <DcrBankAccountOpeningCimbApplication
        v-if="controller.isShowCimbApplication"
        ref="applicationRef"
        v-bind="props.resolutionDocument"
        @updated="emit('updated')"
      />

      <DcrBankAccountOpeningCimbBank
        v-if="!controller.isShowCimbApplication"
        ref="dcrRef"
        v-bind="props.resolutionDocument"
        @updated="emit('updated')"
      />

      <template v-if="props.isShowAllDocuments">
        <DcrBankAccountOpeningCimbOmnibus
          v-if="controller.isShowCimbApplication"
          ref="omnibusRef"
          v-bind="props.resolutionDocument"
          @updated="controller.onOmnibusUpdated()"
        />
        <DcrBankAccountOpeningCimbBank
          v-if="controller.isShowCimbApplication"
          ref="dcrRef"
          v-bind="props.resolutionDocument"
          @updated="emit('updated')"
        />
        <div
          class="document pdf-file"
          v-for="(document, index) in controller.documentsToDisplay"
          :key="index"
          :class="{
            'no-document-display': !controller.hasDocument(index),
          }"
        >
          <div
            class="overlay"
            v-if="!controller.hasDocument(index)"
          >
            <span
              class="click-to-preview"
              v-html="controller.documentName(index)"
            />
          </div>
          <canvas
            :ref="
              (el) => {
                return controller.setCanvasesForDocument(index, 1, el as HTMLCanvasElement | null)
              }
            "
          />
        </div>
        <IdentificationDocumentWatermark
          v-for="(director, i) in controller.directors.value"
          v-bind="controller.getIdentificationDocumentWatermarkProps(director)"
          :ref="
            (el) => {
              controller.setIdentificationRefs(el, i)
            }
          "
        />
        <IdentificationDocumentWatermark
          v-for="(shareholder, i) in controller.shareholdersForIdentification"
          v-bind="controller.getIdentificationDocumentWatermarkProps(shareholder)"
          :ref="
            (el) => {
              controller.setIdentificationRefs(el, i)
            }
          "
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import DcrBankAccountOpeningCimbBank from "~/components/Resolutions/DcrBankAccountOpeningCimbBank.vue"
  import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
  import IdentificationDocumentWatermark from "~/components/Identifications/IdentificationDocumentWatermark.vue"
  import DcrBankAccountOpeningCimbApplication from "~/components/Resolutions/DcrBankAccountOpeningCimbApplication.vue"
  import DcrBankAccountOpeningCimbOmnibus from "~/components/Resolutions/DcrBankAccountOpeningCimbOmnibus.vue"
  import { CimbBankDocumentsController } from "~/scripts/components/banks/documents/CimbBankDocumentsController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    resolutionDocument: {
      type: PropsResolutionDocument<CompanyBankAccountOpening>,
      required: true,
    },
    isShowAllDocuments: {
      type: Boolean,
      default: false,
    },
  })
  const emit = defineEmits(["updated"])

  const applicationRef = ref(null)
  const omnibusRef = ref(null)
  const dcrRef = ref(null)

  const controller = new CimbBankDocumentsController(props, emit)

  watch(
    () => props.resolutionDocument.applicationId,
    () => {
      controller.clearOmnibusDetails()
    }
  )

  watch(
    () => props.resolutionDocument.application,
    (newVal) => {
      controller.setResolutionDocument(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    applicationRef,
    (newVal) => {
      controller.setApplicationRef(newVal)
    },
    { immediate: true }
  )

  watch(
    omnibusRef,
    (newVal) => {
      controller.setOmnibusRef(newVal)
    },
    { immediate: true }
  )

  watch(
    dcrRef,
    (newVal) => {
      controller.setBankResolutionRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    getApplication: controller.getApplication.bind(controller),
    getBranchId: controller.getBranchId.bind(controller),
    getSignatories: controller.getSignatories.bind(controller),
    getSignatoryType: controller.getSignatoryType.bind(controller),
    getAuthorisedPersonsForOnlineBanking: controller.getAuthorisedPersonsForOnlineBanking.bind(controller),
    getOtherDetails: controller.getOtherDetails.bind(controller),
    getPdfPages: controller.getPdfPages.bind(controller),
    downloadPdfs: controller.downloadPdfs.bind(controller),
    getPdfDocumentGroups: controller.getPdfDocumentGroups.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Banks/Documents/BankDocuments" as *;
  @use "~/assets/scss/components/Banks/Documents/CimbBankDocuments" as *;

  #banks-documents-cimb-bank-documents {
    .cimb-application-overlay {
      width: 340px;
      min-height: 200px;
      background-color: black;
      position: absolute;
      z-index: 1;
      left: 50%;
      top: 150px;
      transform: translateX(-50%);
      border-radius: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 30px;
    }

    .cimb-overlay-introduction {
      color: var(--bs-white);
      text-align: center;
    }

    .cimb-overlay-title {
      font-size: 2rem;
    }

    .cimb-overlay-text {
      font-size: 1.4rem;
    }

    .cimb-overlay-choices {
      color: var(--bs-white);
      display: flex;
      gap: 15px;
      flex-direction: column;
    }

    .cimb-overlay-option {
      display: flex;
      gap: 15px;
    }

    .cimb-overlay-checkbox {
      cursor: pointer;
    }

    .cimb-overlay-option-content {
      font-size: 1.4rem;
      cursor: pointer;
    }

    .cimb-overlay-option-description {
      margin-top: 5px;
    }
  }
</style>
