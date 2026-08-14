<template>
  <div id="banks-branch-dropdown">
    <div
      class="searchable-dropdown"
      :class="{ disabled: props.isDisabled, wide: props.isShowAddress }"
    >
      <div
        class="dropdown selected"
        :class="{
          'menu-showing': controller.isShowBranchOptions.value,
          placeholder: controller.isBranchPlaceholder,
        }"
        @click="controller.onBranchOptionClicked()"
      >
        <span class="label">
          {{ controller.selectedBranchName }}
          <span v-if="props.isShowAddress">{{ controller.branchAddress }}</span>
        </span>
        <i
          v-if="!props.isDisabled"
          class="fa-solid fa-caret-down"
          :class="{ rotate: controller.isShowBranchOptions.value }"
        ></i>
      </div>
      <div
        class="dropdown-menu"
        :class="{ show: controller.isShowBranchOptions.value }"
      >
        <div class="dropdown-item">
          <input
            type="text"
            class="form-control"
            placeholder="Search branch"
            v-model="controller.searchBranch.value"
            @click.stop
          />
        </div>
        <template
          v-for="(state, i) in controller.branchStates"
          :key="i"
        >
          <div class="dropdown-menu-group-title">
            {{ state.name.toUpperCase() }}
          </div>
          <div
            class="dropdown-item"
            v-for="(branch, j) in controller.getBranchesInState(state.id)"
            :key="j"
            @click="controller.onBranchOptionSelected(branch.id)"
          >
            {{ branch.name }}
          </div>
          <div class="divider" />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { BranchDropdownController } from "~/scripts/components/banks/BranchDropdownController"

  const props = defineProps({
    bankId: {
      type: String,
      required: true,
    },
    selectedBranchId: {
      type: String,
      required: false,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    isShowAddress: {
      type: Boolean,
      required: false,
      default: false,
    },
  })

  const emit = defineEmits(["branchSelected"])

  const controller = new BranchDropdownController(props.bankId, props.selectedBranchId ?? "", emit)

  watch(
    () => props.bankId,
    (newBankId) => {
      controller.setBankId(newBankId)
    }
  )

  watch(
    () => props.selectedBranchId,
    (newSelectedBranchId) => {
      controller.setSelectedBranchId(newSelectedBranchId ?? "")
    }
  )

  // onMounted(() => {
  //   window.addEventListener("click", controller.handleClick.bind(controller))
  // })

  // onBeforeUnmount(() => {
  //   window.removeEventListener("click", controller.handleClick.bind(controller))
  // })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Banks/BranchDropdown" as *;
</style>
