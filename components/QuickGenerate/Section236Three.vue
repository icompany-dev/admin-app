<template>
  <div id="quick-generate-section236-three">
    <Teleport to="body">
      <Transition name="nric-drawer">
        <div
          v-if="controller.isShowing.value"
          class="nric-display-drawer"
          @click.self="controller.hide()"
        >
          <div class="nric-document-content">
            <Section236Three
              ref="documentRef"
              :company-name="props.companyName"
              :registration-number-new="props.registrationNumberNew"
              :registration-number-old="props.registrationNumberOld"
              :is-show-tray="false"
            />
          </div>

          <div class="nric-document-editor">
            <div class="action-buttons">
              <button
                type="button"
                class="btn btn-sm btn-danger"
                :disabled="controller.isGenerating.value"
                @click="controller.hide()"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-sm btn-submit"
                :class="{ 'is-loading': controller.isGenerating.value }"
                :disabled="controller.isGenerating.value"
                @click="controller.onGenerateClicked()"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import Section236Three from "../ServiceWrappers/Section236Three.vue"
  import { Section236ThreeController } from "~/scripts/components/quick-generate/Section236ThreeController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    registrationNumberNew: {
      type: String,
      required: true,
    },
    registrationNumberOld: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new Section236ThreeController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(documentRef, (newVal) => {
    controller.setDocumentRef(newVal)
  })

  defineExpose({
    show: controller.show.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/QuickGenerate/Section236Three" as *;
</style>
