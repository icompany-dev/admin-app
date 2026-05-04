import { File } from "../models/File"
import { User } from "../models/User"

export class ClientDueDiligenceDeclaration {
  id: string = ""
  companyId: string = ""
  user: User = new User()
  target: string = ""
  targetId: string = ""
  file: File = new File()
  createdAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ClientDueDiligenceDeclaration) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.companyId = data.company_id
    this.user = new User(data.user)
    this.target = data.target
    this.targetId = data.target_id
    this.file = new File(data.file)
    this.createdAt = data.created_at
  }

  clone(data: ClientDueDiligenceDeclaration): void {
    this.id = data.id
    this.companyId = data.companyId
    this.user = new User(data.user)
    this.target = data.target
    this.targetId = data.targetId
    this.file = new File(data.file)
    this.createdAt = data.createdAt
  }

  getRequestBody(): object {
    return {}
  }
}
