import { PageSidebar, SidebarGroup } from "~/scripts/constants/Sidebar"

export class DefaultController {
  sidebarGroups: SidebarGroup[] = PageSidebar.ITEMS
  emitEvents: any | null = null

  constructor(emitEvents: any) {
    this.emitEvents = emitEvents
  }
}
