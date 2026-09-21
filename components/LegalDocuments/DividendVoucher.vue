<template>
  <div
    id="legal-documents-dividend-voucher"
    ref="documentRef"
  >
    <Paper
      v-if="controller.isLoading.value"
      :paper-orientation="controller.paperOrientation"
      :is-loader="true"
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
        v-for="(shareholder, index) in controller.shareholders.value"
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.additionalCssClass"
        :show-page-number="false"
      >
        <template #paperContent>
          <div class="voucher-content">
            <div class="company-details">
              <div class="company-name">
                {{ controller.companyName() }}
              </div>
              <div class="company-registration-numbers">
                {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
              </div>
              <div class="incorporated">(Incorporated in Malaysia)</div>
            </div>
            <div class="voucher-table">
              <table>
                <thead>
                  <tr>
                    <th colspan="7">MALAYSIAN DIVIDEND VOUCHER</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="header">
                    <td>WARRANT NO.</td>
                    <td>DIVIDEND NO.</td>
                    <td>TYPE OF DIVIDEND</td>
                    <td>FOR YEAR ENDED</td>
                    <td>FOR SHARES REGISTERED ON</td>
                    <td>SHAREHOLDING</td>
                    <td>DATE OF PAYMENT</td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        type="text"
                        class="form-control in-resolution"
                        placeholder="Warrant No."
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        class="form-control in-resolution"
                        placeholder="Dividend No."
                      />
                    </td>
                    <td>{{ controller.typeOfDividend }}</td>
                    <td>{{ controller.fye }}</td>
                    <td>{{ controller.dateRegisterOfMembers }}</td>
                    <td>{{ controller.getShareholding(shareholder) }}</td>
                    <td>{{ controller.dateOfPayment }}</td>
                  </tr>
                </tbody>
              </table>
              <table>
                <thead>
                  <tr>
                    <th>CATEGORY OF DIVIDEND</th>
                    <th>DIVIDEND RATE</th>
                    <th>GROSS DIVIDEND (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {{ controller.dividendCategory.value }}
                    </td>
                    <td>{{ controller.getDividendRate(shareholder) }}%</td>
                    <td>
                      {{ controller.getGrossAmount(shareholder) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="shareholder-cosec-details">
              <div class="shareholder-details">
                <b>{{ shareholder.fullName() }}</b>
                <span v-html="controller.getShareholderAddress(shareholder)" />
              </div>
              <div class="cosec-details">
                <span>FOR {{ controller.companyName() }}</span>
                <img :src="controller.cosecSignature" />
                <b>{{ controller.cosecName }}</b>
                <span>Company Secretary</span>
                <span>{{ controller.cosecLicenseNumber }}</span>
                <span>SSM PC No.: {{ controller.cosecSsmPcm }}</span>
              </div>
            </div>
            <div class="disclaimer">
              <ol>
                <li>
                  We hereby certify that the exempt dividend is paid out of dividend income in respect of which Income
                  Tax has been exempted under
                  <input
                    type="text"
                    class="form-control in-resolution"
                    v-model="controller.legalProvisionForExemption.value"
                    placeholder="Legal Provision for Exemption"
                  />
                  .
                </li>
                <li>
                  We hereby certify that no tax is deductible from the single tier dividend under subsection 108(1) of
                  the Income Tax Act 1967. The single tier dividend is not taxable in the hands of the shareholders
                  other than an individual pursuant to paragraph 12B of Schedule 6 of Income Tax Act 1967.
                </li>
              </ol>
              <small>
                <b>Note:</b>
                For an individual who receives one or more dividend vouchers, where the total gross dividend, other than
                dividend which is exempt in the hands of the shareholder, exceeds RM100,000.00, the individual must
                declare the dividend income as part of their aggregate income pursuant to paragraph 6(1)(r) of the said
                Act.
              </small>
            </div>
          </div>
          <!-- <div class="voucher-note">
            <b>NOTE:</b>
            <ol>
              <li>
                Where the date of payment for each category of dividend is different, separate dividend vouchers should
                be prepared.
              </li>
              <li>
                Where the dividend consists of property other than money, the gross dividend shall include the amount of
                the market value of that property at the time of the distribution of the dividend.
              </li>
              <li>
                The date of payment refers to the date on which the dividend is paid, distributed or credited by the
                company to the shareholders.
              </li>
              <li>
                The above example is just for illustration and only the relevant category/categories of dividend paid
                should be shown in the actual dividend voucher.
              </li>
              <li>
                The legal provisions relevant to the category of exempt income from which the exempt dividend is paid
                should be stated accurately in Paragraph 1 above whenever applicable.
              </li>
            </ol>
          </div> -->
        </template>
      </Paper>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import { DividendVoucherController } from "~/scripts/components/legal-documents/DividendVoucherController"
  import type { IPropsDividendVoucher } from "~/scripts/props/PropsDividendVoucher"

  const props = defineProps<IPropsDividendVoucher>()

  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new DividendVoucherController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    getPdfPages: controller.getPdfPages.bind(controller),
    totalPages: controller.totalPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/DividendVoucher" as *;
</style>
