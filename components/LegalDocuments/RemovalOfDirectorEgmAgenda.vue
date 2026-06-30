<template>
  <div
    id="removal-of-director-egm-agenda"
    ref="agendaRef"
  >
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
        <div class="agenda-label">AGENDA</div>
        <div class="header">
          <b>EXTRAORDINARY GENERAL MEETING</b>
          <br />
          {{ controller.companyName.toUpperCase() }}
          <br />
          {{ controller.registrationNumberNew }} ({{ controller.registrationNumberOld }})
        </div>
        <table class="meeting-details">
          <tbody>
            <tr>
              <td>DATE</td>
              <td>:</td>
              <td>{{ controller.egmDate }}</td>
            </tr>
            <tr>
              <td>TIME</td>
              <td>:</td>
              <td>{{ controller.egmTime }}</td>
            </tr>
            <tr>
              <td>VENUE</td>
              <td>:</td>
              <td>
                {{ controller.venue }}
              </td>
            </tr>
            <tr v-if="!controller.isShowOtherVenueField">
              <td>PLATFORM</td>
              <td>:</td>
              <td>
                {{ controller.companyMeeting.value.platform }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="agenda-content">
          <p>
            <b><u>AGENDA:</u></b>
          </p>
          <ol>
            <li>
              <span v-if="!controller.hasAppointedChairman">Appointment of Chairman of the Meeting</span>
              <span v-if="controller.hasAppointedChairman">Chairman's Opening Address</span>
            </li>
            <li>Confirmation of Quorum</li>
            <li>
              To note the receipt of the Special Notice pursuant to Section 206 and Section 322 of the Companies Act
              2016 for the proposed removal of {{ controller.directorName }} as Director of the Company.
            </li>
            <li>
              To consider and, if thought fit, pass the following Ordinary Resolution:
              <p>
                <b>ORDINARY RESOLUTION</b>
                <br />
                “THAT {{ controller.directorName }} be and is hereby removed as Director of the Company pursuant to
                Section 206 of the Companies Act 2016 with effect from the date of passing of this Resolution.”
              </p>
            </li>
            <li>
              To record any representation, statement, clarification, or response made by the Director proposed to be
              removed.
            </li>
            <li>Any other business duly convened.</li>
            <li>End of Meeting.</li>
          </ol>
          <p>
            <b><u>NOTES:</u></b>
          </p>
          <ol class="footnote">
            <li>
              In the absence of a Chairman or where the Chairman is unwilling or unable to act, the members present and
              entitled to vote may appoint one of the members present to act as Chairman of the Meeting
            </li>
            <li>
              Quorum shall consist of at least 2 members present and entitled to vote; or if only one member exists,
              that sole member.
            </li>
          </ol>
        </div>
        <div class="agenda-actions no-print">
          <p>
            <b>Shareholder Acknowledgement</b>
          </p>
          <p>
            This Agenda has been generated based on information provided and is intended solely to facilitate the
            conduct of the Meeting. By acknowledging receipt of this Agenda, the shareholder confirms receipt of the
            document but does not by itself constitute agreement with, approval of, support for, or acceptance of any
            proposed resolution, statement, allegation, or matter contained herein. It just confirms that the
            Shareholders has been given reasonable opportunity to review the matters proposed for discussion at the
            Meeting.
          </p>
          <p>
            Nothing in this acknowledgement shall be construed as a waiver of any rights, objections, representations,
            voting rights, or remedies available to the shareholder under the Companies Act 2016, the Constitution of
            the Company (if any), or any applicable agreement. All such rights are expressly reserved.
          </p>
          <div class="action-buttons">
            <button
              class="btn btn-primary"
              @click="controller.onDownloadClicked()"
            >
              Download Agenda
            </button>
            <button
              class="btn btn-submit"
              @click="emit('acknowledge')"
            >
              Acknowledge Receipt
            </button>
          </div>
        </div>
        <div class="page-footer">
          <b>Generated by iCompany System</b>
          <br />
          This document is generated from information provided by the User (Shareholders, Proxies, Corporate
          Representatives,  Directors and even other Roles authorised under this Company). Directors of the Company
          remain responsible for verifying the accuracy of the contents and ensuring compliance with applicable laws,
          the Company's Constitution (if any), and all relevant agreements and requirements. For any information, please
          email cosec@icompany.my.
        </div>
      </template>
    </Paper>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import Paper from "@/components/Papers/Paper.vue"
  import { RemovalOfDirectorEgmAgendaController } from "~/scripts/components/legal-documents/RemovalOfDirectorEgmAgendaController"

  const props = defineProps({
    companyMeetingId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(["isUpdating", "updated", "acknowledge"])

  const agendaRef = ref(null)

  const controller = new RemovalOfDirectorEgmAgendaController(props.companyMeetingId, emit)

  watch(
    () => props.companyMeetingId,
    (newCompanyMeetingId) => {
      controller.setCompanyMeetingId(newCompanyMeetingId)
    }
  )

  watch(
    agendaRef,
    (newVal) => {
      controller.setAgendaRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    onDownloadClicked: controller.onDownloadClicked.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/LegalDocuments/RemovalOfDirectorEgmAgenda" as *;
</style>
