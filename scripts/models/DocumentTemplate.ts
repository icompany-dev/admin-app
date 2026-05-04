import { User } from "./User"

export class DocumentTemplate {
  id: string = ""
  name: string = ""
  type: string = ""
  useCosecLetterhead: boolean = false
  header: string = ""
  title: string = "" // This refers to the resolution title (e.g. DIRECTORS’ RESOLUTION IN WRITING PURSUANT TO PARAGRAPH 15 ...) or the letter subject
  content: string = ""
  isSignatureRequired: boolean = true
  isOnlyOneSignatureRequired: boolean = false
  isCosecSignatureRequired: boolean = false
  maxNumberOfSignatureOnFirstPage: number = 4
  numberOfSignaturePerPage: number = 6
  signeeType: string = ""
  cosecDetails: string = ""
  isDateRequired: boolean = false
  datePosition: string = ""
  isTitleBorderRequired: boolean = false
  isSignatureTitleRequired: boolean = false
  hasPostSignatureContent: boolean = false
  postSignatureContent: string = ""
  status: string = ""
  createdBy: User | null = null
  approvedOn: string | null = null
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (data !== null) {
      if (data instanceof DocumentTemplate) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.type = data.type
    this.useCosecLetterhead = data.use_cosec_letterhead
    this.header = data.header
    this.title = data.title
    this.content = data.content
    this.isSignatureRequired = data.is_signature_required
    this.isOnlyOneSignatureRequired = data.is_only_one_signature_required
    this.isCosecSignatureRequired = data.is_cosec_signature_required
    this.maxNumberOfSignatureOnFirstPage = data.num_signature_on_first_page
    this.numberOfSignaturePerPage = data.num_signature_per_page
    this.signeeType = data.signee_type
    this.cosecDetails = data.cosec_details
    this.isDateRequired = data.is_date_required
    this.datePosition = data.date_position
    this.isTitleBorderRequired = data.is_title_border_required
    this.isSignatureTitleRequired = data.is_signature_title_required
    this.hasPostSignatureContent = data.has_post_signature_content
    this.postSignatureContent = data.post_signature_content
    this.status = data.status
    this.createdBy = new User(data.creator ?? null)
    this.approvedOn = data.approved_on
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  clone(data: DocumentTemplate): void {
    this.id = data.id
    this.name = data.name
    this.type = data.type
    this.useCosecLetterhead = data.useCosecLetterhead
    this.header = data.header
    this.title = data.title
    this.content = data.content
    this.isSignatureRequired = data.isSignatureRequired
    this.isOnlyOneSignatureRequired = data.isOnlyOneSignatureRequired
    this.isCosecSignatureRequired = data.isCosecSignatureRequired
    this.maxNumberOfSignatureOnFirstPage = data.maxNumberOfSignatureOnFirstPage
    this.numberOfSignaturePerPage = data.numberOfSignaturePerPage
    this.signeeType = data.signeeType
    this.cosecDetails = data.cosecDetails
    this.isDateRequired = data.isDateRequired
    this.datePosition = data.datePosition
    this.isTitleBorderRequired = data.isTitleBorderRequired
    this.isSignatureTitleRequired = data.isSignatureTitleRequired
    this.hasPostSignatureContent = data.hasPostSignatureContent
    this.postSignatureContent = data.postSignatureContent
    this.status = data.status
    this.createdBy = new User(data.createdBy ?? null)
    this.approvedOn = data.approvedOn
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {
      name: this.name,
      type: this.type,
      use_cosec_letterhead: this.useCosecLetterhead,
      header: this.header,
      title: this.title,
      content: this.content,
      is_signature_required: this.isSignatureRequired,
      is_only_one_signature_required: this.isOnlyOneSignatureRequired,
      is_cosec_signature_required: this.isCosecSignatureRequired,
      num_signature_on_first_page: this.maxNumberOfSignatureOnFirstPage,
      num_signature_per_page: this.numberOfSignaturePerPage,
      signee_type: this.signeeType,
      cosec_details: this.cosecDetails,
      is_date_required: this.isDateRequired,
      date_position: this.datePosition,
      is_title_border_required: this.isTitleBorderRequired,
      is_signature_title_required: this.isSignatureTitleRequired,
      has_post_signature_content: this.hasPostSignatureContent,
      post_signature_content: this.postSignatureContent,
      status: this.status,
    }
  }
}
