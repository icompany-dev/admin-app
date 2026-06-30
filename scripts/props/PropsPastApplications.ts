import type { Application } from "../models/Application"
import type { IModelApplication } from "../models/IModelApplication"
import type { IRepositoryStore } from "../models/IRepositoryStore"

export interface IPropsPastApplications {
  companyId: string
  applicationClassType: new (data: any) => Application
  repository: IRepositoryStore
  target: string
}

export class PropsPastApplications implements IPropsPastApplications {
  companyId: string
  applicationClassType: new (data: any) => Application
  repository: IRepositoryStore
  target: string

  constructor(
    companyId: string,
    applicationClassType: new (data: any) => Application,
    repository: IRepositoryStore,
    target: string
  ) {
    this.companyId = companyId
    this.applicationClassType = applicationClassType
    this.repository = repository
    this.target = target
  }
}
