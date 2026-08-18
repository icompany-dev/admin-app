<template>
  <div id="secretarial-services-bank-account-opening">
    <BankAccountOpening
      v-bind="controller.applicationProps"
      @company="emit('company', $event)"
      @paymentOrderId="emit('paymentOrderId', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import BankAccountOpening from "../Services/BankAccountOpening.vue"
  import { BankAccountOpeningController } from "~/scripts/components/secretarial-services/BankAccountOpeningController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const controller = new BankAccountOpeningController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/SecretarialServices/BankAccountOpening" as *;
</style>
