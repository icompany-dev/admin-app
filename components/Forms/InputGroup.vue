<template>
  <div class="form-input-group">
    <label :for="id" class="input-label" :class="{ 'label-floated': controller.isFloated }">
      {{ label }}
    </label>
    <div class="input-container">
      <input :id="id" :type="type" :placeholder="controller.isFloated ? '' : placeholder" class="input-field"
        :value="modelValue" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @focus="controller.onFocus()" @blur="controller.onBlur()" />
      <span v-if="iconClass" class="icon-wrapper" @click="$emit('iconClicked')">
        <i :class="iconLocalValue"></i>
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { InputGroupController } from '~/scripts/components/forms/InputGroupController'

const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  iconClass: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'iconClicked'])
const id = `input-${Math.random().toString(36).substring(2, 9)}`
const iconLocalValue = ref(props.iconClass)
const localModelValue = ref(props.modelValue)
const controller = new InputGroupController(localModelValue)

watch(() => props.modelValue, (newValue) => {
  localModelValue.value = newValue
}, { immediate: true })

watch(() => props.iconClass, (newValue) => {
  iconLocalValue.value = newValue
}, { immediate: true })
</script>