import type { AuditTrail } from "./AuditTrail"

export class AuditTrailRegister {
  label: string = ""
  auditTrails: AuditTrail[] = []

  constructor(label: string, auditTrails: AuditTrail[]) {
    this.label = label
    this.auditTrails = auditTrails
  }
}
