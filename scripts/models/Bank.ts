import { BankBranch } from "./BankBranch"
import { File } from "./File"
import { BankDetails } from "./BankDetails"
import { BankConstants } from "~/scripts/constants/Banks"

export class Bank {
  id = ""
  name: string = ""
  nickname: string = ""
  branches: BankBranch[] = []
  accountPackages = []
  advertisements = []
  idNumber = ""
  numberSequence = ""
  description = ""
  image: File = new File()
  instructions = ""
  isPartner = ""
  metaData = ""
  status = ""

  // Some response may include this
  hasOngoingApplication: boolean = false

  // Notes: bank details coming from constants
  details: BankDetails = new BankDetails()

  constructor(data: any = null) {
    if (data !== null) {
      if (data instanceof Bank) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  convertFromResponse(data: any) {
    this.id = data.id ?? data.bank_id
    this.name = data.name || ""
    this.nickname = data.nickname || ""
    this.branches = data.branches ? data.branches.map((b: any) => new BankBranch(b)) : []
    this.accountPackages = data.account_packages || data.accountPackages || []
    this.advertisements = data.advertisements || []
    this.idNumber = data.id_number || data.idNumber || ""
    this.numberSequence = data.number_sequence || data.numberSequence || ""
    this.description = data.description || ""
    this.image = new File(data.image)
    this.instructions = data.instructions || ""
    this.isPartner = data.is_partner || data.isPartner || ""
    this.metaData = data.meta_data || data.metaData || ""
    this.status = data.status || ""

    this.hasOngoingApplication = data.has_ongoing_application ?? false

    // Bank Details
    this.details = BankConstants.getBankDetailsById(this.id)
  }

  clone(data: Bank) {
    this.id = data.id
    this.name = data.name
    this.nickname = data.nickname
    this.branches = data.branches.map((b) => new BankBranch(b))
    this.accountPackages = data.accountPackages
    this.advertisements = data.advertisements
    this.idNumber = data.idNumber
    this.numberSequence = data.numberSequence
    this.description = data.description
    this.image = new File(data.image)
    this.instructions = data.instructions
    this.isPartner = data.isPartner
    this.metaData = data.metaData
    this.status = data.status

    this.hasOngoingApplication = data.hasOngoingApplication

    // Bank Details
    this.details = BankConstants.getBankDetailsById(this.id)
  }
}
