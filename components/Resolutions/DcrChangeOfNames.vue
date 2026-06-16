<template>
  <div id="dcr-change-of-names">
    <Resolution
      v-bind="controller.resolutionProps"
      @total-page-changed="emit('totalPageChanged')"
      @signed="emit('signed', $event)"
    >
      <template #page1>
        <p>
          <b>WHEREAS:</b>
          <br />
          <br />
          The Board of Directors has proposed a change of the Company’s name, which is conditional upon the members’
          approval by special resolution and upon the passing of such resolution, the Company shall lodge the necessary
          with the Registrar within thirty (30) days pursuant to Section 28 of the Companies Act 2016.
        </p>
        <p>
          <b>IT IS HEREBY RESOLVED:</b>
          <br />
          <br />
          <b>CIRCULATION OF MEMBERS' WRITTEN RESOLUTION TO OBTAIN APPROVAL ON THE CHANGE OF COMPANY'S NAME</b>
        </p>
        <p>
          <b>THAT</b>
          the Directors be and are hereby authorised to propose, circulate and take all necessary steps to obtain the
          members’ approval of the following resolution pursuant to Section 300 of the Act:
        </p>
        <div class="blockquote">
          <b>SPECIAL RESOLUTION</b>
          <br />
          <b>CHANGE OF COMPANY'S NAME</b>
          <br />
          <br />
          THAT the name of the Company,
          <span class="company-names">{{ controller.companyName() }}</span>
          be changed to
          <span
            v-if="!controller.isDocumentEditable()"
            class="company-names"
            :class="{ placeholder: controller.isInPreviewMode.value }"
          >
            {{ controller.namesToChangeTo() }}
          </span>
          <div
            v-if="controller.isDocumentEditable()"
            class="set-company-names"
          >
            <NameReservations
              :name-reservations="controller.nameReservations.value"
              :is-disabled="props.isInPreviewMode"
              @addName="controller.handleNumberOfNamesChanged($event)"
              @removeName="controller.handleNumberOfNamesChanged($event)"
              @nameChanges="controller.handleNameChanges($event)"
            />
          </div>
          with effect from the date as stipulated by the Registrar in the Notice of Registration on Change of Name of
          Company.
        </div>
        <FurtherResolved />
      </template>
    </Resolution>
  </div>
</template>

<script setup lang="ts">
  import FurtherResolved from "./FurtherResolved.vue"
  import Resolution from "./Resolution.vue"
  import NameReservations from "../NameReservations/NameReservations.vue"
  import { DcrChangeOfNamesController } from "~/scripts/components/resolutions/DcrChangeOfNamesController"
  import { NameReservation } from "~/scripts/types/NameReservation"
  import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
  import type { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"

  const props = defineProps<IPropsResolutionDocument<CompanyAmendmentName>>()

  const emit = defineEmits(["startLoading", "doneLoading", "totalPageChanged", "nameChanged", "signed"])

  const controller = new DcrChangeOfNamesController(props, emit)

  watch(
    () => props.applicationId,
    (newVal) => {
      console.log("setting", newVal)
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

  watch(
    () => props.showWatermark,
    (newVal) => {
      controller.setShowWatermark(newVal)
    }
  )

  watch(
    () => props.watermarkText,
    (newVal) => {
      controller.setWatermarkText(newVal)
    }
  )

  defineExpose({
    totalPages: controller.totalPages.bind(controller),
    getApplication: controller.getApplication.bind(controller),
    updateApplicationContent: controller.updateApplicationContent.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Resolutions/ChangeOfNames" as *;
</style>
