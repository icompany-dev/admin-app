<template>
  <div
    class="name-reservation"
    :class="{ disabled: props.isDisabled }"
  >
    <div
      class="input-wrapper"
      :class="controller.inputGroupClass()"
    >
      <div class="input-group">
        <input
          type="text"
          v-model="controller.nameToReserve.value"
          class="in-resolution uppercase"
          :placeholder="props.placeholder"
          @input="controller.onNameChanged()"
          @keyup.enter="controller.onValidateInputClicked()"
          @focus="controller.isInputInFocused.value = true"
          @blur="controller.onInputBlur()"
          :disabled="props.isDisabled"
        />
        <div class="input-group-append">SDN BHD</div>
      </div>

      <div
        v-if="controller.hasClickedEnter.value"
        class="input-notes"
      >
        <ul>
          <li v-if="controller.validationRemarks.value.length > 0">
            <span v-html="controller.validationRemarks.value" />
          </li>
          <li
            v-if="
              controller.warningMessages.value.length > 0 &&
              !controller.isDescriptionRequired.value &&
              !controller.isSupportingDocumentRequired.value
            "
          >
            <span v-html="controller.warningMessages.value" />
          </li>
        </ul>
        <i
          v-if="controller.isChecking.value"
          class="fa-duotone fa-light"
          :class="controller.iconClass()"
        ></i>
        <span>{{ controller.noticeContentCopywriting() }}</span>
      </div>
    </div>

    <div
      ref="availabilityNoticeRef"
      class="availability-notice"
      :class="controller.wrapperClass()"
    >
      <div class="notice-content">
        <div v-if="!controller.hasClickedEnter.value">{{ controller.pressEnterCopywriting() }}</div>
        <div
          v-if="controller.isDescriptionRequired.value || controller.isSupportingDocumentRequired.value"
          class="input-area"
        >
          <div class="label-ask-saira-button">
            <label
              class="textarea-label"
              v-if="props.showInputAreaLabel"
            >
              {{ controller.inputAreaName() }}
            </label>
            <AskSaira
              :input="controller.getDraftInputForSaira()"
              :instruction="controller.draftSairaPrompt()"
              v-if="controller.isShowAskForDrafts()"
              :auto-run="true"
              @workflow-completed="controller.onDraftReceived($event)"
            />
          </div>
          <textarea
            class="in-name-reservation in-resolution"
            v-model="controller.description.value"
            :placeholder="controller.warningMessages.value"
            rows="5"
          ></textarea>
          <div
            class="file-uploader"
            :class="controller.getClassForFileUploader()"
          >
            <FileUploaderLink
              @fileUploaded="controller.onFileUpload($event)"
              @fileRemoved="controller.onFileRemoved()"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="ask-saira-container"
      v-if="controller.isShowAskForRecommendation()"
    >
      <div class="ask-saira-button">
        <AskSaira
          :input="controller.getRecommendationInputForSaira()"
          :instruction="controller.suggestionSairaPrompt()"
          :auto-run="true"
          @workflow-completed="controller.onRecommendationsReceived($event)"
        />
        <span>{{ controller.alternativeRecommendationLabel() }}</span>
      </div>
      <div
        class="ask-saira-suggestion"
        v-if="controller.showNameRecommendations.value"
      >
        <span>{{ controller.nameSuggestedBySaira() }}</span>
        <ul>
          <li
            class="ask-saira-select"
            v-for="(name, index) in controller.nameRecommendations.value"
            :key="index"
            @click="controller.onSuggestedNameClick(name)"
          >
            {{ name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AskSaira from "../AskSaira/AskSaira.vue"
  import FileUploaderLink from "@/components/FileUploaders/Link.vue"
  import { NameReservationController } from "~/scripts/components/name-reservations/NameReservationController"
  import { NameReservation } from "~/scripts/types/NameReservation"

  const emit = defineEmits(["nameChanged"])

  const props = defineProps({
    nameReservation: {
      type: NameReservation,
      required: true,
    },
    placeholder: {
      type: String,
      default: "Insert your new business name",
    },
    showInputAreaLabel: {
      type: Boolean,
      default: false,
    },
    canShowSaira: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    otherNamesToReserve: {
      type: Array<String>,
      default: [],
    },
  })

  const availabilityNoticeRef = ref(null)

  const controller = new NameReservationController(
    props.nameReservation,
    props.otherNamesToReserve as string[],
    emit,
    props.canShowSaira
  )

  watch(
    () => props.nameReservation,
    (newVal) => {
      controller.setNameReservation(newVal)
    }
  )

  watch(
    () => props.otherNamesToReserve,
    (newVal) => {
      controller.setOtherNamesToReserve(newVal as string[])
    }
  )

  watch(
    availabilityNoticeRef,
    (newVal) => {
      controller.setAvailabilityNoticeRef(newVal)
    },
    { immediate: true }
  )

  onMounted(() => {
    window.addEventListener("click", controller.handleClick.bind(controller))
  })

  onBeforeUnmount(() => {
    window.removeEventListener("click", controller.handleClick.bind(controller))
  })
</script>
