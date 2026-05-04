import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"

export class DocumentEmailer {
  name: string = ""
  email: string = ""
  documentName: string = ""
  fileUrl: string = ""

  isMailing: boolean = false
  isSuccess: boolean = false

  constructor(name: string, email: string, documentName: string, fileUrl: string) {
    this.name = name
    this.email = email
    this.documentName = documentName
    this.fileUrl = fileUrl
  }

  async send(): Promise<void> {
    if (!this.areDataValid()) {
      let error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    if (this.isMailing) {
      return
    }

    try {
      this.isMailing = true
      this.isSuccess = false

      let repository = useCompanyDocumentRequestStore()

      const response: any = await repository.email(this.name, this.email, this.documentName, this.fileUrl)

      if (response) {
        this.isSuccess = true
      } else {
        this.isSuccess = false
      }
    } catch (e) {
      this.isSuccess = false
      throw e
    } finally {
      this.isMailing = false
    }
  }

  areDataValid(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.name) &&
      !StringUtil.isNullOrEmpty(this.email) &&
      !StringUtil.isNullOrEmpty(this.documentName) &&
      !StringUtil.isNullOrEmpty(this.fileUrl)
    )
  }
}
