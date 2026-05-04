export class BurgerMenuController {
  isOpen = ref<boolean>(false)
  emitEvents: any | null = null

  constructor(isOpen: boolean, emitEvents: any) {
    this.isOpen.value = isOpen
    this.emitEvents = emitEvents
  }

  onClick(): void {
    this.isOpen.value = !this.isOpen.value
    this.emitEvents("onClick", this.isOpen.value)
  }

  setIsOpen(isOpen: boolean): void {
    this.isOpen.value = isOpen
  }
}
