<template>
  <Transition class="slide-left">
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
            <div class="entity-name">
              {{ selectedUser ? selectedUser.name : selectedCompany?.name }}
            </div>
            <div
              class="badge-container"
              v-if="controller.isSelectedUser"
            >
              <span
                class="badge gender"
                :class="controller.selectedUser.value?.gender.toLowerCase()"
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
            <div class="icon">
              <i class="fa-regular fa-envelope" />
            </div>
            <span
              class="action-link"
              @click="controller.onEmailClicked(controller.selectedUserMail)"
            >
              {{ controller.selectedUserMail }}
            </span>
          </div>

          <div class="contact-item">
            <div class="icon">
              <i class="fa-brands fa-whatsapp" />
            </div>
            <span>{{ controller.selectedUserPhone }}</span>
          </div>

          <div class="contact-item">
            <div class="icon">
              <i class="fa-regular fa-location-dot" />
            </div>
            <div>
              <div>{{ controller.selectedUserAddress.toUpperCase() }}</div>
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

      <div
        v-if="controller.isSelectedCompany"
        class="content-details"
      >
        <!-- Nature & Proximity Badges -->
        <div class="flex flex-wrap gap-1.5">
          <span
            class="px-2.5 py-1 rounded-lg font-semibold border"
            :style="{
              borderColor: BUSINESS_NATURE_COLORS[selectedCompany.businessNature]?.hex,
              color: BUSINESS_NATURE_COLORS[selectedCompany.businessNature]?.hex,
              backgroundColor: `${BUSINESS_NATURE_COLORS[selectedCompany.businessNature]?.hex}15`,
            }"
          >
            {{ selectedCompany.businessNature }}
          </span>

          <span
            v-if="selectedCompany.proximityTier"
            class="px-2.5 py-1 rounded-lg font-medium border"
            :style="{
              borderColor: PROXIMITY_COLORS[selectedCompany.proximityTier]?.hex,
              color: PROXIMITY_COLORS[selectedCompany.proximityTier]?.hex,
              backgroundColor: `${PROXIMITY_COLORS[selectedCompany.proximityTier]?.hex}15`,
            }"
          >
            {{ selectedCompany.officeDistanceKm }} km from Office ({{ selectedCompany.proximityTier }})
          </span>

          <span
            class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
          >
            {{ selectedCompany.state }}
          </span>
        </div>

        <!-- SSM & Registration Info -->
        <div
          class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 grid grid-cols-2 gap-2"
        >
          <div>
            <span class="text-[10px] text-slate-400 uppercase tracking-wider block">SSM Reg No.</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200 font-mono text-[11px]">
              {{ selectedCompany.regNo }}
            </span>
          </div>

          <div>
            <span class="text-[10px] text-slate-400 uppercase tracking-wider block">Paid-Up Capital</span>
            <span class="font-semibold text-emerald-600 dark:text-emerald-400">
              {{ selectedCompany.paidUpCapital }}
            </span>
          </div>

          <div>
            <span class="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Year</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">{{ selectedCompany.establishedYear }}</span>
          </div>

          <div>
            <span class="text-[10px] text-slate-400 uppercase tracking-wider block">Total Governance</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">
              {{ selectedCompany.directorsCount }} Dir &bull; {{ selectedCompany.shareholdersCount }} Sh &bull;
              {{ selectedCompany.officersCount }} Off
            </span>
          </div>
        </div>

        <!-- Location & Address -->
        <div class="space-y-2 text-slate-600 dark:text-slate-300">
          <div class="flex items-start gap-2">
            <MapPinIcon class="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <div>{{ selectedCompany.address }}</div>
              <div class="text-[11px] text-slate-400">{{ selectedCompany.city }}, {{ selectedCompany.state }}</div>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <MailIcon class="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <a
              :href="`mailto:${selectedCompany.contactEmail}`"
              class="text-sky-600 dark:text-sky-400 hover:underline truncate"
            >
              {{ selectedCompany.contactEmail }}
            </a>
          </div>

          <div class="flex items-center gap-2">
            <PhoneIcon class="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{{ selectedCompany.contactPhone }}</span>
          </div>
        </div>

        <!-- Associated Users / Officers from Database -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Affiliated Personnel ({{ affiliatedPersonnel.length }})
            </span>
          </div>

          <div class="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
            <div
              v-for="u in affiliatedPersonnel"
              :key="u.id"
              class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 flex items-center justify-between text-xs"
            >
              <div>
                <div class="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{{ u.name }}</span>
                  <span
                    v-if="(u.appointments?.length ?? 0) > 1"
                    class="text-[9px] bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 px-1 py-0.2 rounded font-medium"
                  >
                    Multi-Entity
                  </span>
                </div>
                <div class="text-[10px] text-slate-400">
                  {{ u.appointments?.find((a) => a.companyId === selectedCompany?.id)?.role || u.role }} &bull;
                  {{ u.gender }}, {{ u.age != null ? `${u.age} y/o` : "Age Unknown" }}
                </div>
              </div>

              <button
                @click="handleSelectUser(u)"
                class="px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-md font-semibold text-[10px] hover:bg-amber-500 hover:text-white transition-colors"
              >
                Locate
              </button>
            </div>

            <div
              v-if="affiliatedPersonnel.length === 0"
              class="text-slate-400 text-xs italic py-1"
            >
              No individual user records mapped for this entity.
            </div>
          </div>
        </div>

        <!-- Action button -->
        <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          <button
            @click="handleFlyToEntity(selectedCompany.lat, selectedCompany.lng, 15)"
            class="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <NavigationIcon class="w-3.5 h-3.5" />
            <span>Center Company on Map</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
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
