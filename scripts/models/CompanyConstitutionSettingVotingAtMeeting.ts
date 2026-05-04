import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingVotingAtMeeting extends CompanyConstitutionSettingItem {
  isByShowOfHands: boolean = false
  isByPoll: boolean = false
  isByElectronicVotingSystem: boolean = false
  isByProxy: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingVotingAtMeeting) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isByShowOfHands = data.is_by_show_of_hands
    this.isByPoll = data.is_by_poll
    this.isByElectronicVotingSystem = data.is_by_electronic_voting_system
    this.isByProxy = data.is_by_proxy
  }

  cloneDetails(data: CompanyConstitutionSettingVotingAtMeeting): void {
    super.clone(data)
    this.isByShowOfHands = data.isByShowOfHands
    this.isByPoll = data.isByPoll
    this.isByElectronicVotingSystem = data.isByElectronicVotingSystem
    this.isByProxy = data.isByProxy
  }

  getRequestBody(): object {
    return {
      is_by_show_of_hands: this.isByShowOfHands,
      is_by_poll: this.isByPoll,
      is_by_electronic_voting_system: this.isByElectronicVotingSystem,
      is_by_proxy: this.isByProxy,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
