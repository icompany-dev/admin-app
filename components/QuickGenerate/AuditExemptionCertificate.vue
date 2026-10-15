<template>
  <div id="quick-generate-audit-exemption-certificate">
    <Teleport to="body">
      <Transition name="nric-drawer">
        <div
          v-if="controller.isShowDocument.value"
          class="nric-display-drawer"
          @click.self="controller.onCloseDocument()"
        >
          <div class="nric-document-content">
            <AuditExemptionCertificate
              :company-id="props.companyId"
              :director-id="controller.directorId.value"
              ref="auditExemptionCertificateRef"
            />
          </div>

          <div class="nric-document-editor">
            <div class="nric-document-editor-input-wrapper">
              <div class="label">Select Director:</div>
              <select
                class="form-control"
                v-model="controller.directorId.value"
              >
                <option
                  disabled
                  selected
                >
                  Select Director
                </option>
                <option
                  v-for="director in controller.directors.value"
                  :value="director.id"
                >
                  {{ director.name }}
                </option>
              </select>
            </div>

            <div class="action-buttons">
              <div
                class="btn btn-sm btn-submit"
                @click="controller.onDownloadDocument()"
              >
                Download
              </div>
              <div
                class="btn btn-sm btn-danger"
                @click="controller.onCloseDocument()"
              >
                Close
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import AuditExemptionCertificate from "../LegalDocuments/AuditExemptionCertificate.vue"
  import { AuditExemptionCertificateController } from "~/scripts/components/quick-generate/AuditExemptionCertificateController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })
  const emit = defineEmits([])

  const auditExemptionCertificateRef = ref(null)

  const controller = new AuditExemptionCertificateController(props, emit)

  watch(
    auditExemptionCertificateRef,
    (newVal) => {
      controller.setAuditExemptionCertificateRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    show: controller.onOpenDocument.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/QuickGenerate/AuditExemptionCertificate" as *;
</style>
