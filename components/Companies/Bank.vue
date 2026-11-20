<template>
  <div id="companies-bank">
    <template v-if="!controller.isEditing.value">
      <div class="bank-details">
        <div class="bank-name">
          {{ controller.selectedBankName }}
        </div>
        <div class="branch-name">
          {{ controller.selectedBranchName }}
        </div>
        <div class="branch-address">
          {{ controller.selectedBranchAddress }}
        </div>
        <div class="account-number">
          <span class="label">{{ controller.accountNumberLabel }} :</span>
          <span class="input">{{ controller.companyBank.value.accountNumber }}</span>
        </div>
      </div>
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
    </template>
    <template v-if="controller.isEditing.value">
      <div class="bank-details editable">
        <div class="bank-name">
          <SearchableDropdown
            :options="controller.bankOptions"
            :selected-item-name="controller.selectedBankName"
            :placeholder="'Select a Bank'"
            :label-key="'label'"
            :value-key="'value'"
            @search="controller.onSearchBank($event)"
            @selected="controller.onSelectedBank($event)"
          />
        </div>
        <div class="branch-name">
          <BranchDropdown
            :bank-id="controller.companyBank.value.bankId"
            :selected-branch-id="controller.companyBank.value.bankBranchId"
            :is-show-address="false"
            @branch-selected="controller.onBranchSelected($event)"
          />
        </div>
        <div class="branch-address">
          {{ controller.selectedBranchAddress }}
        </div>
        <div class="account-number">
          <span class="label">{{ controller.accountNumberLabel }} :</span>
          <span class="input">
            <input
              type="text"
              class="form-control"
              v-model="controller.companyBank.value.accountNumber"
            />
          </span>
        </div>
      </div>
      <div class="actions">
        <span
          class="clickable save"
          @click="controller.onSaveClicked()"
          v-if="!controller.isSubmitting.value"
        >
          <i class="fa-regular fa-save" />
        </span>
        <span
          class="clickable cancel"
          @click="controller.onCancelEditClicked()"
          v-if="!controller.isSubmitting.value"
        >
          <i class="fa-solid fa-xmark" />
        </span>
        <span
          class="clickable progress"
          v-if="controller.isSubmitting.value"
        >
          <i class="fa-solid fa-spinner fa-spin" />
        </span>
      </div>
    </template>
    <ConfirmToDelete
      ref="confirmToDeleteRef"
      :remove-item-name="controller.itemToRemoveName"
      @proceed="controller.onProceedRemoved()"
    />
  </div>
</template>

<script lang="ts" setup>
  import BranchDropdown from "../Banks/BranchDropdown.vue"
  import ConfirmToDelete from "../Popups/ConfirmToDelete.vue"
  import SearchableDropdown from "../Forms/SearchableDropdown.vue"
  import { BankController } from "~/scripts/components/companies/BankController"
  import type { IPropsCompanyBank } from "~/scripts/props/PropsCompanyBank"

  const props = defineProps<IPropsCompanyBank>()

  const emit = defineEmits(["removed", "updated", "added", "cancel"])

  const confirmToDeleteRef = ref(null)

  const controller = new BankController(props, emit)

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
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/Bank" as *;
</style>
