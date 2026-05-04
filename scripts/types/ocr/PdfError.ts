export class PdfError {
  name: string = ""
  message: string = ""

  constructor(data: Partial<PdfError>) {
    this.name = data.name ?? ""
    this.message = data.message ?? ""
  }
}
