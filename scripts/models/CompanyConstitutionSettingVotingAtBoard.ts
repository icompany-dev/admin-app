import { CompanyConstitutionSettingItem } from "~/scripts/models/CompanyConstitutionSettingItem"

export class CompanyConstitutionSettingVotingAtBoard extends CompanyConstitutionSettingItem {
  isOneDirectorOneVote: boolean = false
  isChairmanHasVoteIfTie: boolean = false
  isChairmanHasNoVoteMotionFail: boolean = false

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyConstitutionSettingVotingAtBoard) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.isOneDirectorOneVote = data.is_one_director_one_vote
    this.isChairmanHasVoteIfTie = data.is_chairman_has_vote_if_tie
    this.isChairmanHasNoVoteMotionFail = data.is_chairman_has_no_vote_motion_fail
  }

  cloneDetails(data: CompanyConstitutionSettingVotingAtBoard): void {
    super.clone(data)
    this.isOneDirectorOneVote = data.isOneDirectorOneVote
    this.isChairmanHasVoteIfTie = data.isChairmanHasVoteIfTie
    this.isChairmanHasNoVoteMotionFail = data.isChairmanHasNoVoteMotionFail
  }

  getRequestBody(): object {
    return {
      is_one_director_one_vote: this.isOneDirectorOneVote,
      is_chairman_has_vote_if_tie: this.isChairmanHasVoteIfTie,
      is_chairman_has_no_vote_motion_fail: this.isChairmanHasNoVoteMotionFail,
    }
  }

  canSubmit(): boolean {
    return true
  }
}
