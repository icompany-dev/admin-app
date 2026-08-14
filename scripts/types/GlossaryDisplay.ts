export class GlossaryDisplay {
  id: string = ''
  title: string = ''
  summary: string = ''
  description: string = ''

  constructor(
    id: string,
    title: string, 
    summary: string, 
    description: string, 
  ) {
    this.id = id
    this.title = title
    this.summary = summary
    this.description = description
  }
}
