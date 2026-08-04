<template>
  <div id="switches-ongoings">
    <div
      class="loader-container"
      v-if="controller.tableDataFetcher.value.isLoading"
    >
      <LoaderPrepare
        :label="controller.loaderLabel"
        :sublabel="controller.loaderSublabel"
      />
    </div>
    <div
      class="applications"
      v-if="!controller.tableDataFetcher.value.isLoading"
    >
      <NoRecord
        v-if="controller.tableDataFetcher.value.hasNoRecord"
        :title="controller.noRecordTitle"
        :subtitle="controller.noRecordSubtitle"
      />
      <div
        class="application"
        v-for="(application, i) in controller.tableDataFetcher.value.data"
        :key="i"
      >
        <div class="application-details">
          <div
            class="proposed-name"
            @click="controller.onApplicationClicked(application)"
          >
            {{ application.getFullName() }}
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
          <button
            class="btn btn-submit btn-pill"
            @click="controller.onApplicationClicked(application)"
          >
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
  import { OngoingsController } from "~/scripts/components/switches/OngoingsController"
  import type { IPropsSwitchesOngoing } from "~/scripts/props/PropsSwitchesOngoing"

  const props = defineProps<IPropsSwitchesOngoing>()

  const emit = defineEmits([])

  const controller = new OngoingsController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/switches/Ongoings" as *;
</style>
