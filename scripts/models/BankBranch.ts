import { StatusConstants } from "../constants/Status"
import { State } from "./Location"

export class BankBranch {
  id: string = ""
  bankId: string = ""
  name: string = ""
  address: string = ""
  phone: string = ""
  fax: string = ""
  stateId: number = 0
  state: State = new State()
  
  remarks: string = ""
  hasIssue: boolean = false
  status: string = ""

  constructor(data: any = null) {
    if (data !== null) {
      if (data instanceof BankBranch) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  convertFromResponse(data: any) {
    this.id = data.id ?? ""
    this.bankId = data.bank_id ?? ""
    this.name = data.name ?? ""
    this.address = data.address ?? ""
    this.phone = data.phone ?? ""
    this.fax = data.fax ?? ""
    this.stateId = data.state_id ?? 0
    this.state = new State(data.state)

    this.remarks = data.remarks ?? ""
    this.hasIssue = data.has_issue === 1 ? true : false
    this.status = data.status ?? StatusConstants.DRAFT
  }

  clone(data: BankBranch) {
    this.id = data.id
    this.bankId = data.bankId
    this.name = data.name
    this.address = data.address
    this.phone = data.phone
    this.fax = data.fax
    this.stateId = data.stateId
    this.state = new State(data.state)

    this.remarks = data.remarks
    this.hasIssue = data.hasIssue
    this.status = data.status
  }
}
