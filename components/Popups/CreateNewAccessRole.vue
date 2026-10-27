<template>
  <div id="popups-create-new-access-role">
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
          <input
            type="text"
            class="form-control"
            placeholder="New Role Name"
            v-model="controller.accessRole.value.name"
          />
          <input
            type="text"
            class="form-control"
            placeholder="Description of New Role"
            v-model="controller.accessRole.value.description"
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
          :class="{ 'is-loading': controller.isSubmitting.value }"
          :disabled="controller.isSubmitting.value"
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
  import { CreateNewAccessRoleController } from "~/scripts/components/popups/CreateNewAccessRoleController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(EmitMessages.POPUPS)

  const popupRef = ref(null)

  const controller = new CreateNewAccessRoleController(props.companyId, emit)

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
  @use "~/assets/scss/components/Popups/CreateNewAccessRole" as *;
</style>
