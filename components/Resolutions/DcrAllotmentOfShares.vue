<template>
  <div
    id="dcr-allotment-of-shares"
    class="allotment-of-shares"
  >
    <Resolution
      v-bind="controller.resolutionProps"
      @total-page-changed="emit('totalPageChanged')"
      @signed="emit('signed', $event)"
    >
      <template #page1>
        <p>
          <b>RESOLVED:-</b>
          <br />
          <b>ISSUE AND ALLOTMENT OF SHARES</b>
          <br />
          <br />
          THAT pursuant to the authority given by the Members of the Company on
          <span class="placeholder">to be determined by iCompany</span>
          , applications for a total of
          <span
            class="fit-content"
            :class="{ placeholder: controller.isInPreviewMode.value }"
          >
            {{ controller.totalShares() }}
          </span>
          shares in the capital of the Company for cash be and are hereby accepted and that the shares applied for be
          and are hereby issued and allotted, as follows -
        </p>

        <table class="allot-tos-table">
          <thead>
            <tr>
              <th>Name of Allotees</th>
              <th>No. of Shares Allotted</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(allotTo, index) in controller.allotTos.value"
              :key="allotTo.allotee.id"
            >
              <td>
                <div
                  v-if="controller.isDocumentEditable()"
                  class="shareholder-options"
                  :class="{ 'align-center': allotTo.type !== AlloteeType.New, new: allotTo.type === AlloteeType.New }"
                >
                  <select
                    v-if="allotTo.type === AlloteeType.Existing"
                    v-model="allotTo.allotee.shareholderId"
                    class="form-control in-resolution"
                    :disabled="allotTo.isDisabled"
                  >
                    <option
                      value=""
                      disabled
                      selected
                    >
                      Select an existing shareholder
                    </option>
                    <option
                      v-for="option in controller.getShareholderOptionsForIndex(allotTo.allotee)"
                      :value="option.value"
                      :key="option.id"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                  <div
                    class="new-allotee"
                    v-if="allotTo.type === AlloteeType.New"
                  >
                    <div class="form-group-row">
                      <label class="required">Email Address</label>
                      <InputGroupText
                        :input-value="allotTo.email"
                        :is-append-value="true"
                        :pre-or-append-value="controller.getNameLabel(allotTo)"
                        :is-input-valid="true"
                        :is-warning-required="false"
                        :placeholder="'Email address of the new Shareholder'"
                      />
                    </div>
                    <div class="form-group-row">
                      <label class="required">Shareholder Type</label>
                      <select
                        v-model="allotTo.shareholdingType"
                        class="form-control in-resolution"
                      >
                        <option
                          v-for="shareholdingType in controller.shareholderTypeOptions()"
                          :key="shareholdingType.id"
                          :value="shareholdingType.value"
                        >
                          {{ shareholdingType.label }}
                        </option>
                      </select>
                    </div>
                    <div
                      class="form-group-row"
                      v-if="allotTo.shareholdingType === ShareholdingType.Representative"
                    >
                      <label class="required">Name of Corporate Body</label>
                      <InputGroupText
                        :input-value="allotTo.companyName"
                        :is-append-value="true"
                        :pre-or-append-value="'MEMBER'"
                        :is-input-valid="true"
                        :is-warning-required="false"
                        :placeholder="'Name of Corporate Body'"
                      />
                    </div>
                  </div>
                </div>
                <span
                  v-if="!controller.isDocumentEditable()"
                  :class="{ placeholder: controller.isInPreviewMode.value }"
                >
                  {{ controller.allotToName(allotTo) }}
                </span>
              </td>
              <td>
                <div
                  v-if="controller.isDocumentEditable()"
                  class="shares-to-allot"
                >
                  <input
                    type="text"
                    v-model="allotTo.allotee.sharesAllotted"
                    class="form-control in-resolution"
                  />
                  <span
                    class="action-link remove"
                    v-if="index > 0 && !allotTo.isDisabled"
                    @click="controller.onRemoveAllotTo(allotTo.allotee.id)"
                  >
                    <i class="fa-solid fa-xmark" />
                  </span>
                </div>
                <span
                  v-if="!controller.isDocumentEditable()"
                  :class="{ placeholder: controller.isInPreviewMode.value }"
                >
                  {{ controller.allotToShares(allotTo) }}
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>
                <span
                  v-if="controller.isDocumentEditable()"
                  class="action-link add"
                  @click="controller.onAddAllotTo(AlloteeType.Existing)"
                >
                  + Allot to Shareholder
                </span>
                &nbsp;&nbsp;
                <span
                  v-if="controller.isDocumentEditable()"
                  class="action-link add"
                  @click="controller.onAddAllotTo(AlloteeType.New)"
                >
                  + Add New Shareholder
                </span>
              </td>
              <td :class="{ editing: controller.isDocumentEditable() }">
                {{ controller.totalShares() }}
              </td>
            </tr>
          </tfoot>
        </table>
        <FurtherResolved />
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import FurtherResolved from "./FurtherResolved.vue"
  import InputGroupText from "../Forms/InputGroupText.vue"
  import Resolution from "./Resolution.vue"
  import { AlloteeType } from "~/scripts/constants/AllotmentOfShares"
  import { DcrAllotmentOfSharesController } from "~/scripts/components/resolutions/DcrAllotmentOfSharesController"
  import { ShareholdingType } from "~/scripts/constants/Shareholder"
  import { CompanyShareholderAllotment } from "~/scripts/models/CompanyShareholderAllotment"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

  const props = defineProps<IPropsResolutionDocument<CompanyShareholderAllotment>>()

  const emit = defineEmits([
    "startLoading",
    "doneLoading",
    "totalPageChanged",
    "changed",
    "applicationUpdated",
    "signed",
  ])

  const controller = new DcrAllotmentOfSharesController(props, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
      controller.otherDataInitiation()
    }
  )

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
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

  // watch(
  //   () => props.application,
  //   (newVal) => {
  //     controller.onApplicationChanged(newVal)
  //   },
  //   { deep: true }
  // )

  watch(
    () => controller.allotTos.value,
    (newVal, oldVal) => {
      if (oldVal.length <= 0) {
        return
      }

      controller.isChangeHandlingRequired.value = false
    },
    { deep: true }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
    }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller), //Has to plus one always, because there is accompanying document
    getApplication: controller.getApplication.bind(controller),
    getApplicationData: controller.getApplicationData.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    setIsChangeHandlingRequired: controller.setIsChangeHandlingRequired.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/AllotmentOfShares" as *;
</style>
