<template>
  <div id="services-change-of-name-application">
    <ServiceApplication v-bind="controller.serviceApplicationProps">
      <template #application>
        <ApplicationNode
          v-bind="controller.approvalApplicationNodeProps"
          @click="controller.onApprovalStepClicked()"
        >
          <template #nodeContent>
            <div class="approval-container">
              <span class="node-title">{{ controller.approvalLabel }}</span>
              <div class="actions-button-options">
                <div
                  class="btn btn-primary selected"
                  @click="controller.onApprovalTypeClicked()"
                >
                  <span class="label">{{ controller.selectedApprovalTypeLabel }}</span>
                  <i
                    class="fa-solid fa-caret-down"
                    :class="{ rotate: controller.isShowApprovalTypeOptions.value }"
                  ></i>
                </div>
                <div
                  class="options"
                  :class="{ show: controller.isShowApprovalTypeOptions.value }"
                >
                  <button
                    class="btn btn-primary"
                    @click="controller.onApprovalTypeSelected('director')"
                  >
                    {{ controller.directorApprovalTypeLabel }}
                  </button>
                  <button
                    class="btn btn-primary"
                    @click="controller.onApprovalTypeSelected('member')"
                  >
                    {{ controller.shareholderApprovalTypeLabel }}
                  </button>
                  <button
                    class="btn btn-primary"
                    @click="controller.onApprovalTypeSelected('director-member')"
                  >
                    {{ controller.directorShareholderApprovalTypeLabel }}
                  </button>
                </div>
              </div>
            </div>
            <div class="approval-dates">
              <div>
                <b>{{ controller.completedLabel }} :</b>
                {{ controller.approvalDate }}
              </div>
              <div>
                <b>{{ controller.latestSignatureLabel }} :</b>
                {{ controller.lastSignatureDate }}
              </div>
            </div>
          </template>
          <template #nodeOptions>
            <button
              class="btn btn-pill btn-primary"
              :class="{ 'is-loading': controller.isDownloading.value }"
              @click="controller.onDownloadClicked()"
            >
              Download
            </button>
          </template>
          <template #nodeActions>
            <div class="actions-button-options">
              <div
                class="btn btn-pill btn-submit selected"
                @click="controller.onShowApprovalActionClicked()"
              >
                <span class="label">{{ controller.approvalActionLabel }}</span>
                <i
                  class="fa-solid fa-caret-down"
                  :class="{ rotate: controller.isShowApprovalAction.value }"
                ></i>
              </div>
              <div
                class="options"
                :class="{ show: controller.isShowApprovalAction.value }"
              >
                <button
                  class="btn btn-pill btn-submit"
                  disabled
                >
                  {{ controller.concluded }}
                </button>
                <button
                  class="btn btn-pill btn-submit"
                  :disabled="controller.isShareholderSignatureCompleted"
                  @click="controller.onRejectApplicationClicked()"
                >
                  {{ controller.reject }}
                </button>
              </div>
            </div>
          </template>
        </ApplicationNode>
        <ApplicationNode
          v-bind="controller.nameReservationNodeProps"
          @click="controller.onApplicationOfNameReservationClicked()"
        >
          <template #nodeContent>
            <div class="application-container">
              <div class="node-title">{{ controller.nameReservationLabel }}</div>
              <div class="node-subtitle">({{ controller.nameReservationSublabel }})</div>
              <div class="application-details">
                <span class="application-label">
                  {{ controller.proposedNamesLabel }}
                </span>
                <div class="actions-button-options">
                  <div
                    class="btn btn-primary selected"
                    @click="controller.onProposedNamesClicked()"
                  >
                    <span class="label">{{ controller.selectedProposedNameForDisplay }}</span>
                    <i
                      class="fa-solid fa-caret-down"
                      :class="{ rotate: controller.isShowProposedNames.value }"
                    ></i>
                  </div>
                  <div
                    class="options"
                    :class="{ show: controller.isShowProposedNames.value }"
                  >
                    <button
                      v-for="(name, index) in controller.nameOptions"
                      :key="index"
                      class="btn btn-primary name-option"
                      @click="controller.onProposedNamesSelected(name)"
                    >
                      {{ name }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #nodeOptions>
            <button
              class="btn btn-pill btn-primary"
              :class="{ 'is-loading': controller.isUploadingSection27.value }"
              @click="controller.onUploadSection27Clicked()"
            >
              Upload
            </button>
          </template>
          <template #nodeActions>
            <div class="actions-button-options">
              <div
                class="btn btn-pill btn-submit selected"
                :class="{ 'is-loading': controller.isUpdatingSection27.value }"
                @click="controller.onShowSection27ActionClicked()"
              >
                <span class="label">{{ controller.section27ActionLabel }}</span>
                <i
                  class="fa-solid fa-caret-down"
                  :class="{ rotate: controller.isShowSection27Actions.value }"
                ></i>
              </div>
              <div
                class="options"
                :class="{ show: controller.isShowSection27Actions.value }"
              >
                <button
                  class="btn btn-pill btn-submit"
                  :disabled="!controller.canSubmitSection27"
                  @click="controller.onSubmitNameReservation()"
                >
                  {{ controller.submitSection27ApplicationLabel }}
                </button>
                <button
                  class="btn btn-pill btn-submit"
                  :disabled="!controller.canUpdateSection27"
                  @click="controller.onApproveNameReservation()"
                >
                  {{ controller.approvedSection27Label }}
                </button>
                <button
                  class="btn btn-pill btn-submit"
                  :disabled="!controller.canUpdateSection27"
                  @click="controller.onNameReservationRejectedClicked()"
                >
                  {{ controller.rejectedSection27Label }}
                </button>
              </div>
            </div>
          </template>
        </ApplicationNode>
        <ApplicationNode
          v-bind="controller.registrationOfNameChangeProps"
          @click="controller.onRegistrationOfNameChangedClicked()"
        >
          <template #nodeContent>
            <div class="application-container">
              <div class="node-title">{{ controller.registrationOfNameChangeLabel }}</div>
              <div class="node-subtitle">({{ controller.registrationOfNameChangeSublabel }})</div>
            </div>
          </template>
          <template #nodeOptions>
            <button
              class="btn btn-pill btn-primary"
              :class="{ 'is-loading': controller.isDownloadingSection28.value }"
              @click="controller.onDownloadClicked()"
            >
              Download
            </button>
          </template>
          <template #nodeActions>
            <div class="actions-button-options">
              <div
                class="btn btn-pill btn-submit selected"
                :class="{ 'is-loading': controller.isDownloadingSection28.value }"
                @click="controller.onShowRegistrationActions()"
              >
                <span class="label">{{ controller.section28ActionLabel }}</span>
                <i
                  class="fa-solid fa-caret-down"
                  :class="{ rotate: controller.isShowSection28Actions.value }"
                ></i>
              </div>
              <div
                class="options"
                :class="{ show: controller.isShowSection28Actions.value }"
              >
                <button class="btn btn-pill btn-submit">
                  {{ controller.registrationOfNameButtonLabel }}
                </button>
              </div>
            </div>
          </template>
        </ApplicationNode>
      </template>
    </ServiceApplication>
    <PopupNameReservationRejected
      ref="nameReservationRejectedPopup"
      v-bind="controller.nameReservationRejectedProps"
      @proceed="controller.onProceedNameReservationRejected($event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import ApplicationNode from "./ApplicationNode.vue"
  import PopupNameReservationRejected from "@/components/Popups/NameReservationRejected.vue"
  import ServiceApplication from "./ServiceApplication.vue"
  import { ChangeOfNameApplicationController } from "~/scripts/components/services/ChangeOfNameApplicationController"
  import type { IPropsApplication } from "~/scripts/props/PropsApplication"

  const props = defineProps<IPropsApplication>()

  const emit = defineEmits(["applicationId", "documentSelected", "download"])

  const resolutionsRef = ref(null)
  const nameReservationRejectedPopup = ref(null)

  const controller = new ChangeOfNameApplicationController(props, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    resolutionsRef,
    (newVal) => {
      controller.setResolutionsRef(newVal)
    },
    { immediate: true }
  )

  watch(
    nameReservationRejectedPopup,
    (newVal) => {
      controller.setNameReservationRejectedPopup(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/ChangeOfNameApplication" as *;
</style>
