<template>
  <div id="quick-generate-appoint-cosec">
    <Teleport to="body">
      <Transition name="nric-drawer">
        <div
          v-if="controller.isShowing.value"
          class="nric-display-drawer"
          @click.self="controller.hide()"
        >
          <div class="nric-document-content">
            <AppointJointCompanySecretary
              ref="documentRef"
              :company-id="props.companyId"
              :is-show-action-tray="false"
              :selectedDirectorId="controller.selectedDirectorId.value"
              :secretaryName="controller.secretaryName.value"
              :secretaryIc="controller.secretaryIc.value"
              :secretaryLicense="controller.secretaryLicense.value"
              :secretaryCertificate="controller.secretaryCertificate.value"
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

              <div class="nric-document-editor-input-wrapper">
                <div class="label">New Secretary:</div>
                <input
                  v-model="controller.secretaryName.value"
                  class="form-control"
                  type="text"
                />
              </div>

              <div class="nric-document-editor-input-wrapper">
                <div class="label">New Secretary IC:</div>
                <input
                  v-model="controller.secretaryIc.value"
                  class="form-control"
                  type="text"
                />
              </div>

              <div class="nric-document-editor-input-wrapper">
                <div class="label">New Secretary License No..:</div>
                <input
                  v-model="controller.secretaryLicense.value"
                  class="form-control"
                  type="text"
                />
              </div>

              <div class="nric-document-editor-input-wrapper">
                <div class="label">New Secretary SSM PC No.:</div>
                <input
                  v-model="controller.secretaryCertificate.value"
                  class="form-control"
                  type="text"
                />
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
  import AppointJointCompanySecretary from "../ServiceWrappers/AppointJointCompanySecretary.vue"
  import { AppointCosecController } from "~/scripts/components/quick-generate/AppointCosecController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const documentRef = ref(null)

  const controller = new AppointCosecController(props.companyId, emit)

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
  @use "~/assets/scss/components/QuickGenerate/AppointCosec" as *;
</style>
