export enum OwnershipType {
  Direct = "direct",
  Indirect = "indirect",
  DirectIndirect = "direct-indirect",
  Others = "others",
}

export enum CriteriaType {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
}

export class BODeclarationConstants {
  static OWNERSHIP_TYPE_LABELS: Record<OwnershipType, string> = {
    [OwnershipType.Direct]: "Direct Ownership",
    [OwnershipType.Indirect]: "Indirect Ownership",
    [OwnershipType.DirectIndirect]: "Direct & Indirect Ownership",
    [OwnershipType.Others]: "Other Means of Control",
  }

  static CRITERIA_LABELS: Record<CriteriaType, string> = {
    [CriteriaType.A]: "Criteria A: Holds ≥20% of shares",
    [CriteriaType.B]: "Criteria B: Holds ≥20% of voting shares",
    [CriteriaType.C]: "Criteria C: Ultimate effective control",
    [CriteriaType.D]: "Criteria D: Right to appoint/remove directors",
    [CriteriaType.E]: "Criteria E: Controls majority voting rights through agreement",
    [CriteriaType.F]: "Criteria F: Exercises significant control/influence",
  }
}
