<template>
  <div class="auth-layout">
    <div class="image-overlay"></div>
    <div class="color-overlay"></div>
    <NoAuthHeader />

    <div class="page-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AuthLayoutController } from "@/scripts/layouts/AuthLayoutController"
import NoAuthHeader from "@/components/PageHeaders/NoAuth.vue"

const authLayoutController = new AuthLayoutController()
</script>

<style lang="scss">
@use "~/assets/scss/layouts/auth" as *;
</style>
