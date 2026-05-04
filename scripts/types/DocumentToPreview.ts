export class DocumentToPreview {
  id: string = crypto.randomUUID()
  name: string = ""
  onClick: Function = () => {}

  constructor(name: string, onClick: Function) {
    this.name = name
    this.onClick = onClick
  }
}
