<template>
  <div id="companies-overview">
    <div class="company-overview-section">
      <div class="overview-title">{{ controller.businessDetailsLabel }}</div>
      <table class="overview-table">
        <tbody>
          <tr>
            <td>{{ controller.incorporatedAtLabel }}</td>
            <td>:</td>
            <td>
              {{ controller.incorporatedAtDate }}
            </td>
          </tr>
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
              <ol>
                <li v-for="(branchAddress, i) in controller.branchAddresses">
                  <span
                    class="address-span"
                    v-html="branchAddress"
                  />
                </li>
              </ol>
            </td>
          </tr>
          <tr>
            <td>{{ controller.bankDetailLabel }}</td>
            <td>:</td>
            <td>
              <span v-if="controller.bankDetails.length <= 0">{{ controller.noneText }}</span>
              <ol
                class="bank-details"
                v-if="controller.bankDetails.length > 0"
              >
                <li
                  v-for="(companyBank, i) in controller.bankDetails"
                  :key="i"
                >
                  <div class="bank-account-detail">
                    <div class="name">
                      <b>{{ companyBank.bank.name }}</b>
                    </div>
                    <div class="branch-details">
                      {{ companyBank.bankBranch.name }}
                      <br />
                      {{ companyBank.bankBranch.address }}
                    </div>
                    <div class="account-number">
                      {{ controller.accountNumberLabel }}: {{ companyBank.accountNumber }}
                    </div>
                  </div>
                </li>
              </ol>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="company-overview-section">
      <div class="company-overview-section-split">
        <div class="split-section-item">
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
        <div class="split-section-item">
          <div class="overview-title">{{ controller.shareholdersLabel }}</div>
          <ol v-if="!controller.isShowShareDistribution.value">
            <li
              v-for="(shareholder, i) in controller.shareholdersDetails"
              :key="i"
            >
              <div class="human-details">
                <div class="name">{{ shareholder.name }}</div>
                <div class="human-detail">
                  <i class="fa-regular fa-envelope"></i>
                  <span class="email">{{ shareholder.email }}</span>
                </div>
                <div class="human-detail">
                  <i class="fa-brands fa-whatsapp" />
                  <span class="phone">{{ shareholder.phone }}</span>
                </div>
                <div class="human-detail">
                  <span>
                    <b>{{ controller.totalSharesLabel }}:</b>
                  </span>
                  <span>{{ controller.ordinarySharesLabel }}:</span>
                  <span>{{ shareholder.ordinaryShares }}</span>
                  <span>/</span>
                  <span>{{ controller.preferenceSharesLabel }}:</span>
                  <span>{{ shareholder.preferenceShares }}</span>
                </div>
              </div>
            </li>
          </ol>
          <div
            class="chart-wrapper"
            v-if="controller.isShowShareDistribution.value"
          >
            <Pie
              :data="controller.shareDistributionChartData"
              :options="controller.shareDistributionChartOptions"
            />
          </div>
          <div class="action-link-container right">
            <span
              class="action-link"
              @click="controller.onShowSharePercentageClicked()"
            >
              {{ controller.showDistributionLabel }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Pie } from "vue-chartjs"
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
