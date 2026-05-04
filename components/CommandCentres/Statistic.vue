<template>
  <div
    id="command-centre-statistic"
    @click.self="controller.hideOptions()"
  >
    <div class="statistic-title">
      <div class="statistic-status-selection">
        <i
          class="fa-solid fa-circle-sort"
          @click="controller.onStatusSelectionClicked()"
        ></i>
        <div
          class="statistic-status-options"
          :class="{ show: controller.isShowStatusOptions.value }"
        >
          <div
            class="statistic-status-option"
            @click="controller.onSelectStatus(status)"
            v-for="(status, index) in controller.statuses.value"
            :key="index"
          >
            {{ StringUtil.capitalize(status) }}
          </div>
        </div>
      </div>
      <span class="statistic-status">
        {{ controller.status }}
      </span>
      <span class="statistic-name">
        {{ controller.title.value }}
      </span>
    </div>
    <div class="statistic-counter">
      <VueCountUp
        class="statistic-count"
        :autoplay="true"
        :duration="3"
        :decimal-places="0"
        :start-val="0"
        :end-val="controller.count.value"
      />
    </div>
    <div class="statistic-period">
      <span class="statistic-selected-period">
        {{ controller.periodPrepend }} {{ controller.selectedPeriod.value }} {{ controller.periodAppend }}
      </span>
      <div class="statistic-period-selection">
        <i
          class="fa-solid fa-caret-down"
          :class="{ rotate: controller.isShowPeriodOptions.value }"
          @click="controller.onPeriodSelectionClicked()"
        ></i>
        <div
          class="statistic-period-options"
          :class="{ show: controller.isShowPeriodOptions.value }"
        >
          <div
            class="statistic-period-option"
            @click="controller.onSelectPeriod(period)"
            v-for="(period, index) in controller.periods.value"
            :key="index"
          >
            {{ period }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import VueCountUp from "vue-countup-v3"
  import { StatisticController } from "~/scripts/components/command-centres/StatisticController"
  import type { IPropsCommandCentreStatistic } from "~/scripts/props/PropsCommandCentreStatistic"
  import { StringUtil } from "~/scripts/utils/String"

  const props = defineProps<IPropsCommandCentreStatistic>()

  const emit = defineEmits(["statusSelected", "periodSelected"])

  const controller = new StatisticController(props, emit)

  watch(
    () => props.statuses,
    (newVal) => {
      controller.setStatuses(newVal)
    }
  )

  watch(
    () => props.selectedStatus,
    (newVal) => {
      controller.setSelectedStatus(newVal)
    }
  )

  watch(
    () => props.title,
    (newVal) => {
      controller.setTitle(newVal)
    }
  )

  watch(
    () => props.count,
    (newVal) => {
      controller.setCount(newVal)
    }
  )

  watch(
    () => props.periods,
    (newVal) => {
      controller.setPeriods(newVal)
    }
  )

  watch(
    () => props.selectedPeriod,
    (newVal) => {
      controller.setSeletedPeriod(newVal)
    }
  )

  defineExpose({
    onStatusSelectionClicked: controller.onStatusSelectionClicked.bind(controller),
    onPeriodSelectionClicked: controller.onPeriodSelectionClicked.bind(controller),
    hideOptions: controller.hideOptions.bind(controller),
  })
</script>

<style lang="scss">
  @use "~/assets/scss/components/CommandCentres/Statistic" as *;
</style>
