<template>
  <!--NOTE(Bahiyah): This is to be used together with Transaction Year-->
  <tr
    v-keyboard-click
    @click="controller.toggleSelected()"
    :class="{ 'is-selected': controller.transaction.value.isSelected }"
  >
    <td>
      <input
        type="checkbox"
        v-model="controller.transaction.value.isSelected"
        class="form-check-input"
      />
    </td>
    <td>
      {{ controller.transaction.value.referenceNumber }}
    </td>
    <td>
      <div
        class="transaction-description"
        :class="{ expanded: controller.isExpanded.value }"
      >
        <div class="descriptions">
          <span
            v-for="(description, index) in controller.transaction.value.paymentFor"
            :key="index"
            :class="{ hidden: !controller.isExpanded.value && index >= 1 }"
          >
            {{ description }}
            <br />
          </span>
        </div>
        <div
          class="toggle"
          v-if="controller.isPaidForMoreThanOne.value"
          v-keyboard-click
          @click="controller.toggleShowPaymentFor()"
        >
          <i
            class="fa-solid"
            :class="controller.isExpanded.value ? 'fa-caret-up' : 'fa-caret-down'"
          />
        </div>
      </div>
    </td>
    <td>
      {{ controller.transaction.value.name }}
    </td>
    <td>
      {{ controller.transaction.value.paymentDate }}
    </td>
  </tr>
</template>

<script setup lang="ts">
  import { TransactionController } from "~/scripts/components/transactions/TransactionController"
  import { Transaction } from "~/scripts/types/Transaction"

  const props = defineProps({
    transaction: {
      type: Transaction,
      required: true,
    },
  })

  const emit = defineEmits(["selected", "download", "email", "print"])

  const controller = new TransactionController(props.transaction, emit)

  watch(
    () => props.transaction,
    (newVal) => {
      controller.setTransaction(newVal)
    },
    { deep: true }
  )
</script>
