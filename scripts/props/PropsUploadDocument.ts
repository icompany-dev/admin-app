export interface IPropsUploadDocument {
  companyId: string
  canUploadImage: boolean
  canUploadPdf: boolean
}

export class PropsUploadDocument implements IPropsUploadDocument {
  companyId: string
  canUploadImage: boolean = true
  canUploadPdf: boolean = true

  constructor(companyId: string) {
    this.companyId = companyId
  }
}
