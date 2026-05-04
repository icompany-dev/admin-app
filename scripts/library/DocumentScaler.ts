import { PaperOrientation } from "../constants/Paper"

export class DocumentScaler {
  paperOrientation: PaperOrientation = PaperOrientation.Portrait
  scaleFactor: number = 1
  additionalTopHeight: number = 0

  parentContainer: HTMLDivElement | null = null

  constructor(paperOrientation: PaperOrientation, additionalTopHeight: number = 0) {
    this.paperOrientation = paperOrientation
    this.additionalTopHeight = additionalTopHeight
    this.setScaleFactor()
  }

  setParentContainer(parentContainer: HTMLDivElement): void {
    this.parentContainer = parentContainer
  }

  setScaleFactor(): void {
    let paperHeightInPx = (297 / 25.4) * 96
    let paperWidthInPx = (210 / 25.4) * 96

    if (this.paperOrientation === PaperOrientation.Landscape) {
      paperHeightInPx = (210 / 25.4) * 96
      paperWidthInPx = (297 / 25.4) * 96
    }

    let containerHeight = window.innerHeight - 300 - this.additionalTopHeight
    let containerWidth = window.innerWidth

    // if (this.parentContainer !== null) {
    //   containerHeight = this.parentContainer.offsetHeight
    //   containerWidth = this.parentContainer.offsetWidth

    //   if (containerHeight > window.innerHeight - 300 - this.additionalTopHeight) {
    //     containerHeight = window.innerHeight - 300 - this.additionalTopHeight
    //   }
    // } else {
    //   containerHeight = window.innerHeight - 300 - this.additionalTopHeight
    // }

    let pageHeight = containerHeight
    let pageWidth = containerWidth

    if (pageHeight >= paperHeightInPx && pageWidth >= paperWidthInPx) {
      return
    }

    let scaleFactor = 1
    if (pageHeight < paperHeightInPx) {
      scaleFactor = pageHeight / paperHeightInPx
    } else {
      scaleFactor = pageWidth / paperWidthInPx
    }

    this.scaleFactor = scaleFactor
  }

  setViewPortScale(viewportWidth: number, viewportHeight: number): void {
    let pageHeight = window.innerHeight - 300 - this.additionalTopHeight
    let pageWidth = window.innerWidth

    if (pageHeight >= viewportHeight && pageWidth >= viewportWidth) {
      return
    }

    let scaleFactor = 1
    if (pageHeight < viewportHeight) {
      scaleFactor = pageHeight / viewportHeight
    } else {
      scaleFactor = pageWidth / viewportWidth
    }

    this.scaleFactor = scaleFactor
  }
}
