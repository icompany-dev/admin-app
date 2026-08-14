<template>
  <div id="command-centres-activities">
    <div class="activities-title">
      <div class="activities-status-selection">
        <i
          class="fa-solid fa-circle-sort"
          @click="controller.onPeriodSelectionClicked()"
        ></i>
        <div
          class="activities-status-options"
          :class="{ show: controller.isShowPeriodOptions.value }"
        >
          <div
            class="activities-status-option"
            @click="controller.onPeriodSelected(status)"
            v-for="(status, index) in controller.periodOptions"
            :key="index"
          >
            {{ StringUtil.capitalize(status) }}
          </div>
        </div>
      </div>
      <span class="activities-status">
        {{ StringUtil.capitalize(controller.selectedPeriod.value) }}
      </span>
      <span class="activities-name">
        {{ controller.title }}
      </span>
    </div>
    <div class="activities-table">
      <table class="activities">
        <tbody>
          <tr
            v-for="(todo, index) in controller.activitiesOnPage"
            :key="index"
          >
            <td class="no-logo">
              <img src="/img/logo/default-logo.png" />
            </td>
            <td class="company-name">
              {{ todo.companyName }}
            </td>
            <td class="status">
              <b>{{ todo.name }}</b>
              <br />
              {{ controller.activityStatus(todo) }}
            </td>
            <td>// actions?</td>
            <td>
              <button class="btn btn-standard btn-submit">Next Step</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <TablePagination
      v-bind="controller.tablePaginationProps"
      @goToPage="controller.goToPage($event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import TablePagination from "@/components/Paginations/TablePagination.vue"
  import { ActivitiesController } from "~/scripts/components/command-centres/ActivitiesController"
  import { StringUtil } from "~/scripts/utils/String"

  const props = defineProps({})
  const emit = defineEmits([])

  const controller = new ActivitiesController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/CommandCentres/Activities" as *;
</style>
