<template>
  <div id="secretarial-services-applications">
    <div
      class="loader-container"
      v-if="controller.tableDataFetcher.value?.isLoading"
    >
      <LoaderPrepare
        :label="controller.loaderLabel"
        :sublabel="controller.loaderSublabel"
      />
    </div>
    <div
      class="applications"
      v-if="!controller.tableDataFetcher.value?.isLoading"
    >
      <NoRecord
        v-if="controller.tableDataFetcher.value?.hasNoRecord"
        :title="controller.noRecordTitle"
        :subtitle="controller.noRecordSubtitle"
      />
      <div
        class="application"
        v-for="(application, i) in controller.tableDataFetcher.value?.data"
        :key="i"
        @click="controller.onApplicationClicked(application)"
      >
        <div class="application-details">
          <div class="application-information">
            <div
              class="company-name"
              @click="controller.onCompanyNameClicked(application.companyId)"
            >
              {{ controller.companyName(application) }}
            </div>
            <div
              class="app-info"
              v-html="controller.applicationDetails(application)"
            />
          </div>
          <div class="application-date">
            {{ controller.applicationDate(application) }}
          </div>
          <div
            class="application-status"
            :class="controller.applicationStatusClass(application)"
          >
            {{ controller.applicationStatus(application) }}
          </div>
        </div>
        <div class="application-actions">
          <button class="btn btn-submit btn-pill">
            {{ controller.viewApplicationLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import NoRecord from "@/components/Placeholders/NoRecord.vue"
  import { ApplicationsController } from "~/scripts/components/secretarial-services/ApplicationsController"
  import { BankAccountOpeningsController } from "~/scripts/components/secretarial-services/BankAccountOpeningsController"
  import { CompanyConstants } from "~/scripts/constants/Company"
  import type { IPropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"

  const props = defineProps<IPropsSecretarialServices>()

  const emit = defineEmits([])

  let controller = new ApplicationsController(props, emit)

  switch (props.target) {
    case CompanyConstants.TARGET_OPEN_BANK_ACCOUNT:
      controller = new BankAccountOpeningsController(props, emit)
  }

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/SecretarialServices/Applications" as *;
</style>
