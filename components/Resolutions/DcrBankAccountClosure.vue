<template>
  <div id="dcr-appointment-of-director">
    <Resolution :company-name="controller.companyName()" :registration-number-old="controller.registrationNumberOld()"
      :registration-number-new="controller.registrationNumberNew()" :resolution-title="controller.resolutionTitle()"
      :signature-title="controller.signatureTitle()" :signature-items="controller.signatureItems.value"
      :resolution-date="controller.resolutionDate()" :signature-start-on-page="controller.signatureStartOnPage.value"
      :max-signature-on-first-page="controller.maxSignatureOnFirstPage.value"
      :max-signature-on-other-page="controller.maxSignatureOnOtherPages.value" :has-accompanying-document="false"
      :is-draft="controller.isResolutionInDraft()"
      :total-pages="controller.totalPages()">
      <template #page1>

        <p>
          <b>RESOLVED:</b>
          <br>
          <b>CLOSURE OF BANK ACCOUNT WITH {{ bankName }}</b>
        </p>

        <p>
          {{ bankName }} ("the Bank") <br>
        </p>
        <p>
          {{ bankBranch }} BRANCH <br>
        </p>

        <p>
          {{ formattedBankAddress }}
        </p>

        <p>
          Current Account No. : {{ bankAccountNoProp }}
        </p>

        <p>
          That authority be and is hereby given for the Company to close the abovementioned bank account maintained with the Bank with immediate effect.
        </p>

        <p>
          That authority be and is hereby given to Authorised Signatories to instruct the Bank to transfer the remaining funds standing in credit in the Company's Account
          maintained with the Bank to the following bank account of the Shareholder and to give such further necessary instructions to the Bank to complete the aforesaid transfer, for and on behalf of the Company:
        </p>

        <table>
          <tbody>
            <tr>
              <td>
                Name of Bank
              </td>
              <td>
                : {{ transferToBankName }}
              </td>
            </tr>

            <tr>
              <td>
                Name of Beneficiary
              </td>
              <td>
                : {{ transferToBeneficiary }}
              </td>
            </tr>

            <tr>
              <td>
                Current Account No.
              </td>
              <td>
                : {{ transferToBankAccountNo }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
import { StringUtil } from '~/scripts/utils/String'
import Resolution from './Resolution.vue'
import { DcrBankAccountClosureController } from '~/scripts/components/resolutions/DcrBankAccountClosureController'
const props = defineProps({
  companyId: {
    type: String,
    required: true
  },
  applicationId: {
    type: [String, null],
    default: null
  }
})
const emit = defineEmits(['startLoading', 'doneLoading'])
const controller = new DcrBankAccountClosureController(props.companyId, props.applicationId, null, emit)
watch(() => props.applicationId, (newVal) => {
  if (!StringUtil.isNullOrEmpty(newVal)) {
    controller.fetchApplication(newVal ?? '')
  }
})
defineExpose({
  totalPages: controller.totalPages.bind(controller)
})
</script>

<style lang="scss">
@use '~/assets/scss/components/Resolutions/AppointmentOfDirector' as *;
</style>