export interface IPropsAssignMsicCode {
  target: string
  targetId: string
}

export class PropsAssignMsicCode implements IPropsAssignMsicCode {
  target: string
  targetId: string

  constructor(target: string, targetId: string) {
    this.target = target
    this.targetId = targetId
  }
}
