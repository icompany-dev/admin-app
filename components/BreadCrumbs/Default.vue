<template>
  <div id="bread-crumbs-default">
    <i class="fa-solid fa-home" />
    <div class="slash">/</div>
    <template
      v-for="(crumb, index) in controller.crumbs.value"
      :key="index"
    >
      <div
        class="page-name"
        :class="{ clickable: !controller.isLastItem(index) }"
        @click="controller.onClick(crumb, index)"
      >
        {{ crumb.pageName }}
      </div>
      <div
        class="slash"
        v-if="!controller.isLastItem(index)"
      >
        /
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { DefaultController } from "~/scripts/components/bread-crumbs/DefaultController"
  import type { IPropsBreadCrumb } from "~/scripts/props/PropsBreadCrumb"

  const props = defineProps<IPropsBreadCrumb>()
  const emit = defineEmits([])

  const controller = new DefaultController(props, emit)
</script>

<style lang="scss">
  @use "~/assets/scss/components/BreadCrumbs/Default" as *;
</style>
