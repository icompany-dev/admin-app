<template>
  <div id="popups-add-bank-account">
    <Popup
      ref="popupRef"
      v-bind="controller.popupProps"
    >
      <template #content>
        <div
          class="action"
          v-html="controller.content"
        />
        <div class="action bank-account-detaills">
          <div class="form-group">
            <!-- <label>{{ controller.accountBankLabel }}</label> -->
            <input
              type="text"
              class="form-control"
              v-model="controller.bankAccountNumber.value"
            />
          </div>
        </div>
      </template>
      <template #actionButtons>
        <button
          class="btn btn-danger"
          :disabled="controller.isUpdating.value"
          @click="controller.onCancelClicked()"
        >
          {{ controller.cancelLabel }}
        </button>
        <button
          class="btn btn-submit"
          :class="{ 'is-loading': controller.isUpdating.value }"
          :disabled="controller.isUpdating.value"
          @click="controller.onProceedClicked()"
        >
          {{ controller.proceedLabel }}
        </button>
      </template>
    </Popup>
  </div>
</template>

<script lang="ts" setup>
  import Popup from "./Popup.vue"
  import { AddBankAccountController } from "~/scripts/components/popups/AddBankAccountController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"

  const props = defineProps({
    companyBankAccountOpeningId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)

  const controller = new AddBankAccountController(props.companyBankAccountOpeningId, emit)

  watch(
    () => props.companyBankAccountOpeningId,
    (newVal) => {
      controller.setCompanyBankAccountOpeningId(newVal)
    }
  )

  watch(
    popupRef,
    (newVal) => {
      controller.setPopupRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    show: controller.show.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Popups/AddBankAccount" as *;
</style>
