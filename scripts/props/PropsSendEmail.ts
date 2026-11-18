import type { EmailAttachment } from "../models/AdminEmail"

export interface IPropsSendEmail {
  recipients: string[]
  subject: string
  content: string
  fileAttachments: EmailAttachment[]
  files: File[]

  directorEmails: string[]
  shareholderEmails: string[]
}

export class PropsSendEmail implements IPropsSendEmail {
  recipients: string[] = []
  subject: string = ""
  content: string = ""
  fileAttachments: EmailAttachment[] = []
  files: File[] = []
  directorEmails: string[] = []
  shareholderEmails: string[] = []

  constructor(
    recipients: string[] = [],
    subject: string = "",
    content: string = "",
    fileAttachments: EmailAttachment[] = [],
    files: File[] = [],
    directorEmails: string[] = [],
    shareholderEmails: string[] = []
  ) {
    this.recipients = recipients
    this.subject = subject
    this.content = content
    this.fileAttachments = fileAttachments
    this.files = files
    this.directorEmails = directorEmails
    this.shareholderEmails = shareholderEmails
  }
}
