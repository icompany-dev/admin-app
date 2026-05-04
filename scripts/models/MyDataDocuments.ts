import type { IModel } from "./IModel"

export class MyDataDocuments implements IModel<MyDataDocuments> {
  id: string = "" //This is for structure purposes.
  myDataOrderNumber: string = ""
  myDataInvoiceNumber: string = ""
  errorMessage: string = ""
  successCode: string = ""
  noOfDocuments: number = 0
  documents: MyDataDocument[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof MyDataDocuments) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.myDataOrderNumber = data.mydata_order_number
    this.myDataInvoiceNumber = data.mydata_invoice_number
    this.errorMessage = data.error_message
    this.successCode = data.success_code
    this.noOfDocuments = data.no_of_documents
    this.documents =
      data.documents && Array.isArray(data.documents)
        ? data.documents.map((doc: any) => {
            return new MyDataDocument(doc)
          })
        : []
  }

  clone(data: MyDataDocuments): void {
    this.id = data.id
    this.myDataOrderNumber = data.myDataOrderNumber
    this.myDataInvoiceNumber = data.myDataInvoiceNumber
    this.errorMessage = data.errorMessage
    this.successCode = data.successCode
    this.noOfDocuments = data.noOfDocuments
    this.documents = data.documents.map((doc: MyDataDocument) => {
      return new MyDataDocument(doc)
    })
  }

  getRequestBody(): object {
    return {}
  }
}

export class MyDataDocument implements IModel<MyDataDocument> {
  companyNo: string = ""
  documentDate: string = ""
  formType: string = ""
  formDescription: string = ""
  totalPages: number = 1
  myDataFileId: number = 0

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof MyDataDocument) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.companyNo = data.company_no
    this.documentDate = data.document_date
    this.formType = data.form_type
    this.formDescription = data.form_description
    this.totalPages = data.total_pages
    this.myDataFileId = data.mydata_file_id
  }

  clone(data: MyDataDocument): void {
    this.companyNo = data.companyNo
    this.documentDate = data.documentDate
    this.formType = data.formType
    this.formDescription = data.formDescription
    this.totalPages = data.totalPages
    this.myDataFileId = data.myDataFileId
  }

  getRequestBody(): object {
    return {}
  }
}
