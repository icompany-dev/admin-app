import type { IRepositoryStore } from "../models/IRepositoryStore"

export interface IPropsCreateNewApplication {
  repository: IRepositoryStore | null
  target: string
}

export class PropsCreateNewApplication implements IPropsCreateNewApplication {
  repository: IRepositoryStore | null
  target: string

  constructor(repository: IRepositoryStore | null, target: string) {
    this.repository = repository
    this.target = target
  }
}
