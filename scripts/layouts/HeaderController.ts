import { useRouter, useRoute } from "#app"

export class HeaderController {
  router = useRouter()
  route = useRoute()

  isMenuOpen = ref<boolean>(false)
  searchbarRef: any | null = null

  timeout = ref<number | null>(null)
  isPageScroll: Ref<boolean> = ref<boolean>(false)
  isHeaderHidden: Ref<boolean> = ref<boolean>(false)

  constructor(isHeaderHidden: boolean) {
    this.setIsHeaderHidden(isHeaderHidden)
  }

  setSearchBarRef(searchbarRef: any | null): void {
    this.searchbarRef = searchbarRef
  }

  setIsHeaderHidden(isHeaderHidden: boolean): void {
    this.isHeaderHidden.value = isHeaderHidden
  }

  onLogoClicked(): void {
    this.router.push({ path: "/" })
  }

  isScrolling(): boolean {
    // No scroll animation on search open
    if (this.searchbarRef && this.searchbarRef.getIsSearchModeOpen()) {
      return false
    }

    return this.isPageScroll.value
  }

  isHomeButtonHidden(): boolean {
    return this.route.fullPath === "/"
  }

  isInSdnBhdDashboard(): boolean {
    return this.route.fullPath.startsWith("/sdnbhd")
  }

  toggleMenu(): void {
    this.isMenuOpen.value = !this.isMenuOpen.value
  }

  onMouseScroll(): void {
    this.isPageScroll.value = true

    if (this.timeout.value !== null) {
      clearTimeout(this.timeout.value)
    }

    this.timeout.value = window.setTimeout(() => {
      this.isPageScroll.value = false
      this.timeout.value = null
    }, 1000)
  }
}
