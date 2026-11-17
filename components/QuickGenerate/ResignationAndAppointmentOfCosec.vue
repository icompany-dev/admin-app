<template>
  <div id="quick-generate-resignation-and-appointment-of-cosec">
    <Teleport to="body">
      <Transition name="nric-drawer">
        <div
          v-if="isShowDocument"
          class="nric-display-drawer"
          @click.self="onCloseDocument"
        >
          <div class="nric-document-content">
            <DcrResignationAndCessationOfCosec
              :key="props.companyId"
              ref="documentRef"
              :company-id="props.companyId"
              :directors="directors"
              :director-ids="selectedDirectorIds"
              :resigning-secretary-name="resigningSecretaryName"
              :resigning-secretary-identification="resigningSecretaryIdentification"
              :resigning-secretary-practising-certificate-number="resigningSecretaryPractisingCertificateNumber"
              :replacement-secretary-name="replacementSecretaryName"
              :replacement-secretary-identification="replacementSecretaryIdentification"
              :replacement-secretary-practising-certificate-number="replacementSecretaryPractisingCertificateNumber"
            />
          </div>

          <div class="nric-document-editor">
            <fieldset :disabled="isDownloading">
              <div class="nric-document-editor-input-wrapper">
                <div class="label">Select Directors:</div>

                <div v-if="isLoadingDirectors">Loading directors...</div>

                <div v-else>
                  <div
                    v-for="director in directors"
                    :key="director.id"
                    class="form-check"
                  >
                    <input
                      :id="`director-${director.id}`"
                      v-model="selectedDirectorIds"
                      class="form-check-input"
                      type="checkbox"
                      :value="director.id"
                    />

                    <label
                      class="form-check-label"
                      :for="`director-${director.id}`"
                    >
                      {{ director.name }}
                    </label>
                  </div>
                </div>
              </div>

              <div class="nric-document-editor-input-wrapper">
                <div class="label">Resigning Secretary:</div>
                <input
                  v-model="resigningSecretaryName"
                  class="form-control"
                  type="text"
                />
              </div>

              <div class="nric-document-editor-input-wrapper">
                <div class="label">Resigning Secretary IC:</div>
                <input
                  v-model="resigningSecretaryIdentification"
                  class="form-control"
                  type="text"
                />
              </div>

              <div class="nric-document-editor-input-wrapper">
                <div class="label">Resigning Secretary SSM PC No. (optional):</div>
                <input
                  v-model="resigningSecretaryPractisingCertificateNumber"
                  class="form-control"
                  type="text"
                />
              </div>

              <div class="nric-document-editor-input-wrapper">
                <div class="label">Replacement Secretary:</div>
                <input
                  v-model="replacementSecretaryName"
                  class="form-control"
                  type="text"
                />
              </div>

              <div class="nric-document-editor-input-wrapper">
                <div class="label">Replacement Secretary IC:</div>
                <input
                  v-model="replacementSecretaryIdentification"
                  class="form-control"
                  type="text"
                />
              </div>

              <div class="nric-document-editor-input-wrapper">
                <div class="label">Replacement Secretary SSM PC No. (optional):</div>
                <input
                  v-model="replacementSecretaryPractisingCertificateNumber"
                  class="form-control"
                  type="text"
                />
              </div>
            </fieldset>

            <div
              v-if="errorMessage"
              class="alert alert-danger"
            >
              {{ errorMessage }}
            </div>

            <div class="action-buttons">
              <button
                type="button"
                class="btn btn-sm btn-submit"
                :disabled="!canDownload"
                @click="onDownloadDocument"
              >
                <i
                  v-if="isDownloading"
                  class="fa-duotone fa-loader fa-spin-pulse"
                />
                {{ isDownloading ? "Downloading..." : "Download" }}
              </button>

              <button
                type="button"
                class="btn btn-sm btn-danger"
                :disabled="isDownloading"
                @click="onCloseDocument"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import DcrResignationAndCessationOfCosec from "../Resolutions/DcrResignationAndCessationOfCosec.vue"
  import { ResignationAndAppointmentOfCosecController } from "~/scripts/components/quick-generate/ResignationAndAppointmentOfCosecController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const controller = new ResignationAndAppointmentOfCosecController(props.companyId)

  const {
    documentRef,
    isShowDocument,
    isDownloading,
    isLoadingDirectors,
    errorMessage,
    directors,
    selectedDirectorIds,
    resigningSecretaryName,
    resigningSecretaryIdentification,
    resigningSecretaryPractisingCertificateNumber,
    replacementSecretaryName,
    replacementSecretaryIdentification,
    replacementSecretaryPractisingCertificateNumber,
  } = controller

  const canDownload = computed(() => controller.canDownload)

  const onCloseDocument = controller.onCloseDocument.bind(controller)
  const onDownloadDocument = controller.onDownloadDocument.bind(controller)

  watch(
    () => props.companyId,
    (companyId) => {
      controller.setCompanyId(companyId)
    }
  )

  defineExpose({
    show: controller.onOpenDocument.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/QuickGenerate/ResignationAndAppointmentOfCosec" as *;
</style>
