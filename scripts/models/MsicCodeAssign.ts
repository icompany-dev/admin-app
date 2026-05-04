import { BaseModel } from "./BaseModel"
import { File } from "./File"
import type { IModel } from "./IModel"
import { MsicCode } from "./MsicCode"

export class MsicCodeAssign extends BaseModel<MsicCodeAssign> implements IModel<MsicCodeAssign> {
  msicCode: MsicCode = new MsicCode()
  documentRequired: File | null = null
  assign: MsicCodeAssignTarget = new MsicCodeAssignTarget()

  constructor(data: any | null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof MsicCodeAssign) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  override convertFromResponse(data: any): void {
    this.id = data.id
    this.msicCode = new MsicCode(data.msic_code)
    this.documentRequired = data.document_requirement ? new File(data.document_requirement) : null
    this.assign = new MsicCodeAssignTarget(data.assign)
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
  }

  override clone(data: MsicCodeAssign): void {
    this.id = data.id
    this.msicCode = new MsicCode(data.msicCode)
    this.documentRequired = data.documentRequired ? new File(data.documentRequired) : null
    this.assign = new MsicCodeAssignTarget(data.assign)
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(): object {
    return {}
  }
}

export class MsicCodeAssignTarget extends BaseModel<MsicCodeAssignTarget> {
  target: string = ""

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof MsicCodeAssignTarget) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  override convertFromResponse(data: any): void {
    this.id = data.id
    this.target = data.target
  }

  override clone(data: MsicCodeAssignTarget): void {
    this.id = data.id
    this.target = data.target
  }

  getRequestBody(): object {
    return {
      id: this.id,
      target: this.target,
    }
  }
}
