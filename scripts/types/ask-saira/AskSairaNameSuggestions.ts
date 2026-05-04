export class AskSairaNameSuggestions {
  proposedNames: string[] = []

  constructor(data: any) {
    this.proposedNames = data.proposed_names ?? []
  }
}
