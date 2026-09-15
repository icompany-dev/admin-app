<template>
  <div
    id="secretarial-services-lodge-annual-return"
    class="secretarial-service-application"
  >
    <div class="application-details">
      <div class="service-details">//</div>
      <div class="service-details split-50">
        <div class="service-detail">
          <Director
            v-for="(director, index) in controller.directors.value"
            v-bind="controller.getUserDetailsProps(director)"
          />
        </div>
        <div class="service-detail">
          <Shareholder
            v-for="(shareholder, index) in controller.shareholders.value"
            v-bind="controller.getUserDetailsProps(shareholder)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Director from "../Users/Director.vue"
  import Shareholder from "../Users/Shareholder.vue"
  import { LodgeAnnualReturnController } from "~/scripts/components/secretarial-services/LodgeAnnualReturnController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
  import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits(["company", "paymentOrderId"])

  const controller = new LodgeAnnualReturnController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/SecretarialServices/SecretarialService" as *;
  @use "~/assets/scss/components/SecretarialServices/LodgeAnnualReturn" as *;
</style>
