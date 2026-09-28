<template>
  <div
    id="users-user-detail"
    class="human-details"
  >
    <div class="name human-detail">
      {{ controller.name }}
      <CopyValue :value="controller.name" />
    </div>
    <div class="human-detail">
      <i class="fa-regular fa-id-card" />
      {{ controller.identificationType }}
      {{ controller.identificationNumber }}
      <CopyValue :value="controller.identificationNumber" />
    </div>
    <div class="human-detail">
      <i class="fa-brands fa-whatsapp" />
      <span class="human-detail-content">
        {{ controller.phone }}
      </span>
      <CopyValue :value="controller.phone" />
    </div>
    <div class="human-detail">
      <i class="fa-regular fa-envelope" />
      <span
        class="action-clickable"
        @click="controller.onEmailClicked()"
      >
        {{ controller.email }}
      </span>
      <CopyValue :value="controller.email" />
    </div>

    <div class="human-detail">
      <i class="fa-regular fa-user" />
      <span class="human-detail-content">
        {{ controller.race }}
      </span>
      <CopyValue :value="controller.race" />
    </div>
    <div class="human-detail align-start">
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
        {{ controller.addressPostcode }}
        <CopyValue :value="controller.addressPostcode" />
        <br />
        {{ controller.addressCity }}
        <CopyValue :value="controller.addressCity" />
        <br />
        {{ controller.addressState }}
        <CopyValue :value="controller.addressState" />
        <br />
        {{ controller.addressCountry }}
        <CopyValue :value="controller.addressCountry" />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import CopyValue from "../Buttons/CopyValue.vue"
  import { UserDetailController } from "~/scripts/components/users/UserDetailController"
  import type { IPropsUserDetail } from "~/scripts/props/PropsUserDetail"

  const props = defineProps<IPropsUserDetail>()
  const emit = defineEmits([])

  const controller = new UserDetailController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Users/UserDetail" as *;
</style>
