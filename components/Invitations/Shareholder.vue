<template>
  <div
    id="invitations-shareholder"
    class="human-details"
  >
    <div
      class="name human-detail"
      v-if="controller.isRegisteredUser"
    >
      {{ controller.name }}
      <CopyValue :value="controller.name" />
    </div>
    <div
      class="human-detail"
      v-if="controller.isRegisteredUser"
    >
      <i class="fa-regular fa-id-card" />
      {{ controller.identificationType }}
      {{ controller.identificationNumber }}
      <CopyValue :value="controller.identificationNumber" />
    </div>
    <div class="human-detail">
      <i class="fa-regular fa-envelope" />
      <span
        class="action-clickable"
        @click="controller.onEmailClicked()"
      >
        {{ controller.email }}
      </span>
      <CopyValue :value="controller.email" />
    </div>
    <div class="human-detail">
      <i class="fa-brands fa-whatsapp" />
      <span class="human-detail-content">
        {{ controller.phone }}
      </span>
      <CopyValue :value="controller.phone" />
    </div>
    <div class="human-detail">
      <i class="fa-regular fa-user" />
      <span class="human-detail-content">
        {{ controller.race }}
      </span>
      <CopyValue :value="controller.race" />
    </div>
    <div class="human-detail align-start">
      <i class="fa-regular fa-home" />
      <span class="human-detail-content">
        {{ controller.addressLine1 }}
        <CopyValue :value="controller.addressLine1" />
        <br />
        <span v-if="controller.addressLine2.length > 0">
          {{ controller.addressLine2 }}
          <CopyValue :value="controller.addressLine2" />
          <br />
        </span>
        {{ controller.addressPostcode }} {{ controller.addressCity }}
        <CopyValue :value="controller.addressPostcode" />
        <br />
        {{ controller.addressState }} {{ controller.addressCountry }}
        <br />
      </span>
    </div>
    <div class="human-detail">
      <span>{{ controller.totalSharesLabel }}</span>
      <span v-if="!controller.isInEditMode.value">{{ controller.invitation.value.ordinaryShares }}</span>
      <input
        type="text"
        class="form-control"
        v-model="controller.invitation.value.ordinaryShares"
        v-if="controller.isInEditMode.value"
      />
      <span
        v-if="!controller.isInEditMode.value"
        class="action-clickable cancel"
        @click="controller.onUpdateClicked()"
      >
        <i class="fa-regular fa-edit" />
      </span>
      <span
        v-if="controller.isInEditMode.value"
        class="action-clickable cancel"
        @click="controller.onCancelUpdateClicked()"
      >
        <i class="fa-solid fa-xmark" />
      </span>
      <span
        v-if="controller.isInEditMode.value"
        class="action-clickable proceed"
        @click="controller.onProceedUpdateClicked()"
      >
        <i class="fa-solid fa-save" />
      </span>
    </div>
    <div class="human-detail">
      <button
        class="btn btn-danger btn-pill"
        :disabled="controller.isRemoving.value"
        :class="{ 'is-loading': controller.isRemoving.value }"
        @click="controller.onRemoveClicked()"
      >
        {{ controller.removeLabel }}
      </button>
    </div>
    <ConfirmToDelete
      ref="removeConfirmationRef"
      :remove-item-name="controller.removeItemName"
      @proceeed="controller.onProceedRemove()"
    />
  </div>
</template>

<script lang="ts" setup>
  import ConfirmToDelete from "../Popups/ConfirmToDelete.vue"
  import CopyValue from "@/components/Buttons/CopyValue.vue"
  import { ShareholderController } from "~/scripts/components/invitations/ShareholderController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import type { IPropsInvitationDetail } from "~/scripts/props/PropsInvitationDetail"

  const props = defineProps<IPropsInvitationDetail>()

  const emit = defineEmits([EmitMessages.REMOVED, EmitMessages.SHOW_DOCUMENT])

  const removeConfirmationRef = ref(null)

  const controller = new ShareholderController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(props)
    },
    { immediate: true }
  )

  watch(
    removeConfirmationRef,
    (newVal) => {
      controller.setRemoveConfirmationRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Invitations/Invitation" as *;
  @use "~/assets/scss/components/Invitations/Shareholder" as *;
</style>
