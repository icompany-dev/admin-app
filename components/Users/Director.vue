<template>
  <div
    id="users-director"
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
      <i class="fa-brands fa-whatsapp" />
      <span class="human-detail-content">
        {{ controller.phone }}
      </span>
      <CopyValue :value="controller.phone" />
    </div>
    <div class="human-detail">
      <i class="fa-regular fa-user" />
      <span class="human-detail-content">
        {{ controller.race }}
      </span>
      <CopyValue :value="controller.race" />
    </div>
    <div class="human-detail">
      <i class="fa-regular fa-venus-mars" />
      <span class="human-detail-content">
        {{ controller.gender.toUpperCase() }}
      </span>
      <CopyValue :value="controller.gender" />
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
        {{ controller.addressPostcode }} {{ controller.addressCity }}
        <CopyValue :value="controller.addressPostcode" />
        <br />
        {{ controller.addressState }} {{ controller.addressCountry }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import CopyValue from "@/components/Buttons/CopyValue.vue"
  import { DirectorController } from "~/scripts/components/users/DirectorController"
  import type { IPropsUserDetail } from "~/scripts/props/PropsUserDetail"

  const props = defineProps<IPropsUserDetail>()

  const emit = defineEmits([])

  const controller = new DirectorController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Users/User" as *;
  @use "~/assets/scss/components/Users/Director" as *;
</style>
