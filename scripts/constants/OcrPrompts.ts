import { DocumentTypes, DocumentType } from "./DocumentTypes"

export class OcrPrompt {
  static byDocumentCategory(category: string, fileType: string) {
    switch (category) {
      case DocumentTypes.CATEGORY_FINANCIAL:
        let document = fileType === "pdf" ? "document" : "image"
        return `The ${document} can be either a bank statement, invoice, or receipt.
          Tell me the document date, reference number, bank name (if bank statement), opening balance and balance (if bank statement), invoice to whom (if invoice), payment received from (if receipt), total invoice or receipt.
          Your response should in json format: { document_date: YYYY-MM-DD, ref_no: "", bank_name: "", opening_balance: "", total: "", from: "" }. 
          Return the texts in key-value pair.
        `
      case DocumentTypes.CATEGORY_AUDIT:
        return `The document is a financial statement from a Sdn Bhd in Malaysia. 
          Based on the requirements from Companies Commission Malaysia and the Companies Act 2016, does the company qualify to submit unaudited financial statements? 
          Your response should be in json format: { can_submit_unaudited: boolean, reason: "" }.`
      default:
        if (fileType === "pdf") {
          return "You are an expert OCR. Extract the texts from the following document. Return the texts in key-value-pair. If there is no text, return an empty response."
        }
        return "Extract all text from this image. Be precise. If there is no text, return an empty response."
    }
  }
}
