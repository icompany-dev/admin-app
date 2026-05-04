import type { IModel } from "./IModel"
export class Glossary implements IModel<Glossary> {
  id: string = ""
  number: number = 0
  keywords: string[] = []
  items: GlossaryItem[] = []

  constructor(data: any = null) {
    if (data !== null) {
      if (data instanceof Glossary) {
        this.clone(data)
      } else {
        this.convertFromResponse(data)
      }
    }
  }

  clone(data: Glossary) {
    this.id = data.id
    this.number = data.number
    this.keywords = data.keywords.map((val) => {
      return val
    })
    this.items = data.items.map((val: GlossaryItem): GlossaryItem => {
      return new GlossaryItem(val.language, val.title, val.summary, val.description)
    })
  }

  convertFromResponse(data: any) {
    this.id = data.id
    this.number = data.number
    this.keywords =
      data.keywords.length > 0
        ? data.keywords.split(",").map((d: string) => {
            return d.trim()
          })
        : []
    this.items =
      data.items.length > 0
        ? data.items.map((val: any): GlossaryItem => {
            return new GlossaryItem(val.language, val.title, val.summary, val.description)
          })
        : []
  }

  getRequestBody() {
    return {}
  }
}

export class GlossaryItem {
  language: string
  title: string = ""
  summary: string = ""
  description: string = ""

  constructor(language: string, title: string, summary: string, description: string) {
    this.language = language
    this.title = title
    this.summary = summary
    this.description = description
  }
}
