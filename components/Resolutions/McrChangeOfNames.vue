<template>
  <div id="mcr-change-of-names">
    <Resolution
      v-bind="controller.resolutionProps"
      @total-page-changed="emit('totalPageChanged')"
      @signed="emit('signed', $event)"
    >
      <template #page1>
        <p>
          <b>IT IS RESOLVED:</b>
          <br />
          <br />
          <b>SPECIAL RESOLUTION</b>
          <br />
          <b><u>CHANGE OF COMPANY'S NAME</u></b>
        </p>
        <p v-if="!controller.isDocumentEditable()">
          THAT the name of the Company,
          <span class="company-names">{{ controller.companyName() }}</span>
          be changed to
          <span
            class="company-names"
            :class="{ placeholder: controller.isInPreviewMode.value }"
          >
            {{ controller.namesToChangeTo() }}
          </span>
          with effect from the date as stipulated by the Registrar in the Notice of Registration on Change of Name of
          Company.
        </p>
        <p v-if="controller.isDocumentEditable()">
          THAT the name of the Company,
          <span class="company-names">{{ controller.companyName() }}</span>
          be changed to
        </p>
        <div
          class="set-company-names"
          v-if="controller.isDocumentEditable()"
        >
          <NameReservations
            :name-reservations="controller.nameReservations.value"
            :is-disabled="props.isInPreviewMode"
            :is-in-preview-mode="props.isInPreviewMode"
            @addName="controller.handleNumberOfNamesChanged($event)"
            @removeName="controller.handleNumberOfNamesChanged($event)"
            @nameChanges="controller.handleNameChanges($event)"
          />
        </div>
        <p v-if="controller.isDocumentEditable()">
          with effect from the date as stipulated by the Registrar in the Notice of Registration on Change of Name of
          Company.
        </p>
        <FurtherResolved />
      </template>
      <template #accompanying-document>
        <p>Notes:</p>
        <p>
          <u>Proposed Resolution on Change of Company's Name</u>
        </p>
        <ol>
          <li>This written resolution has been proposed by the Board of Directors of the Company.</li>
          <li>The circulation date of this written resolution is {{ controller.resolutionDate() }}</li>
          <li>
            Please signify your agreement to this written resolution by signing against your name where indicated and
            enter the date on which you signed. Please then return the signed resolution to the Company (to the
            attention of the Company secretary).
          </li>
          <li>
            If you return this written resolution signed but not dated, it will be assumed by the Company that you
            signed the document on the day immediately preceding the day on which the signed resolution was received by
            the Company.
          </li>
          <li>
            As this resolution is a special resolution, the requisite majority needed to pass the resolution is not less
            than seventy-five per centum of the total voting rights of eligible members. If not passed by the requisite
            majority, this written resolution shall lapse after 28 days from the circulation date, and shall not be
            effective if it is signed after the expiry of that date.
          </li>
        </ol>
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import FurtherResolved from "./FurtherResolved.vue"
  import Resolution from "./Resolution.vue"
  import NameReservations from "../NameReservations/NameReservations.vue"
  import { McrChangeOfNamesController } from "~/scripts/components/resolutions/McrChangeOfNamesController"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import type { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"

  const props = defineProps<IPropsResolutionDocument<CompanyAmendmentName>>()

  const emit = defineEmits(["startLoading", "doneLoading", "totalPageChanged", "nameChanged", "signed"])

  const controller = new McrChangeOfNamesController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      controller.setApplicationId(newVal)
    }
  )

  watch(
    () => props.isInPreviewMode,
    (newVal) => {
      controller.setIsInPreviewMode(newVal)
    }
  )

  watch(
    () => props.nameReservations,
    (newVal) => {
      controller.setNameReservations(newVal)
    }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller), //Has to plus one always, because there is accompanying document
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/ChangeOfNames" as *;
</style>
