import type { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"

export class DraftsController {
  applications: Ref<ApplicationIncorporate[]> = ref<ApplicationIncorporate[]>([])

  emitEvents: any | null = null

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents
  }
}
