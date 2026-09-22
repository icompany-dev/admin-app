<template>
  <div
    id="secretarial-services-document-request"
    class="secretarial-service-application"
  >
    <div class="service-application">//</div>
    <div class="document-container">//</div>
  </div>
</template>

<script lang="ts" setup>
  import { DocumentRequestController } from "~/scripts/components/secretarial-services/DocumentRequestController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const controller = new DocumentRequestController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/SecretarialServices/SecretarialService" as *;
  @use "~/assets/scss/components/SecretarialServices/DocumentRequest" as *;
</style>
