import type { IRepositoryStore } from "../models/IRepositoryStore"

export interface IPropsCreateNewApplication {
  repository: IRepositoryStore | null
}

export class PropsCreateNewApplication implements IPropsCreateNewApplication {
  repository: IRepositoryStore | null

  constructor(repository: IRepositoryStore | null) {
    this.repository = repository
  }
}
