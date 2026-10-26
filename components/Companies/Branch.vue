<template>
  <div id="companies-branch">
    <template v-if="!controller.isEditMode.value">
      <div class="branch-address">
        <span
          class="address-span"
          v-html="controller.branchAddress"
        />
        <div class="actions">
          <span
            class="clickable edit"
            @click="controller.onEditClicked()"
          >
            <i class="fa-regular fa-edit" />
          </span>

          <span
            class="clickable cancel"
            @click="controller.onRemoveClicked()"
          >
            <i class="fa-regular fa-trash-alt" />
          </span>
        </div>
      </div>
    </template>
    <template v-if="controller.isEditMode.value">
      <div class="branch-address editable">
        <AddressInput
          ref="addressInputRef"
          :location="controller.branchLocation.value"
        />
        <div class="actions">
          <span
            class="clickable save"
            @click="controller.onSaveClicked()"
            v-if="!controller.isUpdating.value"
          >
            <i class="fa-regular fa-save" />
          </span>
          <span
            class="clickable cancel"
            @click="controller.onCancelEditClicked()"
            v-if="!controller.isUpdating.value"
          >
            <i class="fa-solid fa-xmark" />
          </span>
          <span
            class="clickable progress"
            v-if="controller.isUpdating.value"
          >
            <i class="fa-solid fa-spinner fa-spin" />
          </span>
        </div>
      </div>
    </template>
    <ConfirmToDelete
      ref="confirmToDeleteRef"
      :removeItemName="controller.itemToRemoveName"
      @proceed="controller.onProceedToDelete()"
    />
  </div>
</template>

<script lang="ts" setup>
  import AddressInput from "../Forms/AddressInput.vue"
  import ConfirmToDelete from "../Popups/ConfirmToDelete.vue"
  import { BranchController } from "~/scripts/components/companies/BranchController"
  import type { IPropsCompanyBranch } from "~/scripts/props/PropsCompanyBranch"

  const props = defineProps<IPropsCompanyBranch>()

  const emit = defineEmits(["branchUpdated", "removed", "branchAdded", "cancel"])

  const confirmToDeleteRef = ref(null)
  const addressInputRef = ref(null)

  const controller = new BranchController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )

  watch(
    confirmToDeleteRef,
    (newVal) => {
      controller.setConfirmToDeleteRef(newVal)
    },
    { immediate: true }
  )

  watch(
    addressInputRef,
    (newVal) => {
      controller.setAddressInputRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    onEditClicked: controller.onEditClicked.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/Branch" as *;
</style>
