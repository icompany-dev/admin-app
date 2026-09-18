<template>
  <div id="tags-tags">
    <div
      class="tag"
      v-for="tag in controller.tags.value"
    >
      {{ tag.name }}
      <i
        class="fa-solid fa-xmark clickable"
        @click="controller.onRemoveTagClicked(tag)"
      />
    </div>
    <div
      class="tag add-new"
      @click="controller.onAddNewTagClicked()"
    >
      + Add
    </div>
    <AddNewTag
      ref="addNewTagRef"
      v-bind="controller.addNewTagProps"
      @proceed="controller.onAddedTag($event)"
    />
  </div>
</template>

<script lang="ts" setup>
  import AddNewTag from "../Popups/AddNewTag.vue"
  import { TagsController } from "~/scripts/components/tags/TagsController"
  import { EmitMessages } from "~/scripts/constants/EmitMessages"
  import type { IPropsTags } from "~/scripts/props/PropsTags"

  const props = defineProps<IPropsTags>()

  const emit = defineEmits([EmitMessages.REFRESH])

  const addNewTagRef = ref(null)

  const controller = new TagsController(props, emit)

  watch(
    () => props,
    (newVal) => {
      controller.setDataFromProps(newVal)
    },
    { deep: true }
  )

  watch(
    addNewTagRef,
    (newVal) => {
      controller.setAddTagRef(newVal)
    },
    { immediate: true }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Tags/Tags" as *;
</style>
