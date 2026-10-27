import { DocumentTypes, DocumentType } from "./DocumentTypes"

export class OcrPrompt {
  static byDocumentCategory(
    category: string,
    fileType: string,
    financialYearEnd: string | null = null,
    totalShares: number | null = null
  ) {
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
      case DocumentTypes.CATEGORY_UNAUDITED:
        return `You are an experienced accountant and auditor in malaysia. This company has ${totalShares} share capital.
        Using this management account, generate the statement of financial position, statement of profit or loss, statement of changes in equity, and statement of cashflows for the financial year ended ${financialYearEnd}. 
        Exclude the document headers from the statements you generated.
        Does it passed the threshold for dormant company, revenue threshold to be considered for audit exemption?
        Provide the reason for profit/loss. Your sentence must complete this: The profit/loss for the financial year was attributable to _______.
        Your response must be in JSON Format:
        {
          'possible_for_audit_exemption': boolean,
          'type_of_exemption': [null / dormant / zero-revenue / threshold],
          'is_profit_or_loss': profit / loss,
          'total_profit_or_loss': number,
          'reason_for_profit_or_loss': string,
          'statement_of_financial_position': [{item_type: 'header / subheader / item / total', description: string, amount: number/null}],
          'statement_of_profit_or_loss': [{item_type: 'header / subheader / item / total', description: string, amount: number/null}],
          'statement_of_changes_in_equity': [{item_type: 'header / subheader / item / total', description: string, amount: number/null}],
          'statement_of_cash_flows': [{item_type: 'header / subheader / item / total', description: string, amount: number/null}],
          'notes_to_the_financial_statements': [
            'note_number': number,
            'title': string,
            'content': null / string,
            'char_count': number,
            'subsections': [
              'subtitle': string,
              'content': string,
              'char_count': number
            ]
          ]
        }
        `
      default:
        if (fileType === "pdf") {
          return "You are an expert OCR. Extract the texts from the following document. Return the texts in key-value-pair. If there is no text, return an empty response."
        }
        return "Extract all text from this image. Be precise. If there is no text, return an empty response."
    }
  }
}
