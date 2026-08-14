import { StringUtil } from "../utils/String"
import type { IModel } from "./IModel"
import _ from 'lodash'

export class CompanyNameRegister implements IModel<CompanyNameRegister> {
  id: string = ''
  name: string = ''
  nameType: string = ''
  metaData: any | null = null
  status: string = ''

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyNameRegister) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }
  
  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.nameType = data.name_type
    this.metaData = data.meta_data ? _.cloneDeep(data.meta_data) : null
    this.status = data.status
  }

  clone(data: CompanyNameRegister): void {
    this.id = data.id
    this.name = data.name
    this.nameType = data.nameType
    this.metaData = data.metaData ? _.cloneDeep(data.metaData) : null
    this.status = data.status
  }

  getRequestBody(): object{
    return {
      name: this.name,
      name_type: this.nameType,
      status: this.status
    }
  }

  async create(repository: any): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.name)) {
      return
    }

    let data = this.getRequestBody()
    await repository.create(data)
  }
}