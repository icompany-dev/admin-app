import type { PartialObject } from "lodash"
import type { ServiceAccessRule } from "./ServiceAccessRule"

export class ModuleAccessRule {
  module: string = ""
  rules: ServiceAccessRule[] = []

  constructor(data: PartialObject<ModuleAccessRule>) {
    Object.assign(this, data)
  }
}
