<template>
  <div id="users-user-viewer">
    <div class="user-content">
      <slot />
    </div>

    <div class="user-viewer-action-container">
      <div class="action-options">
        <div
          class="btn btn-circle"
          @click="controller.onUserDetailClicked()"
        >
          <i class="fa-solid fa-user"></i>
        </div>
        <div
          class="btn btn-circle"
          @click="controller.onNricClicked()"
        >
          <i class="fa-solid fa-address-card"></i>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <TransitionGroup name="user-nric-window">
        <div
          v-if="controller.isShowUserDetail.value"
          class="user-nric-window"
        >
          <div class="user-nric-window-header">
            <span>{{ controller.user.value.name }}</span>

            <div
              class="btn btn-circle"
              @click="controller.onCloseUserDetailClicked()"
            >
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>

          <div
            class="user-nric-window-content"
            style="padding: 30px"
          >
            <div style="margin-bottom: 20px">
              <img
                v-if="controller.user.value.detail?.image?.url"
                :src="controller.user.value.detail.image.url"
                style="height: 300px; width: 300px; object-fit: cover"
              />
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px">
              <div style="display: flex">
                <div style="width: 100px">
                  <b>NAME</b>
                </div>
                <div>{{ controller.user.value.name }}</div>
              </div>
              <div style="display: flex">
                <div style="width: 100px">
                  <b>{{ controller.identificationType }}</b>
                </div>
                <div>{{ controller.user.value.detail?.identification }}</div>
              </div>

              <div style="display: flex">
                <div style="width: 100px">
                  <b>RACE</b>
                </div>
                <div>
                  {{ controller.user.value.detail?.race.toUpperCase() }}

                  <div>
                    {{ controller.user.value.detail?.customRace }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="controller.isShowNric.value"
          class="user-nric-window"
        >
          <div class="user-nric-window-header">
            <span>Identification Document</span>

            <div
              class="btn btn-circle"
              @click="controller.onCloseNricClicked()"
            >
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>

          <!-- TODO: Fix hardcode. -->
          <div style="width: calc(100% - 20px); padding: 15px 10px; box-shadow: var(--box-shadow)">
            <div style="display: flex; justify-content: space-between">
              <div style="display: flex; align-items: center; gap: 10px">
                <div style="width: 50px">Usage:</div>
                <div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="controller.purpose.value"
                    style="min-width: 300px"
                  />
                </div>
              </div>

              <div>
                <div
                  class="btn btn-sm btn-submit"
                  @click="controller.onDownloadNricClicked()"
                >
                  <i
                    class="fa-solid fa-download"
                    style="margin-right: 5px"
                  />
                  Download
                </div>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px">
              <div style="width: 50px">Title:</div>
              <input
                type="text"
                class="form-control"
                v-model="controller.title.value"
                style="min-width: 300px"
              />
            </div>
            <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px">
              <div style="width: 50px">Subtitle:</div>
              <input
                type="text"
                class="form-control"
                v-model="controller.subtitle.value"
                style="min-width: 300px"
              />
            </div>
          </div>
          <div class="user-nric-window-content">
            <IdentificationDocumentWatermark
              v-bind="controller.getIdentificationDocumentWatermarkProps()"
              ref="identificationRef"
            />
            <!-- TODO: need to scale this to the drawer size -->
          </div>
        </div>

        <!-- TODO: need to add user detail view here (show, detail and race. and image) -->
      </TransitionGroup>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  import IdentificationDocumentWatermark from "~/components/Identifications/IdentificationDocumentWatermark.vue"
  import { UserViewerController } from "~/scripts/components/users/UserViewerController"

  const props = defineProps({
    userId: {
      type: [String, null],
      default: "",
    },
    email: {
      type: [String, null],
      default: "",
    },
  })
  const emit = defineEmits([])

  const identificationRef = ref("identificationRef")

  const controller = new UserViewerController(props, emit)

  watch(
    () => props.email,
    (newVal) => {
      controller.setEmail(newVal)
    }
  )

  watch(
    () => props.userId,
    (newVal) => {
      controller.setUserId(newVal)
    }
  )

  watch(
    identificationRef,
    (newVal) => {
      controller.setIdentificationRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Users/UserViewer" as *;
</style>
