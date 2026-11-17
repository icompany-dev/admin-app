import type { EmailAttachment } from "../models/AdminEmail"

export interface IPropsSendEmail {
  recipients: string[]
  subject: string
  content: string
  fileAttachments: EmailAttachment[]
}

export class PropsSendEmail {
  recipients: string[] = []
  subject: string = ""
  content: string = ""
  fileAttachments: EmailAttachment[] = []

  constructor(
    recipients: string[] = [],
    subject: string = "",
    content: string = "",
    fileAttachments: EmailAttachment[] = []
  ) {
    this.recipients = recipients
    this.subject = subject
    this.content = content
    this.fileAttachments = fileAttachments
  }
}
