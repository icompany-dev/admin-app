import type { IReadOnly } from "./IReadOnly"

export class Storyline implements IReadOnly<Storyline> {
  id: string = ""
  date: string = ""
  name: string = ""
  target: StorylineTarget = new StorylineTarget()
  action: string = ""
  appStatus: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Storyline) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? ""
    this.date = data.date
    this.name = data.name
    this.target = new StorylineTarget(data.target)
    this.action = data.action
    this.appStatus = data.app_status ?? ""
  }

  clone(data: Storyline): void {
    this.id = data.id
    this.date = data.date
    this.name = data.name
    this.target = new StorylineTarget(data.target)
    this.action = data.action
    this.appStatus = data.appStatus
  }
}

export class StorylineTarget implements IReadOnly<StorylineTarget> {
  id: string = ""
  type: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof StorylineTarget) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.type = data.type
  }

  clone(data: StorylineTarget): void {
    this.id = data.id
    this.type = data.type
  }
}
