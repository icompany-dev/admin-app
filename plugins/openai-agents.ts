import { defineNuxtPlugin } from "#app"
import { Agent, run } from "@openai/agents"

export default defineNuxtPlugin((nuxtApp) => {
  const apiKey = process.env.OPENAI_API_KEY
  nuxtApp.provide("openaiAgentRun", async (input: string) => {
    const agent = new Agent({ name: "Assistant", instructions: "You are a helpful assistant." })
    const result = await run(agent, input)
    return result.finalOutput
  })
})
