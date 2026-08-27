import type { MalaysiaState } from "./MapStates"

export class OfficeLocation {
  id: string = ""
  name: string = ""
  address: string = ""
  lat: number = 0
  lng: number = 0
  state: MalaysiaState = "Selangor"
  radiusKm: number = 0 // For visualization

  constructor(data: any | null = null) {
    Object.assign(this, data)
  }
}
