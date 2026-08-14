<template>
  <div
    class="input-group-text"
    :class="controller.inputGroupClass()"
  >
    <div
      class="input-group-pre-append"
      v-if="props.isPrependValue"
    >
      {{ props.preOrAppendValue }}
    </div>
    <input
      type="text"
      v-model="controller.inputValue.value"
      :placeholder="props.placeholder"
      :readonly="props.isReadonly"
      @keyup.enter="controller.onEnter()"
      @focus="controller.onFocus()"
      @blur="controller.onBlur()"
    />
    <div
      class="input-group-pre-append"
      v-if="props.isAppendValue"
      v-html="props.preOrAppendValue"
    ></div>
  </div>
</template>

<script setup lang="ts">
  import { InputGroupTextController } from "~/scripts/components/forms/InputGroupTextController"

  const props = defineProps({
    inputValue: {
      type: String,
      required: true,
    },
    isInputValid: {
      type: Boolean,
      default: true,
    },
    isWarningRequired: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    preOrAppendValue: {
      type: String,
      required: true,
    },
    isAppendValue: {
      type: Boolean,
      default: true,
    },
    isPrependValue: {
      type: Boolean,
      default: false,
    },
    isReadonly: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(["updated"])

  const controller = new InputGroupTextController(props.inputValue, emit)

  watch(
    () => props.inputValue,
    (newVal) => {
      controller.setInputValue(newVal)
    }
  )

  watch(
    () => props.isInputValid,
    (newVal) => {
      controller.setIsInputValid(newVal)
    }
  )

  watch(
    () => props.isWarningRequired,
    (newVal) => {
      controller.setIsWarningRequired(newVal)
    }
  )
</script>
