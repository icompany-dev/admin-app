<template>
  <div id="drawers-send-email">
    <Teleport to="body">
      <div
        class="drawer drawer-send-email"
        :class="{ show: controller.isShowing.value }"
        @click.self="controller.hide()"
      >
        <Transition name="slide-left-leave-right">
          <div
            class="drawer-wrapper"
            v-if="controller.isShowing.value"
          >
            <div class="drawer-title">{{ controller.drawerTitle }}</div>
            <div class="drawer-content">
              <div class="send-email-container">
                <div class="recipients">
                  <span><b>Recipients :</b></span>
                  <div class="recipient-input-field">
                    <div
                      class="added"
                      v-for="(recipient, index) in controller.adminEmail.value.recipients"
                    >
                      <div class="email">{{ recipient }}</div>
                      <div
                        class="clickable"
                        @click="controller.onRemoveRecipientEmail(index)"
                      >
                        <i class="fa-solid fa-xmark"></i>
                      </div>
                    </div>
                    <input
                      type="text"
                      class="form-control"
                      v-model="controller.recipientEmail.value"
                      placeholder="Add Recipient"
                      @keypress="controller.onRecipientCommaKey($event)"
                      @change="controller.onRecipientEmailChanged()"
                    />
                  </div>
                  <div class="note">Use Comma ( , ) to separate the emails.</div>
                </div>
                <div class="email-subject-row">
                  <span><b>Subject :</b></span>
                  <input
                    type="text"
                    class="form-control"
                    v-model="controller.adminEmail.value.subject"
                    placeholder="Subject of Your Email"
                  />
                </div>
                <div class="email-content">
                  <textarea
                    class="form-control"
                    v-model="controller.adminEmail.value.content"
                  />
                </div>
              </div>
              <div class="drawer-footer">
                <div class="cta">
                  {{ controller.cta }}
                </div>
                <div class="action-buttons">
                  <button
                    class="btn btn-danger"
                    @click="controller.onCancelClicked()"
                  >
                    {{ controller.cancelLabel }}
                  </button>
                  <button
                    class="btn btn-submit"
                    :class="{ 'is-loading': controller.isSendingEmail.value }"
                    :disabled="!controller.canProceed"
                    @click="controller.onProceedClicked()"
                  >
                    {{ controller.proceedLabel }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import { SendEmailController } from "~/scripts/components/drawers/SendEmailController"
  import type { IPropsSendEmail } from "~/scripts/props/PropsSendEmail"

  const props = defineProps<IPropsSendEmail>()

  const emit = defineEmits([])

  const controller = new SendEmailController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )

  defineExpose({
    show: controller.show.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Drawers/SendEmail" as *;
</style>
