<template>
  <div
    id="legal-documents-section236-three"
    ref="documentRef"
  >
    <Paper
      v-if="controller.isLoading.value"
      :is-loader="true"
      :paper-orientation="controller.paperOrientation"
      :additional-css-class="controller.additionalCssClass"
      :show-page-number="false"
    >
      <template #paperContent>
        <LoaderPrepare
          :label="controller.loaderLabel"
          :sublabel="controller.loaderSublabel"
        />
      </template>
    </Paper>
    <Paper
      v-if="!controller.isLoading.value"
      :paper-orientation="controller.paperOrientation"
      :additional-css-class="controller.additionalCssClass"
      :show-page-number="false"
    >
      <template #paperContent>
        <div class="company-registration">
          <div class="company-registration-label">Company No.</div>
          <div class="company-registration-box">
            {{ controller.companyRegistrationNumberNew.value }} ({{ controller.companyRegistrationNumberOld.value }})
          </div>
        </div>
        <div class="document-header">
          COMPANIES ACT 2016
          <br />
          Section 236(3)
          <br />
          <br />
          DECLARATION BY A PERSON BEFORE APPOINTMENT
          <br />
          AS Secretary
          <br />
          <br />
          {{ controller.companyName.value }}
        </div>
        <table class="section-table particulars">
          <thead>
            <tr>
              <th colspan="2">PARTICULARS OF SECRETARY</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>
                <select
                  v-if="!controller.isPrinting.value"
                  class="form-control"
                  v-model="controller.selectedSecretary.value"
                >
                  <option
                    v-for="(secretary, i) in controller.secretaries"
                    :value="secretary"
                  >
                    {{ secretary.name }}
                  </option>
                </select>
                <span v-if="controller.isPrinting.value">
                  {{ controller.selectedSecretary.value.name }}
                </span>
              </td>
            </tr>
            <tr>
              <td>NRIC No.</td>
              <td>{{ controller.selectedSecretary.value.nric }}</td>
            </tr>
            <tr>
              <td>Firm</td>
              <td>{{ controller.selectedSecretary.value.firmName.toUpperCase() }}</td>
            </tr>
            <tr>
              <td>Tel.</td>
              <td>{{ controller.selectedSecretary.value.firmPhone }}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{{ controller.selectedSecretary.value.email }}</td>
            </tr>
          </tbody>
        </table>
        <table class="section-table declaration">
          <thead>
            <tr>
              <th colspan="2">DECLARATION</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colspan="2">I hereby solemnly and sincerely declare that:</td>
            </tr>
            <tr>
              <td>(a)</td>
              <td>I am qualified to act as a secretary pursuant to section 235;</td>
            </tr>
            <tr>
              <td>(b)</td>
              <td>I am not disqualified to act as a secretary pursuant to section 238; and</td>
            </tr>
            <tr>
              <td>(b)</td>
              <td>
                I hereby consent to act as secretary of
                <b>{{ controller.companyName.value }}</b>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                Name:
                <b>{{ controller.selectedSecretary.value.name }}</b>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                Licence No./Prescribed Body Membership No.:
                <b>{{ controller.selectedSecretary.value.license }}</b>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                Date of Declaration:
                <b>{{ controller.declarationDate }}</b>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="signature-section">
          <div class="sign-off">Signed:</div>
          <div class="signature-image">
            <img :src="controller.selectedSecretary.value.signatureUrl" />
          </div>
          <div class="sign-off-role">(Secretary)</div>
          <div class="sign-off-details">
            <table class="sign-off-table">
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>:</td>
                  <td>{{ controller.selectedSecretary.value.name }}</td>
                </tr>
                <tr>
                  <td>License no/Membership no.</td>
                  <td>:</td>
                  <td>{{ controller.selectedSecretary.value.license }}</td>
                </tr>
                <tr>
                  <td>SSM Practicing Certificate No.</td>
                  <td>:</td>
                  <td>{{ controller.selectedSecretary.value.certificate }}</td>
                </tr>
                <tr>
                  <td>Date</td>
                  <td>:</td>
                  <td>{{ controller.declarationDate }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import { Section236ThreeController } from "~/scripts/components/legal-documents/Section236ThreeController"
  import type { IPropsSection236Three } from "~/scripts/props/PropsSection236Three"

  const props = defineProps<IPropsSection236Three>()

  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new Section236ThreeController(props, emit)

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
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/Section236Three" as *;
</style>
