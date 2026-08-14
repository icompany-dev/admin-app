//NOTE: This is to connect to the AI Agent for Name reservations
import { z } from "zod"
import OpenAI from "openai"
import { Agent, type AgentInputItem, Runner, withTrace } from "@openai/agents"
import { Error } from "./Error"

export type WorkflowInput = { input_as_text: string }

export class AskSaira {
  workflowId: any = ""

  constructor() {
    let config = useRuntimeConfig()
    this.workflowId = config.public.askSairaWorkflowId ?? ""
  }

  messageValidatorSchema(): any {
    return z.object({ is_company_name: z.boolean(), is_instructions: z.boolean() })
  }

  nameValidatorSchema(): any {
    return z.object({
      is_name_accepted: z.boolean(),
      acceptance_score: z.number(),
      other_name_suggestions: z.string(),
      reasons_rejected: z.string(),
      is_supporting_document_required: z.boolean(),
      documents_required: z.string(),
    })
  }

  instructionsHandlerSchema(): any {
    return z.object({ is_name_suggestion: z.boolean(), is_name_description_suggestion: z.boolean() })
  }

  nameSuggestionSchema(): any {
    return z.object({ name_suggestion_1: z.string(), name_suggestion_2: z.string(), name_suggestion_3: z.string() })
  }

  nameDescriberSchema(): any {
    return z.object({ draft_descriptions: z.string() })
  }

  messageValidator(): any {
    return new Agent({
      name: "Message Validator",
      instructions: `If the user input is a company name, this is a new Sdn Bhd name to be validated.
    
    Other than that, it is an instruction for other use.`,
      model: "gpt-4.1",
      outputType: this.messageValidatorSchema(),
      modelSettings: {
        temperature: 1,
        topP: 1,
        maxTokens: 2048,
        store: true,
      },
    })
  }

  nameValidator(): any {
    return new Agent({
      name: "Name Validator",
      instructions: `Validate the user input as a new Sdn Bhd name in Malaysia. The name cannot be the same as any companies in Malaysia. Use Companies Commission Malaysia (SSM) Naming Guidelines as your reference.
    
    If the name cannot be accepted, or has low likelihood to be accepted,  give the reasons for rejection, and suggest a different name. If other supporting documents required, please indicate so.`,
      model: "gpt-4.1",
      outputType: this.nameValidatorSchema(),
      modelSettings: {
        temperature: 1,
        topP: 1,
        maxTokens: 2048,
        store: true,
      },
    })
  }

  instructionsHandler(): any {
    return new Agent({
      name: "Instructions Handler",
      instructions: `The instructions can be either to suggest a new name for a new Sdn Bhd in Malaysia, or to draft the description of the name.
  
  If it does not fall in any of the category, drop it.`,
      model: "gpt-4.1",
      outputType: this.instructionsHandlerSchema(),
      modelSettings: {
        temperature: 1,
        topP: 1,
        maxTokens: 2048,
        store: true,
      },
    })
  }

  nameSuggestion(): any {
    return new Agent({
      name: "Name Suggestion",
      instructions:
        "Using the instructions, suggest 3 names for a Sdn Bhd that fit best. The suggested names MUST be subjected to SSM Naming Guidelines.",
      model: "gpt-4.1",
      outputType: this.nameSuggestionSchema(),
      modelSettings: {
        temperature: 1,
        topP: 1,
        maxTokens: 2048,
        store: true,
      },
    })
  }

  nameDescriber(): any {
    return new Agent({
      name: "Name Describer",
      instructions:
        "Using the instructions, draft a description for the company name. Use formal tone, short and concised sentences and direct to the point. ",
      model: "gpt-4.1",
      outputType: this.nameDescriberSchema(),
      modelSettings: {
        temperature: 1,
        topP: 1,
        maxTokens: 2048,
        store: true,
      },
    })
  }

  async runNameReservationWorkflow(inputAsText: string): Promise<any> {
    try {
      let askSairaRepository = useAskSairaStore()
      const response = await askSairaRepository.runNameReservationWorkflow(inputAsText)
      if (askSairaRepository.error !== null) {
        throw askSairaRepository.error
      }

      return response
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage = "We are unable to connect to SAIRA at the moment. Please try again later."
        let error: Error = new Error(Error.ERROR_TYPE_API, errorMessage)
        error.handle()
      }
    }
  }
}
