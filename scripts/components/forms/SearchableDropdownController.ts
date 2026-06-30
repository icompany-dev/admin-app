export class SearchableDropdownController {
  options = ref<any[]>([])
  filteredOptions = ref<any[]>([])
  selectedValue = ref<any | null>(null)
  isOpen = ref<boolean>(false)
  searchQuery = ref<string | null>(null)
  emitEvents: any | null = null
  isSearching: Ref<boolean> = ref<boolean>(false)
  isPendingSearch: Ref<boolean> = ref<boolean>(false)

  isShowOptions: Ref<boolean> = ref<boolean>(false)

  constructor(options: any[], emitEvents: any | null) {
    this.options.value = options
    this.filteredOptions.value = options
    this.emitEvents = emitEvents
  }

  setOptions(options: any[]) {
    this.options.value = options
    this.filteredOptions.value = options
  }

  setIsSearching(isSearching: boolean): void {
    this.isSearching.value = isSearching
  }

  onKeywordInput(): void {
    this.isPendingSearch.value = true
    // this.emitEvents("filter", this.searchQuery.value)
  }

  onKeywordChanged(): void {
    this.isPendingSearch.value = false
    this.isSearching.value = true
    this.emitEvents("search", this.searchQuery.value)
  }

  instructions(): string {
    if (this.isSearching.value) {
      return "Searching based on keywords... please wait..."
    }

    if (this.isPendingSearch.value) {
      return `Please press Enter to search further.`
    }

    return "No result found. Please try a different keyword."
  }

  onShowItemsClicked(): void {
    this.isShowOptions.value = !this.isShowOptions.value
  }

  handleMouseClick(event: MouseEvent | TouchEvent): void {
    if (!this.isShowOptions.value) {
      return
    }

    const path = event.composedPath()

    const clickedInside = path.some((el) => {
      return el instanceof HTMLElement && el.classList.contains("searchable-dropdown")
    })

    if (clickedInside) {
      return
    }

    this.isShowOptions.value = false
  }

  handleKeydown(event: KeyboardEvent): void {
    if (!this.isShowOptions.value) {
      return
    }

    if (event.key === "Escape") {
      this.isShowOptions.value = false
    }
  }

  onItemClicked(selection: any): void {
    this.isShowOptions.value = false
    this.emitEvents("selected", selection)
  }
}
