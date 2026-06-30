<template>
  <div
    id="name-reservation"
    class="cosec-service-documents"
    :class="{ 'full-size': props.isDocumentEnlarged }"
  >
    <div
      class="incorporate-action-buttons"
      v-if="!props.isDocumentEnlarged"
    >
      <button
        class="btn btn-standard btn-danger"
        v-if="controller.hasApplicationFailed()"
        @click="controller.onAbandonClicked()"
      >
        {{ controller.abandonLabel() }}
      </button>
      <div class="button-group">
        <button
          class="btn btn-standard btn-submit parent-button"
          v-if="controller.hasApplicationFailed()"
        >
          <span @click="controller.onReserveAnotherClicked()">{{ controller.reserveAnotherLabel() }}</span>
          <i
            class="fa-solid fa-caret-down"
            :class="{ 'fa-rotate-180': controller.isShowAppealToMinister.value }"
            @click="controller.onShowAppealToMinisterClicked()"
          />
        </button>
        <button
          class="btn btn-standard btn-submit"
          v-if="controller.canProceedWithIncorporation()"
          @click="controller.onIncorporateNowClicked()"
        >
          {{ controller.incorporateNowLabel() }}
        </button>
        <button
          class="btn btn-standard btn-submit"
          disabled
          :class="{ hide: !controller.isShowAppealToMinister.value }"
          @click="controller.onAppealToMinisterClicked()"
        >
          {{ controller.appealLabel() }}
        </button>
      </div>
    </div>
    <div
      class="documents-section"
      @click="emit('zoomIn')"
      :style="controller.getZoomStyle()"
    >
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <NameReservationEmail
          v-if="controller.isShowEmail.value"
          :application-id="controller.nameReservationApplicationId.value"
          :email-type="controller.emailType.value"
        />
        <Section27OneFour
          v-if="controller.isShowSection27.value"
          :application-id="controller.nameReservationApplicationId.value"
        />
      </TransitionGroup>
    </div>
    <!-- <Teleport to="body">
      <DeleteApplication
        ref="deleteApplicationRef"
        :target-type="CompanyConstants.TARGET_APPLICATION_INCORPORATE"
        :target-id="controller.applicationIncorporateId.value"
      />
    </Teleport> -->
  </div>
</template>

<script setup lang="ts">
  // import DeleteApplication from "../Popups/DeleteApplication.vue"
  import NameReservationEmail from "../LegalDocuments/NameReservationEmail.vue"
  import Section27OneFour from "../LegalDocuments/Section27OneFour.vue"
  import { NameReservationController } from "~/scripts/components/service-wrappers/NameReservationController"
  import { CompanyConstants } from "~/scripts/constants/Company"

  const props = defineProps({
    applicationIncorporateId: {
      type: String,
      required: true,
    },
    isDocumentEnlarged: {
      type: Boolean,
      default: false,
    },
  })

  const deleteApplicationRef = ref(null)
  const emit = defineEmits(["zoomOut", "zoomIn", "back"])

  const controller = new NameReservationController(props.applicationIncorporateId, emit)

  watch(
    () => props.applicationIncorporateId,
    (newVal) => {
      if (newVal) {
        controller.setApplicationIncorporateId(newVal)
      }
    }
  )

  watch(
    deleteApplicationRef,
    (newVal) => {
      controller.setDeleteApplicationRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
  @use "~/assets/scss/components/Services/NameReservation" as *;
</style>
