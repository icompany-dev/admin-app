import { ServiceLog } from "./ServiceLog"

export class DirectorLog extends ServiceLog {
  directorId: string = ""

  constructor(data: any | null = null) {
    super()

    if (data instanceof DirectorLog) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.directorId = data.director_id
  }

  cloneDetails(data: DirectorLog): void {
    super.clone(data)
    this.directorId = data.directorId
  }
}
