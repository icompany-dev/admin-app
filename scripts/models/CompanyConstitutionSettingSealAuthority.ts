import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingSealAuthority extends CompanyConstitutionSettingItem {
  isByDcr: boolean = false
  isWrittenByTwoDirectors: boolean = false
  isWrittenByOneDirector: boolean = false
  isDelegatedToCosec: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingSealAuthority) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isByDcr = data.is_by_dcr
    this.isWrittenByTwoDirectors = data.is_written_by_two_directors
    this.isWrittenByOneDirector = data.is_written_by_one_director
    this.isDelegatedToCosec = data.is_delegated_to_cosec
  }

  cloneDetails(data: CompanyConstitutionSettingSealAuthority): void {
    super.clone(data)
    this.isByDcr = data.isByDcr
    this.isWrittenByTwoDirectors = data.isWrittenByTwoDirectors
    this.isWrittenByOneDirector = data.isWrittenByOneDirector
    this.isDelegatedToCosec = data.isDelegatedToCosec
  }

  getRequestBody(): object {
    return {
      is_by_dcr: this.isByDcr,
      is_written_by_two_directors: this.isWrittenByTwoDirectors,
      is_written_by_one_director: this.isWrittenByOneDirector,
      is_delegated_to_cosec: this.isDelegatedToCosec,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
