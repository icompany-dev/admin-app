import { type PartialObject } from "lodash"

export class NameReservationValidationResult {
  name: string = ""
  acceptableNames: string[] = []

  isAccepted: boolean = true
  isTooShort: boolean = false
  isTooLong: boolean = false
  isMatchHumanName: boolean = false

  isWarningRequired: boolean = false
  isDescriptionRequired: boolean = false
  isSupportingDocumentRequired: boolean = false

  validationRemarks: string[] = []
  warningMessages: string[] = []
  reasonsToReject: string[] = []

  canAskForRecommendation: boolean = false
  canAskForDrafts: boolean = false

  constructor(data: PartialObject<NameReservationValidationResult> | null = null) {
    if (!data) {
      return
    }

    Object.assign(this, data)
  }
}
