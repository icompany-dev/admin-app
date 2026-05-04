export class OnlineBanking {
  id: string = ""
  name: string = ""
  role: string = ""
  identification: string = ""
  designation: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    this.id = data.id ?? ""
    this.name = data.name ?? ""
    this.role = data.role ?? ""
    this.identification = data.identification ?? ""
    this.designation = data.designation ?? ""
  }
}
