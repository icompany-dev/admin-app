export class Coordinate {
  latitude: number
  longitude: number

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude
    this.longitude = longitude
  }

  getJSON(): object {
    return {
      lat: this.latitude.toString(),
      lng: this.longitude.toString(),
    }
  }
}
