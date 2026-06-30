<template>
  <div id="legal-documents-management-account-for-striking-off">
    <Paper
      v-if="controller.isLoading.value"
      :is-loader="true"
      :paper-orientation="controller.paperOrientation"
      :additional-css-class="controller.addiitonalCssClass"
      :show-page-number="true"
      :total-pages="1"
      :page-number="1"
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
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.addiitonalCssClass"
        :show-page-number="true"
        :total-pages="1"
        :page-number="1"
      >
        <template #paperContent>
          <table class="management-account-table">
            <tbody>
              <tr class="header">
                <td
                  colspan="2"
                  class="company-name"
                >
                  {{ controller.company.value.getFullName() }}
                </td>
              </tr>
              <tr class="header">
                <td
                  colspan="2"
                  class="header"
                >
                  (Incorporated in Malaysia)
                </td>
              </tr>
              <tr class="header">
                <td
                  colspan="2"
                  class="header"
                >
                  Registration No. {{ controller.company.value.registrationNumberNew }} ({{
                    controller.company.value.registrationNumberOld
                  }})
                </td>
              </tr>
              <tr class="header">
                <td
                  colspan="2"
                  class="document-title"
                >
                  Statement of Financial Position for the financial period as at
                  {{ controller.formattedEndDate }}
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr class="title">
                <td
                  class="section-title"
                  colspan="2"
                >
                  Assets
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr class="title">
                <td
                  class="sub-section-title"
                  colspan="2"
                >
                  Current Assets
                </td>
              </tr>
              <tr class="bankCase">
                <td
                  class="child-section-title"
                  colspan="2"
                >
                  Bank & Cash Equivalent
                </td>
              </tr>
              <tr class="child">
                <td>Bank</td>
                <td class="amount-column">-</td>
              </tr>
              <tr class="child">
                <td class="sub-total-label">Total Bank & Cash Equivalent</td>
                <td class="sub-total-amount">-</td>
              </tr>
              <tr class="total">
                <td class="total-label">Total Current Assets</td>
                <td class="total-amount">-</td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr class="total">
                <td class="section-total-label">Total Assets</td>
                <td class="section-total-amount">-</td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr class="title">
                <td
                  class="section-title"
                  colspan="2"
                >
                  Equity
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr class="child">
                <td>Share Capital</td>
                <td class="amount-column">{{ controller.formattedShareCapital }}</td>
              </tr>
              <tr class="child">
                <td>Retained Earnings</td>
                <td class="amount-column">({{ controller.retainedEarnings }})</td>
              </tr>
              <tr class="total">
                <td class="total-label">Shareholders Deficit</td>
                <td class="total-amount">{{ controller.shareholdersDeficit }}</td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr class="title">
                <td
                  class="section-title"
                  colspan="2"
                >
                  Liabilities
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr class="child">
                <td>Amount Due to Directors</td>
                <td class="amount-column">{{ controller.totalLiabilities }}</td>
              </tr>
              <tr class="total">
                <td class="total-label">Total Liabilities</td>
                <td class="total-amount">{{ controller.totalLiabilities }}</td>
              </tr>
              <tr class="total">
                <td class="section-total-label">Total Equity + Liabilities</td>
                <td class="section-total-amount">-</td>
              </tr>
            </tbody>
          </table>
        </template>
      </Paper>
      <Paper
        :paper-orientation="controller.paperOrientation"
        :additional-css-class="controller.addiitonalCssClass"
        :show-page-number="true"
        :total-pages="1"
        :page-number="1"
      >
        <template #paperContent>
          <table class="management-account-table">
            <tbody>
              <tr class="header">
                <td
                  colspan="2"
                  class="company-name"
                >
                  {{ controller.company.value.getFullName() }}
                </td>
              </tr>
              <tr class="header">
                <td
                  colspan="2"
                  class="header"
                >
                  (Incorporated in Malaysia)
                </td>
              </tr>
              <tr class="header">
                <td
                  colspan="2"
                  class="header"
                >
                  Registration No. {{ controller.company.value.registrationNumberNew }} ({{
                    controller.company.value.registrationNumberOld
                  }})
                </td>
              </tr>
              <tr class="header">
                <td
                  colspan="2"
                  class="document-title"
                >
                  Detailed Income Statement for the financial period for
                  {{ controller.formattedStartDate }} to
                  {{ controller.formattedEndDate }}
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr class="title">
                <td
                  class="section-title"
                  colspan="2"
                >
                  Revenue
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr class="title">
                <td class="sub-section-title">Cost of Sales</td>
                <td class="amount-column">-</td>
              </tr>
              <tr class="total">
                <td class="section-total-label">Gross Profit</td>
                <td class="section-total-amount">-</td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr class="title">
                <td
                  class="section-title"
                  colspan="2"
                >
                  Expenses
                </td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr
                class="child"
                v-if="controller.isIncorporatedWithinFye"
              >
                <td>Incorporation Fees</td>
                <td class="amount-column">{{ controller.incorporationFees }}</td>
              </tr>
              <tr
                class="child"
                v-if="controller.isSwitchWithinFye"
              >
                <td>Fees to Change Company Secretary</td>
                <td class="amount-column">{{ controller.switchFees }}</td>
              </tr>
              <tr class="child">
                <td>Secretarial Fees</td>
                <td class="amount-column">{{ controller.secretarialFees }}</td>
              </tr>
              <tr class="total">
                <td class="total-label">Total Expenses</td>
                <td class="total-amount">{{ controller.retainedEarnings }}</td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="empty-row"
                ></td>
              </tr>
              <tr class="total">
                <td class="section-total-label">Profit Before Tax</td>
                <td class="section-total-amount">({{ controller.retainedEarnings }})</td>
              </tr>
            </tbody>
          </table>
        </template>
      </Paper>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import { ManagementAccountForStrikingOffController } from "~/scripts/components/legal-documents/ManagementAccountForStrikingOffController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    financialYearEndDate: {
      type: String,
      required: true,
    },
    financialYearStartDate: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const controller = new ManagementAccountForStrikingOffController(
    props.companyId,
    props.financialYearStartDate,
    props.financialYearEndDate,
    emit
  )

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    () => props.financialYearStartDate,
    (newVal) => {
      controller.setFinancialYearStartDate(newVal)
    }
  )

  watch(
    () => props.financialYearEndDate,
    (newVal) => {
      controller.setFinancialYearEndDate(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/ManagementAccountForStrikingOff" as *;
</style>
