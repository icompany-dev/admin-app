<template>
  <div id="page-secretarial-services">
    <div class="page-header">
      <BreadCrumb v-bind="pageController.breadCrumbProps" />
      <div class="page-navigations">
        <TableFilters
          v-bind="pageController.tableFilterProps"
          @search="pageController.onSearchInput($event)"
          @order="pageController.onSortOrderChanged($event)"
          @clearSearch="pageController.onSearchInput('')"
          @unMinimize="pageController.onClearSelected()"
        />
        <AddApplication
          v-bind="pageController.createNewApplicationProps"
          @proceed="pageController.onProceedCreateApplication()"
        />
      </div>
    </div>
    <Applications
      ref="applicationsRef"
      v-bind="pageController.secretarialServicesProps"
    />
  </div>
</template>

<script setup lang="ts">
  import AddApplication from "~/components/Buttons/AddApplication.vue"
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import TableFilters from "@/components/TableData/TableFilters.vue"
  import Applications from "@/components/SecretarialServices/Applications.vue"
  import { PageSdnBhdSecretarialServicesController } from "~/scripts/pages/PageSdnBhdSecretarialServicesController"

  const pageController = new PageSdnBhdSecretarialServicesController()

  const applicationsRef = ref(null)

  watch(
    () => pageController.route.params,
    (newVal) => {
      pageController.setTitleDescription()
    }
  )

  watch(
    applicationsRef,
    (newVal) => {
      pageController.setApplicationsRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/pages/SdnBhdSecretarialServices" as *;
</style>
