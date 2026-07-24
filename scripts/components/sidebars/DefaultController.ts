import { PageSidebar, SidebarGroup } from "~/scripts/constants/Sidebar"

export class DefaultController {
  sidebarGroups: Ref<SidebarGroup[]> = ref<SidebarGroup[]>(PageSidebar.ITEMS)
  emitEvents: any | null = null

  isCollapsed: Ref<boolean> = ref<boolean>(false)

  constructor(emitEvents: any) {
    this.emitEvents = emitEvents
  }

  onGroupClicked(sidebarGroup: SidebarGroup): void {
    sidebarGroup.isExpanded = true

    this.sidebarGroups.value.forEach((sbg: SidebarGroup) => {
      if (sbg.labelEn !== sidebarGroup.labelEn) {
        sbg.isExpanded = false
        return
      }
    })
  }

  onBurgerClicked(): void {
    this.isCollapsed.value = !this.isCollapsed.value
  }
}
