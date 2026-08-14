<template>
  <div id="dcr-register-transfer-of-shares" class="register-transfer-of-shares">
    <Resolution v-bind="controller.resolutionProps"
      @total-page-changed="emit('totalPageChanged')" @signed="emit('signed', $event)">
      <template #page1>
        <p>
          <b>WHEREAS:-</b>
        </p>
        <ol class="resolution-list">
          <li>
            The registered shareholder(s) (“Transferor (s)”) more particularly described below with their respective
            shareholdings is/are desirous to transfer his/her/their shares to the following Transferee(s):
            <table class="table-with-border">
              <thead>
                <tr>
                  <td>Transferor</td>
                  <td>Transferee</td>
                  <td>No. of Ordinary Shares</td>
                  <td>Date of Section 105</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(transferDetail, index) in controller.transferDetails.value" :key="index">
                  <td>
                    {{ transferDetail.transferFromName }}
                  </td>
                  <td>
                    {{ transferDetail.transferToName }}
                  </td>
                  <td>
                    {{ transferDetail.unitsOfShare }}
                  </td>
                  <td>
                    {{ controller.section105Date(transferDetail) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </li>
          <li>
            That the Company hereby acknowledged receipt of the duly executed Form(s) of Transfer of Securities pursuant
            to
            Section 105 of the Companies Act, 2016 dated above.
          </li>
          <li>
            And that thirty (30) days has{{ controller.has30DaysExpired('') ? '' : ' not' }} expire since the receipt of
            the instrument of transfer
          </li>
        </ol>
        <p>
          <b>RESOLVED:-</b>
        <div class="resolution-name" v-if="!controller.isDocumentEditable()">
          {{ controller.registerType() }}
        </div>
        </p>
        <ul class="checkbox-list" v-if="controller.isDocumentEditable()">
          <li v-for="(registerType, index) in controller.registerTypeOptions" :key="index">
            <div class="form-check">
              <input type="checkbox" :value="registerType.value"
                :checked="controller.isRegisterTypeSelected(registerType.value as string)"
                @click="controller.onRegisterTypeClicked(registerType.value as string)">
              <label class="resolution-name"
                :class="{ 'strikedthrough': !controller.isRegisterTypeSelected(registerType.value as string) }">
                {{ registerType.label }}
              </label>
            </div>
          </li>
        </ul>
        <p v-if="controller.isApproval()">
          <b>THAT</b> subject to the approval from the relevant authorities and the receipt of the duly executed and
          stamped
          Form of Transfer of Securities pursuant to Section 105 of the Companies Act, 2016, the above-mentioned
          transfer of ordinary shares of the Company be and is hereby approved.
        </p>
        <p v-if="controller.isApproval()">
          <b>THAT</b> the Company Secretary be hereby instructed to enter the name of the Transferees into the Register
          of Members of the Company and be further authorised to lodge the Register of Member pursuant to Section 51 of
          the Companies Act 2016 with the Companies Commission of Malaysia accordingly.
        </p>
        <p v-if="controller.isDelay()">
          <b>THAT</b> the Board of Directors be and is hereby allowed to exercise the powers contained
          under section 106(1) of the Companies Act, 2016 for the best interest of the Company, to
          delay the registration of transfer of shares if the consideration of the transfer is not received
          by either the Transferor or the Company within thirty (30) days from the receipt of the
          instrument of transfer.
        </p>
        <p v-if="controller.isDelay()">
          <b>THAT</b> upon the receipt of the consideration, the Company Secretary be and is hereby
          authorised to enter the name of the Transferees into the Register of Members of the
          Company and be further authorised to lodge the Register of Member pursuant to Section 51
          of the Companies Act 2016 with the Companies Commission of Malaysia accordingly.
        </p>
        <p v-if="controller.isRefusal()">
          <b>THAT</b> the Board of Directors be and is hereby allowed to exercise the powers contained
          under section 106(1) of the Companies Act, 2016 for the best interest of the Company, to
          refuse the registration of transfer of shares as the consideration of the transfer is not received
          by either the Transferor or the Company within thirty (30) days from the receipt of the
          instrument of transfer.
        </p>
        <FurtherResolved />
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
import FurtherResolved from './FurtherResolved.vue'
import Resolution from './Resolution.vue'
import { DcrRegisterTransferOfSharesController } from '~/scripts/components/resolutions/DcrRegisterTransferOfSharesController'
import { StringUtil } from '~/scripts/utils/String'
import { CompanyShareholderAllotment } from '~/scripts/models/CompanyShareholderAllotment'
import type { CompanyPostShareTransfer } from '~/scripts/models/CompanyPostShareTransfer'
import type { IPropsResolutionDocument } from '~/scripts/props/PropsResolutionDocument'

const props = defineProps<IPropsResolutionDocument<CompanyPostShareTransfer>>()

const emit = defineEmits(['startLoading', 'doneLoading', 'totalPageChanged', 'applicationUpdated', 'signed'])

const controller = new DcrRegisterTransferOfSharesController(
  props,
  emit
)

watch(() => props.applicationId, (newVal) => {
  controller.setApplicationId(newVal)
})

// watch(() => props.application, (newVal) => {
//   controller.onApplicationChanged(newVal)
// }, { deep: true })


watch(() => props.isInPreviewMode, (newVal) => {
  controller.setIsInPreviewMode(newVal)
})

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
  totalPages: controller.totalPages.bind(controller), //Has to plus one always, because there is accompanying document
  getApplication: controller.getApplication.bind(controller),
  updateApplicationContent: controller.updateApplicationContent.bind(controller)
})
</script>

<style lang="scss">
@use '~/assets/scss/components/Resolutions/RegisterTransferOfShares' as *;
</style>
