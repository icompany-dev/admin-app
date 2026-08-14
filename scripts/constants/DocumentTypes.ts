export class DocumentType {
  id: string = ""
  value: string = ""
  category: string = ""

  constructor(id: string, value: string, category: string) {
    this.id = id
    this.value = value
    this.category = category
  }
}

export class DocumentTypes {
  // Accounting Documents
  static BANK_STATEMENT: string = "bank-statement"
  static BANK_STATEMENT_NAME: string = "Bank Statement"
  static SALE_INVOICE: string = "sale-invoice"
  static SALE_INVOICE_NAME: string = "Sale Invoice"
  static PURCHASE_INVOICE: string = "purchase-invoice"
  static PURCHASE_INVOICE_NAME: string = "Purchase Invoice"
  static CASH_PAYMENT_MADE: string = "cash-payment-made"
  static CASH_PAYMENT_MADE_NAME: string = "Cash Payment Made"
  static CASH_PAYMENT_RECEIVED: string = "cash-payment-received"
  static CASH_PAYMENT_RECEIVED_NAME: string = "Cash Payment Received"
  static PAYMENT_RECEIPT: string = "payment-receipt"
  static PAYMENT_RECEIPT_NAME: string = "Payment Receipt"

  // Cosec Documents
  static DIRECTORS_RESOLUTION: string = "dcr"
  static DIRECTORS_RESOLUTION_NAME: string = "Directors' Circulation Resolution"
  static MEMBERS_RESOLUTION: string = "mcr"
  static MEMBERS_RESOLUTION_NAME: string = "Members' Circulation Resolution"
  static CONSTITUTION: string = "constitution"
  static CONSTITUTION_NAME: string = "Company Constitution"
  static STATUTORY_FORM: string = "statutory-form"
  static STATUTORY_FORM_NAME: string = "Statutory Form"
  static DECLARATION: string = "declaration"
  static DECLARATION_NAME: string = "Declaration"

  // Audit Documents
  static AUDITED_FINANCIAL_STATEMENTS: string = "audited-financial-statements"
  static AUDITED_FINANCIAL_STATEMENTS_NAME: string = "Audited Financial Statements"
  static UNAUDITED_FINANCIAL_STATEMENTS: string = "unaudited-financial-statements"
  static UNAUDITED_FINANCIAL_STATEMENTS_NAME: string = "Unaudited Financial Statements"

  static CATEGORY_FINANCIAL: string = "financial"
  static CATEGORY_COSEC: string = "cosec"
  static CATEGORY_AUDIT: string = "audit"

  static DOCUMENT_DATA: DocumentType[] = [
    new DocumentType(this.BANK_STATEMENT, this.BANK_STATEMENT_NAME, this.CATEGORY_FINANCIAL),
    new DocumentType(this.SALE_INVOICE, this.SALE_INVOICE_NAME, this.CATEGORY_FINANCIAL),
    new DocumentType(this.PURCHASE_INVOICE, this.PURCHASE_INVOICE_NAME, this.CATEGORY_FINANCIAL),
    new DocumentType(this.CASH_PAYMENT_MADE, this.CASH_PAYMENT_MADE_NAME, this.CATEGORY_FINANCIAL),
    new DocumentType(this.CASH_PAYMENT_RECEIVED, this.CASH_PAYMENT_RECEIVED_NAME, this.CATEGORY_FINANCIAL),
    new DocumentType(this.PAYMENT_RECEIPT, this.PAYMENT_RECEIPT_NAME, this.CATEGORY_FINANCIAL),
    new DocumentType(this.DIRECTORS_RESOLUTION, this.DIRECTORS_RESOLUTION_NAME, this.CATEGORY_COSEC),
    new DocumentType(this.MEMBERS_RESOLUTION, this.MEMBERS_RESOLUTION_NAME, this.CATEGORY_COSEC),
    new DocumentType(this.CONSTITUTION_NAME, this.CONSTITUTION, this.CATEGORY_COSEC),
    new DocumentType(this.STATUTORY_FORM, this.STATUTORY_FORM_NAME, this.CATEGORY_COSEC),
    new DocumentType(this.DECLARATION, this.DECLARATION_NAME, this.CATEGORY_COSEC),
    new DocumentType(this.AUDITED_FINANCIAL_STATEMENTS, this.AUDITED_FINANCIAL_STATEMENTS_NAME, this.CATEGORY_AUDIT),
    new DocumentType(
      this.UNAUDITED_FINANCIAL_STATEMENTS,
      this.UNAUDITED_FINANCIAL_STATEMENTS_NAME,
      this.CATEGORY_AUDIT
    ),
  ]
}
