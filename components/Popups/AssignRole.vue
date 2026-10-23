<template>
  <div id="popups-assign-role">
    <Popup
      ref="popupRef"
      v-bind="controller.popupProps"
    >
      <template #content>
        <div
          class="action"
          v-html="controller.content"
        />
        <div class="action">
          <div class="form-group">
            <label>
              {{ controller.nameLabel }}
              <span class="required"></span>
            </label>
            <input
              type="text"
              class="form-control"
              v-model="controller.name.value"
            />
          </div>
          <div class="form-group">
            <label>
              {{ controller.roleLabel }}
              <span class="required"></span>
            </label>
            <select
              class="form-control"
              v-model="controller.selectedAccessRole.value"
            >
              <option></option>
              <option
                v-for="(opt, i) in controller.accessRoleOptions"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>
              {{ controller.emailLabel }}
              <span class="required"></span>
            </label>
            <input
              type="text"
              class="form-control email"
              v-model="controller.email.value"
            />
          </div>
          <div class="form-group">
            <label>{{ controller.phoneLabel }}</label>
            <input
              type="text"
              class="form-control"
              v-model="controller.phone.value"
            />
          </div>
          <div class="form-group">
            <label>
              {{ controller.passwordLabel }}
              <span class="required"></span>
            </label>
            <input
              type="text"
              class="form-control email"
              v-model="controller.password.value"
            />
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              v-model="controller.isRequireEkyc.value"
            />
            <span>{{ controller.isRequireEkycLabel }}</span>
          </div>
          <div
            class="form-group"
            v-if="!controller.isRequireEkyc.value"
          >
            <label>
              {{ controller.licenseLabel }}
              <span class="required">*</span>
            </label>
            <input
              type="text"
              class="form-control"
              v-model="controller.license.value"
            />
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              v-model="controller.isSendInvitation.value"
            />
            <span>{{ controller.sendInvitationLabel }}</span>
          </div>
          <div class="form-check">
            <input
              type="checkbox"
              v-model="controller.isNotifyDirectors.value"
            />
            <span>{{ controller.notifyDirectorsLabel }}</span>
          </div>
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
          :class="{ 'is-loading': controller.isSubmitting.value }"
          :disabled="controller.isSubmitting.value || !controller.canProceed"
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
  import { AssignRoleController } from "~/scripts/components/popups/AssignRoleController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import type { IPropsAssignRole } from "~/scripts/props/PropsAssignRole"

  const props = defineProps<IPropsAssignRole>()

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)

  const controller = new AssignRoleController(props, emit)

  watch(
    popupRef,
    (newVal) => {
      controller.setPopupRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )

  defineExpose({
    show: controller.show.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Popups/AssignRole" as *;
</style>
