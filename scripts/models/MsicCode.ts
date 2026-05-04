import { BaseModel } from "./BaseModel"
import type { IModel } from "./IModel"

export class MsicCode extends BaseModel<MsicCode> implements IModel<MsicCode> {
  categoryCode: string = ""
  categoryDescription: string = ""
  categoryDescriptionEn: string = ""
  subCategoryDescription: string = ""
  subCategoryDescriptionEn: string = ""
  subSubCategoryDescription: string = ""
  subSubCategoryDescriptionEn: string = ""
  code: string = ""
  metaData: MsicCodeMetaData = new MsicCodeMetaData() //string = ""
  description: string = ""
  descriptionEn: string = ""

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof MsicCode) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  override convertFromResponse(data: any): void {
    this.id = data.id
    this.categoryCode = data.category_code ?? ""
    this.categoryDescription = data.category_description ?? ""
    this.categoryDescriptionEn = data.category_description_en ?? ""
    this.subCategoryDescription = data.sub_category_description ?? ""
    this.subCategoryDescriptionEn = data.sub_category_description_en ?? ""
    this.subSubCategoryDescription = data.sub_sub_category_description ?? ""
    this.subSubCategoryDescriptionEn = data.sub_sub_category_description_en ?? ""
    this.code = data.code ?? ""
    this.metaData = new MsicCodeMetaData(data.meta_data)
    this.description = data.description ?? ""
    this.descriptionEn = data.description_en ?? ""
    this.updatedAt = data.updated_at
    this.createdAt = data.created_at
  }

  override clone(data: MsicCode): void {
    this.id = data.id
    this.categoryCode = data.categoryCode
    this.categoryDescription = data.categoryDescription
    this.categoryDescriptionEn = data.categoryDescriptionEn
    this.subCategoryDescription = data.subCategoryDescription
    this.subCategoryDescriptionEn = data.subCategoryDescriptionEn
    this.subSubCategoryDescription = data.subSubCategoryDescription
    this.subSubCategoryDescriptionEn = data.subSubCategoryDescriptionEn
    this.code = data.code
    this.metaData = new MsicCodeMetaData(data.metaData)
    this.description = data.description
    this.descriptionEn = data.descriptionEn
    this.updatedAt = data.updatedAt
    this.createdAt = data.createdAt
  }

  getRequestBody(): object {
    return {}
  }
}

export class MsicCodeMetaData {
  isAdditionalDocumentRequired: boolean = false
  instructions: string = ""
  instructionsBm: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof MsicCodeMetaData) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.isAdditionalDocumentRequired = data.require_additional_document_flag
    this.instructions = data.document_requirement_label_en
    this.instructionsBm = data.document_requirement_label
  }

  clone(data: MsicCodeMetaData): void {
    this.isAdditionalDocumentRequired = data.isAdditionalDocumentRequired
    this.instructions = data.instructions
    this.instructionsBm = data.instructionsBm
  }
}
