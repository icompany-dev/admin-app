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
          <b>CHANGE OF AUTHORISED SIGNATORIES FOR THE BANK ACCOUNT MAINTAINED WITH {{companyChangeBankSignatoriesProp?.bankName}}</b>
        </p>

        <div class="bank-details">
          <div class="name">
            {{ companyChangeBankSignatoriesProp?.bankName }}
          </div>
          <div class="branch">
            {{ companyChangeBankSignatoriesProp?.bankBranch }}
          </div>
          <div class="address" v-html="formattedBankAddress" />
        </div>

        <p>
          <b>THAT</b> the bank signatories for the Current Account No. {{ companyChangeBankSignatoriesProp?.bankAccountNo }} (“<b>Account</b>”) maintained with the Bank be changed with immediate effect.
        </p>

        <p>
          <b>THAT</b> the Bank be now empowered whether the Company’s account is in credit or not, to honour cheques, bills of exchange and promissory notes drawn, accepted, or made on behalf of the Company provided that it is operated in the following manner by the following Authorised Signatories:-
        </p>

        <table>
          <thead>
            <tr>
              <th />
              <th>Authorised Signatories</th>
              <th>NRIC No.</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(authorisedSignatory, index) in companyChangeBankSignatoriesProp?.authorisedSignatories" :key="index">
              <td>{{ index +1 }}</td>
              <td>{{ authorisedSignatory.name }}</td>
              <td>{{ authorisedSignatory.identification }}</td>
            </tr>
          </tbody>
        </table>

        <p>
          <b><u>Mode of Operation</u></b>
        </p>

        <p>
          To be signed by <span class="text-uppercase fw-bold">{{ companyChangeBankSignatoriesProp?.authorisedType }}</span> of the above Authorised Signatories.
        </p>

        <p>
          <b>THAT</b> the Bank be authorised to act on any instructions and accept any receipts or other documents relating to the account,
          transactions or affairs of the Company and that all cheques, bills, promissory notes and other documents requiring endorsements on behalf of the Company be endorsed in the aforesaid manner.
        </p>

        <p>
          <b>THAT</b> a copy of this resolution be furnished to the Bank and it shall remain in force until notice in writing to the contrary is given to the Bank by the Company.
        </p>
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
import { StringUtil } from '~/scripts/utils/String'
import Resolution from './Resolution.vue'
import { DcrChangeBankSignatoriesController } from '~/scripts/components/resolutions/DcrChangeBankSignatoriesController'

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

const controller = new DcrChangeBankSignatoriesController(props.companyId, props.applicationId, null, emit)

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