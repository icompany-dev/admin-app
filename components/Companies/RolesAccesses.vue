<template>
  <div id="companies-roles-accesses">
    <TransitionGroup name="fade">
      <div
        class="loader-container"
        v-if="controller.isLoadingPage"
      >
        <LoaderPrepare
          :label="controller.loaderLabel"
          :sublabel="controller.loaderSublabel"
        />
      </div>
      <div
        class="roles-accesses"
        v-if="!controller.isLoadingPage"
      >
        <div
          class="no-record-container"
          v-if="!controller.hasAdditionalRoles"
        >
          <NoRecord
            :title="controller.noRecordLabel"
            :subtitle="controller.noRecordSublabel"
          />
        </div>
        <div
          class="user-access-roles"
          v-if="controller.hasAdditionalRoles"
        >
          <div
            class="user-access-role"
            v-for="(userAccessRole, i) in controller.nonDirectorsAndShareholders"
          >
            <div class="user-image">
              <img
                :src="userAccessRole.user?.detail?.image?.url"
                :alt="'LOGO'"
              />
            </div>
            <div class="user-name">{{ userAccessRole.user?.name ?? "UNKNOWN BUGGER" }}</div>
            <div class="user-roles">{{ userAccessRole.getRoleName() }}</div>
            <div
              class="remove"
              @click="controller.onRemoveAccessClicked(userAccessRole)"
            >
              {{ controller.removeLabel }}
            </div>
          </div>
          <div
            class="user-access-role pending"
            v-for="(userInvitation, i) in controller.userInvitations.value"
          >
            <div class="pending-marker">Pending</div>
            <div class="user-image">
              <img
                v-if="controller.hasImage(controller.getUserImage(userInvitation))"
                :src="controller.getUserImage(userInvitation)"
                :alt="'LOGO'"
              />
            </div>
            <div class="user-name">{{ userInvitation.name ?? "UNKNOWN BUGGER" }}</div>
            <div class="user-roles">{{ userInvitation.accessRole.name }}</div>
            <div
              class="remove"
              @click="controller.onRemoveInvitationClicked(userInvitation)"
            >
              {{ controller.removeLabel }}
            </div>
          </div>
          <div class="user-access-role empty">
            <i class="fa-solid fa-plus" />
          </div>
        </div>
      </div>
      <ActionTray :actions="controller.actionTrayElements" />
    </TransitionGroup>
    <CreateNewAccessRole
      ref="createAccessRoleRef"
      :company-id="controller.companyId.value"
    />
    <AssignRole
      ref="assignRoleRef"
      v-bind="controller.assignRoleProps"
      @proceed="controller.onRoleAssigned()"
    />
    <ConfirmToDelete
      ref="confirmToDeleteRef"
      :remove-item-name="controller.itemToRemoveName"
      @back="controller.onCancelRemove()"
      @proceed="controller.onProceedRemove()"
    />
  </div>
</template>

<script lang="ts" setup>
  import ActionTray from "../ActionTrays/ActionTray.vue"
  import AssignRole from "../Popups/AssignRole.vue"
  import ConfirmToDelete from "../Popups/ConfirmToDelete.vue"
  import CreateNewAccessRole from "../Popups/CreateNewAccessRole.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import NoRecord from "../Placeholders/NoRecord.vue"
  import { RolesAccessesController } from "~/scripts/components/companies/RolesAccessesController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const createAccessRoleRef = ref(null)
  const assignRoleRef = ref(null)
  const confirmToDeleteRef = ref(null)

  const controller = new RolesAccessesController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )

  watch(
    createAccessRoleRef,
    (newVal) => {
      controller.setCreateAccessRoleRef(newVal)
    },
    { immediate: true }
  )

  watch(
    assignRoleRef,
    (newVal) => {
      controller.setAssignRoleRef(newVal)
    },
    { immediate: true }
  )

  watch(
    confirmToDeleteRef,
    (newVal) => {
      controller.setConfirmToDeleteRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/RolesAccesses" as *;
</style>
