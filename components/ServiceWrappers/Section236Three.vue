<template>
  <div
    id="service-wrappers-section236-three"
    class="cosec-service-documents"
  >
    <div class="documents-section">
      <TransitionGroup
        name="flip"
        tag="div"
        class="document-transition-wrapper"
      >
        <Section236Three
          ref="documentRef"
          :company-name="controller.companyName.value"
          :company-registration-number-new="controller.registrationNumberNew.value"
          :company-registration-number-old="controller.registrationNumberOld.value"
        />
      </TransitionGroup>
    </div>
    <ActionTray :actions="controller.actionTrayElements" />
  </div>
</template>

<script lang="ts" setup>
  import ActionTray from "@/components/ActionTrays/ActionTray.vue"
  import Section236Three from "@/components/LegalDocuments/Section236Three.vue"
  import { Section236ThreeController } from "~/scripts/components/service-wrappers/Section236ThreeController"

  const props = defineProps({
    companyName: {
      type: String,
      required: true,
    },
    registrationNumberNew: {
      type: String,
      required: true,
    },
    registrationNumberOld: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(["back"])

  const documentRef = ref(null)

  const controller = new Section236ThreeController(
    props.companyName,
    props.registrationNumberNew,
    props.registrationNumberOld,
    emit
  )

  watch(
    () => props.companyName,
    (newVal) => {
      controller.setCompanyName(newVal)
    }
  )

  watch(
    () => props.registrationNumberNew,
    (newVal) => {
      controller.setRegistrationNumberNew(newVal)
    }
  )

  watch(
    () => props.registrationNumberOld,
    (newVal) => {
      controller.setRegistrationNumberOld(newVal)
    }
  )

  watch(
    documentRef,
    (newVal) => {
      controller.setDocumentRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Services/CosecServiceDocuments" as *;
  @use "~/assets/scss/components/ServiceWrappers/Section236Three" as *;
</style>
