<template>
  <div id="page-all-sdn-bhd">
    <div class="page-header">
      <BreadCrumb v-bind="pageController.breadCrumbProps" />
      <div class="navigation-buttons">
        <TransitionGroup name="slide-left">
          <div
            class="clickable"
            v-if="pageController.canPrevious"
            @click="pageController.onPreviousClicked()"
            :title="`Previous: ${pageController.previousCompanyName.value} SDN BHD`"
          >
            <i class="fa-solid fa-circle-arrow-left" />
          </div>
          <div
            class="clickable"
            @click="pageController.onBackClicked()"
            title="Back to List"
          >
            <i class="fa-solid fa-list" />
          </div>
          <div
            class="clickable"
            v-if="pageController.canNext"
            @click="pageController.onNextClicked()"
            :title="`Next: ${pageController.nextCompanyName.value} SDN BHD`"
          >
            <i class="fa-solid fa-circle-arrow-right" />
          </div>
        </TransitionGroup>
      </div>
    </div>
    <div class="selected-company">
      <SelectedSdnBhd :company-id="pageController.companyId.value" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import SelectedSdnBhd from "~/components/Companies/SelectedSdnBhd.vue"
  import TableFilters from "~/components/TableData/TableFilters.vue"
  import { PageSdnBhdController } from "~/scripts/pages/PageSdnBhdController"

  const props = defineProps({})
  const emit = defineEmits([])

  const pageController = new PageSdnBhdController()

  watch(
    () => pageController.route.params,
    (newVal) => {
      pageController.handleRoute()
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/pages/SdnBhd" as *;
</style>
