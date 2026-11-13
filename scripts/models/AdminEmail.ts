import { StringUtil } from "../utils/String"

export class AdminEmail {
  recipients: string[] = []
  subject: string = ""
  content: string = ""
  fileAttachments: EmailAttachment[] = []

  constructor(data: any | null = null) {
    //
  }

  convertFromResponse(data: any): void {
    this.recipients = data.recipients ?? []
    this.subject = data.subject ?? ""
    this.content = data.content ?? ""
    this.fileAttachments =
      data.file_details && Array.isArray(data.file_details)
        ? data.file_details.map((d: any) => {
            return new EmailAttachment(d)
          })
        : []
  }

  clone(data: AdminEmail): void {
    this.recipients = data.recipients
    this.subject = data.subject
    this.content = data.content
    this.fileAttachments = data.fileAttachments.map((d: any) => {
      return new EmailAttachment(d)
    })
  }

  getRequestBody(): object {
    let data = {
      recipients: this.recipients,
      subject: this.subject,
      content: this.content,
      file_details: this.fileAttachments.map((d: EmailAttachment) => {
        return d.getRequestBody()
      }),
    }

    return data
  }

  canSubmit(): boolean {
    return this.recipients.length > 0 && !StringUtil.isNullOrEmpty(this.subject)
  }
}

export class EmailAttachment {
  url: string = ""
  fileName: string = ""
  mimeType: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof EmailAttachment) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.url = data.url ?? ""
    this.fileName = data.file_name ?? ""
    this.mimeType = data.mime_type ?? ""
  }

  clone(data: EmailAttachment): void {
    this.url = data.url
    this.fileName = data.fileName
    this.mimeType = data.mimeType
  }

  getRequestBody(): object {
    return {
      url: this.url,
      file_name: this.fileName,
      mime_type: this.mimeType,
    }
  }

  canSubmit(): boolean {
    return (
      !StringUtil.isNullOrEmpty(this.url) &&
      !StringUtil.isNullOrEmpty(this.fileName) &&
      !StringUtil.isNullOrEmpty(this.mimeType)
    )
  }
}
