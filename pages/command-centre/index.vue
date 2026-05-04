<template>
  <div id="page-command-centre">
    <BreadCrumb v-bind="pageController.breadCrumbProps" />
    <div class="statistics-row">
      <div class="statistic">
        <Statistic
          ref="nameReservationStatisticRef"
          :title="pageController.nameReservationLabel"
          :statuses="pageController.nameReservationStatuses"
          :selected-status="pageController.selectedNameReservationStatus.value"
          :periods="pageController.periods"
          :selected-period="pageController.selectedNameReservationPeriod.value"
          :count="pageController.nameReservationCount.value"
          @status-selected="pageController.onNameReservationStatusSelected($event)"
          @period-selected="pageController.onNameReservationPeriodSelected($event)"
        />
      </div>
      <div class="statistic">
        <Statistic
          ref="newIncorporationStatisticRef"
          :title="pageController.newIncorporationLabel"
          :statuses="pageController.newIncorporationStatuses"
          :selected-status="pageController.selectedNewIncorporationStatus.value"
          :periods="pageController.periods"
          :selected-period="pageController.selectedNewIncorporationPeriod.value"
          :count="pageController.newIncorporationCount.value"
          @status-selected="pageController.onNewIncorporationStatusSelected($event)"
          @period-selected="pageController.onNewIncorporationPeriodSelected($event)"
        />
      </div>
      <div class="statistic">
        <Statistic
          ref="reassignmentStatisticRef"
          :title="pageController.reassignmentLabel"
          :statuses="pageController.reassignmentStatuses"
          :selected-status="pageController.selectedReassignmentStatus.value"
          :periods="pageController.periods"
          :selected-period="pageController.selectedReassignmentPeriod.value"
          :count="pageController.reassignmentCount.value"
          @status-selected="pageController.onReassignmentStatusSelected($event)"
          @period-selected="pageController.onReassignmentPeriodSelected($event)"
        />
      </div>
      <div class="statistic">
        <Statistic
          ref="usersStatisticRef"
          :title="pageController.usersLabel"
          :statuses="pageController.userStatuses"
          :selected-status="pageController.selectedUsersStatus.value"
          :periods="pageController.periods"
          :selected-period="pageController.selectedUsersPeriod.value"
          :count="pageController.usersCount.value"
          @status-selected="pageController.onUserStatusSelected($event)"
          @period-selected="pageController.onUserPeriodSelected($event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import BreadCrumb from "@/components/BreadCrumbs/Default.vue"
  import Statistic from "~/components/CommandCentres/Statistic.vue"
  import { PageCommandCentreController } from "~/scripts/pages/PageCommandCentreController"

  const nameReservationStatisticRef = ref(null)
  const newIncorporationStatisticRef = ref(null)
  const reassignmentStatisticRef = ref(null)
  const usersStatisticRef = ref(null)

  const pageController = new PageCommandCentreController()

  watch(
    nameReservationStatisticRef,
    (newVal) => {
      pageController.setNameReservationStatisticRef(newVal)
    },
    { immediate: true }
  )

  watch(
    newIncorporationStatisticRef,
    (newVal) => {
      pageController.setNewIncorporationStatisticRef(newVal)
    },
    { immediate: true }
  )

  watch(
    reassignmentStatisticRef,
    (newVal) => {
      pageController.setReassignmentStatisticRef(newVal)
    },
    { immediate: true }
  )

  watch(
    usersStatisticRef,
    (newVal) => {
      pageController.setUsersStatisticRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/pages/CommandCentre" as *;
</style>
