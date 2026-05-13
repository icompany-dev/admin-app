<template>
  <div
    id="header-default"
    :class="{ 'is-scrolling': headerController.isScrolling() || props.isHeaderHidden }"
  >
    <div
      class="color-overlay"
      :class="{ show: headerController.isScrolling() }"
    ></div>
    <div
      class="header-content"
      :class="{ 'is-scrolling': headerController.isScrolling() || props.isHeaderHidden }"
    >
      <div
        class="logo"
        @click="headerController.onLogoClicked()"
      />

      <div class="search-bar">
        <!-- <SearchBar ref="searchBarRef" /> -->
      </div>

      <div
        class="mobile-menu"
        @wheel.prevent
        @touchmove.prevent
      >
        <BurgerMenu
          :isOpen="headerController.isMenuOpen.value"
          @click="headerController.toggleMenu()"
        />
      </div>

      <div
        class="page-tools"
        :class="{ 'is-open': headerController.isMenuOpen.value }"
        @wheel.prevent
        @touchmove.prevent
      >
        <HomeButton v-if="!headerController.isHomeButtonHidden()" />
        <!-- <Notifications />
        <DeliveryButton /> -->
        <Language />
        <ColorModeToggler />
        <!-- <UserProfile /> -->
        <LogoutButton />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import BurgerMenu from "~/components/Headers/BurgerMenu.vue"
  import ColorModeToggler from "~/components/Headers/ColorModeToggler.vue"
  import LogoutButton from "~/components/Headers/LogoutButton.vue"
  import Language from "~/components/Headers/Language.vue"
  // import SearchBar from "~/components/Headers/SearchBar.vue"
  import HomeButton from "~/components/Headers/HomeButton.vue"
  // import UserProfile from "~/components/Headers/UserProfile.vue"
  import { DefaultController } from "~/scripts/components/headers/DefaultController"

  const props = defineProps({
    isHeaderHidden: {
      type: Boolean,
      defaul: false,
    },
  })

  const searchBarRef = ref(null)

  let headerController = new DefaultController(props.isHeaderHidden)

  onMounted(() => {
    window.addEventListener("scroll", headerController.onMouseScroll.bind(headerController))
  })

  onUnmounted(() => {
    window.removeEventListener("scroll", headerController.onMouseScroll.bind(headerController))
  })

  watch(
    searchBarRef,
    (newVal) => {
      headerController.setSearchBarRef(newVal)
    },
    { immediate: true }
  )

  watch(
    () => props.isHeaderHidden,
    (newVal) => {
      headerController.setIsHeaderHidden(newVal)
    }
  )
</script>

<style lang="scss">
  @use "~/assets/scss/components/Headers/Default" as *;
</style>
