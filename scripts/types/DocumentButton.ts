export class DocumentButton {
  id: string = ''
  class: string = ''
  icon: string = ''
  disabled: () => boolean = () => { return true }
  cta: (event: MouseEvent) => void = () => {}

  constructor(data: Partial<DocumentButton> = {}) {
    Object.assign(this, data)
  }
}