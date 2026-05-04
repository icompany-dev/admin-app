export class PageButtonOption {
  id: string = crypto.randomUUID()
  name: string = ""
  nameBm: string = ""
  isDisabled: boolean = false
  isSelected: boolean = false
  cta: Function = () => {}

  constructor(name: string, nameBm: string, isDisabled: boolean, isSelected: boolean, cta: Function) {
    this.name = name
    this.nameBm = nameBm
    this.isDisabled = isDisabled
    this.isSelected = isSelected
    this.cta = cta
  }

  clone(data: PageButtonOption): void {
    this.id = data.id
    this.name = data.name
    this.nameBm = data.nameBm
    this.isDisabled = data.isDisabled
    this.isSelected = data.isSelected
    this.cta = data.cta
  }

  onClick(): void {
    if (this.isDisabled) {
      return
    }

    this.cta()
  }
}
