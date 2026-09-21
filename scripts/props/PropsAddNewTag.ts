export interface IPropsAddNewTag {
  targetType: string
  targetId: string
}

export class PropsAddNewTag {
  targetType: string
  targetId: string

  constructor(targetType: string, targetId: string) {
    this.targetType = targetType
    this.targetId = targetId
  }
}
