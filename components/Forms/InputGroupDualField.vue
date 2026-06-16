<template>
  <div class="input-group-dual-text" :class="controller.inputGroupClass()">
    <div class="input-group-pre-append" v-if="props.isPrependValue">
      {{ props.preOrAppendValue }}
    </div>
    <input type="text" v-model="controller.firstInputValue.value" :placeholder="props.firstPlaceholder"
      :readonly="props.isReadonly" @keyup.enter="emit('updatedFirst', controller.firstInputValue.value)"
      @focus="controller.onFocus()" @blur="controller.onFirstBlur()" />
    <slot name="divider1"></slot>
    <input type="text" v-model="controller.secondInputValue.value" :placeholder="props.secondPlaceholder"
      :readonly="props.isReadonly" @keyup.enter="emit('updatedSecond', controller.secondInputValue.value)"
      @focus="controller.onFocus()" @blur="controller.onSecondBlur()" />
    <slot name="divider2"></slot>
    <div class="input-group-pre-append" v-if="props.isAppendValue">
      {{ props.preOrAppendValue }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { InputGroupDualFieldController } from '~/scripts/components/forms/InputGroupDualFieldController'

const props = defineProps({
  firstInputValue: {
    type: String,
    required: true
  },
  secondInputValue: {
    type: String,
    required: true
  },

  isInputValid: {
    type: Boolean,
    default: true
  },
  isWarningRequired: {
    type: Boolean,
    default: true
  },
  firstPlaceholder: {
    type: String,
    required: true
  },
  secondPlaceholder: {
    type: String,
    required: true
  },
  preOrAppendValue: {
    type: String,
    required: true
  },
  isAppendValue: {
    type: Boolean,
    default: true
  },
  isPrependValue: {
    type: Boolean,
    default: false
  },
  isReadonly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['updatedFirst', 'updatedSecond'])

const controller = new InputGroupDualFieldController(props.firstInputValue, props.secondInputValue, emit)

watch(() => props.firstInputValue, (newVal) => {
  controller.setFirstInputValue(newVal)
})

watch(() => props.secondInputValue, (newVal) => {
  controller.setSecondInputValue(newVal)
})

watch(() => props.isInputValid, (newVal) => {
  controller.setIsInputValid(newVal)
})

watch(() => props.isWarningRequired, (newVal) => {
  controller.setIsWarningRequired(newVal)
})
</script>