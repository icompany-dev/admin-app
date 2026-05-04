<template>
  <div
    id="login-form"
    :class="{ hide: pageController.isLoginSuccess.value }"
  >
    <div class="login-remark-wrapper">
      <span>THE FIRST</span>
      <span class="text-orange">DIGITAL</span>
      <span class="text-orange">COMPANY</span>
      <span class="text-orange">SECRETARY</span>
      <span>THAT REALLY</span>
      <span>WORKS!</span>
    </div>

    <div class="side-card">
      <div class="form-login">
        <div class="form-title-wrapper">
          <div class="main-title">{{ pageController.loginTitle() }}</div>
          <div
            v-if="pageController.isSubtitleVisible()"
            class="title-separator"
          >
            |
          </div>
          <div
            v-if="pageController.isSubtitleVisible()"
            class="subtitle"
          >
            {{ pageController.loginSubtitle() }}:
          </div>
        </div>

        <div class="input-form-wrapper">
          <label
            class="input-label"
            for="email"
          >
            <div class="label">{{ pageController.emailLabel() }}:</div>
            <div class="help-container">
              <HelpButtonWithBorder
                :title="pageController.postItTitle()"
                :description="pageController.postItDescription()"
              />
            </div>
          </label>

          <div
            class="input-group"
            :class="{ 'is-complete': pageController.isEmailExist.value }"
          >
            <input
              class="input"
              placeholder=""
              type="email"
              :label="'email'"
              v-model="pageController.email.value"
              @input="pageController.onEmailChanged()"
              @keydown.enter="pageController.onSubmitClicked()"
            />
            <div class="input-icon">
              <i
                class="fa-regular fa-user"
                v-if="!pageController.isEmailExist.value"
              />
              <i
                class="fa-solid fa-circle-check"
                v-if="pageController.isEmailExist.value"
              />
            </div>
          </div>
        </div>

        <div
          class="input-form-wrapper"
          v-if="pageController.isEmailExist.value"
        >
          <label
            class="input-label"
            for="password"
          >
            <div class="label">{{ pageController.passwordLabel() }}:</div>
          </label>

          <div class="input-group">
            <input
              class="input"
              placeholder=""
              :type="pageController.isShowPassword.value ? 'text' : 'password'"
              v-model="pageController.password.value"
              :label="'password'"
              @input="pageController.onPasswordInputChanged()"
              @keydown.enter="pageController.onSubmitClicked()"
            />
            <div
              class="input-icon cursor-pointer"
              :class="{ reveal: pageController.isShowPassword.value }"
              @click="pageController.onShowPasswordClicked()"
            >
              <i
                class="fa-regular"
                :class="pageController.passwordIcon()"
              />
            </div>
          </div>
        </div>

        <div
          class="buttons-wrapper"
          :class="{ show: pageController.isButtonVisible() }"
        >
          <button
            class="btn btn-submit"
            @click="pageController.onSubmitClicked()"
            :disabled="pageController.isSubmitDisabled()"
            :class="{
              'is-loading': pageController.isLoading.value,
              disabled: pageController.isSubmitDisabled(),
            }"
          >
            {{ pageController.submitButtonLabel() }}
          </button>

          <div
            class="action-link"
            @click="pageController.onForgotPasswordClicked()"
            v-if="pageController.isEmailExist.value"
          >
            {{ pageController.forgotPasswordLabel() }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import HelpButtonWithBorder from "../Buttons/HelpButtonWithBorder.vue"
  import { LoginFormController } from "~/scripts/components/login/LoginFormController"

  const pageController = new LoginFormController()
</script>

<style lang="scss">
  @use "~/assets/scss/components/Login/Form" as *;
</style>
