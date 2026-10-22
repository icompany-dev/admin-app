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
        </div>
      </div>
    </template>
    <template v-if="controller.isEditMode.value">
      <div class="branch-address editable">
        <AddressInput
          :location="controller.companyBranch.value.location"
          @updateAddressLine1="controller.onUpdateAddressLine1($event)"
          @updateAddressLine2="controller.onUpdateAddressLine2($event)"
          @updateAddressLine3="controller.onUpdateAddressLine3($event)"
          @updateState="controller.onUpdateState($event)"
          @updateCity="controller.onUpdateCity($event)"
          @updatePostcode="controller.onUpdatePostcode($event)"
          @updateCountry="controller.onUpdateCountry($event)"
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
  </div>
</template>

<script lang="ts" setup>
  import AddressInput from "../Forms/AddressInput.vue"
  import { BranchController } from "~/scripts/components/companies/BranchController"
  import type { IPropsCompanyBranch } from "~/scripts/props/PropsCompanyBranch"

  const props = defineProps<IPropsCompanyBranch>()

  const emit = defineEmits(["branchUpdated"])

  const controller = new BranchController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )

  defineExpose({
    onEditClicked: controller.onEditClicked.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/Branch" as *;
</style>
