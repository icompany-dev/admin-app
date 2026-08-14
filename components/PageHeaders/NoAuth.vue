<template>
  <div id="no-auth-header">
    <img class="logo" :src="controller.logo" @click="controller.onLogoClicked()" />
  </div>
</template>

<script lang="ts" setup>
import { NoAuthHeaderController } from "~/scripts/components/page-headers/NoAuthHeaderController"

let controller = new NoAuthHeaderController()
</script>

<style lang="scss">
@use "~/assets/scss/components/PageHeaders/NoAuthHeader" as *;
</style>