<template>
  <div id="company-selected-sdn-bhd">
    <div class="company-details">
      <div class="name-logo">
        <div
          class="logo"
          :class="{ 'no-logo': !controller.hasCompanyLogo }"
        >
          <img :src="controller.companyLogo" />
        </div>
        <div class="name-registration-numbers-actions">
          <div class="name-registration-number">
            <div class="company-name">{{ controller.company.value.getFullName() }}</div>
            <div class="registraiton-numbers">
              {{ controller.company.value.registrationNumberNew }}
              ({{ controller.company.value.registrationNumberOld }})
            </div>
          </div>
          <div class="actions-button-options">
            <div
              class="btn btn-pill btn-submit selected"
              @click="controller.onOptionsClicked()"
            >
              <span class="label">{{ controller.more }}</span>
              <i
                class="fa-solid fa-caret-down"
                :class="{ rotate: controller.isShowOptions.value }"
              ></i>
            </div>
            <div
              class="options"
              :class="{ show: controller.isShowOptions.value }"
            >
              <button
                class="btn btn-pill btn-submit"
                @click="controller.onEditClicked()"
              >
                {{ controller.edit }}
              </button>
              <button
                class="btn btn-pill btn-submit"
                @click="controller.onStrikeOffClicked()"
              >
                {{ controller.strikeOff }}
              </button>
              <button
                class="btn btn-pill btn-submit"
                @click="controller.onSwitchOutClicked()"
              >
                {{ controller.switchOut }}
              </button>
            </div>
          </div>
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
