<template>
  <div id="company-services-option-buttons">
    <div class="option-buttons">
      <div v-for="(optionButton, index) in controller.optionButtons.value" class="btn btn-option"
        :class="{ 'active': controller.isButtonActive(index) }" :key="index"
        @click="controller.onButtonClicked(index); optionButton.cta"
        @mouseenter="controller.onMouseEnter(index)"
        @mouseleave="controller.onMouseLeave()">
        {{ optionButton.label }}

        <div v-if="controller.isButtonHovered(index)" class="btn-hover-label">
          {{ optionButton.hoverLabel }}
        </div>
      </div>
    </div>
    <div v-show="controller.hasPreviousApplication.value" class="previous-application">
      {{ controller.lastApplicationCopywriting() }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ServiceOptionButtonsController } from '~/scripts/components/company-services/ServiceOptionButtonsController'

const props = defineProps({
  hasPreviousApplication: {
    type: Boolean,
    default: false
  },
  lastApplicationDate: {
    type: String,
    default: null
  }
})

const controller = new ServiceOptionButtonsController(props.hasPreviousApplication, props.lastApplicationDate)

watch(() => props.hasPreviousApplication, (newVal) => {
  controller.setHasPreviousApplication(newVal)
})

watch(() => props.lastApplicationDate, (newVal) => {
  controller.setLastApplicationDate(newVal)
})

defineExpose({
  clearOptionButtons: controller.clearOptionButtons.bind(controller),
  addOptionButton: controller.addOptionButton.bind(controller),
  getCurrentActiveButton: controller.getCurrentActiveButton.bind(controller)
})

</script>

<style lang="scss">
@use '~/assets/scss/components/CompanyServices/ServiceOptionButtons' as *;
</style>