<template>
  <div id="popups-invite-director">
    <Popup
      ref="popupRef"
      v-bind="controller.popupProps"
    >
      <template #content>
        <div class="action">
          {{ controller.content }}
        </div>
        <div class="form-group">
          <span class="label">{{ controller.nameLabel }}</span>
          <input
            type="text"
            class="form-control"
            v-model="controller.directorInvitation.value.name"
          />
        </div>
        <div class="form-group">
          <span class="label">{{ controller.emailAddressLabel }}</span>
          <input
            type="text"
            class="form-control"
            v-model="controller.directorInvitation.value.email"
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
          @click="controller.onProceedClicked()"
        >
          {{ controller.proceedLabel }}
        </button>
      </template>
    </Popup>
  </div>
</template>

<script lang="ts" setup>
  import { InviteDirectorController } from "~/scripts/components/popups/InviteDirectorController"
  import Popup from "./Popup.vue"
  import type { IPropsInvitationPopup } from "~/scripts/props/PropsInvitationPopup"

  const props = defineProps<IPropsInvitationPopup>()

  const emit = defineEmits(["proceed"])

  const popupRef = ref(null)

  const controller = new InviteDirectorController(props, emit)

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
  @use "~/assets/scss/components/Popups/InviteDirector" as *;
</style>
