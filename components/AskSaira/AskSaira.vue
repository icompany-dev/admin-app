<template>
  <div id="ask-saira">
    <div class="additional-input" :class="{ 'show': controller.isShowAdditionalInputFields.value }">
      <div class="additional-input-area">
        <label class="label" v-html="props.instruction" />
        <textarea class="ask-saira-prompt" v-model="controller.input.value" rows="3">
        </textarea>
      </div>
      <div class="action-buttons">
        <button class="btn btn-danger" @click="controller.onCancelClicked()">
          {{ controller.cancelButtonLabel() }}
        </button>
        <button class="btn btn-submit" @click="controller.run()">
          {{ controller.runButtonLabel() }}
        </button>
      </div>
    </div>
    <div class="btn btn-ask-saira" @click="controller.onClick()"
      :class="{ 'active': controller.isShowAdditionalInputFields.value }">
      <span>{{ controller.askSairaLabel() }} SAIRA</span>
      <i class="fa-solid" :class="controller.isLoading.value ? 'fa-spin fa-spinner' : 'fa-sparkles'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AskSairaController } from '~/scripts/components/ask-saira/AskSairaController'

const props = defineProps({
  input: {
    type: String,
    required: true
  },
  instruction: {
    type: String,
    default: 'Add Prompt'
  },
  autoRun: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['workflowCompleted'])

const controller = new AskSairaController(props.input, emit, props.autoRun)

watch(() => props.input, (newVal) => {
  controller.setInput(newVal)
})
</script>

<style lang="scss">
@use '~/assets/scss/components/AskSaira/AskSaira' as *;
</style>