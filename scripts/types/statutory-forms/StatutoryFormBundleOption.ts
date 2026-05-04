export class StatutoryFormBundleOption {
  id: string = crypto.randomUUID()
  name: string = ""
  nameBm: string = ""
  bundleType: string | null = null
  isSelected: boolean = false

  constructor(name: string, nameBm: string, bundleType: string | null, isSelected: boolean) {
    this.name = name
    this.nameBm = nameBm
    this.bundleType = bundleType
    this.isSelected = isSelected
  }

  clone(data: StatutoryFormBundleOption): void {
    this.id = data.id
    this.name = data.name
    this.nameBm = data.nameBm
    this.bundleType = data.bundleType
    this.isSelected = data.isSelected
  }
}
