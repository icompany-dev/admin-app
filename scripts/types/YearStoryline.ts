import { Storyline } from "../models/Storyline"

export class YearStoryline {
  year: number = 0
  storylines: Storyline[] = []

  constructor(year: number, storylines: Storyline[]) {
    this.year = year
    this.storylines = storylines
  }

  clone(data: YearStoryline): void {
    this.year = data.year
    this.storylines = data.storylines.map((st: Storyline) => {
      return new Storyline(st)
    })
  }
}
