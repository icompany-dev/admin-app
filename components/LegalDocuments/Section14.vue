<template>
  <div
    id="legal-document-section-14"
    ref="documentRef"
  >
    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :additional-css-class="'legal-document section-14 print'"
      :is-include-logo="false"
      :show-page-number="true"
      :total-pages="controller.getTotalPage()"
      :page-number="1"
    >
      <template #paperContent>
        <div class="document-title">
          COMPANIES ACT 2016
          <br />
          Section 14
          <br />
          APPLICATION FOR REGISTRATION OF A COMPANY
        </div>
        <div class="document-section">
          <table>
            <thead>
              <tr>
                <td
                  colspan="3"
                  class="text-center"
                >
                  PARTICULARS OF COMPANY
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="2">Proposed Company Name</td>
                <td>{{ controller.proposedCompanyName() }}</td>
              </tr>
              <tr>
                <td colspan="2">Lodging Ref No</td>
                <td></td>
              </tr>
              <tr>
                <td colspan="2">Purpose</td>
                <td>N - NEW INCORPORATION</td>
              </tr>
              <tr>
                <td colspan="2">Company Type</td>
                <td>S - LIMITED BY SHARES</td>
              </tr>
              <tr>
                <td colspan="2">Sub Type</td>
                <td>SDN. BHD.</td>
              </tr>
              <tr>
                <td colspan="2">Incorporation Date</td>
                <td></td>
              </tr>
              <tr>
                <td colspan="2">Registration No.</td>
                <td></td>
              </tr>

              <tr>
                <td colspan="2">General nature of business</td>
                <td><b>MSIC Code</b></td>
              </tr>

              <tr v-for="(value, index) in controller.application.value.msicCodeAssigns">
                <td class="counter">{{ index + 1 }}</td>
                <td>{{ value.msicCode.categoryDescriptionEn }}</td>
                <td>{{ value.msicCode.code }}</td>
              </tr>

              <tr>
                <td colspan="2">Business Description</td>
                <td class="text-uppercase">{{ controller.application.value.businessDescription }}</td>
              </tr>

              <tr>
                <td colspan="2">Registered Address</td>
                <td>
                  D16, FIRST FLOOR, BLOCK D SEKITAR26 ENTERPRISE
                  <br />
                  PERSIARAN HULU SELANGOR, SEKSYEN 26 40400 SHAH ALAM
                  <br />
                  SELANGOR MALAYSIA
                </td>
              </tr>

              <tr>
                <td colspan="2">Email</td>
                <td>connect@icompany.my</td>
              </tr>

              <tr>
                <td colspan="2">Office No</td>
                <td>0333100896</td>
              </tr>

              <tr>
                <td colspan="2">Faq Number</td>
                <td>NIL</td>
              </tr>

              <tr>
                <td colspan="2">Business Address</td>
                <td>
                  <span
                    class="text-uppercase"
                    v-html="controller.application.value.businessAddressLocation?.getMultilineAddress()"
                  />
                </td>
              </tr>

              <tr>
                <td colspan="2">Office No</td>
                <td>NIL</td>
              </tr>

              <tr>
                <td colspan="2">Faq Number</td>
                <td>NIL</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>

    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :additional-css-class="'legal-document section-14 print'"
      :is-include-logo="false"
      :show-page-number="true"
      :total-pages="controller.getTotalPage()"
      :page-number="2"
    >
      <template #paperContent>
        <div class="document-section">
          <table
            v-for="(director, index) in controller.application.value.directorInvitations"
            :key="index"
            class="table-spaced"
          >
            <thead>
              <tr v-if="index === 0">
                <td
                  colspan="2"
                  class="text-center"
                >
                  PARTICULARS OF DIRECTORS
                </td>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Director Name</td>
                <td>{{ controller.getDirectorName(director) }}</td>
              </tr>
              <tr>
                <td>Identification No</td>
                <td>{{ controller.getDirectorIdentification(director) }}</td>
              </tr>
              <tr>
                <td>Nationality</td>
                <td class="text-uppercase">{{ controller.getDirectorNationality(director) }}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td class="text-uppercase">{{ controller.getDirectorAddress(director) }}</td>
              </tr>
              <tr>
                <td>Date of Birth</td>
                <td></td>
              </tr>
              <tr>
                <td>Race</td>
                <td class="text-uppercase">{{ controller.getDirectorRace(director) }}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{{ director.email }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>

    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :additional-css-class="'legal-document section-14 print'"
      :is-include-logo="false"
      :show-page-number="true"
      :total-pages="controller.getTotalPage()"
      :page-number="3"
    >
      <template #paperContent>
        <div class="document-section">
          <table
            v-for="(shareholder, index) in controller.application.value.shareholderInvitations"
            :key="index"
            class="table-spaced"
          >
            <thead>
              <tr v-if="index === 0">
                <td
                  colspan="2"
                  class="text-center"
                >
                  PARTICULARS OF MEMBERS
                </td>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Member Name</td>
                <td>{{ controller.getShareholderName(shareholder) }}</td>
              </tr>
              <tr>
                <td>ID type</td>
                <td>{{ controller.getShareholderIdType(shareholder) }}</td>
              </tr>
              <tr>
                <td>Nationality</td>
                <td class="text-uppercase">{{ controller.getShareholderNationality(shareholder) }}</td>
              </tr>
              <tr>
                <td>Address</td>
                <td class="text-uppercase">{{ controller.getShareholderAddress(shareholder) }}</td>
              </tr>
              <tr>
                <td>Race</td>
                <td class="text-uppercase">{{ controller.getShareholderRace(shareholder) }}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{{ shareholder.email }}</td>
              </tr>
              <tr>
                <td>Price per share</td>
                <td>1.00</td>
              </tr>
              <tr>
                <td>Class of share</td>
                <td>{{ controller.getShareType(shareholder) }}</td>
              </tr>
              <tr>
                <td>Number of share</td>
                <td>{{ shareholder.totalShares }}</td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <td>Total number of shares</td>
                <td>{{ controller.getTotalShares() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>

    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :additional-css-class="'legal-document section-14 print'"
      :is-include-logo="false"
      :show-page-number="true"
      :total-pages="controller.getTotalPage()"
      :page-number="4"
    >
      <template #paperContent>
        <div class="document-section">
          <table>
            <thead>
              <tr>
                <td colspan="2">Declaration</td>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colspan="2">
                  <div>
                    I confirm that the facts and information stated in this document are true and to the best of my
                    knowledge.
                  </div>

                  <div class="declaration-name">Name:</div>
                  <div>Date of Application:</div>
                </td>
              </tr>

              <tr>
                <td colspan="2">
                  <div>ATTENTION:</div>

                  It is an offence under section 591 of the Companies Act 2016 to make or authorize the making of a
                  statement that a person knows is false or misleading and that person may be liable, upon conviction,
                  to imprisonment for a term not exceeding ten years or to a fine not exceeding RM3 million or to both
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="document-section">
          <table>
            <thead>
              <tr>
                <td colspan="2">Lodger Information</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Name</td>
                <td></td>
              </tr>
              <tr>
                <td>NRIC</td>
                <td></td>
              </tr>
              <tr>
                <td>Prescribed body</td>
                <td></td>
              </tr>
              <tr>
                <td>License No/Membership No</td>
                <td></td>
              </tr>
              <tr>
                <td>Address</td>
                <td></td>
              </tr>
              <tr>
                <td>Phone No.</td>
                <td></td>
              </tr>
              <tr>
                <td>Email</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script setup lang="ts">
  import Paper from "../Papers/Paper.vue"
  import { PaperOrientation } from "~/scripts/constants/Paper"
  import { Section14Controller } from "~/scripts/components/legal-documents/Section14Controller"
  import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"

  const props = defineProps({
    application: {
      type: ApplicationIncorporate,
      required: true,
    },
  })

  const documentRef = ref(null)

  const controller = new Section14Controller(props.application)

  onMounted(async () => {
    await controller.fetchUsers()
  })

  watch(
    () => props.application,
    async (newVal) => {
      controller.setApplication(newVal)
      await controller.fetchUsers()
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
    getPdfElements: controller.getPdfElements.bind(controller),
    isRunning: controller.isRunning.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/Section14" as *;
</style>
