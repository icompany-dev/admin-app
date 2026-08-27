<template>
  <div id="popups-invite-shareholder">
    <Popup
      ref="popupRef"
      v-bind="controller.popupProps"
    >
      <template #content>
        <div class="action">
          {{ controller.content }}
        </div>
        <div class="form-group">
          <span class="label">{{ controller.typeLabel }}</span>
          <select
            class="form-control"
            v-model="controller.shareholderInvitation.value.type"
          >
            <option
              v-for="opt in controller.typeOptions"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div
          class="form-group"
          v-if="controller.isTypeRepresentative"
        >
          <span class="label">{{ controller.companyNameLabel }}</span>
          <input
            type="text"
            class="form-control text-uppercase company-name"
            v-model="controller.shareholderInvitation.value.company.name"
          />
          <select
            class="form-control company-type"
            v-model="controller.shareholderInvitation.value.company.type"
          >
            <option
              v-for="opt in controller.companyNameTypeOptions"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <span class="label">{{ controller.nameLabel }}</span>
          <input
            type="text"
            class="form-control text-uppercase"
            v-model="controller.shareholderInvitation.value.name"
          />
        </div>
        <div class="form-group">
          <span class="label">{{ controller.emailAddressLabel }}</span>
          <input
            type="text"
            class="form-control"
            v-model="controller.shareholderInvitation.value.email"
          />
        </div>
      </template>
      <template #actionButtons>
        <button
          class="btn btn-danger"
          @click="controller.onCancelClicked()"
        >
          {{ controller.cancelLabel }}
        </button>
        <button
          class="btn btn-submit"
          :disabled="!controller.canProceed"
          :class="{ 'is-loading': controller.isSubmitting.value }"
          @click="controller.onAddShareholderClicked()"
        >
          {{ controller.proceedLabel }}
        </button>
      </template>
    </Popup>
  </div>
</template>

<script lang="ts" setup>
  import { InviteShareholderController } from "~/scripts/components/popups/InviteShareholderController"
  import Popup from "./Popup.vue"
  import type { IPropsInvitationPopup } from "~/scripts/props/PropsInvitationPopup"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"

  const props = defineProps<IPropsInvitationPopup>()

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)

  const controller = new InviteShareholderController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
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
  @use "~/assets/scss/components/Popups/InviteShareholder" as *;
</style>
