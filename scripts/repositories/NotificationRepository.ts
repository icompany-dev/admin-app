import { Repository } from "./Repository"

export class NotificationRepository extends Repository<any> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Object)
  }

  async sendEmailNotification(
    subject: string,
    content: string,
    receiverEmails: string[] = []
  ): Promise<any> {
    const data = {
      method: "email",
      subject,
      receiver_emails: receiverEmails,
      content
    }
    return await this.post<any>(this.resourceUrl, data)
  }
}
