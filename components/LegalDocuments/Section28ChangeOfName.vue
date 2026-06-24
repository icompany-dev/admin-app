<template>
  <div id="legal-documents-section28-change-of-name">
    <Paper
      v-if="controller.isLoading.value"
      :is-loader="true"
      :paper-orientation="PaperOrientation.Portrait"
      :show-page-number="false"
    >
      <template #paperContent>
        <LoaderPrepare
          label="Preparing the"
          sublabel="Section 28"
        />
      </template>
    </Paper>
    <template v-if="!controller.isLoading.value">
      <Paper
        ref="documentRef"
        :paper-orientation="PaperOrientation.Portrait"
        :show-page-number="false"
        :additional-css-class="controller.additionalCssClass"
      >
        <template #paperContent>
          <div class="document-company">
            <b>Company No.</b>
            <br />
            <div class="numbers">
              <div class="number">{{ controller.numberFirst }}</div>
              <div class="check-digit">{{ controller.checkDigit }}</div>
            </div>
          </div>
          <div class="endorsement-box"></div>
          <div class="document-header">
            <span>COMPANIES ACT 2016</span>
            <span>Section 28</span>
            <span>APPLICATION FOR CHANGE OF NAME</span>
          </div>
          <div class="document-content">
            <div class="direction-option form-check">
              <div class="checkbox-container">
                <i class="fa-solid fa-check" />
              </div>
              <div class="detail">Notice of change of name</div>
            </div>
            <div class="direction-option form-check">
              <div class="checkbox-container"></div>
              <div class="detail">Direction of Change of Name by Registrar</div>
            </div>
            <div class="indented-content">Name Approval Reference No.</div>
            <div class="indented-content">Proposed New Name</div>
            <p>
              <span class="input-field">
                {{ controller.currentName }}
              </span>
              (Name of Company) hereby gives notice that the company has changed its name to
              <span class="input-field">
                {{ controller.newName }}
              </span>
              by a special resolution dated
              <span
                class="input-field"
                v-if="controller.isDownloading.value"
              >
                {{ controller.formattedResolutionDate }}
              </span>
              <span
                class="input-field"
                v-if="!controller.isDownloading.value"
              >
                <input
                  type="date"
                  class="form-control"
                  v-model="controller.resolutionDate.value"
                />
              </span>
            </p>
            <p>
              <b>Declaration:</b>
            </p>
            <p>
              I confirm that the facts and information stated in this document are true and to the best of my knowledge.
            </p>
            <p>
              <b>Signed</b>
            </p>
            <div class="signature-container"></div>
            <div class="sign-off">(Secretary)</div>
            <div class="sign-off-details">
              <span class="label">Name</span>
              <span>:</span>
              <span>{{ controller.cosecName }}</span>
            </div>
            <div class="sign-off-details">
              <span class="label">Date</span>
              <span>:</span>
              <input
                v-if="!controller.isDownloading.value"
                type="date"
                class="form-control"
                v-model="controller.signatureDate.value"
              />
              <span v-if="controller.isDownloading.value">
                {{ controller.formattedSignatureDate }}
              </span>
            </div>
            <p>
              <b>Attention</b>
            </p>
            <p>
              It is an offence under section 591 of the Companies Act 2016 to make or authorize the making of a
              statement that a person knows is false or misleading and that person may be liable, upon conviction, to
              imprisonment for a term not exceeding ten years or to a fine not exceeding RM3million or to both.
            </p>
            <div class="lodger-header">LODGER INFORMATION</div>
            <table class="lodger-information">
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>:</td>
                  <td>{{ controller.cosecName }}</td>
                </tr>
                <tr>
                  <td>NRIC No</td>
                  <td>:</td>
                  <td>{{ controller.nric }}</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>:</td>
                  <td>{{ controller.address }}</td>
                </tr>
                <tr>
                  <td>Phone No</td>
                  <td>:</td>
                  <td>{{ controller.phone }}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>:</td>
                  <td>{{ controller.email }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </Paper>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import Paper from "../Papers/Paper.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import { PaperOrientation } from "~/scripts/constants/Paper"
  import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
  import { Section28ChangeOfNameController } from "~/scripts/components/legal-documents/Section28ChangeOfNameController"

  const props = defineProps({
    applicationId: {
      type: String,
      required: true,
    },
    changeOfName: {
      type: CompanyAmendmentName,
      required: true,
    },
  })

  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new Section28ChangeOfNameController(props.applicationId, props.changeOfName)

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
  )

  watch(
    () => props.changeOfName,
    (newVal) => {
      controller.setChangeOfName(newVal)
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
  @use "~/assets/scss/components/LegalDocuments/Section28ChangeOfName" as *;
</style>
