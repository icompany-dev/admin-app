<template>
  <div
    id="legal-documents-practice-directive2"
    ref="documentRef"
  >
    <Paper
      :show-page-number="false"
      :additional-css-class="controller.additionalCssClass"
      :paper-orientation="controller.paperOrientation"
    >
      <template #paperContent>
        <div class="pd2-page">
          <div class="pd2-header">
            <div class="header-label">Company No:</div>
            <div class="header-content">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
          </div>

          <div>
            <div class="pd2-form-content">
              <div class="title text-uppercase">Companies Act 2016</div>

              <div class="title">Practice Directive 2/2017</div>

              <div class="title text-uppercase">
                NOTIFICATION OF CHANGE IN THE BUSINESS/BRANCH ADDRESS AND/OR NATURE OF BUSINESS
              </div>

              <div class="title text-uppercase">
                {{ controller.companyName() }}
              </div>

              <div class="copywriting">Type of Change (Please tick whichever applicable)</div>

              <div class="check">
                <div class="slash-box">
                  <i
                    v-if="controller.isChangingAddress"
                    class="fa-solid fa-slash-forward"
                  />
                </div>
                <div :class="{ 'text-decoration-line-through': !controller.isChangingAddress }">
                  <span :class="{ 'text-decoration-line-through': !controller.isUpdatingBusinessAddress.value }">
                    *Business Address
                  </span>
                  /
                  <span :class="{ 'text-decoration-line-through': !controller.isUpdatingBranchAddress.value }">
                    Branch Address
                  </span>
                </div>
              </div>

              <div class="check">
                <div class="slash-box">
                  <i
                    v-if="controller.isUpdatingNature.value"
                    class="fa-solid fa-slash-forward"
                  />
                </div>
                <div :class="{ 'text-decoration-line-through': !controller.isUpdatingNature.value }">
                  Nature of Business
                </div>
              </div>

              <div class="label fw-bold">Business / Branch Address</div>

              <table class="check-table pdf-bordered-table">
                <thead>
                  <tr>
                    <td class="text-center">
                      Tick
                      <br />
                      Whichever
                      <br />
                      is relevant
                    </td>
                    <td class="text-center">Nature of Change:</td>
                    <td class="text-center text-uppercase">Address</td>
                    <td class="text-center">
                      Effective Date of
                      <br />
                      Change
                    </td>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>
                      <i
                        v-if="controller.isUpdatingAddress"
                        class="fa-solid fa-slash-forward"
                      />
                    </td>
                    <td
                      :class="{
                        'text-decoration-line-through': !controller.isUpdatingAddress,
                      }"
                    >
                      Change of
                      <span
                        :class="{
                          'text-decoration-line-through': !controller.isUpdatingBusinessAddress.value,
                        }"
                      >
                        *Business
                      </span>
                      /
                      <br />
                      <span
                        :class="{
                          'text-decoration-line-through': !controller.isUpdatingBranchAddress.value,
                        }"
                      >
                        Branch
                      </span>
                      Address
                      <br />
                      (New address)
                    </td>
                    <td>
                      <span
                        v-if="controller.isUpdatingAddress"
                        v-html="controller.updateAddress.value"
                      />
                    </td>
                    <td>
                      <input
                        v-if="controller.isUpdatingAddress && !controller.isPrinting.value"
                        v-model="controller.updateAddressEffectiveDate.value"
                        type="date form-control no-print"
                      />
                      <span v-if="controller.isUpdatingAddress && controller.isPrinting.value">
                        {{ controller.formattedUpdateAddressEffectiveDate }}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <i
                        v-if="controller.isAddingAddress"
                        class="fa-solid fa-slash-forward"
                      />
                    </td>
                    <td :class="{ 'text-decoration-line-through': !controller.isAddingAddress }">
                      Additional
                      <span :class="{ 'text-decoration-line-through': !controller.isAddingBusinessAddress.value }">
                        *Business
                      </span>
                      /
                      <br />
                      <span :class="{ 'text-decoration-line-through': !controller.isAddingBranchAddress.value }">
                        Branch
                      </span>
                      Address
                    </td>
                    <td>
                      <span
                        v-if="controller.isAddingAddress"
                        v-html="controller.addAddress.value"
                      />
                    </td>
                    <td>
                      <input
                        v-if="controller.isAddingAddress && !controller.isPrinting.value"
                        v-model="controller.addAddressEffectiveDate.value"
                        type="date no-print"
                      />
                      <span v-if="controller.isAddingAddress && controller.isPrinting.value">
                        {{ controller.formattedAddAddressEffectiveDate }}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <i
                        v-if="controller.isRemovingAddress"
                        class="fa-solid fa-slash-forward"
                      />
                    </td>
                    <td :class="{ 'text-decoration-line-through': !controller.isRemovingAddress }">
                      Closure
                      <span :class="{ 'text-decoration-line-through': !controller.isRemovingBusinessAddress }">
                        *Business
                      </span>
                      /
                      <br />
                      <span :class="{ 'text-decoration-line-through': !controller.isRemovingBranchAddress }">
                        Branch
                      </span>
                      Address
                    </td>
                    <td>
                      <span
                        v-if="controller.isRemovingAddress"
                        v-html="controller.removeAddress.value"
                      />
                    </td>
                    <td>
                      <input
                        v-if="controller.isRemovingAddress && !controller.isPrinting.value"
                        v-model="controller.removeAddressEffectiveDate.value"
                        type="date no-print"
                      />
                      <span v-if="controller.isRemovingAddress && controller.isPrinting.value">
                        {{ controller.formattedRemoveAddressEffectiveDate }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="label"><b>Nature of Business</b></div>

              <div
                v-if="controller.isUpdatingNature.value"
                class="d-flex gap-2"
              >
                <div>Nature of Business:</div>
                <div>
                  <!--
                    NOTES: when implementing pd2 for change of business nature make sure it is in below format:
                    a; /n b; and /n c.

                    also add new line for the business description change.
                    (business description is after nature of business)
                  -->
                </div>
              </div>

              <div class="mt-2">
                Date of Change:
                <input
                  v-if="!controller.isPrinting.value"
                  v-model="controller.dateOfChange.value"
                  type="date no-print"
                />
                <span v-if="controller.isPrinting.value">
                  {{ controller.formattedDateOfChange }}
                </span>
              </div>
            </div>

            <div><b>* Strike out whichever is inapplicable</b></div>
          </div>
        </div>
      </template>
    </Paper>
    <Paper
      :show-page-number="false"
      :additional-css-class="controller.additionalCssClass"
      :paper-orientation="controller.paperOrientation"
    >
      <template #paperContent>
        <div class="pd2-header">
          <div class="header-label">Company No:</div>
          <div class="header-content">
            {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
          </div>
        </div>

        <div class="header-label fw-bold">Declaration:</div>

        <div class="copywriting">
          I confirm that the facts and information stated in this document are document are true and to the best of my
          knowledge.
        </div>

        <div class="fw-bold">Signed:</div>

        <div class="pd2-signature-wrapper">
          <div class="signature-content-wrapper">
            <div class="no-print text-center font-size-10 m-1 text-secondary" />
            <div class="signature-content">
              <div>(Secretary)</div>
            </div>
          </div>
        </div>

        <table class="secretary-info-table">
          <tbody>
            <tr>
              <td>Name</td>
              <td>:</td>
              <td>
                <!-- <select
                  v-if="!controller.isPrinting.value"
                  v-model="practiceDirective.secretaryName"
                  @change="practiceDirective.setSecretary(practiceDirective.secretaryName)"
                >
                  <option
                    v-for="(secretary, key) in secretaryInfo.SECRETARY_NAME_LIST"
                    :key="key"
                    :value="secretary.name"
                  >
                    {{ secretary.name }}
                  </option>
                </select>
                <span v-if="controller.isPrinting.value">
                  {{ practiceDirective.secretaryName }}
                </span> -->
              </td>
            </tr>
            <tr>
              <td>License no / Membership No.</td>
              <td>:</td>
              <!-- <td>{{ practiceDirective.secretaryLicense }}</td> -->
            </tr>
            <tr>
              <td>SSM Practicing Certificate No.</td>
              <td>:</td>
              <!-- <td>{{ practiceDirective.secretaryCertificate }}</td> -->
            </tr>
            <tr>
              <td>Date</td>
              <td>:</td>
              <td>
                <!-- <input
                  v-if="!controller.isPrinting.value"
                  v-model="practiceDirective.dateOfChange"
                  type="date"
                >
                <span v-if="controller.isPrinting.value">
                  {{ $moment(practiceDirective.dateOfChange).format('D MMMM YYYY') }}
                </span> -->
              </td>
            </tr>
          </tbody>
        </table>

        <div class="title my-3 fw-bold">Attention:</div>

        <div>
          It is an offence under section 591 of the Companies Act 2016 to make or authorize the making of a statement
          that a person knows is false or misleading and that person may be liable, upon conviction, to imprisonment for
          a term not exceeding ten years or to a fine not exceeding RM3million or to both.
        </div>

        <div class="lodger-header">LODGER INFORMATION</div>

        <table class="lodger-info-table">
          <tbody>
            <tr>
              <td>Name</td>
              <td>:</td>
              <!-- <td>{{ practiceDirective.secretaryName }}</td> -->
            </tr>
            <tr>
              <td>NRIC No.</td>
              <td>:</td>
              <!-- <td>{{ practiceDirective.secretaryNric }}</td> -->
            </tr>
            <tr>
              <td>Address</td>
              <td>:</td>
              <td>
                <!-- <span v-html="practiceDirective.getSecretaryAddress()" /> -->
              </td>
            </tr>
            <tr>
              <td>Phone No.</td>
              <td>:</td>
              <!-- <td>{{ practiceDirective.secretaryPhone }}</td> -->
            </tr>
            <tr>
              <td>Email</td>
              <td>:</td>
              <!-- <td>{{ practiceDirective.secretaryEmail }}</td> -->
            </tr>
          </tbody>
        </table>
      </template>
    </Paper>
  </div>
</template>

<script lang="ts" setup>
  import Paper from "../Papers/Paper.vue"
  import { PracticeDirective2Controller } from "~/scripts/components/legal-documents/PracticeDirective2Controller"
  import type { IPropsPracticeDirective2 } from "~/scripts/props/PropsPracticeDirective2"

  const props = defineProps<IPropsPracticeDirective2>()

  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new PracticeDirective2Controller(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setData(newVal)
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
    totalPages: controller.totalPages.bind(controller),
    getPdfPages: controller.getPdfPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/PracticeDirective2" as *;
</style>
