export class DivToFile {
  filename: string = ""
  div: HTMLElement

  constructor(filename: string, div: HTMLElement) {
    this.filename = filename
    this.div = div
  }
}
