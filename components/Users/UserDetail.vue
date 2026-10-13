<template>
  <div
    id="users-user-detail"
    class="human-details"
  >
    <div class="name human-detail">
      {{ controller.name }}
      <span
        @click="controller.onOpenNricClicked()"
        class="action-icon"
        title="Identification"
      >
        <i
          class="fa-solid"
          :class="controller.userDetail.value.identificationType === 'passport' ? 'fa-passport' : 'fa-address-card'"
        />
      </span>
      <CopyValue :value="controller.name" />
    </div>
    <div class="human-detail">
      <i class="fa-regular fa-id-card" />
      {{ controller.identificationType }}
      {{ controller.identificationNumber }}
      <CopyValue :value="controller.identificationNumber" />
    </div>
    <div class="human-detail">
      <i class="fa-brands fa-whatsapp" />
      <span class="human-detail-content">
        {{ controller.phone }}
      </span>
      <CopyValue :value="controller.phone" />
    </div>
    <div class="human-detail">
      <i class="fa-regular fa-envelope" />
      <span
        class="action-clickable"
        @click="controller.onEmailClicked()"
      >
        {{ controller.email }}
      </span>
      <CopyValue :value="controller.email" />
    </div>

    <div class="human-detail">
      <i class="fa-regular fa-user" />
      <span class="human-detail-content">
        {{ controller.race }}
      </span>
      <CopyValue :value="controller.race" />
    </div>
    <div class="human-detail align-start">
      <i class="fa-regular fa-home" />
      <span class="human-detail-content">
        {{ controller.addressLine1 }}
        <CopyValue :value="controller.addressLine1" />
        <br />
        <span v-if="controller.addressLine2.length > 0">
          {{ controller.addressLine2 }}
          <CopyValue :value="controller.addressLine2" />
          <br />
        </span>
        <span v-if="controller.addressLine3.length > 0">
          {{ controller.addressLine3 }}
          <CopyValue :value="controller.addressLine3" />
          <br />
        </span>
        {{ controller.addressPostcode }}
        <CopyValue :value="controller.addressPostcode" />
        <br />
        {{ controller.addressCity }}
        <CopyValue :value="controller.addressCity" />
        <br />
        {{ controller.addressState }}
        <CopyValue :value="controller.addressState" />
        <br />
        {{ controller.addressCountry }}
        <CopyValue :value="controller.addressCountry" />
      </span>
    </div>

    <Teleport to="body">
      <Transition name="nric-drawer">
        <div
          v-if="controller.isShowNric.value"
          class="nric-display-drawer"
          @click.self="controller.onCloseNricClicked()"
        >
          <div class="nric-document-content">
            <IdentificationDocumentWatermark
              v-bind="controller.identificationDocumentWatermarkProps"
              ref="identificationRef"
            />
          </div>

          <div class="nric-document-editor">
            <div class="nric-document-editor-input-wrapper">
              <div class="label">Document Title:</div>
              <input
                type="text"
                v-model="controller.nricDownloadTitle.value"
                class="form-control"
              />
            </div>

            <div class="nric-document-editor-input-wrapper">
              <div class="label">Document Subtitle:</div>
              <input
                type="text"
                v-model="controller.nricDownloadSubtitle.value"
                class="form-control"
              />
            </div>

            <div class="nric-document-editor-input-wrapper">
              <div class="label">Purpose Watermark:</div>
              <input
                type="text"
                v-model="controller.nricDownloadPurpose.value"
                class="form-control"
              />
            </div>

            <div class="action-buttons">
              <div
                class="btn btn-sm btn-submit"
                @click="controller.onDownloadNricClicked()"
              >
                Download
              </div>
              <div
                class="btn btn-sm btn-danger"
                @click="controller.onCloseNricClicked()"
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
  import CopyValue from "../Buttons/CopyValue.vue"
  import IdentificationDocumentWatermark from "~/components/Identifications/IdentificationDocumentWatermark.vue"
  import { UserDetailController } from "~/scripts/components/users/UserDetailController"
  import type { IPropsUserDetail } from "~/scripts/props/PropsUserDetail"

  const props = defineProps<IPropsUserDetail>()
  const emit = defineEmits([])

  const identificationRef = ref(null)

  const controller = new UserDetailController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
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
  @use "~/assets/scss/components/Users/UserDetail" as *;
</style>
