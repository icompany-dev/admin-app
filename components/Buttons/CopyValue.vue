<template>
  <div
    id="buttons-copy-value"
    :class="{ success: controller.isCopied.value }"
    @click="controller.onClick()"
  >
    <i
      class="icon fa-regular"
      :class="controller.isCopied.value ? 'fa-check' : 'fa-copy'"
    />
  </div>
</template>

<script lang="ts" setup>
  import { CopyValueController } from "~/scripts/components/buttons/CopyValueController"

  const props = defineProps({
    value: {
      type: String,
      required: true,
    },
  })
  const emit = defineEmits([])

  const controller = new CopyValueController(props.value, emit)

  watch(
    () => props.value,
    (newVal) => {
      controller.setValueToCopy(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Buttons/CopyValue" as *;
</style>
