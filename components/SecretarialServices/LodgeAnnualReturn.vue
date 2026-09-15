<template>
  <div id="secretarial-services-lodge-annual-return"></div>
</template>

<script lang="ts" setup>
  import { LodgeAnnualReturnController } from "~/scripts/components/secretarial-services/LodgeAnnualReturnController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const controller = new LodgeAnnualReturnController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/SecretarialServices/LodgeAnnualReturn" as *;
</style>
