export interface IPropsDeleteApplication {
  targetType: string
  targetId: string
}

export class PropsDeleteApplication implements IPropsDeleteApplication {
  targetType: string
  targetId: string

  constructor(targetType: string, targetId: string) {
    this.targetType = targetType
    this.targetId = targetId
  }
}
