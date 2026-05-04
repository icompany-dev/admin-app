export class PDFCanvasItem {
  element: HTMLCanvasElement
  context: CanvasRenderingContext2D | null

  constructor(element: HTMLCanvasElement, context: CanvasRenderingContext2D | null) {
    this.element = element
    this.context = context
  }
}
