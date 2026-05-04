import type { useCompanyShareholderAllotmentStore } from "~/stores/CompanyShareholderAllotments"
import { ClientDueDiligenceDeclaration } from "../constants/ClientDueDiligenceDeclaration"
import { IdentificationTypes } from "../constants/IdentificationTypes"
import { AllotmentCashType, ShareDistributionMethod, ShareType } from "../constants/Shareholder"
import { Application } from "./Application"
import { CompanyShareIssuance } from "./CompanyShareIssuance"
import { File } from "./File"
import type { IModelApplication } from "./IModelApplication"
import { Shareholder } from "./Shareholder"
import { ShareholderInvitation } from "./ShareholderInvitation"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import type { CompanyShareIssuanceResponse } from "./CompanyShareIssuanceResponse"

export class CompanyShareholderAllotment
  extends Application
  implements IModelApplication<CompanyShareholderAllotment, ReturnType<typeof useCompanyShareholderAllotmentStore>>
{
  refNo: string = ""
  shareAllotTos: CompanyShareAllotTo[] = []
  sharesAllotted: number = 0
  pricePerShare: number = 0.0
  shareType: ShareType = ShareType.Ordinary
  allotmentCashType: AllotmentCashType = AllotmentCashType.Cash
  preferenceAgreement: File | null = null
  declarations: ClientDueDiligenceDeclaration[] = []
  isInitiatedByDirector: boolean = false
  issuances: CompanyShareIssuance[] = []

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyShareholderAllotment) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.ref_no
    this.shareAllotTos =
      data.shares_allot_to && Array.isArray(data.shares_allot_to)
        ? data.shares_allot_to.map((d: any) => {
            return new CompanyShareAllotTo(d)
          })
        : []
    this.sharesAllotted = data.shares_allotted
    this.pricePerShare = data.price_per_share
    this.shareType = data.share_type
    this.allotmentCashType = data.allotment_cash_type
    this.preferenceAgreement = data.preference_agreement ? new File(data.preference_agreement) : null
    this.declarations =
      data.declarations && Array.isArray(data.declarations)
        ? data.declarations.map((d: any) => {
            return new ClientDueDiligenceDeclaration(d)
          })
        : []
    this.isInitiatedByDirector = data.is_initiated_by_director
    this.issuances =
      data.issuances && Array.isArray(data.issuances)
        ? data.issuances.map((d: any) => {
            return new CompanyShareIssuance(d)
          })
        : []
  }

  cloneDetails(data: CompanyShareholderAllotment): void {
    super.clone(data)
    this.refNo = data.refNo
    this.shareAllotTos = data.shareAllotTos.map((d: any) => {
      return new CompanyShareAllotTo(d)
    })
    this.sharesAllotted = data.sharesAllotted
    this.pricePerShare = data.pricePerShare
    this.shareType = data.shareType
    this.allotmentCashType = data.allotmentCashType
    this.preferenceAgreement = data.preferenceAgreement ? new File(data.preferenceAgreement) : null
    this.declarations = data.declarations.map((d: any) => {
      return new ClientDueDiligenceDeclaration(d)
    })
    this.isInitiatedByDirector = data.isInitiatedByDirector
    this.issuances = data.issuances.map((d: any) => {
      return new CompanyShareIssuance(d)
    })
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      shares_allotted: this.sharesAllotted,
      shares_type: this.shareType,
      allot_shares_to: this.shareAllotTos.map((allotTo: CompanyShareAllotTo) => {
        return allotTo.getRequestBody()
      }),
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanyShareholderAllotmentStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyShareholderAllotmentStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyShareholderAllotmentStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }

  setDataFromIssuance(shareIssuance: CompanyShareIssuance): void {
    this.sharesAllotted = shareIssuance.sharesToIssue
    this.shareType = shareIssuance.shareType
    this.pricePerShare = shareIssuance.pricePerShare

    let companyTotalShares = 1
    if (shareIssuance.company) {
      if (shareIssuance.shareType === ShareType.Ordinary) {
        companyTotalShares = shareIssuance.company.ordinaryShares
      } else {
        companyTotalShares = shareIssuance.company.preferenceShares
      }
    }

    let subscribers = shareIssuance.responses.filter((csir: CompanyShareIssuanceResponse) => {
      return !csir.isWaived
    })

    this.shareAllotTos = subscribers.map((csir: CompanyShareIssuanceResponse) => {
      let allotTo = new CompanyShareAllotTo()
      allotTo.shareholderId = csir.shareholder.id
      allotTo.shareholder = new Shareholder(csir.shareholder)
      allotTo.sharesType = shareIssuance.shareType

      let sharesToAllot = 1
      if (shareIssuance.distributionMethod === ShareDistributionMethod.ByPercentage) {
        let numberOfShares = 1
        if (shareIssuance.shareType === ShareType.Ordinary) {
          numberOfShares = csir.shareholder.ordinaryShares
        } else {
          numberOfShares = csir.shareholder.preferenceShares
        }
        let percentage = numberOfShares / companyTotalShares
        sharesToAllot = Math.floor(shareIssuance.sharesToIssue * percentage)
      } else {
        sharesToAllot = Math.floor(shareIssuance.sharesToIssue / subscribers.length)
      }

      allotTo.sharesAllotted = sharesToAllot // at this point we set the minimum amount
      return allotTo
    })
  }
}

export class CompanyShareAllotTo {
  id: string = ""
  allotmentId: string = ""
  shareholderId: string | null = null
  shareholder: Shareholder | null = null
  shareholderInvitation: ShareholderInvitation | null = null
  shareholderName: string = ""
  shareholderIdentificationType: string = IdentificationTypes.IC.id
  shareholderIdentification: string = ""
  sharesAllotted: number = 0
  sharesType: ShareType = ShareType.Ordinary
  supportingDocument: File | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyShareAllotTo) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.allotmentId = data.company_shareholder_allotment_id
    this.shareholderId = data.shareholder?.id ?? null
    this.shareholder = data.shareholder ? new Shareholder(data.shareholder) : null
    this.shareholderInvitation = data.shareholder_invitation
      ? new ShareholderInvitation(data.shareholder_invitation)
      : null
    this.shareholderName = data.shareholder_name
    this.shareholderIdentificationType = data.shareholder_id_type
    this.shareholderIdentification = data.shareholder_identification
    this.sharesAllotted = data.shares_allotted
    this.sharesType = data.shares_type
    this.supportingDocument = data.supporting_document
  }

  clone(data: CompanyShareAllotTo): void {
    this.id = data.id
    this.allotmentId = data.allotmentId
    this.shareholderId = data.shareholderId
    this.shareholder = data.shareholder ? new Shareholder(data.shareholder) : null
    this.shareholderInvitation = data.shareholderInvitation
      ? new ShareholderInvitation(data.shareholderInvitation)
      : null
    this.shareholderName = data.shareholderName
    this.shareholderIdentificationType = data.shareholderIdentificationType
    this.shareholderIdentification = data.shareholderIdentification
    this.sharesAllotted = data.sharesAllotted
    this.sharesType = data.sharesType
    this.supportingDocument = data.supportingDocument
  }

  getRequestBody(): object {
    return {
      shareholder_id: this.shareholderId,
      shareholder_invitation_id: this.shareholderInvitation?.id,
      shareholder_name: this.shareholderName,
      shareholder_id_type: this.shareholderIdentificationType,
      shareholder_identification: this.shareholderIdentification,
      shares_allotted: this.sharesAllotted,
      shares_type: this.sharesType,
    }
  }
}
