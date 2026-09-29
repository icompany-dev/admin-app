<template>
  <div
    id="management-accounts-document-wrapper"
    class="service-wrapper"
  >
    <div class="resolution-steps">
      <div
        class="resolution-container"
        :style="controller.getResolutionContainerStyle()"
        @mouseenter="controller.setDocumentHover(true)"
        @mouseleave="controller.setDocumentHover(false)"
      >
        <div
          class="overlay"
          :class="{
            hide: controller.isOverlayHidden(),
            'show-overlay-instruction': controller.isShowOverlayInstruction.value,
          }"
          :style="controller.getOverlayStyle()"
          @click.self="controller.handleDocumentClicked()"
        >
          <span
            class="click-to-preview"
            v-if="!controller.isShowOverlayInstruction.value"
          >
            {{ controller.shroudLabel() }}
          </span>

          <span v-if="controller.isShowOverlayInstruction.value">
            {{ controller.shroudLabel() }}
          </span>

          <div
            v-if="!controller.isShowOverlayInstruction.value"
            class="learn-more-button"
          >
            <slot name="learnMoreButton" />
          </div>

          <div
            v-if="controller.isShowOverlayInstruction.value"
            class="overlay-button"
          >
            <slot name="cornerButton" />
          </div>
        </div>
        <div
          class="document-container"
          :style="controller.getDocumentContainerStyle()"
          v-keyboard-click
          @click="controller.handleDocumentClicked()"
        >
          <div
            class="document-content"
            :style="controller.getDocumentContentStyle()"
          >
            <slot name="document" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { DocumentWrapperController } from "~/scripts/components/management-accounts/DocumentWrapperController"

  const props = defineProps({})
  const emit = defineEmits([])

  const controller = new DocumentWrapperController(false, true, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/ManagementAccounts/DocumentWrapper" as *;
  @use "~/assets/scss/components/CompanyServices/Service" as *;
</style>
