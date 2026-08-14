<template>
  <div id="company-services-help">
    <div class="help-button" @click="controller.toggle()">
      <i class="fa-solid fa-circle-question" />
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

<style lang="scss">
@use '~/assets/scss/components/CompanyServices/ServiceHelp.scss' as *;
</style>