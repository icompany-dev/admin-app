<template>
  <div id="companies-overview">
    <div class="company-overview-section">
      <div class="overview-title">{{ controller.businessDetailsLabel }}</div>
      <table class="overview-table">
        <tbody>
          <tr>
            <td>{{ controller.businessAddressLabel }}</td>
            <td>:</td>
            <td>
              <span
                class="address-span"
                v-html="controller.businessAddress"
              />
            </td>
          </tr>
          <tr>
            <td>{{ controller.registeredAddressLabel }}</td>
            <td>:</td>
            <td>
              <span
                class="address-span"
                v-html="controller.registeredAddress"
              />
            </td>
          </tr>
          <tr>
            <td>{{ controller.businessBranchesLabel }}</td>
            <td>:</td>
            <td>
              <span v-if="controller.branchAddresses.length <= 0">{{ controller.noneText }}</span>
            </td>
          </tr>
          <tr>
            <td>{{ controller.bankDetailLabel }}</td>
            <td>:</td>
            <td>
              <span v-if="controller.bankDetails.length <= 0">{{ controller.noneText }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="company-overview-section">
      <div class="overview-title">{{ controller.directorsLabel }}</div>
      <ol>
        <li
          v-for="(director, i) in controller.directorsDetails"
          :key="i"
        >
          <div class="human-details">
            <div class="name">{{ director.name }}</div>
            <div class="human-detail">
              <i class="fa-regular fa-envelope"></i>
              <span class="email">{{ director.email }}</span>
            </div>
            <div class="human-detail">
              <i class="fa-brands fa-whatsapp" />
              <span class="phone">{{ director.phone }}</span>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { OverviewController } from "~/scripts/components/companies/OverviewController"

  const props = defineProps({
    companyId: {
      type: String,
      required: true,
    },
  })

  const emit = defineEmits([])

  const controller = new OverviewController(props.companyId, emit)

  watch(
    () => props.companyId,
    (newVal) => {
      controller.setCompanyId(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Companies/Overview" as *;
</style>
