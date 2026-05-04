import { ExternalApi } from "./ExternalApi"
import { ChatbotMessage } from "../types/ChatbotMessage"

export class OpenAiApi extends ExternalApi {
  assistantId: string
  static ASSISTANT_V2_OPTIONS = {
    headers: {
      "OpenAI-Beta": "assistants=v2",
    },
  }

  constructor(
    baseUrl: string,
    apiKeyName: string | null,
    apiKeyValue: string | null,
    assistantId: string
  ) {
    super(baseUrl, apiKeyName, apiKeyValue, "application/json")
    this.assistantId = assistantId
  }

  async createThread(): Promise<any> {
    try {
      const response = await this.post(
        "threads",
        {},
        OpenAiApi.ASSISTANT_V2_OPTIONS
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async addMessage(threadId: string, message: ChatbotMessage): Promise<any> {
    try {
      const response = await this.post(
        `threads/${threadId}/messages`,
        message,
        OpenAiApi.ASSISTANT_V2_OPTIONS
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async runThread(threadId: string): Promise<any> {
    try {
      const response = await this.post(
        `threads/${threadId}/runs`,
        { assistant_id: this.assistantId },
        OpenAiApi.ASSISTANT_V2_OPTIONS
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async getRunStatus(threadId: string, runId: string): Promise<any> {
    try {
      const response = await this.get(
        `threads/${threadId}/runs/${runId}`,
        OpenAiApi.ASSISTANT_V2_OPTIONS
      )
      return response
    } catch (error) {
      throw error
    }
  }

  async getMessages(threadId: string): Promise<any> {
    try {
      const response = await this.get(
        `threads/${threadId}/messages`,
        OpenAiApi.ASSISTANT_V2_OPTIONS
      )
      return response
    } catch (error) {
      throw error
    }
  }
}
