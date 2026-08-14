<template>
  <div
    id="company-service-no-constitution-service"
    class="company-services"
  >
    <CompanyServiceWrapper
      ref="wrapperRef"
      v-bind="controller.serviceWrapperProps"
      @preview="controller.onPreview()"
      @shrouded="controller.onShrouded()"
      @go-to-page="controller.goToPage($event)"
      @scroll="controller.handleScroll()"
    >
      <template #resolutions>
        <TransitionGroup
          name="flip"
          tag="div"
          class="documents"
        >
          <ThirdSchedule ref="thirdScheduleRef" />
        </TransitionGroup>
      </template>
    </CompanyServiceWrapper>
  </div>
</template>

<script setup lang="ts">
  import ThirdSchedule from "../LegalDocuments/ThirdSchedule.vue"
  import CompanyServiceWrapper from "@/components/CompanyServices/CompanyServiceWrapper.vue"
  import { ThirdScheduleActServiceController } from "~/scripts/components/company-services/ThirdScheduleActServiceController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits(["doneLoading"])

  const wrapperRef = ref(null)

  const controller = new ThirdScheduleActServiceController(props.companyId, emit)

  onMounted(async () => {
    await nextTick()
    controller.handleDisplayedPage()
    window.addEventListener("keydown", controller.handleKeyDown.bind(controller))
  })

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", controller.handleKeyDown.bind(controller))
  })

  watch(
    wrapperRef,
    (newVal) => {
      controller.setWrapperRef(newVal)
    },
    { immediate: true }
  )

  defineExpose({
    isDoneLoading: controller.isDoneLoading.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CompanyServices/Service" as *;
</style>
