export enum CompanyContractEnterRole {
  Director = "director",
  Representative = "representative",
}

export enum CompanyContractEnterDocumentType {
  General = "general",
  SpecificName = "specific",
}

export enum CompanyContractEnterValidity {
  UntilRevoke = "until-revoke",
  FixedPeriod = "fixed-period",
}

export class CompanyContractEnterKeyValues {
  static MAP: Record<string, string> = {
    [CompanyContractEnterRole.Director]: "a Director of the Company",
    [CompanyContractEnterRole.Representative]: "the authorised representative of the Company",
    [CompanyContractEnterDocumentType.General]: "agreements, contracts and documents on behalf of the Company",
    [CompanyContractEnterDocumentType.SpecificName]: "Name of Agreement e.g. Service Agreement",
    [CompanyContractEnterValidity.UntilRevoke]: "valid and effective until revoked, varied or replaced by a resolution",
    [CompanyContractEnterValidity.FixedPeriod]:
      "from the date of this resolution unless earlier revoked or extended by the Directors",
  }
}
