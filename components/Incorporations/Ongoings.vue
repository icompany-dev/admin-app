<template>
  <div id="incorporations-ongoings">
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
        <div
          class="application-details"
          @click="controller.onApplicationClicked(application)"
        >
          <div class="proposed-name">
            {{ application.getName() }}
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
          <button
            class="btn btn-danger btn-pill"
            @click="controller.onRemoveClicked(application)"
          >
            {{ controller.removeApplicationLabel }}
          </button>
        </div>
      </div>
    </div>
    <ConfirmToDelete
      ref="confirmToDeleteRef"
      :remove-item-name="controller.itemToRemoveName"
      @proceed="controller.onProceedRemove()"
    />
  </div>
</template>

<script lang="ts" setup>
  import ConfirmToDelete from "../Popups/ConfirmToDelete.vue"
  import LoaderPrepare from "@/components/Loaders/Prepare.vue"
  import NoRecord from "@/components/Placeholders/NoRecord.vue"
  import { OngoingsController } from "~/scripts/components/incorporations/OngoingsController"
  import type { IPropsIncorporationsOngoing } from "~/scripts/props/PropsIncorporationsOngoing"

  const props = defineProps<IPropsIncorporationsOngoing>()

  const emit = defineEmits([])

  const confirmToDeleteRef = ref(null)

  const controller = new OngoingsController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
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
  @use "~/assets/scss/components/Incorporations/Ongoings" as *;
</style>
