import type { EmailAttachment } from "../models/AdminEmail"

export interface IPropsSendEmail {
  recipients: string[]
  subject: string
  content: string
  fileAttachments: EmailAttachment[]
  files: File[]
}

export class PropsSendEmail {
  recipients: string[] = []
  subject: string = ""
  content: string = ""
  fileAttachments: EmailAttachment[] = []
  files: File[] = []

  constructor(
    recipients: string[] = [],
    subject: string = "",
    content: string = "",
    fileAttachments: EmailAttachment[] = [],
    files: File[] = []
  ) {
    this.recipients = recipients
    this.subject = subject
    this.content = content
    this.fileAttachments = fileAttachments
    this.files = files
  }
}
