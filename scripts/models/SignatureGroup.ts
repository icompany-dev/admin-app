import { Error } from "../library/Error"
import { File } from "./File"

export class SignatureGroup {
  id: string = ""
  signature: File | null = null
  group: SignatureGroupGroup | null = null
  target: SignatureGroupTarget | null = null
  email: string = ""
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof SignatureGroup) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.signature = new File(data.signature)
    this.group = new SignatureGroupGroup(data.group.id ?? "", data.group.target ?? "")
    this.target = new SignatureGroupTarget(data.target.id ?? "", data.target.target)
    this.email = data.email
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
  }

  clone(data: SignatureGroup): void {
    this.id = data.id
    this.signature = new File(data.signature)
    this.group = new SignatureGroupGroup(data.group?.id ?? "", data.group?.target ?? "")
    this.target = new SignatureGroupTarget(data.target?.id ?? "", data.target?.target ?? "")
    this.email = data.email
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  getRequestBody(fileId: string): object {
    return {
      signature_id: fileId,
      target: this.target?.target,
      target_id: this.target?.id,
      group: this.group?.target,
      group_id: this.group?.id,
    }
  }

  async uploadSignatureFile(
    signatureFileData: string,
    fileRepository: ReturnType<typeof useFileStore>,
    signatureDate: string
  ): Promise<File> {
    let fileName = crypto.randomUUID()
    let uploadFileData = {
      base64attachment: signatureFileData,
      name: fileName,
      description: `${fileName} Sign on ${signatureDate}`,
      slug: fileName,
    }
    let uploadedFile = await fileRepository.create(uploadFileData)
    if (fileRepository.error) {
      throw fileRepository.error
    }

    return uploadedFile
  }

  async create(
    signatureFileData: string,
    fileRepository: ReturnType<typeof useFileStore>,
    signatureRepository: ReturnType<typeof useSignatureStore>,
    signatureDate: string
  ): Promise<void> {
    if (signatureFileData.length < 0) {
      return
    }

    try {
      let uploadedFile = await this.uploadSignatureFile(signatureFileData, fileRepository, signatureDate)

      let fileId = uploadedFile.id
      let data = this.getRequestBody(fileId)
      let uploadedSignature = await signatureRepository.create(data)
      if (signatureRepository.error) {
        throw signatureRepository.error
      }
      this.convertFromResponse(uploadedSignature)
    } catch (e: any) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }
  }

  async update(
    signatureFileData: string,
    fileRepository: any,
    signatureRepository: any,
    signatureDate: string
  ): Promise<void> {
    if (signatureFileData.length < 0) {
      return
    }

    try {
      let uploadedFile = await this.uploadSignatureFile(signatureFileData, fileRepository, signatureDate)

      let fileId = uploadedFile.id
      let data = this.getRequestBody(fileId)
      let uploadedSignature = await signatureRepository.create(data) // cannot update regardless of what
      if (signatureRepository.error) {
        throw signatureRepository.error
      }
      this.convertFromResponse(uploadedSignature)
    } catch (e: any) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }
  }
}

export class SignatureGroupGroup {
  id: string = ""
  target: string = ""

  constructor(id: string, target: string) {
    this.id = id
    this.target = target
  }
}

export class SignatureGroupTarget {
  id: string = ""
  target: string = ""

  constructor(id: string, target: string) {
    this.id = id
    this.target = target
  }
}
