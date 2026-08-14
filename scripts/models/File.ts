import _ from "lodash"
import type { IModel } from "./IModel"

export class File implements IModel<File> {
  id: string = ""
  name: string = ""
  slug: string = ""
  description: string = ""
  url: string = ""
  categories: any[] = []
  extension: string = ""
  size: number = 0
  type: string = ""
  mimeType: string = ""
  server: number | null = null
  dimensions: object | null = null
  variations: any[] = []

  createdAt: string | null = null
  updatedAt: string | null = null

  constructor(data: any = null) {
    if (data) {
      if (data instanceof File) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  convertFromResponse(data: any) {
    this.id = data.id
    this.name = data.name
    this.slug = data.slug
    this.description = data.description || ""
    this.url = data.url || ""
    this.categories = data.categories !== null ? _.cloneDeep(data.categories) : []
    this.extension = data.extension || ""
    this.size = data.size || 0
    this.type = data.type || ""
    this.mimeType = data.mime_type || ""
    this.server = data.server
    this.dimensions = data.dimensions !== null ? _.cloneDeep(data.dimensions) : null
    this.variations = data.variations !== null ? _.cloneDeep(data.variations) : []
    this.createdAt = data.created_at || null
    this.updatedAt = data.updated_at || null
  }

  clone(data: File) {
    this.id = data.id
    this.name = data.name
    this.slug = data.slug
    this.description = data.description || ""
    this.url = data.url || ""
    this.categories = data.categories !== null ? _.cloneDeep(data.categories) : []
    this.extension = data.extension || ""
    this.size = data.size || 0
    this.type = data.type || ""
    this.mimeType = data.mimeType || ""
    this.server = data.server
    this.dimensions = data.dimensions
    this.variations = data.variations !== null ? _.cloneDeep(data.variations) : []
    this.createdAt = data.createdAt || null
    this.updatedAt = data.updatedAt || null
  }

  getRequestBody(): object {
    return {}
  }

  async uploadFile(fileToUpload: globalThis.File, repository: any): Promise<void> {
    const formData = new FormData()
    const type = fileToUpload.type
    const fileNameLength = this.name.length ?? fileToUpload.name.length
    const fileName = fileNameLength > 40 ? this.name.substring(0, 41) : this.name
    formData.append("attachment", fileToUpload)
    formData.append("type", type)
    formData.append("name", fileName)
    await repository.uploadFile(formData)
    this.clone(repository.file)
  }
}

export class FileBase64Response {
  fileUrl: string = ""
  base64: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof FileBase64Response) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.fileUrl = data.file_url ?? ""
    this.base64 = data.base64 ?? ""
  }

  clone(data: FileBase64Response): void {
    this.fileUrl = this.fileUrl
    this.base64 = this.base64
  }
}
