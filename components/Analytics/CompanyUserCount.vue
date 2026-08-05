<template>
  <div
    id="analytics-company-user-count"
    :class="{ 'is-loading': controller.isLoading.value }"
  >
    <div class="item company">
      <div class="title">Companies with iCompany</div>
      <div class="count-to-container">
        <div class="count-to">
          <VueCountUp
            id="company-total"
            :start-val="0"
            :end-val="controller.totalNumberOfCompanies.value"
            :decimals="0"
            :duration="3"
          />
          <div class="subtext">Total</div>
        </div>
        <div class="count-to">
          <VueCountUp
            id="incorp-count"
            class="total"
            :start-val="0"
            :end-val="controller.totalIncorporated.value"
            :decimals="0"
            :duration="3"
          />
          <div class="subtext">Incorporated</div>
        </div>
        <div class="count-to">
          <VueCountUp
            id="switch-count"
            class="total"
            :start-val="0"
            :end-val="controller.totalSwitched.value"
            :decimals="0"
            :duration="3"
          />
          <div class="subtext">Switched</div>
        </div>
      </div>
    </div>

    <div class="item user hide-on-xs">
      <div class="title">Registered Users</div>
      <div class="count-to-container">
        <div class="count-to">
          <VueCountUp
            id="to-date"
            :start-val="0"
            :end-val="controller.totalNumberOfUsers.value"
            :decimals="0"
            :duration="3"
          />
          <div class="subtext">Completed eKYC</div>
        </div>
        <div class="count-to">
          <VueCountUp
            id="to-date"
            :start-val="0"
            :end-val="controller.totalSignUpsThisMonth.value"
            :decimals="0"
            :duration="3"
          />
          <div class="subtext">in {{ controller.currentMonth }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import VueCountUp from "vue-countup-v3"
  import { CompanyUserCountController } from "~/scripts/components/analytics/CompanyUserCountController"
  import type { IPropsAnalyticsDistribution } from "~/scripts/props/PropsAnalyticsDistribution"

  const props = defineProps<IPropsAnalyticsDistribution>()
  const emit = defineEmits([])

  const controller = new CompanyUserCountController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Analytics/CompanyUserCount" as *;
</style>
