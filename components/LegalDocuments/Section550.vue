<template>
  <div
    id="striking-off-application-printables"
    class="legal-document-section-550"
  >
    <div
      v-if="controller.isLoading.value"
      class="paper-wrapper striking-off-application"
    >
      <div class="paper">
        <LoaderPrepare
          :label="controller.loaderLabel()"
          :sublabel="controller.loaderSublabel()"
        />
      </div>
    </div>
    <div v-if="!controller.isLoading.value">
      <Paper
        :additional-css-class="'striking-off-application'"
        :total-pages="2"
        :page-number="1"
        :show-page-number="true"
        :paper-orientation="controller.paperOrientation"
        :show-watermark="controller.showWatermark"
        :watermark-text="controller.watermarkText"
      >
        <template #paperContent>
          <div class="striking-off-application-header">
            <div class="header-label">Company No:</div>
            <div class="header-content">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
          </div>
          <div class="application-content first-page">
            <div class="title">
              <div class="title-content">COMPANIES ACT 2016</div>
              <div class="title-content">Section 550</div>
              <div class="title-content">APPLICATION TO STRIKE OFF COMPANY</div>
              <div class="title-content">{{ controller.company.value.getFullName() }}</div>
            </div>
            <div class="document-content">
              <p>
                <b>DECLARATION</b>
                <br />
                I,
                <b>{{ controller.application.value.applicant.name }}</b>
                (NRIC No: {{ controller.application.value.applicant.identification }}) of residential address at
                <b>
                  {{ controller.application.value.applicantResidentialAddress }}
                </b>
                hereby state the following:
              </p>
              <ol
                type="a"
                class="condition-list-alpha-2"
              >
                <li>
                  I am a
                  <span
                    :class="{
                      strikedthrough: !controller.application.value.applicantRole.includes('director'),
                    }"
                  >
                    director
                  </span>
                  /
                  <span
                    :class="{
                      strikedthrough: !controller.application.value.applicantRole.includes('shareholder'),
                    }"
                  >
                    shareholder
                  </span>
                  /
                  <span
                    :class="{
                      strikedthrough: !controller.application.value.applicantRole.includes('liquidator'),
                    }"
                  >
                    liquidator
                  </span>
                  of {{ controller.companyName() }}. [Company No: {{ controller.registrationNumberNew() }} ({{
                    controller.registrationNumberOld()
                  }})];
                </li>

                <li>
                  As a
                  <span
                    :class="{
                      strikedthrough: !controller.application.value.applicantRole.includes('director'),
                    }"
                  >
                    *director
                  </span>
                  /
                  <span
                    :class="{
                      strikedthrough: !controller.application.value.applicantRole.includes('shareholder'),
                    }"
                  >
                    shareholder
                  </span>
                  , I verify that the affairs of the company has been fully wound up and the assets of the company is
                  not
                  <select
                    v-if="controller.isDocumentEditable()"
                    v-model="controller.application.value.isAmountSufficient"
                    class="form-control in-resolution"
                  >
                    <option :value="true">* available</option>
                    <option :value="false">sufficient</option>
                  </select>
                  <span v-if="!controller.isDocumentEditable()">
                    <span
                      :class="{
                        strikedthrough: controller.application.value.isAmountSufficient,
                      }"
                    >
                      * available
                    </span>
                    /
                    <span
                      :class="{
                        strikedthrough: !controller.application.value.isAmountSufficient,
                      }"
                    >
                      sufficient
                    </span>
                  </span>
                  to pay the costs for obtaining an order of the Court to dissolve the company.
                </li>

                <li>
                  The Company
                  <select
                    v-if="controller.isDocumentEditable()"
                    v-model="controller.application.value.isOperating"
                    class="form-control in-resolution"
                  >
                    <option :value="false">has not carried on business since incorporation</option>
                    <option :value="true">has not been in operation* since</option>
                  </select>
                  <input
                    v-if="controller.application.value.isOperating && controller.isDocumentEditable()"
                    v-model="controller.application.value.operatingSinceDate"
                    type="date"
                    class="form-control in-resolution"
                  />
                  <span v-if="controller.isDocumentEditable()">
                    . The company has no intention to
                    <span v-if="!controller.application.value.isOperating">commence its operation at all;</span>
                    <span v-if="controller.application.value.isOperating">carry on its business* in the future;</span>
                  </span>

                  <span v-if="!controller.isDocumentEditable()">
                    <span
                      :class="{
                        strikedthrough: controller.application.value.isOperating,
                      }"
                    >
                      has not carried on business since incorporation
                    </span>
                    /
                    <span
                      :class="{
                        strikedthrough: !controller.application.value.isOperating,
                      }"
                    >
                      has not been in operation * since
                      <span :class="{ 'blank-space small blank-out': !controller.application.value.isOperating }">
                        <span :class="{ placeholder: !controller.application.value.isOperating }">
                          {{
                            !controller.application.value.isOperating
                              ? "last date of operation"
                              : controller.application.value.operatingSinceDate
                          }}
                        </span>
                      </span>
                    </span>
                    . The Company has no intention to
                    <span
                      :class="{
                        strikedthrough: controller.application.value.isOperating,
                      }"
                    >
                      commence its operation at all;
                    </span>
                    /
                    <span
                      :class="{
                        strikedthrough: !controller.application.value.isOperating,
                      }"
                    >
                      carry on its business* in the future;
                    </span>
                  </span>
                </li>

                <li>
                  The Company does not have any assets or liabilities including any outstanding charges in the Register
                  of Charges kept at the office of the Registrar of Companies;
                </li>

                <li>
                  The company
                  <select
                    v-if="controller.isDocumentEditable()"
                    v-model="controller.application.value.hasOutstandingPenalty"
                    class="form-control in-resolution"
                  >
                    <option :value="false">has no outstanding penalty or compound</option>
                    <option :value="true">has outstanding penalty or compound*</option>
                  </select>
                  <span v-if="!controller.isDocumentEditable()">
                    <span
                      :class="{
                        strikedthrough: !controller.application.value.hasOutstandingPenalty,
                      }"
                    >
                      has no outstanding penalty or compound
                    </span>
                    /
                    <span
                      :class="{
                        strikedthrough: controller.application.value.hasOutstandingPenalty,
                      }"
                    >
                      has outstanding penalty or compound*
                    </span>
                  </span>
                  pursuant to the Company Act 2016.
                  <span v-if="controller.application.value.hasOutstandingPenalty && controller.isDocumentEditable()">
                    The company hereby
                    <select
                      v-model="controller.application.value.applyOrAppealCompound"
                      class="form-control in-resolution"
                    >
                      <option value="applies">applies</option>
                      <option value="appeals">appeals</option>
                    </select>
                    the Registrar of Companies for the penalty or compound to be
                    <select
                      v-model="controller.application.value.waivedOrReducedCompound"
                      class="form-control in-resolution"
                    >
                      <option value="waived">waived</option>
                      <option value="reduced">reduced</option>
                    </select>
                    .
                  </span>

                  <span
                    v-if="!controller.isDocumentEditable()"
                    :class="{ strikedthrough: !controller.application.value.hasOutstandingPenalty }"
                  >
                    The company hereby
                    <span
                      :class="{
                        strikedthrough: controller.application.value.applyOrAppealCompound === 'applies',
                      }"
                    >
                      applies
                    </span>
                    /
                    <span
                      :class="{
                        strikedthrough: controller.application.value.applyOrAppealCompound === 'appeals',
                      }"
                    >
                      appeals
                    </span>
                    the Registrar of Companies for the penalty or compound to be
                    <span
                      :class="{
                        strikedthrough: controller.application.value.waivedOrReducedCompound === 'waived',
                      }"
                    >
                      waived
                    </span>
                    /
                    <span
                      :class="{
                        strikedthrough: controller.application.value.waivedOrReducedCompound === 'reduced',
                      }"
                    >
                      reduced
                    </span>
                    .
                  </span>
                </li>

                <li>
                  The company has no outstanding tax or any other liabilities and is not indept to the Government/The
                  Government departments/agencies in Malaysia;
                </li>

                <li>
                  The information of the company with the Registrar as shown in the attacked "print-out" from the
                  Register is true and is up to-date;
                </li>

                <li>
                  The company is not involved in any impending legal proceedings, whether from within or outside
                  Malaysia;
                </li>

                <li>
                  The company is
                  <select
                    v-if="controller.isDocumentEditable()"
                    class="form-control in-resolution"
                    v-model="controller.application.value.isAHoldingCompany"
                  >
                    <option :value="false">not a</option>
                    <option :value="true">a</option>
                  </select>
                  <span v-if="!controller.isDocumentEditable()">
                    {{ controller.application.value.isAHoldingCompany ? "a" : "not a" }}
                  </span>
                  holding company;
                </li>
              </ol>
            </div>
          </div>
        </template>
      </Paper>

      <Paper
        :additional-css-class="'striking-off-application'"
        :total-pages="2"
        :page-number="2"
        :show-page-number="true"
        :paper-orientation="controller.paperOrientation"
        :show-watermark="controller.showWatermark"
        :watermark-text="controller.watermarkText"
      >
        <template #paperContent>
          <div class="striking-off-application-header">
            <div class="header-label">Company No:</div>
            <div class="header-content">
              {{ controller.registrationNumberNew() }} ({{ controller.registrationNumberOld() }})
            </div>
          </div>
          <div class="application-content">
            <div class="document-content">
              <ol
                type="a"
                start="10"
                class="condition-list-alpha-2"
              >
                <li>
                  <span :class="{ strikedthrough: !controller.application.value.isAHoldingCompany }">
                    The company is a subsidiary of
                    <input
                      v-if="controller.application.value.isAHoldingCompany && controller.isDocumentEditable()"
                      v-model.trim="controller.application.value.holdingCompanyName"
                      type="text"
                      placeholder="Name of Holding Company (SSM Registration Number)"
                      class="form-control in-resolution wide"
                    />
                    <span
                      v-if="!controller.application.value.isAHoldingCompany"
                      class="blank-space"
                      :class="{ 'blank-out': !controller.isDocumentEditable() }"
                    >
                      <span class="placeholder">
                        (state the name of the holding company and its incorporation number)
                      </span>
                    </span>
                    <span v-if="!controller.isDocumentEditable() && controller.application.value.isAHoldingCompany">
                      {{ controller.application.value.holdingCompanyName }}
                    </span>
                    (state the name of the holding company and its incorporation number). (The company must attach the
                    letter of consent from its holding company if it is a wholly owned subsidiary of a holding company
                    or the letter of consent from all other shareholders if it is co-owned by other shareholders);
                  </span>
                </li>
                <li>
                  The company is not a "Guarantor Corporation". (The company must attach sufficient proof or evidence to
                  show that it is no longer a Guarantor Corporation" to enable it to apply for striking off).
                </li>
                <li>The company has not made any return of capital to the shareholders.</li>
              </ol>
              <p>
                *strike out whichever is not applicable.
                <br />
                <br />
                <b>Declaration:</b>
                <br />
                I confirm that the facts and information stated in this document are true and to the best of my
                knowledge.
                <br />
                <br />
                Signed by Applicant;
              </p>
              <div class="signature-section">
                <Signature
                  :signature-item="controller.applicantSignatureItem.value"
                  @signed="emit('signed', $event)"
                />
                <div class="applicant-sign-off">
                  <div class="details">
                    <span class="label">Name</span>
                    <span>:</span>
                    <span>
                      {{ controller.application.value.applicant.name }}
                    </span>
                  </div>
                  <div class="details">
                    <span class="label">Date</span>
                    <span>:</span>
                    <span :class="{ placeholder: !controller.application.value.signature }">
                      {{ controller.signatureDate() }}
                    </span>
                  </div>
                </div>
              </div>
              <p>
                <br />
                <b>Attention:</b>
                <br />
                It is an offence under section 591 of the Companies Act 2016 to make or authorize the making of a
                statement that a person knows is false or misleading and that person may be liable, upon conviction, to
                imprisonment for a term not exceeding ten years or to a fine not exceeding RM3million or to both.
                <br />
                <br />
                <br />
                <b>LODGER INFORMATION</b>
              </p>
              <table class="lodger-info-table">
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>:</td>
                    <td>
                      {{ controller.application.value.lodgerName }}
                    </td>
                  </tr>

                  <tr>
                    <td>NRIC No</td>
                    <td>:</td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>Address</td>
                    <td>:</td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>Tel</td>
                    <td>:</td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>Email</td>
                    <td>:</td>
                    <td>connect@icompany.my</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </Paper>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "../Papers/Paper.vue"
  import { Section550Controller } from "~/scripts/components/legal-documents/Section550Controller"
  import Signature from "~/components/Signatures/Signature.vue"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(["signed"])

  const controller = new Section550Controller(props.companyId, emit)

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
  @use "~/assets/scss/components/LegalDocuments/Section550" as *;
</style>
