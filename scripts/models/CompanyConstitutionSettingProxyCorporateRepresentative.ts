import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingProxyCorporateRepresentative extends CompanyConstitutionSettingItem {
  isEntitledToAttendByProxy: boolean = false
  isCorpRepAuthorisationByResolution: boolean = false
  isCorpRepAuthorisationByHardCopy: boolean = false
  isCorpRepAuthorisationSpecifyRights: boolean = false
  isCorpRepAuthorisationNotSpecifiedRights: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingProxyCorporateRepresentative) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isEntitledToAttendByProxy = data.is_entitled_to_attend_by_proxy
    this.isCorpRepAuthorisationByResolution = data.is_authorisation_by_resolution
    this.isCorpRepAuthorisationByHardCopy = data.is_authorisation_by_hard_copy
    this.isCorpRepAuthorisationSpecifyRights = data.is_authorisation_specify_rights
    this.isCorpRepAuthorisationNotSpecifiedRights = data.is_authorisation_not_specified_rights
  }

  cloneDetails(data: CompanyConstitutionSettingProxyCorporateRepresentative): void {
    super.clone(data)
    this.isEntitledToAttendByProxy = data.isEntitledToAttendByProxy
    this.isCorpRepAuthorisationByResolution = data.isCorpRepAuthorisationByResolution
    this.isCorpRepAuthorisationByHardCopy = data.isCorpRepAuthorisationByHardCopy
    this.isCorpRepAuthorisationSpecifyRights = data.isCorpRepAuthorisationSpecifyRights
    this.isCorpRepAuthorisationNotSpecifiedRights = data.isCorpRepAuthorisationNotSpecifiedRights
  }

  getRequestBody(): object {
    return {
      is_entitled_to_attend_by_proxy: this.isEntitledToAttendByProxy,
      is_authorisation_by_resolution: this.isCorpRepAuthorisationByResolution,
      is_authorisation_by_hard_copy: this.isCorpRepAuthorisationByHardCopy,
      is_authorisation_specify_rights: this.isCorpRepAuthorisationSpecifyRights,
      is_authorisation_not_specified_rights: this.isCorpRepAuthorisationNotSpecifiedRights,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
