import { FormType } from "./FormType"
import { FormDocumentBundleMapping } from "./FormDocumentBundleMapping"

export class FormDocumentBundle {
  id: string = ""
  formTypeId: string = ""
  formType: FormType = new FormType()
  name: string = ""
  nameBm: string = ""
  servicePricingId: string = ""
  mappings: FormDocumentBundleMapping[] = []
  createdAt: string | null = null
  updatedAt: string | null = null
  deletedAt: string | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof FormDocumentBundle) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.formTypeId = data.form_type_id
    this.formType = new FormType(data.form_type)
    this.name = data.name
    this.nameBm = data.name_bm
    this.servicePricingId = data.service_pricing_id
    this.mappings =
      data.mappings && Array.isArray(data.mappings)
        ? data.mappings.map((d: any) => {
            return new FormDocumentBundleMapping(d)
          })
        : []
    this.createdAt = data.created_at
    this.updatedAt = data.updated_at
    this.deletedAt = data.deleted_at
  }

  clone(data: FormDocumentBundle): void {
    this.id = data.id
    this.formTypeId = data.formTypeId
    this.formType = new FormType(data.formType)
    this.name = data.name
    this.nameBm = data.nameBm
    this.servicePricingId = data.servicePricingId
    this.mappings = data.mappings.map((d: FormDocumentBundleMapping) => {
      return new FormDocumentBundleMapping(d)
    })
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }
}
