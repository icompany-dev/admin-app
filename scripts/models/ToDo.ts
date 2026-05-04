import { CompanyConstants } from "../constants/Company"
import { Error } from "../library/Error"
import type { IModel } from "./IModel"

export class ToDo implements IModel<ToDo> {
  static TYPE_EDIT: string = "edit"
  static TYPE_PAY: string = "pay"
  static TYPE_SIGN: string = "sign"
  static TYPE_NEW_NAME: string = "new_name"
  static TYPE_NEW_INCORP: string = "rec_incorp_new"
  static TYPE_NEW_SWITCH: string = "rec_switch_new"
  static TYPE_APPLY_NOW: string = "rec_edit"
  static TYPE_PURCHASE_STAMP: string = "rec_stamp"
  static TYPE_ANNUAL_RETURN: string = "rec_annual_return"

  id: string = ""
  type: string = ""
  name: string = ""
  companyId: string = ""
  companyName: string = ""
  target: string = ""
  targetId: string = ""

  constructor(data: any) {
    if (!data) {
      return
    }

    if (data instanceof ToDo) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.type = data.type ?? ""
    this.name = data.name ?? ""
    this.companyId = data.company_id ?? ""
    this.companyName = data.company_name ?? ""
    this.target = data.target ?? ""
    this.targetId = data.target_id ?? ""
  }

  clone(data: ToDo): void {
    this.id = data.id
    this.type = data.type
    this.name = data.name
    this.companyId = data.companyId
    this.companyName = data.companyName
    this.target = data.target
    this.targetId = data.targetId
  }

  getRequestBody(): object {
    return {}
  }

  canDelete(): boolean {
    return (
      this.target !== "company_annual_return_request" &&
      this.target !== "company_subscription" &&
      this.getDispatchRemoveAction() !== null
    )
  }

  canPay(): boolean {
    return this.type === ToDo.TYPE_PAY
  }

  requireDelivery(): boolean {
    return this.target === "company_bank_resolution"
  }

  getName(): string {
    if (this.name === "application_incorporate") {
      if (this.type === ToDo.TYPE_NEW_NAME) {
        return "Propose New Incorp Name"
      }

      return "Complete Incorp Application"
    }

    if (this.name === "application_switch") {
      return "Complete Switch Application"
    }

    return this.name
  }

  getCtaLabel(isMalay: boolean): string {
    switch (this.type) {
      case ToDo.TYPE_SIGN:
        return isMalay ? "Tandatangan diperlukan" : "Signature required"
      case ToDo.TYPE_PAY:
        return isMalay ? "Buat pembayaran" : "Make payment"
      case ToDo.TYPE_EDIT:
        return isMalay ? "Sambung permohonan" : "Resume application"
      case ToDo.TYPE_NEW_NAME:
        return isMalay ? "Cadangkan nama baharu" : "Propose new name"
      case ToDo.TYPE_NEW_INCORP:
        return isMalay ? "Cipta baharu" : "Create new"
      case ToDo.TYPE_NEW_SWITCH:
        return isMalay ? "Tukar sekarang" : "Switch now"
      case ToDo.TYPE_APPLY_NOW:
        return isMalay ? "Mohon sekarang" : "Apply now"
      case ToDo.TYPE_PURCHASE_STAMP:
        return isMalay ? "Pesan sekarang" : "Order now"
      case ToDo.TYPE_ANNUAL_RETURN:
        return isMalay ? "Hantar sekarang" : "Submit now"
      default:
        return isMalay ? "Ambil tindakan" : "Take action"
    }
  }

  getCtaUrl(): string {
    if (this.canPay() || this.type === ToDo.TYPE_NEW_INCORP || this.type === ToDo.TYPE_NEW_SWITCH) {
      // This has to be handled by the page itself
      return ""
    }

    if (this.name === "application_incorporate") {
      // This will need to go to the 201 page
      return `/incorporation/${this.targetId}/section201`
    }

    if (this.name === "application_switch") {
      return `/switch/${this.targetId}`
    }

    if (this.type === ToDo.TYPE_PURCHASE_STAMP) {
      return `/company/${this.companyId}/business?tab=comp-item`
    }

    if (this.type === ToDo.TYPE_ANNUAL_RETURN) {
      return `/company/${this.companyId}/business?action=lodge-annual-return`
    }

    if (this.type === ToDo.TYPE_SIGN) {
      switch (this.target) {
        case CompanyConstants.TARGET_AMENDMENT_ADDRESS:
          return `quick-sign/service/amendmentAddress?id=${this.targetId}`
        case CompanyConstants.TARGET_AMENDMENT_NAME:
          return `quick-sign/service/amendmentName?id=${this.targetId}`
        case "company_bank_resolution":
          return `quick-sign/service/newBank?id=${this.targetId}`
        case "company_bank_account_closure":
          return `quick-sign/service/bankAccountClosure?id=${this.targetId}&company_id=${this.companyId}`
        // return `/company/${this.companyId}/bankings?tab=account_closure&target=${this.targetId}`
        case "company_director_appointment":
          return `quick-sign/service/directorAppointment?id=${this.targetId}`
        case "company_shareholder_transfer":
          return `quick-sign/service/transferOfShare?id=${this.targetId}`
        case "company_shareholder_allotment":
          return `quick-sign/service/allotmentOFShares?id=${this.targetId}&company_id=${this.companyId}`
        // return `/company/${this.companyId}/shareholders?tab=sha_allo&id=${this.targetId}`
        case "company_shareholder_transfer_proposal":
          return `/company/${this.companyId}/shareholders`
        case "company_audit_circulation":
          return `quick-sign/service/auditCirculation?id=${this.targetId}&company_id=${this.companyId}`
        case "company_audit_extension_of_time":
          return `quick-sign/service/auditExtensionOfTime?id=${this.targetId}&company_id=${this.companyId}`
        case "company_auditor_appointment":
          return `quick-sign/service/appointmentOfAuditor?id=${this.targetId}`
      }

      const actionType = this.getActionType()
      if (actionType.length > 0) {
        return `/quick-sign/form/${actionType}/${this.targetId}`
      }
    }

    return `/company/${this.companyId}`
  }

