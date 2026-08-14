<template>
  <div
    id="striking-off-application-printables"
    class="legal-document-striking-off-application"
  >
    <div
      v-if="controller.isLoading.value"
      class="paper-wrapper"
    >
      <div class="paper">
        <LoaderPrepare
          :label="controller.loaderLabel()"
          :sublabel="controller.loaderSublabel()"
        />
      </div>
    </div>
    <Paper
      v-if="!controller.isLoading.value"
      :total-pages="1"
      :page-number="1"
      :show-page-number="true"
      :additional-css-class="'striking-off-application legal-document'"
      :paper-orientation="'portrait'"
      :show-watermark="controller.showWatermark"
      :watermark-text="controller.watermarkText"
    >
      <template #paperContent>
        <div class="text-center fw-bold">CHECKLIST FOR ENCLOSURES</div>
        <br />
        <br />

        <table class="striking-off-application-table company-details">
          <tbody>
            <tr>
              <td>Company</td>
              <td>:</td>
              <td>
                {{ controller.companyName() }}
              </td>
            </tr>

            <tr>
              <td class="col-width-40">Company No</td>
              <td>:</td>
              <td>{{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})</td>
            </tr>
          </tbody>
        </table>
        <div class="notice-instruction">
          Please tick
          <span class="tick-box is-checked" />
          to ensure all documents have been submitted
        </div>
        <table class="striking-off-application-table">
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <div class="form-check align-center">
                  <span
                    class="tick-box"
                    :class="{
                      'is-checked': controller.application.value.hasPaidApplicationFees,
                      disabled: !controller.isDocumentEditable(),
                    }"
                    @click="
                      controller.application.value.hasPaidApplicationFees =
                        !controller.application.value.hasPaidApplicationFees
                    "
                  />
                  <div>Application Fees</div>
                </div>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>
                <div class="form-check align-center">
                  <span
                    class="tick-box"
                    :class="{
                      'is-checked': controller.application.value.hasCoveringLetter,
                      disabled: !controller.isDocumentEditable(),
                    }"
                    @click="
                      controller.application.value.hasCoveringLetter = !controller.application.value.hasCoveringLetter
                    "
                  />
                  <div>Covering Letter – stating reason to support application</div>
                </div>
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>
                <div class="form-check align-center">
                  <span
                    class="tick-box"
                    :class="{
                      'is-checked': controller.application.value.hasDeclarationByApplicant,
                      disabled: !controller.isDocumentEditable(),
                    }"
                    @click="
                      controller.application.value.hasDeclarationByApplicant =
                        !controller.application.value.hasDeclarationByApplicant
                    "
                  />
                  <div>Declaration by Applicant</div>
                </div>
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>
                <div class="form-check align-center">
                  <span
                    class="tick-box"
                    :class="{
                      'is-checked': controller.application.value.hasIndividualMembersResolution,
                      disabled: !controller.isDocumentEditable(),
                    }"
                    @click="
                      controller.application.value.hasIndividualMembersResolution =
                        !controller.application.value.hasIndividualMembersResolution
                    "
                  />
                  <div>Individual – Resolution of majority shareholders; OR</div>
                </div>
                <br />
                <br />
                <div class="form-check">
                  <span
                    class="tick-box"
                    :class="{
                      'is-checked': controller.application.value.hasCoOwnedSubsidiaryMcr,
                      disabled: !controller.isDocumentEditable(),
                    }"
                    @click="
                      controller.application.value.hasCoOwnedSubsidiaryMcr =
                        !controller.application.value.hasCoOwnedSubsidiaryMcr
                    "
                  />
                  <div>
                    Co-owned subsidiary (Individual and company) – Resolution of majority shareholders and a corporate
                    representative certificate must be attached to the application.
                    <br />
                    <br />
                    Note: In the case of where Shareholder/s is/are untraceable, proof of attempts to contact by way of
                    registered post must be attached to the application. Proof of any other modes of attempt (if any)
                    must also be attached to the application.
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td>5</td>
              <td>
                <div class="form-check">
                  <span
                    class="tick-box"
                    :class="{
                      'is-checked': controller.application.value.hasLatestManagementAccounts,
                      disabled: !controller.isDocumentEditable(),
                    }"
                    @click="
                      controller.application.value.hasLatestManagementAccounts =
                        !controller.application.value.hasLatestManagementAccounts
                    "
                  />
                  <div>
                    *Latest Management Accounts (Balance Sheet and Profit & Loss Statement) certified by the Director
                    (in each page) / Latest Audited Financial Statement, in the case of an application by a company
                    limited by guareantee
                    <br />
                    (*Strike out whichever is not applicable)
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td>6</td>
              <td>
                <div class="form-check align-center">
                  <span
                    class="tick-box"
                    :class="{
                      'is-checked': controller.application.value.hasWaiverLetters,
                      disabled: !controller.isDocumentEditable(),
                    }"
                    @click="
                      controller.application.value.hasWaiverLetters = !controller.application.value.hasWaiverLetters
                    "
                  />
                  <div>Waiver letters from directors/creditors</div>
                </div>
              </td>
            </tr>

            <tr>
              <td>7</td>
              <td>
                <div class="form-check align-center">
                  <span
                    class="tick-box"
                    :class="{
                      'is-checked': controller.application.value.hasTaxClearance,
                      disabled: !controller.isDocumentEditable(),
                    }"
                    @click="
                      controller.application.value.hasTaxClearance = !controller.application.value.hasTaxClearance
                    "
                  />
                  <div>Tax clearance (if applicable)</div>
                </div>
              </td>
            </tr>
            <tr>
              <td>8</td>
              <td>
                <div class="form-check align-center">
                  <span
                    class="tick-box"
                    :class="{
                      'is-checked': controller.application.value.hasCompanyPrintOut,
                      disabled: !controller.isDocumentEditable(),
                    }"
                    @click="
                      controller.application.value.hasCompanyPrintOut = !controller.application.value.hasCompanyPrintOut
                    "
                  />
                  <div>Company Print-Out</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="signature-section">
          <Signature
            :signature-item="controller.signatureItem.value"
            @signed="emit('signed', $event)"
          />
          <span>
            {{ controller.signatureDate() }}
          </span>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script setup lang="ts">
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import { StrikingOffChecklistController } from "~/scripts/components/legal-documents/StrikingOffChecklistController"
  import Signature from "~/components/Signatures/Signature.vue"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(["signed"])

  const controller = new StrikingOffChecklistController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  defineExpose({
    getApplicationData: controller.getApplicationData.bind(controller),
    refreshData: controller.refreshData.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/StrikingOffChecklist" as *;
</style>
