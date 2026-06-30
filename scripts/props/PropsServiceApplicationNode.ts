export interface IPropsServiceApplicationNode {
  isInFocused: boolean
  isCompleted: boolean
  isShowDocument: boolean
  isLastNode: boolean
}

export class PropsServiceApplicationNode implements IPropsServiceApplicationNode {
  isInFocused: boolean
  isCompleted: boolean
  isShowDocument: boolean
  isLastNode: boolean = false

  constructor(isInFocused: boolean, isCompleted: boolean, isShowDocument: boolean) {
    this.isInFocused = isInFocused
    this.isCompleted = isCompleted
    this.isShowDocument = isShowDocument
  }
}
