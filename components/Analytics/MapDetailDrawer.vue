<template>
  <div
    id="analytics-map-detail-drawer"
    v-if="controller.selectedUser.value || controller.selectedCompany.value"
    class="drawer-wrapper"
  >
    <div class="header">
      <div class="header-title">
        <div
          class="icon"
          :class="controller.isSelectedUser ? 'user' : 'company'"
        >
          <i
            class="fa-solid"
            :class="controller.isSelectedUser ? 'fa-user' : 'fa-building'"
          />
        </div>
        <div class="details">
          <span class="entity-type">
            {{ selectedUser ? "User Profile" : "Company Entity" }}
          </span>
          <h3 class="entity-name">
            {{ selectedUser ? selectedUser.name : selectedCompany?.name }}
          </h3>
        </div>
      </div>
      <button
        @click="controller.handleClose()"
        class="close-button"
      >
        <i class="fa-solid fa-xmark" />
      </button>
    </div>

    <!-- USER DETAILS -->
    <div
      v-if="controller.isSelectedUser"
      class="content-details"
    >
      <!-- Role & Demographics Badges -->
      <div class="badge-container">
        <span
          v-for="role in controller.selectedUserRoles"
          :key="role"
          class="badge role"
          :class="controller.roleClass(role)"
        >
          {{ role }}
        </span>

        <span
          class="badge gender"
          :class="controller.selectedUser.value?.gender"
        >
          {{ controller.selectedUser.value?.gender }}
        </span>

        <span
          class="badge age-group"
          :class="controller.selectedUserAgeGroupClass"
        >
          {{ controller.selectedUserAge }}
        </span>

        <span class="badge">
          {{ controller.selectedUserActiveStatus }}
        </span>
      </div>

      <!-- Affiliated Companies & Appointments List -->
      <div class="item-container">
        <div class="item-title-container">
          <span class="item-title">Corporate Appointments ({{ controller.selectedUserAppointments.length }})</span>
        </div>

        <div class="item-content">
          <div
            v-for="(appt, idx) in controller.selectedUserAppointments"
            :key="`${appt.companyId}-${idx}`"
            class="company-detail-container"
          >
            <div class="company-detail">
              <div class="company-name">
                {{ appt.companyName }}
              </div>
              <div class="role-details">
                <span
                  class="badge role"
                  :class="controller.roleClass(appt.role)"
                >
                  {{ appt.role }}
                </span>
                <span
                  v-if="appt.shareholdingPercent"
                  class="shareholding"
                >
                  {{ appt.shareholdingPercent }} equity
                </span>
              </div>
            </div>

            <button
              v-if="controller.getCompanyById(appt.companyId)"
              @click="controller.handleSelectCompany(controller.getCompanyById(appt.companyId)!)"
              class="locate-button"
              title="Locate company on map"
            >
              <span>Locate</span>
              <i class="fa-solid fa-arrow-right" />
            </button>
          </div>
        </div>
      </div>

      <!-- Contact & Location Info -->
      <div class="contact-details-container">
        <div class="contact-item">
          <i class="fa-regular fa-envelope icon" />
          <span
            class="action-link"
            @click="controller.onEmailClicked(controller.selectedUserMail)"
          >
            {{ controller.selectedUserMail }}
          </span>
        </div>

        <div class="contact-item">
          <i class="fa-brands fa-whatsapp icon" />
          <span>{{ controller.selectedUserPhone }}</span>
        </div>

        <div class="contact-item">
          <i class="fa-regular fa-location-dot icon" />
          <div>
            <div>{{ controller.selectedUserAddress }}</div>
          </div>
        </div>
      </div>

      <!-- Quick Fly Action -->
      <div class="quick-fly-container">
        <button
          @click="controller.handleFlyToEntity(controller.selectedUserLat, controller.selectedUserLng, 15)"
          class="fly-button"
        >
          <i class="fa-regular fa-paper-plane" />
          <span>Center User on Map</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { MapDetailDrawerController } from "~/scripts/components/analytics/MapDetailDrawerController"
  import type { IPropsMapDetailDrawer } from "~/scripts/props/PropsMapDetailDrawer"

  const props = defineProps<IPropsMapDetailDrawer>()

  const emit = defineEmits(["selectUser", "selectCompany", "close", "flyTo"])

  const controller = new MapDetailDrawerController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Analytics/MapDetailDrawer" as *;
</style>
