export class DocumentSort {
  id: string = ''
  label: string = ''
  isSelected: boolean = false

  constructor(data: Partial<DocumentSort> = {}) {
    Object.assign(this, data)
  }
}
