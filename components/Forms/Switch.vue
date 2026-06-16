<template>
  <label class="switch">
    <input type="checkbox" v-model="controller.booleanValue.value" @change="controller.onClick()">
    <span class="slider round"></span>
  </label>
</template>

<script setup lang="ts">
import { SwitchController } from '~/scripts/components/forms/SwitchController'

const props = defineProps({
  booleanValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['switchUpdate'])
const controller = new SwitchController(props.booleanValue, emit)
</script>