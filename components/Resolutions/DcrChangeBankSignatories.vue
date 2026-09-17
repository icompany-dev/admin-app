<template>
  <div id="dcr-change-bank-signatories">
    <Resolution
      v-bind="controller.resolutionProps"
      @signed="emit('signed', $event)"
    >
      <template
        #paperMargins1
        v-if="controller.isDocumentEditable()"
      >
        <Transition name="fade">
          <div
            class="paper-tag point-left change-signatory-tag"
            v-if="!controller.areAllDataCompleted"
          >
            Complete This
          </div>
        </Transition>
      </template>
      <template #page1>
        <p>
          <b>RESOLVED:</b>
          <br />
          <b>
            CHANGE OF AUTHORISED SIGNATORIES FOR THE BANK ACCOUNT MAINTAINED WITH
            {{ controller.bankName.toUpperCase() }}
          </b>
        </p>

        <div class="bank-details">
          <div class="name">
            {{ controller.bankName }}
          </div>
          <div class="branch">
            {{ controller.branchDetails }}
          </div>
          <div
            class="address"
            v-html="controller.bankAddress"
          />
        </div>

        <p>
          <b>THAT</b>
          the bank signatories for the Current Account No. {{ controller.bankAccountNumber }} (“
          <b>Account</b>
          ”) maintained with the Bank be changed with immediate effect.
        </p>

        <p>
          <b>THAT</b>
          the Bank be now empowered whether the Company’s account is in credit or not, to honour cheques, bills of
          exchange and promissory notes drawn, accepted, or made on behalf of the Company provided that it is operated
          in the following manner by the following Authorised Signatories:-
        </p>

        <table class="signatories-table">
          <thead>
            <tr>
              <th />
              <th>Authorised Signatories</th>
              <th>NRIC / Passport No.</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(signatory, index) in controller.signatories"
              :key="index"
            >
              <td>
                <div class="index-remove-column">
                  <Transition class="fade">
                    <span
                      v-if="controller.isDocumentEditable() && controller.signatories.length > 1"
                      class="action-link remove"
                      @click="controller.onRemoveSignatory(index)"
                    >
                      <i class="fa-solid fa-xmark" />
                    </span>
                  </Transition>
                  {{ index + 1 }}
                </div>
              </td>
              <td>
                <template v-if="controller.isDocumentEditable()">
                  <input
                    type="text"
                    class="form-control in-resolution"
                    :list="`name-${index}`"
                    v-model="signatory.name"
                    @change="controller.onNameChanged(index)"
                  />
                  <datalist :id="`name-${index}`">
                    <option v-for="(name, x) in controller.directorNameOptions(index)">{{ name }}</option>
                  </datalist>
                </template>
                <span v-if="!controller.isDocumentEditable()">{{ signatory.name }}</span>
              </td>
              <td>
                <template v-if="controller.isDocumentEditable()">
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-model="signatory.identification"
                  />
                </template>
                <span v-if="!controller.isDocumentEditable()">{{ signatory.identification }}</span>
              </td>
              <td>
                <template v-if="controller.isDocumentEditable()">
                  <select
                    class="form-control in-resolution"
                    v-model="signatory.role"
                  >
                    <option value="maker">MAKER</option>
                    <option value="checker">CHECKER</option>
                  </select>
                </template>
                <span v-if="!controller.isDocumentEditable()">{{ signatory.role?.toUpperCase() }}</span>
              </td>
            </tr>
            <tr
              v-if="controller.isDocumentEditable()"
              class="add-more-row"
            >
              <td colspan="4">
                <span
                  class="action-link add-more"
                  @click="controller.onAddSignatory()"
                >
                  + Add More
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- <p>
          <b><u>Mode of Operation</u></b>
        </p>

        <p>
          To be signed by
          <span class="text-uppercase fw-bold">{{ companyChangeBankSignatoriesProp?.authorisedType }}</span>
          of the above Authorised Signatories.
        </p> -->

        <p>
          <b>THAT</b>
          the Bank be authorised to act on any instructions and accept any receipts or other documents relating to the
          account, transactions or affairs of the Company and that all cheques, bills, promissory notes and other
          documents requiring endorsements on behalf of the Company be endorsed in the aforesaid manner.
        </p>

        <p>
          <b>THAT</b>
          a copy of this resolution be furnished to the Bank and it shall remain in force until notice in writing to the
          contrary is given to the Bank by the Company.
        </p>
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import { StringUtil } from "~/scripts/utils/String"
  import Resolution from "./Resolution.vue"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { CompanyChangeBankSignatory } from "~/scripts/models/CompanyChangeBankSignatory"
  import { DcrChangeBankSignatoriesController } from "~/scripts/components/resolutions/DcrChangeBankSignatoriesController"

  const props = defineProps<IPropsResolutionDocument<CompanyChangeBankSignatory>>()

  const emit = defineEmits(["startLoading", "doneLoading", "signed", "dataUpdated"])

  const controller = new DcrChangeBankSignatoriesController(props, emit)

  watch(
    () => props.applicationId,
    async (newVal) => {
      controller.setApplicationId(newVal)
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
      controller.setContent()
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
    () => controller.application.value?.signatories,
    (newVal) => {
      controller.handleDataUpdated()
    },
    { deep: true }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/ChangeOfSignatories" as *;
</style>
