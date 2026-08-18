<template>
  <div id="secretarial-services-application">
    <div class="company-details">
      <div class="company-name">
        {{ controller.companyName }}
      </div>
      <div class="company-registration-number">
        {{ controller.registrationNumber }}
      </div>
    </div>
    <component
      :is="activeDocumentComponent"
      v-bind="props"
      @company="controller.onCompanyUpdated($event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import BankAccountOpening from "./BankAccountOpening.vue"
  import { ApplicationController } from "~/scripts/components/secretarial-services/ApplicationController"
  import type { IPropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
  import { CompanyConstants } from "~/scripts/constants/Company"

  const props = defineProps<IPropsSecretarialService>()

  const emit = defineEmits([])

  const controller = new ApplicationController(props, emit)

  const componentMap: Record<string, any> = {
    [CompanyConstants.TARGET_OPEN_BANK_ACCOUNT]: BankAccountOpening,
  }

  const activeDocumentComponent = computed(() => {
    const target = props.target
    return target && componentMap[target] ? componentMap[target] : null
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/SecretarialServices/Application" as *;
</style>
