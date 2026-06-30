<template>
  <div id="legal-documents-removal-of-director-egm-minutes">
    <Paper
      v-if="controller.isLoading.value"
      :is-loader="true"
      :additional-css-class="controller.additionalCssClass"
      :paper-orientation="controller.paperOrientation"
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
      :additional-css-class="controller.additionalCssClass"
      :paper-orientation="controller.paperOrientation"
      :show-page-number="true"
      :total-pages="controller.totalPages.value"
      :page-number="1"
    >
      <template #paperContent>
        <div class="minutes-label">
          <span class="label">Minutes</span>
          <span class="sublabel">of the Extraordinary General Meeting</span>
        </div>
        <div class="header">
          <b>{{ controller.companyName }}</b>
          <br />
          {{ controller.registrationNumberNew }} ({{ controller.registrationNumberOld }})
        </div>
        <div class="attendance-list">
          <ol class="upper-alpha">
            <li>
              <div class="attendance-header">PRESENT IN NO PARTICULAR ORDER</div>
              <div class="attendance-signatures">// we need a list of shareholders here</div>
            </li>
            <li>
              <div class="attendance-header">PRESENT IN NO PARTICULAR ORDER</div>
              <div class="attendance-names">// names of attendees</div>
            </li>
          </ol>
        </div>
        <div class="minutes-title">
          MINUTES OF THE EXTRAORDINARY GENERAL MEETING OF THE COMPANY HELD AT {{ controller.venue.toUpperCase() }} ON
          {{ controller.egmDate.toUpperCase() }} AT {{ controller.egmTime.toUpperCase() }}.
        </div>
        <div class="minutes-content">
          <ol>
            <li v-if="controller.companyMeeting.value.isChairmanAddress">
              <div class="point-title">WELCOMING REMARKS</div>
              <div class="point-content">[NAME] as the Chairman welcomed all present to the Meeting.</div>
            </li>
            <li v-if="!controller.companyMeeting.value.isChairmanAddress">
              <div class="point-title">APPOINTMENT OF CHAIRMAN</div>
              <div class="point-content">
                As there was no Chairman previously appointed for the Meeting, the members present unanimously agreed
                that [NAME] shall act as Chairman of the Meeting.
              </div>
            </li>
            <li>
              <div class="point-title">QUORUM</div>
              <div class="point-content">
                The Chairman confirmed that the requisite quorum
                <select
                  class="form-control in-resolution"
                  @change="controller.onQuorumChanged($event)"
                >
                  <option value="true">was present</option>
                  <option value="false">was not present</option>
                </select>
                <span v-if="controller.isQuorumComplete.value">and declared the Meeting duly convened.</span>
                <span v-if="!controller.isQuorumComplete.value">
                  and the Meeting was unable to proceed with the business set out in the Notice of Extraordinary General
                  Meeting and was accordingly adjourned to [DATE] at [TIME].
                </span>
              </div>
            </li>
            <li>
              <div class="point-title">SPECIAL NOTICE</div>
              <div class="point-content">
                The Chairman informed the Meeting that the Company had received a Special Notice pursuant to Section 206
                and Section 322 of the Companies Act 2016 proposing the removal of {{ controller.directorName }} as
                Director of the Company.
                <br />
                <br />
                The Chairman further confirmed that notice of the Meeting had been duly circulated to all entitled
                members and to the Director proposed to be removed in accordance with the Companies Act 2016
                {{ controller.company.hasConstitution ? "and the Constitution of the Company" : "" }}.
              </div>
            </li>
            <li>
              <div class="point-title">ORDINARY RESOLUTION</div>
              <div class="point-content">
                The following Ordinary Resolution was tabled before the Meeting:
                <br />
                <br />
                “THAT {{ controller.directorName }} be and is hereby removed as Director of the Company pursuant to
                Section 206 of the Companies Act 2016 with effect from the date of passing of this Resolution.”
                <br />
                <br />
                The Chairman invited discussion and representations
                <br />
                <br />
                <span v-if="controller.isMajorityReached">
                  The Director proposed to be removed addressed the Meeting and made representations in relation to the
                  proposed resolution.
                </span>
                <span v-if="!controller.isMajorityReached">
                  No representations were made by the Director proposed to be removed.
                </span>
              </div>
            </li>
            <li>
              <div class="point-title">VOTING ON THE ORDINARY RESOLUTION</div>
              <div class="point-content">
                The Chairman accordingly determined that voting on the proposed Ordinary Resolution shall be conducted
                by way of [show of hands / poll / electronic voting / verbal confirmation].
                <br />
                <br />
                Upon completion of the voting process, the Chairman declared that the Ordinary Resolution was:
                <div v-if="controller.isMajorityReached">
                  PASSED as an Ordinary Resolution and the shareholders present and entitled to vote accordingly
                  confirmed the voting outcome by signing the Ordinary Resolution as a sign of attendance and voting
                  records of the Meeting.
                </div>
                <div v-if="!controller.isMajorityReached">
                  NOT PASSED as an Ordinary Resolution. The shareholders present and entitled to vote accordingly
                  confirmed the voting outcome by signing the attendance and voting records of the Meeting as set out
                  herein
                </div>
              </div>
            </li>
            <li>
              <div class="point-title">END OF MEETINGS</div>
              <div class="point-content">There being no further business, the Meeting concluded at [TIME].</div>
            </li>
          </ol>
        </div>
        <div class="minutes-sign-off">
          <div class="sign-off-title">CONFIRMED AS CORRECT</div>
          <div class="signature-container">//</div>
          <div class="date">//</div>
        </div>
      </template>
    </Paper>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import { RemovalOfDirectorEgmMinutesController } from "~/scripts/components/legal-documents/RemovalOfDirectorEgmMinutesController"

  const props = defineProps({
    companyMeetingId: {
      type: String,
      required: true,
    },
  })
  const emit = defineEmits(["isUpdating", "updated"])

  const controller = new RemovalOfDirectorEgmMinutesController(props.companyMeetingId, emit)

  watch(
    () => props.companyMeetingId,
    (newCompanyMeetingId) => {
      controller.setCompanyMeetingId(newCompanyMeetingId)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/RemovalOfDirectorEgmMinutes" as *;
</style>
