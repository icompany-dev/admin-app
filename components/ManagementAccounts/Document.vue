<template>
  <div
    id="management-accounts-document"
    class="company-services"
    :class="{ enlarged: controller.isEnlarged.value }"
  >
    <div
      class="loader-container"
      v-if="controller.isLoading.value"
    >
      <LoaderPrepare
        :label="controller.loaderLabel()"
        :sublabel="controller.loaderSublabel()"
      />
    </div>
    <DocumentWrapper
      v-if="!controller.isLoading.value"
      @proceed="controller.onInstructionsConfirmed()"
    >
      <template
        #document
        v-if="controller.tables.value.length > 0"
      >
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <div
            id="management-account-document"
            v-keyboard-click
            @click="controller.onPageClick()"
          >
            <div
              class="paper-wrapper"
              v-for="(table, index) in controller.getTables()"
              :key="index"
            >
              <div
                class="paper print"
                :class="{ 'is-printing': props.isForPrinting }"
              >
                <div
                  class="ocr-container"
                  :class="{ show: controller.showOcrContainer() }"
                  v-if="props.isDocumentEditable"
                >
                  <div class="instructions">
                    <div
                      class="loader"
                      :class="{ show: controller.isOcrRunning.value }"
                    >
                      <i class="fa-duotone fa-solid fa-loader fa-spin"></i>
                    </div>
                    <div class="action">{{ controller.dragAndDropCopywriting() }}</div>
                    <div class="type-position">
                      <span class="type">{{ controller.documentCopywriting() }}</span>
                      {{ controller.hereCopywriting() }}
                    </div>
                    <div class="note">
                      {{ controller.instructionNoteCopywriting() }}
                    </div>
                  </div>
                </div>
                <div
                  class="document-ear-mark"
                  v-if="props.isShowEarMark"
                >
                  <div
                    class="document-text"
                    v-html="controller.getDocumentName(index)"
                  />
                </div>
                <div class="auto-save-marker">
                  <i
                    class="fa-regular"
                    :class="{
                      'fa-spinner fa-spin': controller.autoSave.value.isSaving,
                      'fa-circle-check': controller.autoSave.value.hasSaveOnce && !controller.autoSave.value.isSaving,
                    }"
                    :title="controller.savingIconTooltip()"
                  />
                  <span
                    class="wording"
                    :class="{ show: controller.autoSave.value.isSaving }"
                  >
                    {{ controller.savingMarkerCopywriting() }}
                  </span>
                </div>
                <table class="management-account-table">
                  <tbody>
                    <tr
                      v-for="(rows, r) in controller.getTableForPage(index).rows"
                      :key="r"
                      :class="rows.cssClass"
                    >
                      <td
                        v-for="(col, c) in rows.columns"
                        :key="c"
                        :colspan="col.colSpan"
                        :class="col.cssClass"
                      >
                        <span
                          v-if="!controller.isValueEditable(col)"
                          v-keyboard-click
                          @click="controller.handleOnClickEvent(col)"
                          v-html="col.content"
                        />
                        <span
                          v-if="col.hasMoreInfo"
                          class="more-info"
                          v-keyboard-click
                          @click="controller.onMoreInfoClicked(col.type, $event)"
                        >
                          More Info
                        </span>
                        <div v-if="col.isEditable && col.hasOptions">
                          <input
                            type="text"
                            class="form-control"
                            v-model="col.content"
                            @input="controller.onValueChanged(col)"
                            :list="`suggestions-${col.id}`"
                          />
                          <datalist :id="`suggestions-${col.id}`">
                            <option
                              v-for="opt in controller.getOptions(col.type)"
                              :key="opt"
                              :value="opt"
                            ></option>
                          </datalist>
                        </div>
                        <div
                          class="amount-input"
                          v-if="col.isEditable && !col.hasOptions"
                        >
                          <input
                            type="text"
                            class="form-control"
                            v-model="col.content"
                            @input="controller.onValueChanged(col)"
                          />
                          <i
                            class="fa-regular fa-trash-alt delete-item"
                            v-keyboard-click
                            @click="controller.handleOnDeleteClickEvent(col)"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="paper-page-number">
                  {{ index + 1 }}
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </template>
      <template #cornerButton>
        <!-- <button
          class="btn btn-standard btn-pay"
          v-keyboard-click @click="controller.onMoreInfoClicked()"
        >
          {{ controller.learnMoreLabel() }}
        </button> -->
        <button
          class="btn btn-standard btn-pay"
          v-keyboard-click
          @click="controller.onInstructionsConfirmed()"
        >
          {{ controller.proceedButtonLabel() }}
        </button>
      </template>
    </DocumentWrapper>

    <ActionTray
      v-if="!controller.isInPreviewMode"
      :is-lock-position="true"
      :actions="controller.actionTrayElements.value"
    />
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import DocumentWrapper from "./DocumentWrapper.vue"
  // import ManagementAccountWrapper from "./ManagementAccountWrapper.vue"
  // import DocumentPostIt from "@/components/DocumentButtons/DocumentPostIt.vue"
  import ActionTray from "../ActionTrays/ActionTray.vue"
  // import PostOcrManagementAccount from "../Popups/PostOcrManagementAccount.vue"
  import { DocumentController } from "~/scripts/components/management-accounts/DocumentController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
    financialYearStartDate: {
      type: String,
      required: true,
    },
    financialYearEndDate: {
      type: String,
      required: true,
    },
    companyManagementAccountId: {
      type: String,
      default: null,
    },
    isDocumentEditable: {
      type: Boolean,
      default: true,
    },
    canEnlargeDocument: {
      type: Boolean,
      default: true,
    },
    isEnlarged: {
      type: Boolean,
      default: false,
    },
    isShowEarMark: {
      type: Boolean,
      default: true,
    },
    isForPrinting: {
      type: Boolean,
      default: false,
    },
    isShowAlert: {
      type: Boolean,
      default: true,
    },
  })

  const emit = defineEmits(["back"])

  const documentContainerRef = ref(null)
  const documentInstructionRef = ref(null)
  const postOcrProcessPopupRef = ref(null)
  const financialPeriodForManagementAccountRef = ref(null)

  const controller = new DocumentController(
    props.companyId,
    props.financialYearStartDate,
    props.financialYearEndDate,
    props.companyManagementAccountId,
    props.isDocumentEditable,
    props.canEnlargeDocument,
    props.isEnlarged,
    emit
  )

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    () => props.companyManagementAccountId,
    async (newVal) => {
      await controller.setCompanyManagementAccountId(newVal)
      controller.setupDocument()
    }
  )

  watch(
    () => props.financialYearStartDate,
    (newVal) => {
      controller.setFinancialYearStartDate(newVal)
    }
  )

  watch(
    () => props.financialYearEndDate,
    (newVal) => {
      controller.setFinancialYearEndDate(newVal)
    }
  )

  watch(
    () => props.isEnlarged,
    (newVal) => {
      controller.setIsEnlarged(newVal)
    }
  )

  watch(
    documentContainerRef,
    (newVal) => {
      controller.setDocumentContainerRef(newVal)
    },
    { immediate: true }
  )

  watch(
    documentInstructionRef,
    (newVal) => {
      controller.setDocumentInstructionRef(newVal)
    },
    { immediate: true }
  )

  watch(
    postOcrProcessPopupRef,
    (newVal) => {
      controller.setPostOcrProcessPopupRef(newVal)
    },
    { immediate: true }
  )

  watch(
    financialPeriodForManagementAccountRef,
    (newVal) => {
      controller.setFinancialPeriodForManagementAccountRef(newVal)
    },
    { immediate: true }
  )

  onMounted(() => {
    window.addEventListener("resize", controller.setDocumentContainerScale.bind(controller))

    let dropTarget = document.getElementById("accountings-management-account-document")
    controller.setDragAndDropTarget(dropTarget)

    if (dropTarget !== null) {
      ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName: string) => {
        if (!dropTarget) {
          return
        }
        dropTarget.addEventListener(eventName, controller.preventDefaults.bind(controller), false)
      })

      dropTarget.addEventListener("dragenter", controller.handleDragEnter.bind(controller), false)
      dropTarget.addEventListener("dragover", controller.handleDragEnter.bind(controller), false) // dragover is similar to enter
      dropTarget.addEventListener("dragleave", controller.handleDragLeave.bind(controller), false)
      dropTarget.addEventListener("drop", controller.handleDrop.bind(controller), false)
    }
  })

  onUnmounted(() => {
    controller.handleUnmounting()

    window.removeEventListener("resize", controller.setDocumentContainerScale.bind(controller))

    let dropTarget = document.getElementById("accountings-management-account-document")
    if (dropTarget) {
      ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName: string) => {
        if (!dropTarget) {
          return
        }
        dropTarget.removeEventListener(eventName, controller.preventDefaults.bind(controller), false)
      })
      dropTarget.removeEventListener("dragenter", controller.handleDragEnter.bind(controller), false)
      dropTarget.removeEventListener("dragover", controller.handleDragEnter.bind(controller), false)
      dropTarget.removeEventListener("dragleave", controller.handleDragLeave.bind(controller), false)
      dropTarget.removeEventListener("drop", controller.handleDrop.bind(controller), false)
    }
  })

  defineExpose({
    onPageClick: controller.onPageClick.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/ManagementAccounts/Document" as *;
</style>
