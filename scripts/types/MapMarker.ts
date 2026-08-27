export class MapMarker {
  id: string = ""
  lat: number = 0
  lng: number = 0
  title: string = ""

  constructor(id: string, lat: number, lng: number, title: string) {
    this.id = id
    this.lat = lat
    this.lng = lng
    this.title = title
  }
}
