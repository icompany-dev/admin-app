import { PageSidebar, SidebarGroup } from "~/scripts/constants/Sidebar"
import { StatusConstants } from "~/scripts/constants/Status"
import { Filter } from "~/scripts/library/Filter"
import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { ApplicationSwitch } from "~/scripts/models/ApplicationSwitch"

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

  // async isPulsing(): Promise<boolean> {
  //   let tableDataFetcher = ref<TableDataFetcher<ApplicationSwitch>>(
  //     new TableDataFetcher(ApplicationSwitch, useApplicationSwitchStore())
  //   )

  //   const filter = new Filter()
  //   filter.take = 1
  //   filter.statuses = [StatusConstants.PAID]
  //   tableDataFetcher.value.filter = filter
  //   await tableDataFetcher.value.fetchData()

  //   return tableDataFetcher.value.data.length > 0
  // }

  onBurgerClicked(): void {
    this.isCollapsed.value = !this.isCollapsed.value

    this.emitEvents(this.isCollapsed.value ? "collapsed" : "expanded")
  }
}
