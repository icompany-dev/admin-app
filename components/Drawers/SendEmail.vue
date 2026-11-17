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
                  <div class="company-logo">
                    <img
                      src="https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/landing-res/logos/icompany_long.png"
                    />
                  </div>
                  <div class="email-content-input">
                    <div class="quill-editor">
                      <div ref="editorNode"></div>
                    </div>
                    <!-- <textarea
                      class="form-control"
                      v-model="controller.adminEmail.value.content"
                    /> -->
                  </div>
                  <div class="email-sign-off">
                    <b>Best wishes,</b>
                    <br />
                    iCompany Malaysia
                  </div>
                  <div class="email-footer">
                    This is a system-generated email from iCompany Systems.
                    <br />
                    All actions are initiated by the authorised User (Director, Shareholder, or Corporate
                    Representative, where applicable) under
                    <br />
                    the Companies Act 2016.
                  </div>
                </div>
                <div class="attachments">
                  <div
                    ref="dropZoneRef"
                    class="drop-zone"
                    :class="{ collapsed: controller.anyFileAdded, 'drag-enter': controller.isDragEnter.value }"
                    @click="controller.onUploadClicked()"
                  >
                    <i class="fa-regular fa-cloud-arrow-up icon"></i>
                    <span v-html="controller.instructions" />
                  </div>
                  <input
                    type="file"
                    ref="fileInputRef"
                    class="hidden"
                    multiple="true"
                    @change="controller.handleFileSelected($event)"
                  />
                  <div
                    class="selected-files"
                    v-if="controller.files.value.length > 0"
                  >
                    <div
                      class="selected-file"
                      v-for="(file, i) in controller.files.value"
                    >
                      <i
                        class="fa-solid fa-circle-xmark remove"
                        @click="controller.removeAttachment(i)"
                      />
                      <i
                        class="fa-regular document-icon"
                        :class="file.type !== 'application/pdf' ? 'fa-image' : 'fa-file-pdf'"
                      />
                      <div class="filename">{{ file.name }}</div>
                    </div>
                  </div>
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
  import "quill/dist/quill.snow.css"
  import type Quill from "quill"
  import { SendEmailController } from "~/scripts/components/drawers/SendEmailController"
  import type { IPropsSendEmail } from "~/scripts/props/PropsSendEmail"
  import { StringUtil } from "~/scripts/utils/String"

  const props = defineProps<IPropsSendEmail>()

  const emit = defineEmits([])

  const dropZoneRef = ref(null)

  const fileInputRef = ref(null)

  const controller = new SendEmailController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )

  watch(
    dropZoneRef,
    (newVal) => {
      controller.setDropZoneRef(newVal)
    },
    { immediate: true }
  )

  watch(
    fileInputRef,
    (newVal) => {
      controller.setFileInputRef(newVal)
    },
    { immediate: true }
  )

  //Quill Editor has to be placed here
  const editorNode = ref<HTMLElement | null>(null)
  let quillInstance: Quill | null = null
  const customFontSizes = ["12px", "14px", "16px", "18px", "24px", "32px", "48px"]
  const customFonts = ["Arial", "Georgia", "Courier-New", "Times-New-Roman"]

  const initQuill = async (el: HTMLElement) => {
    if (quillInstance) return

    const [{ default: QuillClass }] = await Promise.all([import("quill")])

    const SizeStyle = QuillClass.import("attributors/style/size") as any
    SizeStyle.whitelist = customFontSizes
    QuillClass.register(SizeStyle, true)

    const FontStyle = QuillClass.import("attributors/style/font") as any
    FontStyle.whitelist = customFonts.map((f: string) => f.toLowerCase().replace(/ /g, "-"))
    QuillClass.register(FontStyle, true)

    quillInstance = new QuillClass(el, {
      theme: "snow",
      placeholder: "Content of your email here...",
      modules: {
        table: false,
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ script: "sub" }, { script: "super" }],
          [{ align: [] }],
        ],
        keyboard: {
          bindings: {
            shiftEnter: {
              key: "Enter",
              shiftKey: true,
              handler: (range: { index: number; length: number }) => {
                if (quillInstance) {
                  quillInstance.insertEmbed(range.index, "softbreak", true, "user")
                  quillInstance.setSelection(range.index + 1, "silent")
                }
                return false
              },
            },
          },
        },
      },
    })

    if (StringUtil.isNullOrEmpty(controller.adminEmail.value.content)) {
      quillInstance.root.innerHTML = ""
    } else {
      quillInstance.root.innerHTML = controller.adminEmail.value.content
    }

    quillInstance.on("text-change", () => {
      if (!quillInstance) return

      const tableModule = quillInstance.getModule("table-better") as any
      if (tableModule) {
        tableModule.hideTools()
      }

      const rawHTML = quillInstance.getSemanticHTML?.() || quillInstance.root.innerHTML
      controller.updateEditorContent(rawHTML)
    })
  }

  watch(editorNode, async (newEl) => {
    if (newEl) {
      await initQuill(newEl)
    } else if (quillInstance) {
      // Clean up when v-if destroys the DOM node on drawer close
      quillInstance.off("text-change")
      quillInstance = null
    }
  })

  defineExpose({
    show: controller.show.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Drawers/SendEmail" as *;
</style>
