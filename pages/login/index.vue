<template>
  <div id="page-login">
    <LoginForm />
  </div>
</template>

<script lang="ts" setup>
import LoginForm from '@/components/Login/Form.vue'
import { PageLoginController } from '~/scripts/pages/PageLoginController'

const pageController = new PageLoginController()

</script>