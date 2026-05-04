import type { IModel } from "./IModel"

export class SearchCompany implements IModel<SearchCompany> {
  id: string = ""
  name: string = ""
  nameType: string = ""
  registrationNumberOld: string = ""
  registrationNumberNew: string = ""
  incorporatedAt: string | null = null
  companySettingId: string | null = null


  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof SearchCompany) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ''
    this.name = data.name ?? ''
    this.nameType = data.name_type ?? ''
    this.registrationNumberOld = data.registration_number_old ?? ''
    this.registrationNumberNew = data.registration_number_new ?? ''
    this.incorporatedAt  = data.incorporated_at ?? null
    this.companySettingId = data.company_setting_id ?? null
  }

  clone(data: SearchCompany): void {
    this.id = data.id
    this.name = data.name
    this.nameType = data.nameType
    this.registrationNumberOld = data.registrationNumberOld
    this.registrationNumberNew = data.registrationNumberNew
    this.incorporatedAt = data.incorporatedAt
    this.companySettingId = data.companySettingId
  }

  getRequestBody(): object {
    return {}
  }
}
