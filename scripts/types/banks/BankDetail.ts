export class BankDetail {
  id: string = ''
  requirements: string = ""
  forDirectors: string = ""
  additionalNotes: string = ""
  url: string = ''


  constructor(data: Partial<BankDetail> = {}) {
    Object.assign(this, data)
  }
}
