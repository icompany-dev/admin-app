export class ReceiptTableRow {
  rowClass: string = ""
  item: ReceiptTableColumn
  quantity: ReceiptTableColumn
  price: ReceiptTableColumn

  constructor(
    rowClass: string,
    item: ReceiptTableColumn,
    quantity: ReceiptTableColumn,
    price: ReceiptTableColumn
  ) {
    this.rowClass = rowClass
    this.item = item
    this.quantity = quantity
    this.price = price
  }
}

export class ReceiptTableColumn {
  value: string = ""
  cssClass: string = ""
  showColumn: boolean = false
  colspan: number = 1

  constructor(
    value: string,
    cssClass: string,
    showColumn: boolean,
    colspan: number
  ) {
    this.value = value
    this.cssClass = cssClass
    this.showColumn = showColumn
    this.colspan = colspan
  }
}
