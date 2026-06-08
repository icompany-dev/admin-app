<template>
  <div id="company-selected-sdn-bhd">
    <div class="company-details">
      <div class="name-logo">
        <div class="logo">// logo</div>
        <div class="name-registration-numbers-actions">
          <div class="name-registration-number">
            <div class="company-name">{{ controller.company.value.getFullName() }}</div>
            <div class="registraiton-numbers">
              {{ controller.company.value.registrationNumberNew }}
              ({{ controller.company.value.registrationNumberOld }})
            </div>
          </div>
          <div class="actions-button-options">More</div>
        </div>
      </div>
    </div>
    <div class="document-container"></div>
  </div>
</template>

<script lang="ts" setup>
  import { SelectedSdnBhdController } from "~/scripts/components/companies/SelectedSdnBhdController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const controller = new SelectedSdnBhdController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => [controller.setCompanyId(newVal)]
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/SelectedSdnBhd" as *;
</style>
