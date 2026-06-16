<template>
  <div id="dcr-section-47">
    <Resolution
      :company-name="controller.companyName()"
      :registration-number-old="controller.registrationNumberOld()"
      :registration-number-new="controller.registrationNumberNew()"
      :resolution-title="controller.resolutionTitle()"
      :signature-title="controller.signatureTitle()"
      :signature-items="controller.signatureItems.value"
      :resolution-date="controller.resolutionDate()"
      :signature-start-on-page="controller.signatureStartOnPage.value"
      :max-signature-on-first-page="controller.maxSignatureOnFirstPage.value"
      :max-signature-on-other-page="controller.maxSignatureOnOtherPages.value"
      :has-accompanying-document="false"
      :show-watermark="controller.isResolutionInDraft() || props.showWatermark"
      :watermark-text="props.watermarkText"
      :total-pages="controller.totalPages()"
      @signed="emit('signed', $event)"
    >
      <template #page1>
        <p>
          <b>RESOLVED:</b>
          <br />
          <b>DECLARATION OF WHERE DOCUMENTS OF THE COMPANY ARE KEPT</b>
        </p>

        <p>THAT the the following documents:</p>

        <ol class="not-kept-document-list">
          <li v-for="option in controller.getOptionList()">
            <div class="document-option">
              <input
                type="checkbox"
                v-if="controller.isDocumentEditable()"
              />
              <label v-html="option.label"></label>
            </div>
          </li>
        </ol>

        <p v-html="controller.getContentCopywriting()" />

        <div v-if="controller.isShowAddressForm()">
          <AddressInput
            @update-address-line1="controller.handleAddressLine1Change($event)"
            @update-address-line2="controller.handleAddressLine2Change($event)"
            @update-postcode="controller.handlePostcodeChange($event)"
            @update-city="controller.handleCityChange($event)"
            @update-state="controller.handleStateChange($event)"
            @update-country="controller.handleCountryChange($event)"
          />
        </div>

        <div
          v-if="!controller.isDocumentEditable()"
          v-html="controller.getNewAddress()"
        />

        <p>
          THAT the Secretary be and is hereby authorised to notify the Registrar of Companies, Companies Commission of
          Malaysia and to do all such acts, deeds and things as may be necessary to give effect to the above resolution.
        </p>
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import AddressInput from "../Forms/AddressInput.vue"
  import Resolution from "./Resolution.vue"
  import { DcrSection47Controller } from "~/scripts/components/resolutions/DcrSection47Controller"
  import { StringUtil } from "~/scripts/utils/String"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    applicationId: {
      type: [String, null],
      default: null,
    },
    showWatermark: {
      type: Boolean,
      default: false,
    },
    watermarkText: {
      type: String,
      default: "PREVIEW",
    },
    isInPreviewMode: {
      type: Boolean,
      default: true,
    },
  })

  const emit = defineEmits(["startLoading", "doneLoading", "totalPageChanged", "applicationUpdated", "signed"])

  const controller = new DcrSection47Controller(props.companyId, props.applicationId, null, props.isInPreviewMode, emit)
  watch(
    () => props.applicationId,
    (newVal) => {
      if (!StringUtil.isNullOrEmpty(newVal)) {
        controller.fetchApplication(newVal ?? "")
      }
    }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/Section47" as *;
</style>
