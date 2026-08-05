export class Coordinate {
  lat = 0
  lng = 0

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Coordinate) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.lat = data.lat ?? 0.0
    this.lng = data.lng ?? 0.0
  }

  clone(data: Coordinate): void {
    this.lat = data.lat
    this.lng = data.lng
  }

  getJson() {
    return {
      lat: this.lat,
      lng: this.lng,
    }
  }
}
