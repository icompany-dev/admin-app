import type { Tag } from "../models/Tag"

export interface IPropsTags {
  targetType: string
  targetId: string
  tags: Tag[]
}

export class PropsTags implements IPropsTags {
  targetType: string
  targetId: string
  tags: Tag[]

  constructor(targetType: string, targetId: string, tags: Tag[]) {
    this.targetType = targetType
    this.targetId = targetId
    this.tags = tags
  }
}
