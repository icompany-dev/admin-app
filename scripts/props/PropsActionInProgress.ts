export interface IPropsActionInProgress {
  totalActionsToTake: number
  currentActionAt: number
  actionName: string
}

export class PropsActionInProgress implements IPropsActionInProgress {
  totalActionsToTake: number = 0
  currentActionAt: number = 0
  actionName: string = ""

  constructor(totalActionsToTake: number, currentActionAt: number, actionName: string) {
    this.totalActionsToTake = totalActionsToTake
    this.currentActionAt = currentActionAt
    this.actionName = actionName
  }
}
