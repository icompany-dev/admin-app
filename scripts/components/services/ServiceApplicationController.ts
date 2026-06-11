import type { IPropsServiceApplication } from "~/scripts/props/PropsServiceApplication"

export class ServiceApplicationController {
  isCollapsed: Ref<boolean> = ref<boolean>(false)

  serviceName: Ref<string> = ref<string>("")
  hasApplication: Ref<boolean> = ref<boolean>(false)

  emitEvents: any | null = null

  constructor(props: IPropsServiceApplication, emitEvents: any) {
    this.serviceName.value = props.serviceName
    this.hasApplication.value = props.hasApplication
    this.emitEvents = emitEvents
  }

  setServiceName(serviceName: string): void {
    this.serviceName.value = serviceName
  }

  setHasApplication(hasApplication: boolean): void {
    this.hasApplication.value = hasApplication
  }

  onPanelClicked(): void {
    this.isCollapsed.value = !this.isCollapsed.value
  }
}
