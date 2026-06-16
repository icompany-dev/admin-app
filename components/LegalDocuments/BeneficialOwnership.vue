<template>
  <div
    id="legal-documents-beneficial-ownership"
    ref="documentRef"
  >
    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :show-page-number="true"
      :page-number="1"
      :total-pages="controller.totalPages()"
      :additional-css-class="controller.additionalCssClass"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
      :is-printable="true"
    >
      <template #paperContent>
        <div class="header">
          <span>
            Date:
            <span :class="{ 'date-placeholder': !controller.hasSigned() }">
              {{ controller.declarationDate() }}
            </span>
          </span>
          <br />
          <br />
          <span
            class="shareholder-name"
            v-if="controller.showShareholderName()"
          >
            {{ controller.shareholderName() }}
          </span>
          <div
            class="external-bo-input"
            v-if="controller.isExternalBO() && controller.isDocumentEditable()"
          >
            <input
              type="text"
              class="form-control in-resolution"
              v-model="controller.application.value.fullName"
              @input="controller.setSignatureItem()"
              placeholder="YOUR NAME"
            />
          </div>
          <br v-if="!controller.isExternalBO() || !controller.isDocumentEditable()" />
          <span class="company-name">{{ controller.companyName() }}</span>
          <br />
          <span class="company-name">
            {{ controller.company.value.registrationNumberNew }} ({{ controller.company.value.registrationNumberOld }})
          </span>
          <div
            v-if="controller.company.value.businessAddressLocation"
            class="company-address"
            v-html="controller.company.value.businessAddressLocation.getMultilineAddress()"
          />
        </div>

        <div class="declaration-title">Beneficial Ownership Declaration</div>
        <div class="document-content">
          <p>
            Pursuant to subsection 60D (1) of Companies Act 2016, I would like to inform and confirm that

            <span v-if="!controller.isDocumentEditable()">
              {{ controller.application.value.isBeneficialOwner ? "I am" : "I am not" }} the Beneficial Owner of the
              Company.
            </span>
          </p>
          <div
            v-if="controller.isDocumentEditable()"
            class="bo-selection-container"
          >
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                :checked="controller.application.value.isBeneficialOwner === true"
                @click="controller.onIsBeneficialOwnerChanged(true)"
              />
              <label>I am the Beneficial Owner of the Company.</label>
            </div>
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                :checked="controller.application.value.isBeneficialOwner === false"
                @click="controller.onIsBeneficialOwnerChanged(false)"
              />
              <label>I am not the Beneficial Owner of the Company.</label>
            </div>
          </div>
          <p>The Beneficial Ownership information is as per Appendix A.</p>
          <p>I hereby declare as follows:</p>
          <p class="shareholder-declaration">
            "I hereby confirmed that the facts and information stated in this letter are true and to the best of my
            knowledge and belief."
          </p>
          <p>Kindly take the necessary action pursuant to section 60B of the Companies Act 2016.</p>
        </div>
        <div class="signature-section">
          <div class="signature-text">Yours faithfully,</div>
          <Signature
            :signature-item="controller.signatureItem.value"
            @signed="emit('signed', $event)"
          />
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :show-page-number="true"
      :page-number="2"
      :total-pages="controller.totalPages()"
      :additional-css-class="controller.additionalCssClass"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
      :is-printable="true"
    >
      <template #paperContent>
        <div class="appendix-title">Appendix A</div>
        <div class="details-section">
          <div class="details-section-title">1. The Beneficial Ownership Information</div>
          <div class="details-section-content">
            <table class="table-borderless">
              <tbody>
                <tr>
                  <td>Full Name</td>
                  <td>:</td>
                  <td class="table-form-input">
                    <input
                      v-if="controller.isFieldEditable()"
                      type="text"
                      class="form-control in-resolution"
                      v-model="controller.application.value.fullName"
                    />
                    <div v-if="!controller.isFieldEditable()">
                      {{ controller.application.value.fullName }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Residential Address</td>
                  <td>:</td>
                  <td class="table-form-input">
                    <input
                      v-if="controller.isFieldEditable()"
                      type="text"
                      class="form-control in-resolution"
                      v-model="controller.application.value.residentialAddress"
                    />
                    <div v-if="!controller.isFieldEditable()">
                      {{ controller.application.value.residentialAddress.toUpperCase() }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Email Address</td>
                  <td>:</td>
                  <td class="table-form-input small">
                    <input
                      v-if="controller.isFieldEditable()"
                      type="text"
                      class="form-control in-resolution email"
                      v-model="controller.application.value.emailAddress"
                    />
                    <div v-if="!controller.isFieldEditable()">
                      {{ controller.application.value.emailAddress }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Nationality</td>
                  <td>:</td>
                  <td class="table-form-input small">
                    <input
                      v-if="controller.isFieldEditable()"
                      type="text"
                      class="form-control in-resolution"
                      v-model="controller.application.value.nationality"
                    />
                    <div v-if="!controller.isFieldEditable()">
                      {{ controller.application.value.nationality.toUpperCase() }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Date of Birth</td>
                  <td>:</td>
                  <td class="table-form-input date">
                    <input
                      v-if="controller.isDocumentEditable()"
                      v-model="controller.application.value.dateOfBirth"
                      type="date"
                      class="form-control in-resolution"
                      :max="controller.maxDate()"
                    />
                    <div v-if="!controller.isDocumentEditable()">
                      {{ controller.formatDate(controller.application.value.dateOfBirth) }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Race</td>
                  <td>:</td>
                  <td class="table-form-input small">
                    <input
                      v-if="controller.isFieldEditable()"
                      type="text"
                      class="form-control in-resolution"
                      v-model="controller.application.value.race"
                    />
                    <div v-if="!controller.isFieldEditable()">
                      {{ controller.application.value.race.toUpperCase() }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Gender</td>
                  <td>:</td>
                  <td class="table-form-input small">
                    <div
                      class="form-check"
                      v-if="controller.isFieldEditable()"
                    >
                      <input
                        type="checkbox"
                        class="form-check-input"
                        @click="controller.onGenderClicked(Gender.Male)"
                        :checked="controller.isGenderChecked(Gender.Male)"
                      />
                      <span>Male</span>
                      <input
                        type="checkbox"
                        class="form-check-input"
                        @click="controller.onGenderClicked(Gender.Female)"
                        :checked="controller.isGenderChecked(Gender.Female)"
                      />
                      <span>Female</span>
                    </div>
                    <div v-if="!controller.isFieldEditable()">
                      {{ controller.application.value.gender.toUpperCase() }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>NRIC / Passport</td>
                  <td>:</td>
                  <td class="table-form-input small">
                    <input
                      v-if="controller.isFieldEditable()"
                      type="text"
                      class="form-control in-resolution"
                      v-model="controller.application.value.identificationNumber"
                    />
                    <div v-if="!controller.isFieldEditable()">
                      {{ controller.application.value.identificationNumber }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Position in the Company</td>
                  <td>:</td>
                  <td class="table-form-input small">
                    <input
                      v-if="controller.isFieldEditable()"
                      type="text"
                      class="form-control in-resolution"
                      v-model="controller.application.value.position"
                    />
                    <div v-if="!controller.isFieldEditable()">
                      {{ controller.application.value.position.toUpperCase() }}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Date of Appointment</td>
                  <td>:</td>
                  <td class="table-form-input date">
                    <input
                      v-if="controller.isFieldEditable()"
                      class="form-control in-resolution"
                      v-model="controller.application.value.dateOfAppointment"
                      type="date"
                    />
                    <div v-if="!controller.isFieldEditable()">
                      {{ controller.formatDate(controller.application.value.dateOfAppointment) }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="details-section">
          <div class="details-section-title">2. Category and Criteria of Beneficial Owner</div>
          <div class="details-section-content">
            <table class="table-border">
              <tbody>
                <tr>
                  <td colspan="2">
                    <span class="bo-category-title">Category of Beneficial Owner</span>
                    <div class="bo-category-list">
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          v-if="controller.isDocumentEditable()"
                          :checked="controller.isOwnershipType(OwnershipType.Direct)"
                          @click="controller.setOwnershipType(OwnershipType.Direct)"
                        />
                        <i
                          v-if="!controller.isDocumentEditable()"
                          class="fa-light icon"
                          :class="controller.isOwnershipType(OwnershipType.Direct) ? 'fa-square-check' : 'fa-square'"
                        />
                        <span class="category-label">Direct Ownership</span>
                      </div>
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          v-if="controller.isDocumentEditable()"
                          :checked="controller.isOwnershipType(OwnershipType.Indirect)"
                          @click="controller.setOwnershipType(OwnershipType.Indirect)"
                        />
                        <i
                          v-if="!controller.isDocumentEditable()"
                          class="fa-light icon"
                          :class="controller.isOwnershipType(OwnershipType.Indirect) ? 'fa-square-check' : 'fa-square'"
                        />
                        <span class="category-label">Indirect Ownership</span>
                      </div>
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          v-if="controller.isDocumentEditable()"
                          :checked="controller.isOwnershipType(OwnershipType.DirectIndirect)"
                          @click="controller.setOwnershipType(OwnershipType.DirectIndirect)"
                        />
                        <i
                          v-if="!controller.isDocumentEditable()"
                          class="fa-light icon"
                          :class="
                            controller.isOwnershipType(OwnershipType.DirectIndirect) ? 'fa-square-check' : 'fa-square'
                          "
                        />
                        <span class="category-label">Direct-Indirect Ownership</span>
                      </div>
                      <div class="form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          v-if="controller.isDocumentEditable()"
                          :checked="controller.isOwnershipType(OwnershipType.Others)"
                          @click="controller.setOwnershipType(OwnershipType.Others)"
                        />
                        <i
                          v-if="!controller.isDocumentEditable()"
                          class="fa-light icon"
                          :class="controller.isOwnershipType(OwnershipType.Others) ? 'fa-square-check' : 'fa-square'"
                        />
                        <span class="category-label">Others (Control by other means)</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th>CATEGORY OF BO</th>
                  <th>CRITERIA</th>
                </tr>
                <tr>
                  <td>Direct Ownership</td>
                  <td>
                    <div class="criteria">
                      <div class="criterion form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :disabled="!controller.isOwnershipType(OwnershipType.Direct)"
                          v-if="controller.isDocumentEditable()"
                          :checked="
                            controller.isOwnershipType(OwnershipType.Direct) &&
                            controller.isCriteriaType(CriteriaType.A)
                          "
                          @click="controller.setCriteriaType(CriteriaType.A)"
                        />
                        <i
                          v-if="!controller.isDocumentEditable()"
                          class="fa-light icon"
                          :class="
                            controller.isOwnershipType(OwnershipType.Direct) &&
                            controller.isCriteriaType(CriteriaType.A)
                              ? 'fa-square-check'
                              : 'fa-square'
                          "
                        />
                        <div class="criterion-details">
                          <span class="criterion-label">
                            Criteria A - Hold not less than 20% of shares in the company
                          </span>
                        </div>
                      </div>
                      <div class="criterion form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :disabled="!controller.isOwnershipType(OwnershipType.Direct)"
                          v-if="controller.isDocumentEditable()"
                          :checked="
                            controller.isOwnershipType(OwnershipType.Direct) &&
                            controller.isCriteriaType(CriteriaType.B)
                          "
                          @click="controller.setCriteriaType(CriteriaType.B)"
                        />
                        <i
                          v-if="!controller.isDocumentEditable()"
                          class="fa-light icon"
                          :class="
                            controller.isOwnershipType(OwnershipType.Direct) &&
                            controller.isCriteriaType(CriteriaType.B)
                              ? 'fa-square-check'
                              : 'fa-square'
                          "
                        />
                        <div class="criterion-details">
                          <span class="criterion-label">
                            Criteria B - Hold not less than 20% of voting rights in the company
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Indirect Ownership</td>
                  <td>
                    <div class="criteria">
                      <div class="criterion form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :disabled="!controller.isOwnershipType(OwnershipType.Indirect)"
                          v-if="controller.isDocumentEditable()"
                          :checked="
                            controller.isOwnershipType(OwnershipType.Indirect) &&
                            controller.isCriteriaType(CriteriaType.A)
                          "
                          @click="controller.setCriteriaType(CriteriaType.A)"
                        />
                        <i
                          v-if="!controller.isDocumentEditable()"
                          class="fa-light icon"
                          :class="
                            controller.isOwnershipType(OwnershipType.Indirect) &&
                            controller.isCriteriaType(CriteriaType.A)
                              ? 'fa-square-check'
                              : 'fa-square'
                          "
                        />
                        <div class="criterion-details">
                          <span class="criterion-label">
                            Criteria A - Holds indirectly in not less than 20% of the shares the company
                          </span>
                        </div>
                      </div>
                      <div class="criterion form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :disabled="!controller.isOwnershipType(OwnershipType.Indirect)"
                          v-if="controller.isDocumentEditable()"
                          :checked="
                            controller.isOwnershipType(OwnershipType.Indirect) &&
                            controller.isCriteriaType(CriteriaType.B)
                          "
                          @click="controller.setCriteriaType(CriteriaType.B)"
                        />
                        <i
                          v-if="!controller.isDocumentEditable()"
                          class="fa-light icon"
                          :class="
                            controller.isOwnershipType(OwnershipType.Indirect) &&
                            controller.isCriteriaType(CriteriaType.B)
                              ? 'fa-square-check'
                              : 'fa-square'
                          "
                        />
                        <div class="criterion-details">
                          <span class="criterion-label">
                            Criteria B - Holds indirectly in not less than 20% of the voting shares of the company
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Direct & Indirect Ownership</td>
                  <td>
                    <div class="criteria">
                      <div class="criterion form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :disabled="!controller.isOwnershipType(OwnershipType.DirectIndirect)"
                          v-if="controller.isDocumentEditable()"
                          :checked="
                            controller.isOwnershipType(OwnershipType.DirectIndirect) &&
                            controller.isCriteriaType(CriteriaType.A)
                          "
                          @click="controller.setCriteriaType(CriteriaType.A)"
                        />
                        <i
                          v-if="!controller.isDocumentEditable()"
                          class="fa-light icon"
                          :class="
                            controller.isOwnershipType(OwnershipType.DirectIndirect) &&
                            controller.isCriteriaType(CriteriaType.A)
                              ? 'fa-square-check'
                              : 'fa-square'
                          "
                        />
                        <div class="criterion-details">
                          <span class="criterion-label">
                            Criteria A - Holds directly or indirectly in not less than 20% of the shares the company
                          </span>
                        </div>
                      </div>
                      <div class="criterion form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :disabled="!controller.isOwnershipType(OwnershipType.DirectIndirect)"
                          v-if="controller.isDocumentEditable()"
                          :checked="
                            controller.isOwnershipType(OwnershipType.DirectIndirect) &&
                            controller.isCriteriaType(CriteriaType.B)
                          "
                          @click="controller.setCriteriaType(CriteriaType.B)"
                        />
                        <i
                          v-if="!controller.isDocumentEditable()"
                          class="fa-light icon"
                          :class="
                            controller.isOwnershipType(OwnershipType.DirectIndirect) &&
                            controller.isCriteriaType(CriteriaType.B)
                              ? 'fa-square-check'
                              : 'fa-square'
                          "
                        />
                        <div class="criterion-details">
                          <span class="criterion-label">
                            Criteria B - Holds directly or indirectly in not less than 20% of the voting shares of the
                            company
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </Paper>
    <Paper
      :paper-orientation="PaperOrientation.Portrait"
      :show-page-number="true"
      :page-number="3"
      :total-pages="controller.totalPages()"
      :additional-css-class="controller.additionalCssClass"
      :show-watermark="props.showWatermark"
      :watermark-text="props.watermarkText"
      :is-printable="true"
    >
      <template #paperContent>
        <div class="details-section">
          <div class="details-section-content">
            <table class="table-border">
              <tbody>
                <tr>
                  <td>Control by Other Means</td>
                  <td>
                    <div class="criteria">
                      <div class="criterion form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :disabled="!controller.isOwnershipType(OwnershipType.Others)"
                          v-if="controller.isDocumentEditable()"
                          :checked="
                            controller.isOwnershipType(OwnershipType.Others) &&
                            controller.isCriteriaType(CriteriaType.C)
                          "
                          @click="controller.setCriteriaType(CriteriaType.C)"
                        />
                        <i
                          v-if="!controller.isDocumentEditable()"
                          class="fa-light icon"
                          :class="
                            controller.isOwnershipType(OwnershipType.Others) &&
                            controller.isCriteriaType(CriteriaType.C)
                              ? 'fa-square-check'
                              : 'fa-square'
                          "
                        />
                        <div class="criterion-details">
                          <span class="criterion-label">
                            Criteria C - Has the right to exercise ultimate effective control whether formal or informal
                            over the company or the directors or the management of the company
                          </span>
                        </div>
                      </div>
                      <div class="criterion form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :disabled="!controller.isOwnershipType(OwnershipType.Others)"
                          v-if="controller.isDocumentEditable()"
                          :checked="
                            controller.isOwnershipType(OwnershipType.Others) &&
                            controller.isCriteriaType(CriteriaType.D)
                          "
                          @click="controller.setCriteriaType(CriteriaType.D)"
                        />
                        <i
                          v-if="!controller.isDocumentEditable()"
                          class="fa-light icon"
                          :class="
                            controller.isOwnershipType(OwnershipType.Others) &&
                            controller.isCriteriaType(CriteriaType.D)
                              ? 'fa-square-check'
                              : 'fa-square'
                          "
                        />
                        <div class="criterion-details">
                          <span class="criterion-label">
                            Criteria D - Has the right or power to directly or indirectly appoint or remove a
                            director(s) who holds the majority of the voting rights at the meeting of directors
                          </span>
                        </div>
                      </div>
                      <div class="criterion form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :disabled="!controller.isOwnershipType(OwnershipType.Others)"
                          v-if="controller.isDocumentEditable()"
                          :checked="
                            controller.isOwnershipType(OwnershipType.Others) &&
                            controller.isCriteriaType(CriteriaType.E)
                          "
                          @click="controller.setCriteriaType(CriteriaType.E)"
                        />
                        <i
                          v-if="!controller.isDocumentEditable()"
                          class="fa-light icon"
                          :class="
                            controller.isOwnershipType(OwnershipType.Others) &&
                            controller.isCriteriaType(CriteriaType.E)
                              ? 'fa-square-check'
                              : 'fa-square'
                          "
                        />
                        <div class="criterion-details">
                          <span class="criterion-label">
                            Criteria E - Is a member of the company and, under an agreement with another member of the
                            company, controls alone a majority of the voting rights in the company
                          </span>
                        </div>
                      </div>
                      <div class="criterion form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :disabled="!controller.isOwnershipType(OwnershipType.Others)"
                          v-if="controller.isDocumentEditable()"
                          :checked="
                            controller.isOwnershipType(OwnershipType.Others) &&
                            controller.isCriteriaType(CriteriaType.F)
                          "
                          @click="controller.setCriteriaType(CriteriaType.F)"
                        />
                        <i
                          v-if="!controller.isDocumentEditable()"
                          class="fa-light icon"
                          :class="
                            controller.isOwnershipType(OwnershipType.Others) &&
                            controller.isCriteriaType(CriteriaType.F)
                              ? 'fa-square-check'
                              : 'fa-square'
                          "
                        />
                        <div class="criterion-details">
                          <span class="criterion-label">
                            Criteria F - Has less than 20% of shares or voting shares but exercises significant control
                            or influence over the company
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td
                    colspan="2"
                    class="footnote"
                  >
                    Note:
                    <ul>
                      <li>An individual can be a beneficial owner if he meets one or more of the Criteria.</li>
                      <li>You may attach illustration of ownership/control, if any.</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </Paper>
    <Teleport to="body">
      <NonBeneficialOwner
        ref="nonBeneficialOwnerRef"
        @proceed="emit('updateNonBO', $event)"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import Paper from "../Papers/Paper.vue"
  import Signature from "@/components/Signatures/Signature.vue"
  import NonBeneficialOwner from "../Popups/NonBeneficialOwner.vue"
  import { BODeclarationController } from "~/scripts/components/legal-documents/BODeclarationController"
  import { CriteriaType, OwnershipType } from "~/scripts/constants/BODeclarations"
  import { Gender } from "~/scripts/constants/UserProfile"
  import { PaperOrientation } from "~/scripts/constants/Paper"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    shareholderId: {
      type: String,
      required: false,
      default: null,
    },
    showWatermark: {
      type: Boolean,
      default: false,
    },
    watermarkText: {
      type: String,
      default: "DRAFT",
    },
    isInPreviewMode: {
      type: Boolean,
      default: false,
    },
    declarationId: {
      type: String,
      required: false,
      default: null,
    },
    externalBoEmailAddress: {
      type: String,
      required: false,
      default: null,
    },
  })

  const emit = defineEmits(["cancel", "declarationComplete", "signed", "totalPageChanged", "updateNonBO"])

  const documentRef = ref(null)
  const nonBeneficialOwnerRef = ref(null)

  const controller = new BODeclarationController(
    props.companyId,
    props.shareholderId,
    props.declarationId,
    props.externalBoEmailAddress,
    props.isInPreviewMode,
    emit
  )

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    () => props.shareholderId,
    (newVal) => {
      controller.setShareholderId(newVal)
    }
  )

  watch(
    () => props.declarationId,
    (newVal) => {
      controller.setDeclarationId(newVal)
    }
  )

  watch(
    () => props.externalBoEmailAddress,
    (newVal) => {
      controller.setExternalBoEmailAddress(newVal)
    }
  )

  watch(
    documentRef,
    (newVal) => {
      if (newVal) {
        controller.setDocumentRef(newVal)
      }
    },
    { immediate: true }
  )

  watch(
    nonBeneficialOwnerRef,
    (newVal) => {
      if (newVal) {
        controller.setNonBeneficialOwnerRef(newVal)
      }
    },
    { immediate: true }
  )

  watch(
    () => controller.isLoading.value,
    (isLoading) => {
      if (!isLoading) {
        // Emit event when loading is complete
        nextTick(() => {
          emit("totalPageChanged")
        })
      }
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
      controller.setSignatureItem()
    }
  )

  defineExpose({
    getApplicationData: controller.getApplicationData.bind(controller),
    getPdfElements: controller.getPdfElements.bind(controller),
    totalPages: controller.totalPages.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/BeneficialOwnership" as *;
</style>
