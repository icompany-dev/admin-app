export class ChatbotMessage {
  role: string = '' // assistant, user
  content: string = ''

  constructor(role: string, content: string) {
    this.role = role
    this.content = content
  }
}
