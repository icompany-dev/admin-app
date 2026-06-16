<template>
  <div id="legal-documents-notification-of-beneficial-ownership">
    <Paper
      v-if="controller.isLoading.value"
      :total-pages="controller.totalPages"
      :additional-css-class="controller.additionalCssClass"
      :page-number="1"
      :paper-orientation="controller.paperOrientation"
    >
      <template #paperContent>
        <LoaderPrepare
          :label="controller.loaderLabel"
          :sublabel="controller.loaderSublabel"
        />
      </template>
    </Paper>
    <div
      v-if="!controller.isLoading.value"
      ref="documentRef"
    >
      <Paper
        :total-pages="controller.totalPages"
        :additional-css-class="controller.additionalCssClass"
        :page-number="1"
        :show-page-number="false"
        :paper-orientation="controller.paperOrientation"
      >
        <template #paperContent>
          <div class="notice-header">NOTIFICATION OF BENEFICIAL OWNERSHIP INFORMATION</div>
          <div class="notice-subheader">
            <div class="notice-subheader-detail division">Division 8A, 60B (3), Companies Act 2016</div>
            <div class="notice-subheader-detail">
              <table class="submission-detail">
                <tbody>
                  <tr>
                    <td>Submission Number</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Date & Time Received</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <table class="notification-of-bo-table">
            <thead>
              <tr>
                <td colspan="2">PARTICULARS OF COMPANY</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>COMPANY NAME</td>
                <td>{{ controller.companyName }}</td>
              </tr>
              <tr>
                <td>COMPANY NO</td>
                <td>{{ controller.registrationNumber }}</td>
              </tr>
              <tr>
                <td>STATUS</td>
                <td>EXISTING</td>
              </tr>
            </tbody>
          </table>
          <table class="notification-of-bo-table">
            <thead>
              <tr>
                <td colspan="4">PARTICULARS OF BENEFICIAL OWNERSHIP</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>TYPE OF BO APPLICATION</td>
                <td colspan="3">BENEFICIAL OWNER</td>
              </tr>
              <tr>
                <td>STATUS</td>
                <td colspan="3">{{ controller.declarationStatus }}</td>
              </tr>
              <tr>
                <td>DATE OF BECOMING BO</td>
                <td colspan="3">{{ controller.dateBecomingBO }}</td>
              </tr>
              <tr>
                <td>DATE OF DATA RECORDED</td>
                <td colspan="3">{{ controller.dateRecorded }}</td>
              </tr>
              <tr>
                <td>TYPE</td>
                <td colspan="3">{{ controller.type }}</td>
              </tr>
              <tr>
                <td>CATEGORY</td>
                <td colspan="3">{{ controller.category }}</td>
              </tr>
              <tr>
                <td>NAME</td>
                <td colspan="3">{{ controller.name }}</td>
              </tr>
              <tr>
                <td>IDENTIFICATION NO.</td>
                <td>{{ controller.identificationNo }}</td>
                <td>DATE OF BIRTH</td>
                <td>{{ controller.dateOfBirth }}</td>
              </tr>
              <tr>
                <td>GENDER</td>
                <td>{{ controller.gender }}</td>
                <td>RACE</td>
                <td>{{ controller.race }}</td>
              </tr>
              <tr>
                <td>NATIONALITY</td>
                <td>{{ controller.nationality }}</td>
                <td>CITIZENSHIP</td>
                <td>{{ controller.citizenship }}</td>
              </tr>
              <tr>
                <td>DESIGNATION/POSITION IN THE COMPANY</td>
                <td colspan="3">{{ controller.designation }}</td>
              </tr>
              <tr>
                <td>RESIDENTIAL ADDRESS</td>
                <td colspan="3">{{ controller.residentialAddress }}</td>
              </tr>
              <tr>
                <td>BUSINESS ADDRESS</td>
                <td colspan="3">{{ controller.businessAddress }}</td>
              </tr>
              <tr>
                <td>EMAIL</td>
                <td class="email">{{ controller.emailAddress }}</td>
                <td>CONTACT NO.</td>
                <td>{{ controller.contactNo }}</td>
              </tr>
              <tr>
                <td>TYPE OF BO</td>
                <td colspan="3">
                  {{ controller.typeOfBO }}
                  <br />
                  <span class="explanation">{{ controller.typeOfBOCriteria }}</span>
                </td>
              </tr>
              <tr>
                <td>PERCENTAGE %</td>
                <td colspan="3">{{ controller.percentage }}</td>
              </tr>
            </tbody>
          </table>
          <table class="notification-of-bo-table acknowledgement">
            <thead>
              <tr>
                <td colspan="2">DECLARATION</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colspan="2"
                  class="declaration"
                >
                  I CONFIRM THAT THE FACTS AND THE INFORMATIONS STATED IN THIS DOCUMENT ARE TRUE AND TO THE BEST OF MY
                  KNOWLEDGE.
                </td>
              </tr>
              <tr>
                <td>NAME</td>
                <td></td>
              </tr>
              <tr>
                <td>DATE OF APPLICATION</td>
                <td></td>
              </tr>
              <tr>
                <td
                  colspan="2"
                  class="attention-notice"
                >
                  <b>ATTENTION:</b>
                  It is an offence under section 591 of the Companies Act 2016 to make or authorize the making of a
                  statement that a person knows is false or misleading and that person may be liable, upon conviction,
                  to imprisonment for a term not exceeding ten years or to a fine not exceeding RM3 million or to both.
                </td>
              </tr>
            </tbody>
          </table>

          <div class="notice-page-number">
            <div class="ssm-name">SURUHANJAYA SYARIKAT MALAYSIA</div>
            <div class="page-number">Page 1 of 2</div>
          </div>
        </template>
      </Paper>
      <Paper
        :total-pages="controller.totalPages"
        :additional-css-class="controller.additionalCssClass"
        :page-number="1"
        :show-page-number="false"
        :paper-orientation="controller.paperOrientation"
      >
        <template #paperContent>
          <div class="notice-header">NOTIFICATION OF BENEFICIAL OWNERSHIP INFORMATION</div>
          <table class="notification-of-bo-table acknowledgement">
            <thead>
              <tr>
                <td colspan="2">LODGER INFORMATION</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>NAME</td>
                <td></td>
              </tr>
              <tr>
                <td>IDENTIFICATION NO.</td>
                <td></td>
              </tr>
              <tr>
                <td>ADDRESS</td>
                <td class="address"></td>
              </tr>
              <tr>
                <td>EMAIL ADDRESS</td>
                <td class="email">connect@icompany.my</td>
              </tr>
              <tr>
                <td>PHONE NO.</td>
                <td></td>
              </tr>
              <tr>
                <td>PRACTISING CERTIFICATE NO.</td>
                <td></td>
              </tr>
              <tr>
                <td>PROFESSIONAL BODY TYPE</td>
                <td></td>
              </tr>
              <tr>
                <td>LICENSE NO. / MEMBERSHIP NO.</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <div class="notice-page-number">
            <div class="ssm-name">SURUHANJAYA SYARIKAT MALAYSIA</div>
            <div class="page-number">Page 2 of 2</div>
          </div>
        </template>
      </Paper>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import { NotificationOfBeneficialOwnershipController } from "~/scripts/components/legal-documents/NotificationOfBeneficialOwnershipController"
  import { CompanyBODeclaration } from "~/scripts/models/CompanyBODeclaration"

  const props = defineProps({
    declarationId: {
      type: String,
      required: true,
    },
    declaration: {
      type: CompanyBODeclaration,
      default: null,
    },
  })
  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new NotificationOfBeneficialOwnershipController(props.declarationId, emit)

  watch(
    () => props.declarationId,
    (newVal) => {
      controller.setDeclarationId(newVal)
    }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.declaration,
    (newVal) => {
      if (!newVal) {
        return
      }

      controller.setDeclaration(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    getPdfElements: controller.getPdfElements.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/NotificationOfBeneficialOwnership" as *;
</style>
