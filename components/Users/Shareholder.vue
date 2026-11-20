<template>
  <div
    id="users-shareholder"
    class="human-details"
  >
    <template v-if="!controller.isCorporateShareholder">
      <UserDetail v-bind="controller.userDetailProps" />
      <div class="total-shares human-detail align-start">
        <i class="fa-regular fa-pie-chart" />
        <span>
          {{ controller.ordinaryShares }} Ordinary Shares
          <br />
          {{ controller.preferenceShares }} Preference Shares
        </span>
      </div>
    </template>
    <template v-if="controller.isCorporateShareholder">
      <div class="name human-detail">
        {{ controller.shareholderName }}
        <CopyValue :value="controller.shareholderName" />
      </div>
      <div class="human-detail">
        <i class="fa-regular fa-id-card" />
        {{ controller.registrationNumber }}
        <CopyValue :value="controller.registrationNumber" />
      </div>
      <!--We do not have the address at the moment-->
      <!-- <div class="human-detail align-start">
        <i class="fa-regular fa-home" />
        <span class="human-detail-content">
          {{ controller.addressLine1 }}
          <CopyValue :value="controller.addressLine1" />
          <br />
          <span v-if="controller.addressLine2.length > 0">
            {{ controller.addressLine2 }}
            <CopyValue :value="controller.addressLine2" />
            <br />
          </span>
          <span v-if="controller.addressLine3.length > 0">
            {{ controller.addressLine3 }}
            <CopyValue :value="controller.addressLine3" />
            <br />
          </span>
          {{ controller.postcode }}
          <CopyValue :value="controller.postcode" />
          <br />
          {{ controller.cityName }}
          <CopyValue :value="controller.cityName" />
          <br />
          {{ controller.stateName }}
          <CopyValue :value="controller.stateName" />
          <br />
          {{ controller.countryName }}
          <CopyValue :value="controller.countryName" />
        </span>
      </div> -->
      <div class="total-shares human-detail align-start">
        <i class="fa-regular fa-pie-chart" />
        <span>
          {{ controller.ordinaryShares }} Ordinary Shares
          <br />
          {{ controller.preferenceShares }} Preference Shares
        </span>
      </div>
      <div class="corporate-representative">
        <div class="corp-rep-label">{{ controller.corporateRepresentativeLabel }}</div>
        <UserDetail v-bind="controller.userDetailProps" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import UserDetail from "./UserDetail.vue"
  import CopyValue from "../Buttons/CopyValue.vue"
  import { ShareholderController } from "~/scripts/components/users/ShareholderController"
  import type { IPropsShareholderDetail } from "~/scripts/props/PropsShareholderDetail"

  const props = defineProps<IPropsShareholderDetail>()
  const emit = defineEmits([])

  const controller = new ShareholderController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(props)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Users/Shareholder" as *;
</style>