  getActionType(): string {
    switch (this.target) {
      case CompanyConstants.TARGET_AMENDMENT_NAME:
        return "ame-name"
      case "company_amendment_description":
        return "ame-desc"
      case CompanyConstants.TARGET_AMENDMENT_ADDRESS:
        return "ame-addr"
      case CompanyConstants.TARGET_AMENDMENT_BRANCH:
        return "ame-bran"
      case "company_amendment_constitution":
        return "ame-cons"
      case "company_director_appointment":
        return "dir-appo"
      case "company_director_resignation":
        return "dir-resi"
      case "company_shareholder_allotment":
        return "sha-allo"
      case "company_shareholder_transfer":
        return "sha-tran"
      case "company_custom_resolution":
        return "cus-reso"
      case "company_bank_resolution":
        return "ban-reso"
      case "company_strikingoff":
        return "com-stri"
      default:
        return ""
    }
  }

  getActionPage(target: string): string {
    switch (target) {
      case CompanyConstants.TARGET_AMENDMENT_NAME:
      case "company_amendment_description":
      case CompanyConstants.TARGET_AMENDMENT_ADDRESS:
      case CompanyConstants.TARGET_AMENDMENT_BRANCH:
      case "company_amendment_constitution":
      case "company_strikingoff":
        return "business"
      case "company_director_appointment":
      case "company_director_resignation":
        return "directors"
      case "company_shareholder_allotment":
      case "company_shareholder_transfer":
        return "shareholders"
      case "company_audit":
      case "company_audit_exemptions":
      case "company_auditor_appointment":
      case "company_auditor_resignation":
        return "audits"
      case "company_bank_resolution":
        return "bankings"
      case "company_audit_exemption":
        return "audits"
      default:
        return "overviews"
    }
  }

  getDispatchRemoveAction(): string | null {
    switch (this.target) {
      case "application_incorporate":
        return "applications/incorporates/remove"
      case "application_switch":
        return "applications/switches/remove"
      case CompanyConstants.TARGET_AMENDMENT_ADDRESS:
        return "company/amendments/addresses/remove"
      case CompanyConstants.TARGET_AMENDMENT_BRANCH:
        return "company/amendments/branches/remove"
      case "company_amendment_constitution":
        return "company/amendments/constitutions/remove"
      case "company_amendment_description":
        return "company/amendments/descriptions/remove"
      case CompanyConstants.TARGET_AMENDMENT_NAME:
        return "company/amendments/names/remove"
      case "company_auditor_appointment":
        return "company/auditor/appointments/remove"
      case "company_bank_resolution":
        return "companies/banks/resolutions/remove"
      case "company_director_appointment":
        return "company/directors/appointments/remove"
      case "company_director_resignation":
        return "company/directors/resignations/remove"
      case "company_shareholder_allotment":
        return "company/shareholders/allotments/remove"
      case "company_shareholder_transfer":
        return "company/shareholders/transfers/remove"
      case "company_custom_resolution":
        return "company/custom-resolutions/remove"
      case "company_share_issuance":
        return "company/shareholders/issuances/delete"
      case "company_post_share_transfer":
        return "companies/shareholders/transfers/section106/remove" // use id not object
      case "company_share_authorization":
        return "company/shareholders/authorizations/delete" // use id, not object
      case "company_bank_account_closure":
        return "companies/banks/account-closures/remove"
      case "company_audit_circulation":
        return "company/audit-circulations/remove"
      case "company_audit_extension_of_time":
        return "company/audit-extension-of-times/remove"
      default:
        return null
    }
  }

  // TODO: Handle delete using the new repositories structures
  // async delete (store) {
  //   const dispatchAction = this.getDispatchRemoveAction()
  //   if (!dispatchAction) {
  //     return
  //   }

  //   let payload = { id: this.id }
  //   if (
  //     this.target === 'company_share_issuance' ||
  //     this.target === 'company_post_share_transfer' ||
  //     this.target === 'company_share_authorization'
  //   ) {
  //     payload = this.id
  //   }

  //   await store
  //     .dispatch(dispatchAction, payload)
  //     .then((response) => {
  //       return response
  //     })
  //     .catch((error) => {
  //       console.error(error)
  //       const errorMessage = new Error(
  //         Error.ERROR_TYPE_API,
  //         'Unable to remove application. Please try again. If the issue persists, please contact support.'
  //       )
  //       throw errorMessage
  //     })
  // }
}
