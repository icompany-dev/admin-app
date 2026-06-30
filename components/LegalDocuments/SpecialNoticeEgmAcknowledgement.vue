<template>
  <div id="legal-documents-special-notice-egm-acknowledgement">
    <Paper
      v-if="controller.isLoading.value"
      :is-loader="true"
      :paper-orientation="controller.paperOrientation"
      :show-page-number="true"
      :page-number="1"
      :total-pages="controller.totalPages"
    >
      <template #paperContent>
        <LoaderPrepare
          :label="controller.loaderLabel"
          :sublabel="controller.loaderSublabel"
        />
      </template>
    </Paper>
    <template v-if="!controller.isLoading.value">
      <Paper
        :additional-css-class="controller.addititionalClassCss"
        :paper-orientation="controller.paperOrientation"
        :show-page-number="true"
        :page-number="1"
        :total-pages="controller.totalPages"
      >
        <template #paperContent>
          <div class="document-header">
            ACKNOWLEDGEMENT OF NOTICE, CONFIRMATION OF ATTENDANCE AND APPOINTMENT OF REPRESENTATIVE / PROXY
          </div>
          <div class="document-content">
            <p>
              {{ StringUtil.capitalize(controller.iOrWe) }}, {{ controller.nameOfShareholder }} being a member of the
              Company, hereby acknowledge receipt of the Special Notice and call for a General Meeting together with the
              Agenda.
            </p>
            <div
              class="instruction"
              v-if="controller.isDocumentEditable"
            >
              Please select and complete the applicable section below.
            </div>
            <TransitionGroup
              name="fade"
              class="options"
              tag="div"
            >
              <div
                class="form-check"
                :class="{
                  selected: controller.application.value.isAttendingInPerson,
                  'not-selected': controller.isAnyOptionSelected && !controller.application.value.isAttendingInPerson,
                }"
                v-if="controller.isDocumentEditable"
              >
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="controller.application.value.isAttendingInPerson"
                  @click="controller.onIsAttendingInPersonClicked()"
                />
                <span class="option-label">OPTION 1 – ATTENDANCE IN PERSON</span>
              </div>
              <div
                :class="{ 'section-content': controller.isDocumentEditable }"
                v-if="controller.application.value.isAttendingInPerson"
              >
                <p>
                  {{ StringUtil.capitalize(controller.iOrWe) }} confirm that {{ controller.iOrWe }} shall attend and
                  participate in the Meeting
                  <template v-if="!controller.isDocumentEditable">
                    <span v-if="!controller.application.value.isAttendingAsCorporateRep">
                      personally at such time, date, method and venue as prescribed.
                    </span>
                    <span v-if="controller.application.value.isAttendingAsCorporateRep">
                      as a Corporate Representative at such time, date, method and venue as prescribed.
                    </span>
                  </template>
                </p>
                <div
                  class="form-check"
                  v-if="controller.isDocumentEditable"
                >
                  <input
                    type="checkbox"
                    class="form-check-input"
                    :checked="!controller.application.value.isAttendingAsCorporateRep"
                    @click="controller.onAttendPersonally()"
                  />
                  <span>personally at such time, date, method and venue as prescribed.</span>
                </div>
                <div
                  class="form-check"
                  v-if="controller.isDocumentEditable"
                >
                  <input
                    type="checkbox"
                    class="form-check-input"
                    :checked="controller.application.value.isAttendingAsCorporateRep"
                    @click="controller.onAttendByCorporateRepresentative()"
                  />
                  <span>as a Corporate Representative at such time, date, method and venue as prescribed.</span>
                </div>
              </div>
              <div
                class="form-check"
                :class="{
                  selected: controller.application.value.isAppointingAProxy,
                  'not-selected': controller.isAnyOptionSelected && !controller.application.value.isAppointingAProxy,
                }"
                v-if="controller.isDocumentEditable"
              >
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="controller.application.value.isAppointingAProxy"
                  @click="controller.onIsAppointingAProxyClicked()"
                />
                <span class="option-label">OPTION 2 – APPOINTMENT OF PROXY</span>
              </div>
              <div
                :class="{ 'section-content': controller.isDocumentEditable }"
                v-if="controller.application.value.isAppointingAProxy"
              >
                <p>
                  {{ StringUtil.capitalize(controller.iOrWe) }} {{ controller.amOrAre }} unable to attend the Meeting
                  and hereby appoint the following person as {{ controller.myOrOur }} proxy:
                </p>
                <table class="proxy-details">
                  <tbody>
                    <tr>
                      <td>Full Name</td>
                      <td>:</td>
                      <td>
                        <input
                          v-if="controller.isDocumentEditable"
                          type="text"
                          class="form-control in-resolution"
                          v-model="controller.application.value.proxyFullName"
                        />
                        <span v-if="!controller.isDocumentEditable">
                          {{ controller.application.value.proxyFullName }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Email Address</td>
                      <td>:</td>
                      <td>
                        <input
                          v-if="controller.isDocumentEditable"
                          type="text"
                          class="form-control in-resolution"
                          v-model="controller.application.value.proxyEmailAddress"
                        />
                        <span v-if="!controller.isDocumentEditable">
                          {{ controller.application.value.proxyEmailAddress }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Contact Number</td>
                      <td>:</td>
                      <td>
                        <input
                          v-if="controller.isDocumentEditable"
                          type="text"
                          class="form-control in-resolution"
                          v-model="controller.application.value.proxyContactNumber"
                        />
                        <span v-if="!controller.isDocumentEditable">
                          {{ controller.application.value.proxyContactNumber }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Known Address</td>
                      <td>:</td>
                      <td>
                        <input
                          v-if="controller.isDocumentEditable"
                          type="text"
                          class="form-control in-resolution"
                          v-model="controller.application.value.proxyKnownAddress"
                        />
                        <span v-if="!controller.isDocumentEditable">
                          {{ controller.application.value.proxyKnownAddress }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>NRIC / Passport No</td>
                      <td>:</td>
                      <td>
                        <input
                          v-if="controller.isDocumentEditable"
                          type="text"
                          class="form-control in-resolution"
                          v-model="controller.application.value.proxyIdentificationNumber"
                        />
                        <span v-if="!controller.isDocumentEditable">
                          {{ controller.application.value.proxyIdentificationNumber }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>Relationship (if any)</td>
                      <td>:</td>
                      <td>
                        <input
                          v-if="controller.isDocumentEditable"
                          type="text"
                          class="form-control in-resolution"
                          v-model="controller.application.value.proxyRelationship"
                        />
                        <span v-if="!controller.isDocumentEditable">
                          {{ controller.application.value.proxyRelationship }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  class="instruction"
                  v-if="controller.isDocumentEditable"
                >
                  Would you like this proxy to be appointed solely for this Meeting or saved for future use?
                </div>
                <div
                  class="form-check"
                  v-if="controller.isDocumentEditable"
                >
                  <input
                    type="checkbox"
                    class="form-check-input"
                    :checked="controller.application.value.isForThisMeetingOnly"
                    @click="controller.onIsForThisMeetingOnlyClicked()"
                  />
                  <span>This Meeting Only (RM0.00)</span>
                </div>
                <p v-if="controller.application.value.isForThisMeetingOnly">
                  This proxy shall be authorised to attend, participate, speak and vote solely for the purposes of this
                  General Meeting and any adjournment thereof. The appointment shall automatically expire upon the
                  conclusion of the Meeting.
                </p>
                <div
                  class="form-check"
                  v-if="controller.isDocumentEditable"
                >
                  <input
                    type="checkbox"
                    class="form-check-input"
                    :checked="!controller.application.value.isForThisMeetingOnly"
                    @click="controller.onIsSaveForFutureClicked()"
                  />
                  <span>Save as Future Proxy Profile (from RM50.00 per year)</span>
                </div>
                <p v-if="!controller.application.value.isForThisMeetingOnly">
                  The details of this proxy shall be retained in Roles & Access for future appointment and use. Each
                  future appointment shall remain subject to the applicable law, the Constitution of the Company (if
                  any), and any requirements of the relevant meeting.
                </p>
                <p>
                  The above person is appointed as
                  <template v-if="controller.isDocumentEditable">:</template>
                  <template v-if="!controller.isDocumentEditable">
                    <span v-if="controller.application.value.isUnderConstitution">
                      Proxy pursuant to the Constitution of the Company.
                    </span>
                    <span v-if="!controller.application.value.isUnderConstitution">
                      Proxy pursuant to the unanimous agreement and consent of all members present at the Meeting.
                    </span>
                  </template>
                </p>
                <div
                  class="form-check"
                  v-if="controller.isDocumentEditable"
                >
                  <input
                    type="checkbox"
                    class="form-check-input disabled"
                    disabled
                    :checked="controller.application.value.isUnderConstitution"
                    @click="controller.onIsUnderConstitutionClicked()"
                  />
                  <span class="disabled">Proxy pursuant to the Constitution of the Company.</span>
                </div>
                <div
                  class="form-check"
                  v-if="controller.isDocumentEditable"
                >
                  <input
                    type="checkbox"
                    class="form-check-input"
                    :checked="!controller.application.value.isUnderConstitution"
                    @click="controller.onIsUnanimousAgreementClicked()"
                  />
                  <span>
                    Proxy pursuant to the unanimous agreement and consent of all members present at the Meeting.
                  </span>
                </div>
                <p>
                  The appointed proxy shall be entitled to attend, participate, speak and vote on my/our behalf to the
                  extent permitted by the Constitution of the Company, applicable law, or the unanimous agreement of the
                  members, as the case may be.
                </p>
              </div>
              <div
                class="form-check"
                :class="{
                  selected: controller.application.value.isAcknowledgingOnly,
                  'not-selected': controller.isAnyOptionSelected && !controller.application.value.isAcknowledgingOnly,
                }"
                v-if="controller.isDocumentEditable"
              >
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="controller.application.value.isAcknowledgingOnly"
                  @click="controller.onIsAcknowledingOnlyClicked()"
                />
                <span class="option-label">OPTION 3 – ACKNOWLEDGEMENT OF NOTICE ONLY</span>
              </div>
              <div
                class="section-content"
                v-if="controller.application.value.isAcknowledgingOnly"
              >
                <p>
                  I/We acknowledge receipt of the Notice of General Meeting and accompanying documents but do not intend
                  to attend the Meeting personally and do not appoint any proxy or representative.
                </p>
              </div>
            </TransitionGroup>
          </div>
          <div class="signature-section">
            <table class="signature-details">
              <tbody>
                <tr>
                  <td>Signature</td>
                  <td>:</td>
                  <td>
                    <Signature
                      :signature-item="controller.signatureItem"
                      @signed="emit('signed', $event)"
                    />
                  </td>
                </tr>
                <tr>
                  <td>Full Name</td>
                  <td>:</td>
                  <td>
                    {{ controller.nameOfShareholder }}
                  </td>
                </tr>
                <tr>
                  <td>Date</td>
                  <td>:</td>
                  <td>
                    <span :class="{ placeholder: !controller.hasSigned }">
                      {{ controller.signatureDate }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="document-content"
            v-if="
              controller.application.value.isAttendingInPerson && controller.application.value.isAttendingAsCorporateRep
            "
          >
            <div class="section-content">
              <p>
                Full Name : {{ controller.shareholder.name }} as the authorised Corporate Representative of
                {{ controller.nameOfShareholder }}.
              </p>
              <p>
                <b>Declaration by Corporate Representative</b>
              </p>
              <p>
                I hereby declare that I am duly authorised and appointed as the Corporate Representative of the Member
                named above and am vested with full power and authority to represent the Member at this Meeting and any
                adjournment thereof, including the authority to attend, participate, speak, vote, consent, execute
                documents, and do all such acts and things as may be required for the purposes of the Meeting.
              </p>
            </div>
          </div>
        </template>
      </Paper>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import Signature from "@/components/Signatures/Signature.vue"
  import { SpecialNoticeEgmAcknowledgementController } from "~/scripts/components/legal-documents/SpecialNoticeEgmAcknowledgementController"
  import { StringUtil } from "~/scripts/utils/String"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    meetingId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(["signed"])

  const controller = new SpecialNoticeEgmAcknowledgementController(props.companyId, props.meetingId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    () => props.meetingId,
    (newVal) => {
      controller.setMeetingId(newVal)
    }
  )

  defineExpose({
    getApplication: controller.getApplication.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/SpecialNoticeEgmAcknowledgement" as *;
</style>
