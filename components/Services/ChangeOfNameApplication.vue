<template>
  <div id="services-change-of-name-application">
    <ServiceApplication v-bind="controller.serviceApplicationProps">
      <template #application>
        <ApplicationNode v-bind="controller.approvalApplicationNodeProps">
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
        <ApplicationNode v-bind="controller.nameReservationNodeProps">
          <template #nodeContent>
            <div class="application-container">
              <div class="node-title">{{ controller.nameReservationLabel }}</div>
              <div class="node-subtitle">({{ controller.nameReservationSublabel }})</div>
            </div>
          </template>
        </ApplicationNode>
      </template>
      <template #documents>
        <ChangeOfNameService
          ref="resolutionsRef"
          :company-id="controller.companyId.value"
          :view-type="'existing'"
          :application-id="controller.application.value?.id ?? ''"
        />
      </template>
    </ServiceApplication>
  </div>
</template>

<script lang="ts" setup>
  import ApplicationNode from "./ApplicationNode.vue"
  import ServiceApplication from "./ServiceApplication.vue"
  import ChangeOfNameService from "@/components/CompanyServices/ChangeOfNameService.vue"
  import { ChangeOfNameApplicationController } from "~/scripts/components/services/ChangeOfNameApplicationController"
  import type { IPropsApplication } from "~/scripts/props/PropsApplication"

  const props = defineProps<IPropsApplication>()

  const emit = defineEmits(["applicationId"])

  const resolutionsRef = ref(null)

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
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/ChangeOfNameApplication" as *;
</style>
