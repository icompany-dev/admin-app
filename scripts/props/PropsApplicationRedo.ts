import type { IRepositoryStore } from "../models/IRepositoryStore"

export interface IPropsApplicationRedo {
  applicationId: string
  repository: IRepositoryStore
  signatureGroupId: string
}

export class PropsApplicationRedo implements IPropsApplicationRedo {
  applicationId: string
  repository: IRepositoryStore
  signatureGroupId: string

  constructor(applicationId: string, repository: IRepositoryStore, signatureGroupId: string) {
    this.applicationId = applicationId
    this.repository = repository
    this.signatureGroupId = signatureGroupId
  }
}
