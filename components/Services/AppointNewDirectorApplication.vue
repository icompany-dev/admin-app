<template>
  <div id="services-appoint-new-director-application">
    <ServiceApplication
      ref="serviceApplicationRef"
      v-bind="controller.serviceApplicationProps"
      @paymentNodeSelected="controller.onPaymentStepClicked()"
      @show="controller.onShowPanel()"
      @hide="emit('hide')"
      @download="emit('download', $event)"
    >
      <template #application>
        <ApplicationNode
          v-bind="controller.applicationDetailsNodeProps"
          @click="controller.onApplicationDetailsClicked()"
        >
          <template #nodeContent>
            <div class="application-container">
              <div class="node-title">
                {{ controller.applicationDetailsLabel }}
              </div>
              <div class="node-subtitle">
                {{ controller.applicationDetailsSublabel }}
              </div>
            </div>
            <div class="application-details">
              <template v-for="invitation in controller.directorInvitations">
                <Director v-bind="controller.getInvitationDetailProp(invitation)" />
              </template>

              <template v-if="controller.hasOtherRequirements">
                <br />
                <br />
                <b>{{ controller.itemsToPrepareLabel }}</b>
                <ol>
                  <li
                    v-for="(item, i) in controller.itemsToPrepare"
                    :key="i"
                  >
                    {{ item }}
                  </li>
                </ol>
              </template>
            </div>
          </template>
          <template #nodeOptions>
            <button
              class="btn btn-pill btn-primary"
              @click="controller.onDownloadClicked()"
            >
              {{ controller.downloadLabel }}
            </button>
          </template>
          <template #nodeActions>
            <button
              class="btn btn-pill btn-submit"
              :class="{ 'is-loading': controller.isApproving.value }"
              :disabled="controller.isApproving.value"
              @click="controller.onApprovedClicked()"
            >
              {{ controller.approveLabel }}
            </button>
          </template>
        </ApplicationNode>
        <ApplicationNode
          v-if="controller.isDeliveryRequired"
          v-bind="controller.deliveryNodeProps"
          @click="controller.onApplicationDetailsClicked()"
        >
          <template #nodeContent>
            <div class="application-container">
              <div class="node-title">
                {{ controller.deliveryLabel }}
              </div>
              <div class="node-subtitle">
                {{ controller.deliverySublabel }}
              </div>
            </div>
            <div class="application-details">
              <b>{{ controller.deliverMethodLabel }}</b>
              <br />
              {{ controller.deliveryMethod }}
              <br />
              <br />
              <b>{{ controller.deliverToLabel }}</b>
              <br />
              <span v-html="controller.deliveryAddress" />
              <CopyValue :value="controller.deliveryAddressToCopy" />
            </div>
          </template>
          <!--This will be where the print slips be-->
          <template #nodeOptions></template>
          <template #nodeActions>
            <button
              class="btn btn-pill btn-submit"
              @click="controller.onShippedClicked()"
            >
              {{ controller.shipLabel }}
            </button>
          </template>
        </ApplicationNode>
        <ApplicationNode
          v-bind="controller.completedNodeProps"
          @click="controller.onApplicationDetailsClicked()"
        >
          <template #nodeContent>
            <div class="application-container">
              <div class="node-title">
                {{ controller.applicationCompletedLabel }}
              </div>
              <div class="node-subtitle">
                {{ controller.completedSublabel }}
              </div>
            </div>
          </template>
          <template #nodeOptions></template>
          <template #nodeActions>
            <button
              class="btn btn-pill btn-submit"
              @click="controller.onCompleteClicked()"
            >
              {{ controller.markCompletedLabel }}
            </button>
          </template>
        </ApplicationNode>
      </template>
    </ServiceApplication>
    <PopupShipApplication
      v-bind="controller.shipApplicationProps"
      ref="shipApplicationRef"
      @proceed="controller.onProceedShipped()"
    />
  </div>
</template>

<script lang="ts" setup>
  import ApplicationNode from "./ApplicationNode.vue"
  import CopyValue from "../Buttons/CopyValue.vue"
  import Director from "../Invitations/Director.vue"
  import PopupShipApplication from "@/components/Popups/ShipApplication.vue"
  import PopupUploadDocument from "@/components/Popups/UploadDocument.vue"
  import ServiceApplication from "./ServiceApplication.vue"
  import { AppointNewDirectorApplicationController } from "~/scripts/components/services/AppointNewDirectorApplicationController"

  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import type { IPropsApplication } from "~/scripts/props/PropsApplication"

  const props = defineProps<IPropsApplication>()

  const resolutionsRef = ref(null)
  const shipApplicationRef = ref(null)
  const serviceApplicationRef = ref(null)

  const emit = defineEmits(EmitMessages.APPLICATION_SERVICES)

  const controller = new AppointNewDirectorApplicationController(props, emit)

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
    shipApplicationRef,
    (newVal) => {
      controller.setShipApplicationRef(newVal)
    },
    { immediate: true }
  )

  watch(
    serviceApplicationRef,
    (newVal) => {
      controller.setServiceApplicationRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    expand: controller.expand.bind(controller),
    collapse: controller.collapse.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/AppointNewDirectorApplication" as *;
</style>
