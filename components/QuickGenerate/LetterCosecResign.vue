<template>
  <div id="quick-generate-letter-cosec-resign">
    <Teleport to="body">
      <Transition name="nric-drawer">
        <div
          v-if="controller.isShowing.value"
          class="nric-display-drawer cosec-resign-drawer"
          @click.self="controller.hide()"
        >
          <div class="nric-document-content">
            <LetterOfCosecResign
              ref="documentRef"
              :company-id="controller.companyId.value"
              :is-show-action-tray="false"
              :director-id="controller.selectedDirectorId.value"
            />
          </div>

          <div class="nric-document-editor">
            <fieldset :disabled="controller.isGenerating.value">
              <div class="nric-document-editor-input-wrapper">
                <div class="label">Select Director:</div>
                <select
                  v-model="controller.selectedDirectorId.value"
                  class="form-control"
                  :disabled="controller.isFetchingDirectors.value"
                >
                  <option
                    disabled
                    value=""
                  >
                    {{ controller.isFetchingDirectors.value ? "Loading directors..." : "Select Director" }}
                  </option>

                  <option
                    v-for="director in controller.directors.value"
                    :key="director.id"
                    :value="director.id"
                  >
                    {{ director.name }}
                  </option>
                </select>
              </div>
            </fieldset>

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
  import LetterOfCosecResign from "../ServiceWrappers/LetterOfCosecResign.vue"
  import { LetterCosecResignController } from "~/scripts/components/quick-generate/LetterCosecResignController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new LetterCosecResignController(props.companyId, emit)

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
  @use "~/assets/scss/components/QuickGenerate/LetterCosecResign" as *;
</style>
