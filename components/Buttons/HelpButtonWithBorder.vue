<template>
  <div class="help-button-wrapper">
    <div class="help-button-with-border" @click="controller.toggle()"
      :class="{ 'post-it-showing': controller.isShowing.value }">
      <i :class="props.iconClass" />
    </div>
    <div class="post-it" :class="{ 'show': controller.isShowing.value }">
      <div class="close-button" @click="controller.hide()">
        <i class="fa-regular fa-circle-xmark" />
      </div>
      <div class="title">
        {{ controller.title.value }}
      </div>
      <div class="content" v-html="controller.description.value" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HelpButtonController } from '~/scripts/components/buttons/HelpButtonController'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  iconClass: {
    type: String,
    default: 'fa-solid fa-circle-question'
  }
})

const controller = new HelpButtonController(props.title, props.description)

watch(() => props.title, (newVal) => {
  controller.setTitle(newVal)
})

watch(() => props.description, (newVal) => {
  controller.setDescription(newVal)
})
</script>