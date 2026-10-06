export class ManagementAccountTableColumn {
  content: string = ""
  type: string = ""
  cssClass: string = ""
  colSpan: number = 1
  onClick: Function = (value: any) => {}
  onDeleteClick: Function = (value: any) => {}
  onChange: Function = (value: any) => {}

  isDeletable: boolean = false
  isEditable: boolean = false
  hasMoreInfo: boolean = false
  hasOptions: boolean = false

  hasLabel: boolean = false
  labelString: string = ""

  placeholder: string = ""

  id: string = ""

  inputType: string = "text"

  constructor(
    content: string,
    type: string,
    cssClass: string,
    colSpan: number,
    onClick: Function,
    id: string = "",
    onDeleteClick: Function = () => {},
    onChange: Function = () => {}
  ) {
    this.content = content
    this.type = type
    this.cssClass = cssClass
    this.colSpan = colSpan
    this.onClick = onClick
    this.id = id
    this.onDeleteClick = onDeleteClick
    this.onChange = onChange
  }
}
