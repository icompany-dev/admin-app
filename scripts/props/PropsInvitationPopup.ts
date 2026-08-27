export interface IPropsInvitationPopup {
  targetType: string
  targetId: string
}

export class PropsInvitationPopup implements IPropsInvitationPopup {
  targetType: string
  targetId: string

  constructor(targetType: string, targetId: string) {
    this.targetType = targetType
    this.targetId = targetId
  }
}
