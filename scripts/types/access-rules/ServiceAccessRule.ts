import type { PartialObject } from "lodash"
import type { AccessType } from "./AccessType"

export class ServiceAccessRule {
  serviceName: string = ""
  serviceDisplayName: string = ""
  accessTypes: AccessType[] = []

  constructor(data: PartialObject<ServiceAccessRule>) {
    Object.assign(this, data)
  }
}
