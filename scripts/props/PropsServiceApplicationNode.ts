export interface IPropsServiceApplicationNode {
  isInFocused: boolean
  isCompleted: boolean
}

export class PropsServiceApplicationNode {
  isInFocused: boolean
  isCompleted: boolean

  constructor(isInFocused: boolean, isCompleted: boolean) {
    this.isInFocused = isInFocused
    this.isCompleted = isCompleted
  }
}
