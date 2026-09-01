<template>
  <div class="signature-pad">
    <div class="signature">
      <div
        v-if="props.isTinted"
        class="tint-overlay no-print"
      >
        {{ props.tintLabel }}
      </div>
      <img
        v-if="controller.showSignature()"
        :src="controller.getSignatureFileImage()"
      />
      <div
        v-if="!controller.showSignature()"
        class="sign-marker signature-pending no-print"
      ></div>
      <div
        class="signature-buttons no-print"
        v-if="controller.canSign()"
      >
        <button
          class="btn btn-abstain"
          @click="controller.onAbstain()"
          v-if="controller.signatureItem.value.canAbstain"
        >
          {{ controller.abstainButtonLabel() }}
        </button>
        <button
          class="btn btn-submit"
          @click="controller.onSignaturePadClicked($event)"
        >
          {{ controller.signNowButtonLabel() }}
        </button>
      </div>
    </div>
    <div class="sign-off">
      <div class="signee-name">
        {{ controller.signatureItem.value.name }}
      </div>
      <div
        class="signee-role"
        v-html="controller.signatureItem.value.role"
      />
    </div>
    <Teleport to="body">
      <div
        class="enlarged-signature-container"
        :class="{ show: controller.isSignaturePadEnlarged.value }"
      >
        <div
          class="signature-overlay"
          @click.self="controller.onCloseSignaturePadClicked()"
        ></div>
        <div
          class="signature-container"
          :style="controller.enlargedComponentStyle.value"
        >
          <!-- <div class="close-button" @click="controller.onCloseSignaturePadClicked()">
            <i class="fa-solid fa-xmark" />
          </div> -->
          <ClientOnly v-if="controller.isSignaturePadEnlarged.value">
            <NuxtSignaturePad
              ref="signaturePad"
              width="100%"
              height="70%"
            />
          </ClientOnly>
          <div class="sign-off">
            <div class="signee-name">
              {{ controller.signatureItem.value.name }}
            </div>
            <div
              class="signee-role"
              v-html="controller.signatureItem.value.role"
            />
          </div>
          <div class="action-buttons">
            <button
              class="btn btn-standard btn-danger"
              @click="controller.onClearSignature()"
            >
              {{ controller.clearButtonLabel() }}
            </button>
            <button
              class="btn btn-standard btn-submit"
              @click="controller.onSaveSignature()"
            >
              {{ controller.doneButtonLabel() }}
            </button>
          </div>
          <div class="disclaimer">
            You are affixing your signature only for this Application unless otherwise stated. Your electronic signature
            is protected with industry-standard encryption, used only for approved filings with SSM, and we never store
            your signature other than if it is required by law. if there are edits or errors occur, you may be required
            to re-sign.
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import { SignatureController } from "~/scripts/components/signatures/SignatureController"
  import { SignatureItem } from "~/scripts/types/SignatureItem"

  const props = defineProps({
    signatureItem: {
      type: SignatureItem,
      required: true,
    },
    isTinted: {
      type: Boolean,
      default: false,
    },
    tintLabel: {
      type: String,
      default: "",
    },
  })

  const emit = defineEmits(["isEnlarged", "signed", "abstain"])

  const signaturePad = ref(null)

  const controller = new SignatureController(props.signatureItem, emit)
  controller.setSignaturePad(signaturePad)
  watch(
    () => props.signatureItem,
    (newVal) => {
      controller.setSignatureItem(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Signatures/Signature" as *;
</style>
