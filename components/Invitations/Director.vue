<template>
  <div
    id="invitations-director"
    class="human-details"
  >
    <div class="name human-detail">
      {{ controller.name }}
      <CopyValue :value="controller.name" />
    </div>
    <div class="human-detail">
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
      </span>
    </div>
    <div
      class="human-detail"
      v-if="props.hasSection201"
    >
      <span
        :class="{ 'action-clickable': controller.hasAcceptedInvitation }"
        @click="controller.onDeclarationClicked()"
      >
        {{ controller.declarationLabel }}
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
  import { DirectorController } from "~/scripts/components/invitations/DirectorController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import type { IPropsInvitationDetail } from "~/scripts/props/PropsInvitationDetail"

  const props = defineProps<IPropsInvitationDetail>()

  const emit = defineEmits([EmitMessages.REMOVED, EmitMessages.SHOW_DOCUMENT])

  const removeConfirmationRef = ref(null)

  const controller = new DirectorController(props, emit)

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
  @use "~/assets/scss/components/Invitations/Director" as *;
</style>
