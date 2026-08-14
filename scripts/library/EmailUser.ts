import { StringUtil } from "../utils/String"

/**
 * NOTE: This class is for connecting to Gmail immediately
 *  -- We can ride on this later to send email through our Backend API
 */
export class EmailUser {
  recipientAddress: string = ""
  subject: string = ""
  body: string = ""
  cc: string = ""
  bcc: string = ""

  constructor(emailAddress: string) {
    this.recipientAddress = emailAddress
  }

  connectToGmail(): void {
    if (StringUtil.isNullOrEmpty(this.recipientAddress)) {
      return
    }

    const baseUrl = "https://mail.google.com/mail/?view=cm&fs=1"
    const params = new URLSearchParams()

    params.append("to", this.recipientAddress)

    if (!StringUtil.isNullOrEmpty(this.subject)) {
      params.append("su", this.subject)
    }

    if (!StringUtil.isNullOrEmpty(this.body)) {
      params.append("body", this.body)
    }

    if (!StringUtil.isNullOrEmpty(this.cc)) {
      params.append("cc", this.cc)
    }

    if (!StringUtil.isNullOrEmpty(this.bcc)) {
      params.append("bcc", this.bcc)
    }

    let emailUrl = `${baseUrl}&${params.toString()}`

    window.open(emailUrl, "_blank")
  }
}
