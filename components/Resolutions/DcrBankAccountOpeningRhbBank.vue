<template>
  <div
    id="dcr-bank-account-opening-rhb-bank"
    ref="documentRef"
  >
    <Resolution
      v-bind="controller.resolutionProps"
      :company-address-multiline="controller.selectedCompanyAddress"
      @signed="emit('signed', $event)"
    >
      <template #page1>
        <div class="rhb-body">
          <br />
          <p><b>RESOLVED THAT:</b></p>

          <p>
            Business Current Account and Reflex Cash Management Services offered by RHB Bank Berhad (“Bank”) to
            {{ controller.companyName() }} (“Company”).
          </p>

          <ol class="rhb-alpha">
            <li>
              The Company may open, maintain and/or close Current Account with RHB Bank/ RHB Islamic Bank Berhad at
              {{ controller.branchName }} (“the Bank”), in accordance with and subject to such terms and conditions as
              may be prescribed by the Bank which may be supplemented, amended and/or substituted from time to time.
            </li>
            <li>
              That the Authorised signatories are hereby authorised to accept on behalf of the Company the terms and
              conditions for any facilities or services offered by the Bank through any website/electronic means [to
              insert other explanation] based transactions to be made from the Account (“Services”).
            </li>
            <li>
              The Bank is hereby authorised and instructed to:

              <ol class="rhb-roman">
                <li>
                  Honour all cheques, promissory notes, and other order drawn by and all bills accepted on behalf of the
                  Company and to debit such cheque, notes, orders and bills to the Company’s account whether such
                  account be in credit or overdrawn or may become overdrawn in consequence of such debit, provided that
                  they are endorsed/signed by the authorised signatories, and to accept and credit to the account of the
                  Company all monies deposited with or owing by the Bank on the Account at any time or times kept or to
                  be kept in the name of the Company and the amount of all cheques, notes, bills, other negotiable
                  instruments, orders or receipts;
                </li>
                <li>
                  THAT the Authorised Signatories authorize the appointment of the system administrator &lt;”SysAdmin
                  1”&gt; and system authorizer &lt;”SysAdmin 2”&gt; identified in the Reflex Cash Management Application
                  Form. In the event of the replacement of SysAdmin 1 and/or SysAdmin 2, the Company hereby authorizes
                  the Authorised Representative to appoint such replacement personnel from time to time and such
                  replacement personnel shall be authorized to act as the SysAdmin 1 (for creation of end users of the
                  Reflex Cash Management Services) and/or the SysAdmin 2 (for the approval of the creation of end users
                  of the Reflex Cash Management Services), as the case may be.
                </li>
              </ol>
            </li>
          </ol>
        </div>
      </template>

      <template
        v-for="page in controller.mandatePages"
        :key="page.number"
        #[`page${page.number}`]
      >
        <div class="rhb-body rhb-mandate-page">
          <br />
          <template v-if="page.number === 2">
            <ol
              class="rhb-roman"
              start="3"
            >
              <li>
                THAT the Authorised signatories acknowledge and agree that through the appointment of SysAdmin 1 and
                SysAdmin 2, as well as the creation of the end user by SysAdmin 1 and SysAdmin 2, the Company authorizes
                SysAdmin 1, SysAdmin 2 and the end user to act for and on behalf of the Company to access and/or use the
                Reflex Cash Management Services, including without limitation the acceptance of terms and conditions or
                submission of forms, applications or documents, whether physically, electronically or otherwise (as the
                case may be).
              </li>
              <li>
                THAT the Authorised signatories authorise the Bank to issue to SysAdmin 1 or SysAdmin 2 and to accept on
                the Company’s behalf, the passwords, tokens, digital certificate and any other identifiers or security
                codes required by the Company for access and/or use of the Reflex Cash Management Services.
              </li>
              <li>
                Accept all documents, instruments, forms, applications, letters of acknowledgement and/or terms and
                conditions executed by and on behalf of the Company relating to the Services;
              </li>
            </ol>

            <p>
              Provided they be signed by the following Authorised Signatories in accordance with the following
              conditions:
            </p>
          </template>

          <div v-if="page.number === 2 || page.accounts.length">
            <p>1. {{ controller.signingInstruction }}</p>
            <ol
              v-if="page.accounts.length"
              class="rhb-people"
              :start="page.accounts[0].index + 1"
            >
              <li
                v-for="row in page.accounts"
                :key="row.index"
              >
                {{ row.person.name }}
                <div v-if="row.person.identification">Identification No: {{ row.person.identification }}</div>
              </li>
            </ol>
          </div>

          <div v-if="page.representatives.length || page.number === controller.lastClausePage - 1">
            <p>2. Authorized Representative for Reflex:</p>
            <ol
              v-if="page.representatives.length"
              class="rhb-people"
              :start="page.representatives[0].index + 1"
            >
              <li
                v-for="row in page.representatives"
                :key="row.index"
              >
                {{ row.person.name }}
                <div v-if="row.person.identification">Identification No: {{ row.person.identification }}</div>
              </li>
            </ol>
          </div>
        </div>
      </template>

      <template #[`page${controller.lastClausePage}`]>
        <br />
        <div class="rhb-body">
          <ol
            class="rhb-alpha"
            start="4"
          >
            <li>
              The Authorised Signatories be and are hereby authorised and empowered on behalf of the Company to:

              <ol class="rhb-roman">
                <li>
                  Open and operate Account in any manner other than by signature, including the operation of such
                  Account through electronic means such as by the use of Personal Identification Numbers (“PINs”),
                  computer terminals and other means or services made available to the Company by the Bank.
                </li>
                <li>
                  Negotiate, execute, submit and deliver all relevant applications forms, agreements, instruments and
                  any other documents as may be necessary as expedient or desirable in respect of the opening,
                  operation, maintaining Account or Services and/or to negotiate and agree to the terms and conditions
                  thereof and such modification, amendments, variation and or additions thereto as the Authorised
                  Signatories deem fit.
                </li>
              </ol>
            </li>
            <li>
              This resolution and the authority and the power given to each person in this resolution shall continue
              with full force and effect to bind the Company until the Bank receives a certified true copy of the
              resolution of the Board of the Director of the Company revoking or amending this resolution.
            </li>
            <li>
              Any one/two director(s) and/or the secretary of the Company be and are hereby authorised to certify to the
              Bank from time to time all documents, instruments or instructions given with regards to the Account and
              the Services.
            </li>
            <li>
              This resolution is only applicable to the branch that the account is opened and is not allowed to be used
              in other branches.
            </li>
          </ol>
        </div>
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import Resolution from "./Resolution.vue"
  import { CompanyBankAccountOpening } from "~/scripts/models/CompanyBankAccountOpening"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import { DcrBankAccountOpeningRhbBankController } from "~/scripts/components/resolutions/DcrBankAccountOpeningRhbBankController"

  const props = defineProps<IPropsResolutionDocument<CompanyBankAccountOpening>>()
  const emit = defineEmits(["startLoading", "doneLoading", "signed", "updated"])
  const documentRef = ref<HTMLElement | null>(null)
  const controller = new DcrBankAccountOpeningRhbBankController(props, emit)

  watch(
    () => props.application,
    (application) => {
      controller.application.value = new CompanyBankAccountOpening(application)
      controller.setContent()
    },
    { deep: true, immediate: true }
  )

  watch(
    [() => props.application?.companyId, () => props.application?.id, () => props.application?.signatureGroups],
    () => controller.loadSignatures(),
    { immediate: true, deep: true }
  )

  watch(
    () => props.isShowCompanyAddress,
    (showAddress) => controller.setIsShowCompanyAddress(showAddress !== false),
    { immediate: true }
  )

  watch(
    () => props.showWatermark,
    (value) => controller.setShowWatermark(value)
  )

  watch(
    () => props.watermarkText,
    (value) => controller.setWatermarkText(value)
  )

  watch(documentRef, (element) => controller.setDocumentRef(element), { immediate: true })

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    getBranchId: controller.getBranchId.bind(controller),
    getSignatories: controller.getSignatories.bind(controller),
    getSignatoryType: controller.getSignatoryType.bind(controller),
    getAuthorisedPersonsForOnlineBanking: controller.getAuthorisedPersonsForOnlineBanking.bind(controller),
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/DcrBankAccountOpeningRhbBank" as *;
</style>
