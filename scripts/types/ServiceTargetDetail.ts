import type { IRepositoryStore } from "~/scripts/models/IRepositoryStore"

export class ServiceTargetDetail {
  name: string
  repository: IRepositoryStore

  constructor(name: string, repository: IRepositoryStore) {
    this.name = name
    this.repository = repository
  }
}
