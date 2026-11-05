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
              :director-id="directorId"
              :resigning-secretary-name="resigningSecretaryName"
              :resigning-secretary-identification="resigningSecretaryIdentification"
              :replacement-secretary-name="replacementSecretaryName"
              :replacement-secretary-identification="replacementSecretaryIdentification"
              :replacement-secretary-practising-certificate-number="replacementSecretaryPractisingCertificateNumber"
            />
          </div>

          <div class="nric-document-editor">
            <fieldset :disabled="isDownloading">
              <div class="nric-document-editor-input-wrapper">
                <div class="label">Select Director:</div>
                <select
                  v-model="directorId"
                  class="form-control"
                  :disabled="isLoadingDirectors"
                >
                  <option
                    disabled
                    value=""
                  >
                    {{ isLoadingDirectors ? "Loading directors..." : "Select Director" }}
                  </option>

                  <option
                    v-for="director in directors"
                    :key="director.id"
                    :value="director.id"
                  >
                    {{ director.name }}
                  </option>
                </select>
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
                <div class="label">Replacement Secretary SSM PC No.:</div>
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
  import { Director } from "~/scripts/models/Director"
  import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
  import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const documentRef = ref<InstanceType<typeof DcrResignationAndCessationOfCosec> | null>(null)

  const isShowDocument = ref(false)
  const isDownloading = ref(false)
  const isLoadingDirectors = ref(false)
  const errorMessage = ref("")

  const directors = ref<Director[]>([])
  const directorId = ref("")

  const resigningSecretaryName = ref("ASHIKIN")
  const resigningSecretaryIdentification = ref("850108085351")

  const replacementSecretaryName = ref("AHMAD ASYRAQ BIN ABDUL RASID")
  const replacementSecretaryIdentification = ref("870523-04-5275")
  const replacementSecretaryPractisingCertificateNumber = ref("202608000324")

  let directorsLoadVersion = 0

  const canDownload = computed(() => {
    return (
      !isDownloading.value &&
      !isLoadingDirectors.value &&
      !!documentRef.value &&
      !documentRef.value.isLoading &&
      !documentRef.value.errorMessage &&
      !!directorId.value &&
      !!resigningSecretaryName.value.trim() &&
      !!resigningSecretaryIdentification.value.trim() &&
      !!replacementSecretaryName.value.trim() &&
      !!replacementSecretaryIdentification.value.trim() &&
      !!replacementSecretaryPractisingCertificateNumber.value.trim()
    )
  })

  async function fetchDirectors(): Promise<void> {
    const version = ++directorsLoadVersion

    isLoadingDirectors.value = true
    errorMessage.value = ""
    directors.value = []
    directorId.value = ""

    try {
      if (!props.companyId) {
        throw new Error("Company is required.")
      }

      const repository = useDirectorStore()
      const response = await repository.fetchAllForCompany(props.companyId)

      if (repository.error) {
        throw new Error("Unable to load directors.")
      }

      if (version !== directorsLoadVersion) return

      directors.value = (response ?? []).map((item: any) => new Director(item))

      if (directors.value.length === 1) {
        directorId.value = directors.value[0].id
      }

      if (directors.value.length === 0) {
        errorMessage.value = "No directors found for this company."
      }
    } catch (error) {
      if (version !== directorsLoadVersion) return

      errorMessage.value = error instanceof Error ? error.message : "Unable to load directors."

      console.error(error)
    } finally {
      if (version === directorsLoadVersion) {
        isLoadingDirectors.value = false
      }
    }
  }

  function show(): void {
    if (isShowDocument.value) return

    isShowDocument.value = true
    fetchDirectors()
  }

  function onCloseDocument(): void {
    if (isDownloading.value) return

    isShowDocument.value = false
  }

  async function onDownloadDocument(): Promise<void> {
    if (!canDownload.value || !documentRef.value) return

    isDownloading.value = true
    errorMessage.value = ""

    try {
      await nextTick()

      const pages = await documentRef.value.getPdfPages()

      if (pages.length === 0) {
        throw new Error("No document pages available to download.")
      }

      await PdfPaperUtil.generatePdfFile(
        pages,
        19,
        "Resignation and Appointment of Company Secretary.pdf",
        PaperSize.A4,
        PaperOrientation.Portrait
      )
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : "Unable to download the document."

      console.error(error)
    } finally {
      isDownloading.value = false
    }
  }

  watch(
    () => props.companyId,
    () => {
      if (isShowDocument.value) {
        fetchDirectors()
      }
    }
  )

  defineExpose({ show })
</script>

<style lang="scss">
  @use "~/assets/scss/components/QuickGenerate/ResignationAndAppointmentOfCosec" as *;
</style>
