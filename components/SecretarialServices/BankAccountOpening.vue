<template>
  <div id="secretarial-services-bank-account-opening">In Bank Account Opening</div>
</template>

<script lang="ts" setup>
  import { BankAccountOpeningController } from "~/scripts/components/secretarial-services/BankAccountOpeningController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits([])

  const controller = new BankAccountOpeningController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/SecretarialServices/BankAccountOpening" as *;
</style>
