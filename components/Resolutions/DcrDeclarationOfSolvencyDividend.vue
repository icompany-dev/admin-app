<template>
  <div id="dcr-dividend-declaration">
    <Resolution
      v-bind="controller.resolutionProps"
      @total-page-changed="emit('totalPageChanged')"
    >
      <template #page1>
        <p>
          <b>RESOLVED:-</b>
          <br />
          <b>DECLARATION OF SOLVENCY</b>
        </p>
        <p>Whereas the Directors of the Company have:-</p>
        <ol class="number-list">
          <li>
            made proper inquiry into:-
            <ol class="alpha-list">
              <li>the latest Audited Financial Statement of the Company;</li>
              <li>the projected twelve months management accounts and cash flow statements of the Company;</li>
              <li>the Company's state of affairs and prospects; and</li>
              <li>
                take into account all the liabilities of the Company including contingent liabilities of the Company.
              </li>
            </ol>
          </li>
          <li>
            formed the opinion and hereby declared that:-
            <br />
            <ol class="alpha-list">
              <li>there will be no ground on which the Company could be found to be unable to pay its debts;</li>
              <li>
                the assets of the Company is more than the liabilities of the Company as at the date of the declaration
                of dividend; and
              </li>
              <li>
                the Company will be able to pay its debts in full as the debts become due during the period of twelve
                months immediately following the declaration of the dividend.
              </li>
            </ol>
          </li>
        </ol>
        <p>
          THAT the Solvency Statement to be signed by all the Directors of the Company in respect of the declaration of
          the dividend.
        </p>
        <p>
          <b>RESOLVED:-</b>
          <br />
          <b>DECLARATION OF DIVIDEND</b>
        </p>
        <ol class="number-list">
          <li>
            Declaration of Dividend
            <br />
            <br />
            {{ controller.anOrA() }}
            <select
              v-if="controller.isDocumentEditable()"
              class="form-control in-resolution"
              v-model="controller.selectedDividendType.value"
              @changed="controller.onSelectedDividendType()"
            >
              <option
                v-for="(dividendType, index) in controller.dividendTypes"
                :key="index"
                :value="dividendType.value"
              >
                {{ dividendType.label }}
              </option>
            </select>
            <span
              v-if="!controller.isDocumentEditable()"
              class="fit-content"
              :class="{ placeholder: controller.isInPreviewMode.value }"
            >
              {{ controller.dividendType() }}
            </span>
            dividend of RM
            <input
              type="text"
              v-model="controller.pricePerShare.value"
              v-if="controller.isDocumentEditable()"
              class="form-control in-resolution currency"
              @change="controller.onPricePerShareChanged()"
            />
            <span
              v-if="!controller.isDocumentEditable()"
              class="fit-content"
              :class="{ placeholder: controller.isInPreviewMode.value }"
            >
              {{ controller.dividendPricePerShare() }}
            </span>
            per share, amounting in aggregate to Ringgit Malaysia
            <input
              type="text"
              v-model="controller.amountInWords.value"
              v-if="controller.isDocumentEditable()"
              @change="controller.onAmountInWordsChanged()"
              placeholder="Amount in words"
              class="form-control in-resolution width-fit"
            />
            <span
              v-if="!controller.isDocumentEditable()"
              class="fit-content"
              :class="{ placeholder: controller.isInPreviewMode.value }"
            >
              {{ controller.dividendAmountInWords() }}
            </span>
            (RM
            <input
              type="text"
              v-model="controller.amount.value"
              v-if="controller.isDocumentEditable()"
              @input="controller.onTotalAmountInput()"
              @change="controller.onAmountChanged()"
              class="form-control in-resolution currency"
            />
            <span
              v-if="!controller.isDocumentEditable()"
              class="fit-content"
              :class="{ placeholder: controller.isInPreviewMode.value }"
            >
              {{ controller.dividendTotal() }}
            </span>
            ), be and is hereby declared in respect of the issued
            <select
              v-if="controller.isDocumentEditable()"
              class="form-control in-resolution"
              v-model="controller.selectedShareType.value"
              @change="controller.onSelectedShareType()"
            >
              <option
                v-for="(shareType, index) in controller.shareTypes"
                :key="index"
                :value="shareType.value"
              >
                {{ shareType.label }}
              </option>
            </select>
            <span
              v-if="!controller.isDocumentEditable()"
              class="fit-content"
              :class="{ placeholder: controller.isInPreviewMode.value }"
            >
              {{ controller.shareType() }}
            </span>
            shares of the Company for the financial year ending
            <input
              type="date"
              v-model="controller.financialYearEndDate.value"
              v-if="controller.isDocumentEditable()"
              @change="controller.onFinancialYearEndDateChanged()"
              class="form-control in-resolution"
            />
            <span
              v-if="!controller.isDocumentEditable()"
              class="fit-content"
              :class="{ placeholder: controller.isInPreviewMode.value }"
            >
              {{ controller.fye() }}
            </span>
            .
          </li>
          <li>
            Entitlement Date
            <br />
            <br />
            The dividend shall be payable to shareholders whose names appear in the Register of Members as at
            <input
              type="date"
              v-model="controller.dateOfRegisterOfMembers.value"
              :max="controller.dividendPaymentDate.value"
              v-if="controller.isDocumentEditable()"
              class="form-control in-resolution"
              @change="controller.onDateOfRegisterOfMembersChanged()"
            />
            <span
              v-if="!controller.isDocumentEditable()"
              class="fit-content"
              :class="{ placeholder: controller.isInPreviewMode.value }"
            >
              {{ controller.dateOfRegister() }}.
            </span>
          </li>
          <li>
            Payment Date and Mode
            <br />
            <br />
            The dividend shall be paid on or before
            <input
              type="date"
              v-model="controller.dividendPaymentDate.value"
              v-if="controller.isDocumentEditable()"
              class="form-control in-resolution"
              @change="controller.onDividendPaymentDateChanged()"
            />
            <span
              v-if="!controller.isDocumentEditable()"
              class="fit-content"
              :class="{ placeholder: controller.isInPreviewMode.value }"
            >
              {{ controller.formattedDividendPaymentDate() }}
            </span>
            by way of
            <select
              v-if="controller.isDocumentEditable()"
              class="form-control in-resolution"
              v-model="controller.selectedDividendPaymentMethod.value"
            >
              <option
                v-for="(dividendPaymentMethod, index) in controller.dividendPaymentMethods"
                :key="index"
                :value="dividendPaymentMethod.value"
              >
                {{ dividendPaymentMethod.label }}
              </option>
            </select>
            <span
              v-if="!controller.isDocumentEditable()"
              class="fit-content"
              :class="{ placeholder: controller.isInPreviewMode.value }"
            >
              {{ controller.dividendPaymentMethod() }}
            </span>
            into the shareholders’ nominated bank accounts.
          </li>
        </ol>
      </template>
      <template #page2>
        <br />
        <FurtherResolved />
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import { StringUtil } from "~/scripts/utils/String"
  import Resolution from "./Resolution.vue"
  import FurtherResolved from "./FurtherResolved.vue"
  import { DcrDeclarationOfSolvencyDividendController } from "~/scripts/components/resolutions/DcrDeclarationOfSolvencyDividendController"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import type { CompanyDividendDeclaration } from "~/scripts/models/CompanyDividendDeclaration"

  const props = defineProps<IPropsResolutionDocument<CompanyDividendDeclaration>>()

  const emit = defineEmits(["startLoading", "doneLoading", "totalPageChanged"])

  const controller = new DcrDeclarationOfSolvencyDividendController(props, emit)

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

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/DividendDeclaration" as *;
</style>
