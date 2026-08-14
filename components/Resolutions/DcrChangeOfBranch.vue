<template>
  <div
    id="dcr-change-of-branches"
    ref="documentRef"
  >
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)"
    >
      <template #page1>
        <div class="change-of-branch">
          <p>
            <b>RESOLVED:</b>
            <br />
            <b>
              <select
                v-if="controller.isDocumentEditable()"
                class="form-control in-resolution"
                v-model="controller.applicationType.value"
                @change="controller.handleTypeChange()"
                :disabled="props.isInPreviewMode"
              >
                <option
                  v-for="option in controller.typeOptions.value"
                  :key="option.id"
                  :value="option.value"
                  :disabled="controller.isTypeOptionDisabled(option)"
                >
                  {{ option.label.toUpperCase() }}
                </option>
              </select>
              <span v-if="!controller.isDocumentEditable()">
                {{ controller.application.value?.getTypeName().toUpperCase() }}
              </span>
              OF BUSINESS BRANCH ADDRESS
            </b>
          </p>

          <p>THAT the {{ controller.resolutionContentLine() }}:</p>

          <div
            v-if="controller.isShowBranchSelection()"
            class="branch-selection"
          >
            <div
              v-for="branch in controller.companyBranches.value"
              class="branch-option"
              :class="{ 'is-hidden': controller.isBranchOptionHidden(branch.id) }"
            >
              <input
                :id="branch.id"
                type="checkbox"
                class="form-control in-resolution"
                @click="controller.handleFromBranchChange()"
                v-model="controller.selectedBranchId.value"
                :value="branch.id"
                :disabled="props.isInPreviewMode"
              />
              <label
                :for="branch.id"
                class="label"
                v-html="branch.location.getMultilineAddress()"
              />
            </div>
          </div>

          <div
            v-if="controller.isShowExistingAddress()"
            v-html="controller.getCompanyBranchToChangeAddress()"
            class="address"
            :class="{ placeholder: controller.isInPreviewMode.value }"
          />

          <p v-if="controller.isAmendmentTypeChange()">To business branch address of the Company:</p>

          <div v-if="controller.isShowBranchAddressForm()">
            <AddressInput
              :is-disabled="props.isInPreviewMode"
              :location="controller.location"
              @update-address-line1="controller.handleAddressLine1Change($event)"
              @update-address-line2="controller.handleAddressLine2Change($event)"
              @update-postcode="controller.handlePostcodeChange($event)"
              @update-city="controller.handleCityChange($event)"
              @update-state="controller.handleStateChange($event)"
              @update-country="controller.handleCountryChange($event)"
            />
          </div>

          <div
            v-if="controller.isShowNewAddress()"
            v-html="controller.getNewAddress()"
            class="address"
            :class="{ placeholder: controller.isInPreviewMode.value }"
          />

          <p>is hereby accepted and confirmed.</p>
          <FurtherResolved />
        </div>
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import AddressInput from "../Forms/AddressInput.vue"
  import FurtherResolved from "./FurtherResolved.vue"
  import Resolution from "./Resolution.vue"
  import { DcrChangeOfBranchesController } from "~/scripts/components/resolutions/DcrChangeOfBranchesController"
  import { StringUtil } from "~/scripts/utils/String"
  import type { CompanyAmendmentBranch } from "~/scripts/models/CompanyAmendmentBranch"

  const props = defineProps<IPropsResolutionDocument<CompanyAmendmentBranch>>()

  const emit = defineEmits(["startLoading", "doneLoading", "signed"])

  const documentRef = ref(null)

  const controller = new DcrChangeOfBranchesController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
    }
  )

  watch(
    () => props.showWatermark,
    (newVal) => {
      controller.setShowWatermark(newVal)
    }
  )

  watch(
    () => props.watermarkText,
    (newVal) => {
      controller.setWatermarkText(newVal)
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
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    getPdfPages: controller.getPdfPages.bind(controller),
    isLoading: controller.isLoading.value,
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/ChangeOfBranches" as *;
</style>
