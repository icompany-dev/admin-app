import { Application } from "../models/Application"
import type { IRepositoryStore } from "../models/IRepositoryStore"

export interface IPropsShipApplication {
  application: Application
  target: string
  repository: IRepositoryStore
}

export class PropsShipApplication {
  application: Application
  target: string
  repository: IRepositoryStore

  constructor(application: Application, target: string, repository: IRepositoryStore) {
    this.application = application
    this.target = target
    this.repository = repository
  }
}
