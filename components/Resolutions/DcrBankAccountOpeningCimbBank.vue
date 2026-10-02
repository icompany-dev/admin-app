<template>
  <div id="dcr-bank-account-opening-cimb-bank">
    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :is-loader="true"
      :show-page-number="false"
      v-if="controller.isLoading.value"
    >
      <template #paperContent>
        <LoaderPrepare
          :label="controller.loaderLabel"
          :sublabel="controller.loaderSublabel"
        />
      </template>
    </Paper>
    <template v-if="!controller.isLoading.value">
      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        :additional-css-class="'resolution'"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <!-- <div class="paper-tag point-left branch-selection"><span>Insert Information</span></div> -->
        </template>

        <template #paperContent>
          <div class="company-detail-head">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="company-registration-number">
              Company No: [{{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})]
            </div>
            <div>
              <br />
              (Incorporated in Malaysia)
            </div>

            <div>
              <br />
              ( also referred to as the
              <b>“Company”</b>
              )
            </div>
          </div>

          <div class="resolution-title">
            <span>
              {{ controller.resolutionTitle() }}
            </span>
          </div>

          <div class="resolution-content">
            <P><b>Resolved:</b></P>
            <p>
              <b>
                <u>
                  OPENING OF BANK ACCOUNT(S) AND SUBSCRIPTION OF SERVICES WITH CIMB BANK BERHAD AND/OR CIMB ISLAMIC BANK
                  BERHAD
                </u>
              </b>
            </p>

            <ol>
              <li>
                <b>AUTHORISED PERSON</b>
                <p>
                  Approval and authorisation be given for the sole person with specimen signatures appended in Annexure
                  (“Authorised Person”) to do the following for and on behalf of the Company:
                </p>
                <ol>
                  <li>
                    <p>
                      to open, maintain and / or close any account(s) (“Accounts”) with CIMB Bank Berhad and / or CIMB
                      Islamic Bank Berhad (“Bank”) at any time subject to the terms and conditions of such Accounts;
                    </p>
                  </li>
                  <li>
                    <p>
                      to subscribe, maintain and / or terminate any electronic banking services and / or cash management
                      services, remittances and payment services, including to book foreign exchange rates and to
                      authorize foreign exchange transactions and any other services of a similar nature offered by the
                      Bank (“Services”) at any time subject to the terms and conditions of such Services;
                    </p>
                  </li>
                  <li>
                    <p>to appoint, change and / or revoke the appointment of:</p>

                    <ol>
                      <li>
                        any person whose signatures may be appended in the Signature Form (“Authorised Signatory”) in
                        connection with the operation of the Accounts, including signing and / or issuing any cheques,
                        promissory notes, orders, bills, instructions or receipts;
                      </li>
                      <li>any users to use and / or operate the Services (“Authorised User”); and</li>
                    </ol>
                  </li>
                  <li>
                    <p>
                      to negotiate, accept, execute and / or issue any documents or agreements including any
                      supplemental, letters, forms, indemnities, undertakings, notices or communications (“Documents”)
                      in connection with the Accounts and / or the Services.
                    </p>
                  </li>
                </ol>
              </li>
              <li>
                <b>COMMON SEAL</b>
                <p>
                  Approval and authorisation be given for the Common Seal of the Company to be affixed, wherever
                  necessary or required by the Bank on any Documents.
                </p>
              </li>
              <li>
                <b>RATIFICATION</b>
                <p>
                  Approval and authorisation be given to the Company to ratify, confirm, declare and adopt each and
                  every action, deeds, agreements, transactions done or made prior to the date of this resolution in
                  connection with the Accounts and / or Services undertaken by the Company.
                </p>
              </li>
            </ol>
          </div>
        </template>
      </Paper>

      <Paper
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        :additional-css-class="'resolution'"
      >
        <template
          #paperMargins
          v-if="props.isShowTag"
        >
          <!-- <div class="paper-tag point-left branch-selection"><span>Insert Information</span></div> -->
        </template>

        <template #paperContent>
          <div class="company-detail-head cimb-other-pages">
            <div class="company-name">
              <b>{{ controller.companyName() }}</b>
              (the "Company")
            </div>
            <div class="company-registration-number">
              Company No: [{{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})]
            </div>
          </div>

          <div class="resolution-title cimb-other-pages">
            <span>
              {{ controller.resolutionTitle() }}
            </span>
          </div>

          <div class="resolution-content">
            <ol start="4">
              <li>
                <b>CERTIFICATION</b>
                <p>Approval and authorization be given to:</p>
                <ol>
                  <li>
                    The Directors OR Company Secretary and one (1) Director OR two (2) Directors to certify any extract
                    Resolution; and
                  </li>
                  <li>
                    the Company Secretary or the Company Director to certify any company documents other than the
                    extract Resolution.
                  </li>
                </ol>
              </li>

              <li>
                <b>SUPERSESSION</b>
                <p>
                  This resolution shall supersede all existing resolutions for the operation of the Accounts and / or
                  Services solely operated by the Company previously received and recorded by the Bank. For avoidance of
                  doubt, all or any Accounts which are operated solely by third parties or jointly with third parties
                  including but not limited to, the Bank or its affiliates shall not be superseded by this resolution.
                </p>
              </li>
            </ol>
          </div>

          <div
            class="resolution-date"
            v-if="2 >= controller.signatureStartOnPage.value"
          >
            <b>Dated:</b>
            <br />
            <span class="date unknown">to be determined</span>
          </div>
          <div
            class="signature-section"
            v-if="2 >= controller.signatureStartOnPage.value"
          >
            <div class="signature-title">
              {{ controller.signatureTitle() }}
            </div>
            <div
              class="signature-item"
              v-for="(signatureItem, i) in controller.getSignatureOnCurrentPage(2)"
              :key="i"
            >
              <Signature
                :signature-item="signatureItem"
                :is-tinted="true"
                :tint-label="'Your Signature is required in Wet Ink'"
              />
            </div>
          </div>
        </template>
      </Paper>

      <!-- <Paper
        v-for="(page, index) in controller.pageRangeForSignatures()"
        :paper-orientation="PaperOrientation.Portrait"
        :additional-css-class="'resolution'"
        :total-pages="controller.totalPages()"
        :page-number="page"
        :show-ear-mark="true"
        :ear-mark-text="'DCR'"
        :show-watermark="props.showWatermark"
        :watermark-text="props.watermarkText"
      >
        <template #paperContent>
          <div class="company-detail-head maybank-other-pages">
            <div class="company-name">
              {{ controller.companyName() }}
            </div>
            <div class="company-registration-number">
              [Company No: {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})]
            </div>
          </div>
          <div class="resolution-title maybank-other-pages">
            (Directors’ Resolution in Writing Re: Opening of Bank Account with Bank Kerjasama Rakyat Malaysia Berhad –
            cont’d)
          </div>
          <div
            class="resolution-date"
            v-if="page >= controller.signatureStartOnPage.value"
          >
            <b>Dated:</b>
            <br />
            <span class="date unknown">to be determined</span>
          </div>
          <div class="signature-section">
            <div
              class="signature-title"
              v-if="page === controller.signatureStartOnPage.value"
            >
              {{ controller.signatureTitle() }}
            </div>

            <div
              class="signature-item"
              v-for="(signatureItem, i) in controller.getSignatureOnCurrentPage(page)"
              :key="index"
            >
              <Signature
                :signature-item="signatureItem"
                :is-tinted="true"
                :tint-label="'Your Signature is required in Wet Ink'"
                @is-enlarged="controller.handleEnlargedSignaturePad($event)"
                @signed="emit('signed', $event)"
              />
            </div>
          </div>
        </template>
      </Paper> -->
    </template>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import Signature from "../Signatures/Signature.vue"
  import BranchDropdown from "@/components/Banks/BranchDropdown.vue"
  import type { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
  import { DcrBankAccountOpeningCimbBankController } from "~/scripts/components/resolutions/DcrBankAccountOpeningCimbBankController"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { StringUtil } from "~/scripts/utils/String"
  import { PaperOrientation } from "~/scripts/constants/Paper"

  const props = defineProps<IPropsResolutionDocument<CompanyBankAccountOpening>>()

  const emit = defineEmits(["startLoading", "doneLoading", "signed", "updated"])

  const resolutionContent = ref(null)
  const nonDirectorBankSignatoryRef = ref(null)

  const controller = new DcrBankAccountOpeningCimbBankController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      if (!StringUtil.isNullOrEmpty(newVal)) {
        controller.fetchApplication(newVal ?? "")
      }
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      console.log(newVal)
      controller.setIsInPreviewMode(newVal)
      controller.setContent()
    }
  )

  watch(
    resolutionContent,
    (newVal) => {
      if (newVal) {
        controller.setResolutionContentRef(newVal)
      }
    },
    { immediate: true }
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
    () => props.application,
    (newVal) => {
      if (!newVal) {
        return
      }

      controller.updateApplicationContent(newVal)
    },
    { deep: true }
  )

  watch(nonDirectorBankSignatoryRef, (newVal) => {
    controller.setNonDirectorBankSignatoryRef(newVal)
  })

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
    isLoading: controller.isLoading.value,
    getAuthorisedPersonsForOnlineBanking: controller.getAuthorisedPersonsForOnlineBanking.bind(controller),
    getSignatoryType: controller.getSignatoryType.bind(controller),
    getSignatories: controller.getSignatories.bind(controller),
    getBranchId: controller.getBranchId.bind(controller),
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/DcrBankAccountOpeningCimbBank" as *;
</style>
