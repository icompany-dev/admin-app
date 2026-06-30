<template>
  <div
    ref="serviceStepsRef"
    id="company-services-steps"
    :class="{ 'is-visible': !controller.isCurrentStepPayment() }"
  >
    <div class="steps">
      <div
        v-if="!props.isPascaInPasca"
        class="step"
        :class="{ active: controller.isCurrentStepPayment(), completed: controller.hasPaid.value }"
      >
        <div class="node-container">
          <div class="node"></div>
        </div>
        <div class="content">
          <div class="label">{{ controller.paymentLabel() }}:</div>
          <div class="details">
            <span v-if="!controller.hasPaid.value">
              {{ controller.priceFrom() }} RM {{ controller.price.value.toFixed(2) }}
            </span>

            <div v-if="controller.hasPaid.value">
              <b>{{ controller.paymentReceived() }}:</b>
              <br />
              <span
                class="step-date"
                v-if="controller.paymentDate.value"
              >
                {{ controller.paymentDate.value }}
                <i class="check-icon fa-solid fa-circle-check"></i>
              </span>
              <div class="step-buttons">
                <button
                  class="btn btn-submit"
                  @click="controller.onReceiptClicked()"
                >
                  {{ controller.downloadReceiptButtonLabel() }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="step"
        :class="{ active: controller.isCurrentStepAffirmation(), completed: controller.isAffirmationCompleted() }"
      >
        <div class="node-container">
          <div class="node"></div>
        </div>
        <div class="content">
          <div class="label">{{ controller.affirmationLabel() }}:</div>
          <div
            class="details"
            v-if="!controller.hasCustomAffirmation.value"
          >
            <div v-if="!controller.haveMajorityReached.value">
              <b>{{ controller.directorLabel() }}:</b>
              <div
                v-if="props.isDcr"
                class="signature-markers"
              >
                <div
                  class="signature-marker"
                  v-for="(director, index) in controller.directorNumberRanges.value"
                  :key="index"
                  :class="{ signed: controller.hasDirectorAtIndexSigned(director) }"
                >
                  <i class="fa-solid fa-user" />
                </div>
              </div>
              <div
                v-if="!props.isDcr"
                class="signature-notes"
              >
                {{ controller.notRequiredLabel() }}
              </div>
              <b>{{ controller.shareholderLabel() }}:</b>
              <div
                v-if="props.isMcr"
                class="signature-markers"
              >
                <div
                  class="signature-marker"
                  v-for="(shareholder, index) in controller.shareholderNumberRanges.value"
                  :key="index"
                  :class="{ signed: controller.hasDirectorAtIndexSigned(shareholder) }"
                >
                  <i class="fa-solid fa-user" />
                </div>
              </div>
              <div
                v-if="!props.isMcr"
                class="signature-notes"
              >
                {{ controller.notRequiredLabel() }}
              </div>
            </div>

            <div v-if="controller.hasUserSigned.value && !controller.haveMajorityReached.value">
              <br />
              <b>{{ controller.affirmationReceived() }}:</b>
              <br />
              <span class="step-date">
                {{ controller.getSignatureDate() }}
                <i class="check-icon fa-solid fa-circle-check"></i>
              </span>
            </div>

            <div v-if="controller.haveMajorityReached.value">
              <b>{{ controller.affirmationReceived() }}:</b>
              <br />
              <span class="step-date">
                {{ controller.getSignatureDate() }}
                <i class="check-icon fa-solid fa-circle-check"></i>
              </span>
            </div>
          </div>
          <div
            class="details"
            v-id="controller.hasCustomAffirmation.value"
          >
            <slot name="customAffirmation" />
          </div>
        </div>
      </div>

      <div
        class="step"
        :class="{ active: controller.isCurrentStepStatus(), completed: controller.isPendingConfirmation.value }"
      >
        <div class="node-container">
          <div class="node"></div>
        </div>
        <div class="content">
          <div class="label">{{ controller.statusLabel() }}:</div>
          <div class="details">
            <slot
              name="statusDetails"
              :isActive="controller.isCurrentStepStatus()"
            />
          </div>
        </div>
      </div>

      <div
        v-if="!props.isPascaInPasca"
        class="step"
        :class="{ active: controller.isCurrentStepConfirmation(), completed: controller.isConfirmed.value }"
      >
        <div class="node-container">
          <div class="node"></div>
        </div>
        <div class="content">
          <div class="label">{{ controller.confirmationLabel() }}:</div>
          <div
            class="details"
            v-if="props.useDefaultConfirmation"
          >
            <div v-if="controller.isCurrentStepConfirmation() && !controller.isConfirmed.value">
              <b>{{ controller.resolvedResolutionCopywriting() }}</b>
            </div>

            <div
              v-if="controller.isCurrentStepConfirmation() && !controller.isConfirmed.value"
              class="step-buttons"
            >
              <button
                class="btn btn-danger"
                @click="emit('revoke')"
              >
                {{ controller.confirmationButtonRevokeLabel() }}
              </button>
              <button
                class="btn btn-submit"
                @click="emit('accept')"
              >
                {{ controller.confirmationButtonAcceptLabel() }}
              </button>
            </div>

            <div
              v-if="controller.isCurrentStepConfirmation() && !controller.isConfirmed.value"
              class="confirmation-step-notes"
              v-html="controller.confirmationStepsNotesCopywriting()"
            />

            <span v-if="controller.isConfirmed.value">
              {{ controller.completedLabel() }}:
              <br />
              <span class="step-date">
                {{ controller.completedApplicationDate.value }}
                <i class="check-icon fa-solid fa-circle-check"></i>
              </span>
            </span>
          </div>
          <div
            class="details"
            v-if="!props.useDefaultConfirmation"
          >
            <slot name="customConfirmation" />
          </div>
        </div>
      </div>

      <div
        v-if="!props.isPascaInPasca"
        class="step"
        :class="{ active: controller.isCurrentStepArchive() }"
      >
        <div class="node-container">
          <div class="node"></div>
        </div>
        <div class="content">
          <div class="label">{{ controller.archiveLabel() }}:</div>
          <div class="details">
            <div
              v-if="controller.isCurrentStepArchive()"
              class="step-buttons"
            >
              <button
                class="btn btn-submit"
                @click="controller.onDocumentsClicked()"
              >
                {{ controller.documentButtonLabel() }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ReceiptInvoice
      ref="receiptRef"
      :payment-order="controller.paymentOrderForReceipt.value"
      :payment-order-id="controller.paymentOrderIdForReceipt.value ?? ''"
    />
  </div>
</template>

<script setup lang="ts">
  import ReceiptInvoice from "@/components/Payments/ReceiptInvoice.vue"
  import { ServiceStepsController } from "~/scripts/components/company-services/ServiceStepsController"
  import { Application } from "~/scripts/models/Application"
  import type { IPropsServiceStep } from "~/scripts/props/PropsServiceStep"

  const props = defineProps<IPropsServiceStep>()

  const emit = defineEmits(["revoke", "accept"])

  const receiptRef = ref(null)
  const serviceStepsRef = ref(null)

  const controller = new ServiceStepsController(
    props.application as Application,
    props.target,
    props.price,
    props.hasPaid,
    props.haveAllSigned,
    props.hasUserSigned,
    props.signatureDate,
    props.isDcr,
    props.isMcr,
    props.numberOfDirectors,
    props.numberOfShareholders,
    props.canSkipToConfirmation,
    props.hasMajorityRule,
    props.hasCustomAffirmation
  )

  watch(
    () => props.application,
    (newVal) => {
      controller.setApplication(newVal as Application)
    },
    { deep: true }
  )

  watch(
    () => props.target,
    (newVal) => {
      controller.setTarget(newVal)
    }
  )

  watch(
    () => props.price,
    (newVal) => {
      controller.price.value = newVal
      controller.setValues()
    }
  )

  watch(
    () => props.hasPaid,
    (newVal) => {
      controller.hasPaid.value = newVal
      controller.setValues()
    }
  )

  watch(
    () => props.haveAllSigned,
    (newVal) => {
      controller.haveMajorityReached.value = newVal
      controller.setValues()
    }
  )

  watch(
    () => props.hasUserSigned,
    (newVal) => {
      controller.hasUserSigned.value = newVal
      controller.setValues()
    }
  )

  watch(
    () => props.signatureDate,
    (newVal) => {
      controller.signatureDate.value = newVal
      controller.setValues()
    }
  )

  watch(
    () => props.isDcr,
    (newVal) => {
      controller.hasDcr.value = newVal
      controller.setValues()
    }
  )

  watch(
    () => props.isMcr,
    (newVal) => {
      controller.hasMcr.value = newVal
      controller.setValues()
    }
  )

  watch(
    () => props.numberOfDirectors,
    (newVal) => {
      controller.numberOfDirectors.value = newVal
      controller.setValues()
    }
  )

  watch(
    () => props.numberOfShareholders,
    (newVal) => {
      controller.numberOfShareholders.value = newVal
      controller.setValues()
    }
  )

  watch(
    () => props.canSkipToConfirmation,
    (newVal) => {
      controller.setCanSkipToConfirmation(newVal)
    }
  )

  watch(
    () => props.hasMajorityRule,
    (newVal) => {
      controller.hasMajorityRule.value = newVal
      controller.setValues()
    }
  )

  watch(
    () => props.hasCustomAffirmation,
    (newVal) => {
      controller.setHasCustomAffirmation(newVal)
    }
  )

  watch(
    serviceStepsRef,
    (newVal) => {
      controller.setServiceStepsRef(newVal)
    },
    { immediate: true }
  )

  watch(
    receiptRef,
    (newVal) => {
      if (newVal) {
        controller.setReceiptRef(newVal)
      }
    },
    { immediate: true }
  )

  defineExpose({
    setValues: controller.setValues.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/ServiceSteps" as *;
</style>
