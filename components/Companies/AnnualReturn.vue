<template>
  <div id="companies-annual-return">
    <div
      v-if="controller.isLoading.value"
      class="loader-container"
    >
      <LoaderPrepare
        :label="controller.loaderLabel"
        :sublabel="controller.loaderSublabel"
      />
    </div>
    <template v-if="!controller.isLoading.value">
      <div class="annual-return-details">
        <div class="detail">
          <div class="detail-row">
            <div class="lodged-button">
              <button
                class="btn btn-submit"
                :class="{ 'is-loading': controller.isUploadingDocument.value }"
                :disabled="controller.isUploadingDocument.value"
                @click="controller.uploadDocumentClicked()"
              >
                {{ controller.completeAnnualReturnLabel }}
              </button>
            </div>
            <table class="annual-return-detail-table">
              <tbody>
                <tr>
                  <td>
                    <b>{{ controller.section68Label }}</b>
                  </td>
                  <td>:</td>
                  <td>
                    <div class="document-action">
                      <span>{{ controller.section68 }}</span>
                      <template v-if="controller.isSection68Uploaded">
                        <span
                          class="action-link"
                          @click="controller.onSection68Clicked()"
                        >
                          <i
                            class="fa-regular"
                            :class="controller.isViewingDocument.value ? 'fa-eye' : 'fa-eye-closed'"
                          />
                        </span>
                        <a
                          :href="controller.pdfUrl"
                          target="_blank"
                        >
                          <i class="fa-solid fa-up-right-from-square"></i>
                        </a>
                      </template>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>{{ controller.annualReturnLabel }}</b>
                  </td>
                  <td>:</td>
                  <td>{{ controller.formattedAnnualReturn }}</td>
                </tr>
                <tr>
                  <td>
                    <b>{{ controller.lodgementDeadlineLabel }}</b>
                  </td>
                  <td>:</td>
                  <td>{{ controller.lodgementDeadline }}</td>
                </tr>
                <tr>
                  <td>
                    <b>{{ controller.paymentDateLabel }}</b>
                  </td>
                  <td>:</td>
                  <td>
                    <span :class="{ 'text-danger': !controller.isPaid && !controller.hasSubmittedForYear }">
                      {{ controller.paymentDate }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <b>{{ controller.businessAddressLabel }}</b>
                  </td>
                  <td>:</td>
                  <td>
                    {{ controller.businessAddressLine1 }}
                    <CopyValue :value="controller.businessAddressLine1" />
                    <br />
                    <template v-if="!StringUtil.isNullOrEmpty(controller.businessAddressLine2)">
                      {{ controller.businessAddressLine2 }}
                      <CopyValue :value="controller.businessAddressLine2" />
                      <br />
                    </template>
                    <template v-if="!StringUtil.isNullOrEmpty(controller.businessAddressLine3)">
                      {{ controller.businessAddressLine3 }}
                      <CopyValue :value="controller.businessAddressLine3" />
                      <br />
                    </template>
                    {{ controller.businessAddressPostcode }}
                    <CopyValue :value="controller.businessAddressPostcode" />
                    <br />
                    {{ controller.businessAddressCity }}
                    <CopyValue :value="controller.businessAddressCity" />
                    <br />
                    {{ controller.businessAddressState }}
                    <CopyValue :value="controller.businessAddressState" />
                    <br />
                    {{ controller.businessAddressCountry }}
                    <CopyValue :value="controller.businessAddressCountry" />
                    <br />
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>{{ controller.registeredAddressLabel }}</b>
                  </td>
                  <td>:</td>
                  <td>
                    {{ controller.registeredAddressLine1 }}
                    <CopyValue :value="controller.registeredAddressLine1" />
                    <br />
                    <template v-if="!StringUtil.isNullOrEmpty(controller.registeredAddressLine2)">
                      {{ controller.registeredAddressLine2 }}
                      <CopyValue :value="controller.registeredAddressLine2" />
                      <br />
                    </template>
                    <template v-if="!StringUtil.isNullOrEmpty(controller.registeredAddressLine3)">
                      {{ controller.registeredAddressLine3 }}
                      <CopyValue :value="controller.registeredAddressLine3" />
                      <br />
                    </template>
                    {{ controller.registeredAddressPostcode }}
                    <CopyValue :value="controller.registeredAddressPostcode" />
                    <br />
                    {{ controller.registeredAddressCity }}
                    <CopyValue :value="controller.registeredAddressCity" />
                    <br />
                    {{ controller.registeredAddressState }}
                    <CopyValue :value="controller.registeredAddressState" />
                    <br />
                    {{ controller.registeredAddressCountry }}
                    <CopyValue :value="controller.registeredAddressCountry" />
                    <br />
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>{{ controller.totalSharesLabel }}</b>
                  </td>
                  <td>:</td>
                  <td>
                    {{ NumberUtil.thousandSeparator(controller.totalOrdinaryShares) }}
                    {{ controller.totalOrdinarySharesLabel }}
                    <CopyValue :value="controller.totalOrdinaryShares.toString()" />
                    / {{ NumberUtil.thousandSeparator(controller.totalPreferenceShares) }}
                    {{ controller.totalPreferenceSharesLabel }}
                    <CopyValue :value="controller.totalPreferenceShares.toString()" />
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>
                    <b>{{ controller.descriptionLabel }}</b>
                  </td>
                  <td>:</td>
                  <td>
                    {{ controller.businessDescription }}
                    <CopyValue :value="controller.businessDescription" />
                    <ul>
                      <li v-for="(msicCode, i) in controller.msicCodes">
                        {{ msicCode.code }} - {{ msicCode.descriptionEn }}
                        <CopyValue :value="msicCode.code" />
                      </li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>{{ controller.directorsLabel }}</b>
                  </td>
                  <td>:</td>
                  <td>
                    <div
                      class="director"
                      v-for="director in controller.directorsForAnnualReturn"
                    >
                      <UserDetail v-bind="controller.getUserDetailProps(director)" />
                      <br />
                      <b>{{ controller.dateAppointed }}</b>
                      : {{ controller.getDateOfAppointment(director) }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>{{ controller.shareholdersLabel }}</b>
                  </td>
                  <td>:</td>
                  <td>
                    <div
                      class="shareholder"
                      v-for="shareholder in controller.shareholdersForAnnualReturn"
                    >
                      <UserDetail v-bind="controller.getUserDetailProps(shareholder)" />
                      <br />
                      <b>{{ controller.totalOrdinarySharesLabel }}</b>
                      : {{ NumberUtil.thousandSeparator(shareholder.ordinaryShares) }}
                      <CopyValue :value="shareholder.ordinaryShares.toString()" />
                      <br />
                      <b>{{ controller.totalPreferenceSharesLabel }}</b>
                      : {{ NumberUtil.thousandSeparator(shareholder.preferenceShares) }}
                      <CopyValue :value="shareholder.preferenceShares.toString()" />
                      <br />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>{{ controller.secretariesDetail }}</b>
                  </td>
                  <td>:</td>
                  <td>
                    <div
                      class="secretary"
                      v-for="secretary in SecretaryInformation.SECRETARY_NAME_LIST"
                    >
                      <b>{{ secretary.name }}</b>
                      <CopyValue :value="secretary.name" />
                      <br />
                      {{ secretary.nric }}
                      <CopyValue :value="secretary.nric" />
                      <br />
                      {{ secretary.license }}
                      <CopyValue :value="secretary.license" />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <div class="action-buttons">
                      <button
                        class="btn btn-submit btn-pill"
                        :class="{ 'is-loading': controller.isGenerating.value }"
                        :disabled="controller.isGenerating.value"
                        @click="controller.onGenerateXBRLClicked()"
                      >
                        {{ controller.generateXbrlLabel }}
                      </button>

                      <button
                        class="btn btn-pill btn-primary"
                        :class="{ 'is-loading': controller.isGeneratingBO.value }"
                        :disabled="controller.isGeneratingBO.value"
                        @click="controller.onGenerateBOAnnexureTxtClicked()"
                      >
                        Generate BO Annexure
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>
    <Teleport to="body">
      <ViewDocument
        ref="viewDocumentRef"
        :pdf-url="controller.pdfUrl"
        @hide="controller.onHideSection68()"
      />
      <UploadDocument
        ref="uploadDocumentRef"
        v-bind="controller.uploadDocumentProps"
        @proceed="controller.onProceedUploadDocument()"
      />
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import CopyValue from "../Buttons/CopyValue.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import UploadDocument from "../Popups/UploadDocument.vue"
  import UserDetail from "@/components/Users/UserDetail.vue"
  import ViewDocument from "@/components/Documents/ViewDocument.vue"
  import { AnnualReturnController } from "~/scripts/components/companies/AnnualReturnController"
  import { Company } from "~/scripts/models/Company"
  import { StringUtil } from "~/scripts/utils/String"
  import { NumberUtil } from "~/scripts/utils/Number"
  import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"

  const props = defineProps({
    company: {
      type: Company,
      required: true,
    },
  })
  const emit = defineEmits(["isPaid", "yearToLodge", "goToDocuments"])

  const viewDocumentRef = ref(null)
  const uploadDocumentRef = ref(null)

  const controller = new AnnualReturnController(props.company, emit)

  watch(
    () => props.company,
    (newVal) => {
      controller.setCompany(newVal)
    },
    { deep: true }
  )

  watch(
    viewDocumentRef,
    (newVal) => {
      controller.setViewDocumentRef(newVal)
    },
    { immediate: true }
  )
  watch(
    uploadDocumentRef,
    (newVal) => {
      controller.setUploadDocumentRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/AnnualReturn" as *;
</style>
