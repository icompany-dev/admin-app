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
              <div v-if="controller.isApprovalReceived">
                <b>{{ controller.completedLabel }} :</b>
                {{ controller.approvalDate }}
              </div>
              <div>
                <b>{{ controller.latestSignatureLabel }} :</b>
                {{ controller.approvalDate }}
              </div>
            </div>
          </template>
          <template #nodeActions>
            <div class="action-button-options">
              <div class="btn btn-pill btn-submit selected">//status</div>
            </div>
          </template>
        </ApplicationNode>
      </template>
    </ServiceApplication>
  </div>
</template>

<script lang="ts" setup>
  import ApplicationNode from "./ApplicationNode.vue"
  import ServiceApplication from "./ServiceApplication.vue"
  import { ChangeOfNameApplicationController } from "~/scripts/components/services/ChangeOfNameApplicationController"
  import type { IPropsApplication } from "~/scripts/props/PropsApplication"

  const props = defineProps<IPropsApplication>()

  const emit = defineEmits([])

  const controller = new ChangeOfNameApplicationController(props, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/ChangeOfNameApplication" as *;
</style>
