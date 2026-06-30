export interface IPropsServiceApplicationNode {
  isInFocused: boolean
  isCompleted: boolean
  isShowDocument: boolean
}

export class PropsServiceApplicationNode implements IPropsServiceApplicationNode {
  isInFocused: boolean
  isCompleted: boolean
  isShowDocument: boolean

  constructor(isInFocused: boolean, isCompleted: boolean, isShowDocument: boolean) {
    this.isInFocused = isInFocused
    this.isCompleted = isCompleted
    this.isShowDocument = isShowDocument
  }
}
