/**
 * NOTE (Bahiyah):
 *  -- This library requires the div with class '.paper' and '.print'
 *  -- The div(s) to be downloaded and/or printed must have both classes
 */
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { FileZipper } from "~/scripts/utils/FileZipper"
import { DownloadFileData } from "~/scripts/types/DownloadFileData"
import { DivToFile } from "~/scripts/types/DivToFile"
import { PaperSize, PaperOrientation } from "~/scripts/constants/Paper"
import { Error } from "~/scripts/library/Error"

export class MultiDocumentHandler {
  elements: DivToFile[] = []
  paperMargin: number = 20
  paperSize: PaperSize = PaperSize.A4
  paperOrientation: PaperOrientation = PaperOrientation.Portrait
  filename: string | null = null

  constructor(
    elements: DivToFile[],
    paperMargin: number,
    paperSize: PaperSize,
    paperOrientation: PaperOrientation,
    filename: string | null = null
  ) {
    this.elements = elements
    this.paperMargin = paperMargin
    this.paperSize = paperSize
    this.paperOrientation = paperOrientation
    this.filename = filename
  }

  async download(): Promise<void> {
    let files: DownloadFileData[] = []
    for (let index = 0; index < this.elements.length; index++) {
      let element = this.elements[index].div
      let filename = this.elements[index].filename

      let papers = element.getElementsByClassName("paper")
      let pages: HTMLElement[] = []
      for (let i = 0; i < papers.length; i++) {
        let paper = papers[i]
        pages.push(paper as HTMLElement)
      }

      let blob = await PdfPaperUtil.getPdfBlob(pages, this.paperMargin, filename, this.paperSize, this.paperOrientation)
      files.push(new DownloadFileData(URL.createObjectURL(blob), filename))
    }

    await FileZipper.zipAndDownload(files, "management-accounts.zip")
  }

  async print(): Promise<void> {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write("Please wait, generating your document for printing...")
    } else {
      throw "Fail to open new window"
    }

    let pages: HTMLElement[] = []
    try {
      for (let index = 0; index < this.elements.length; index++) {
        let element = this.elements[index].div
        let papers = element.getElementsByClassName("paper")
        for (let i = 0; i < papers.length; i++) {
          let paper = papers[i]
          pages.push(paper as HTMLElement)
        }
      }

      if (pages.length <= 0) {
        printWindow.close()
        return
      }

      const blob = await PdfPaperUtil.getPdfBlob(
        pages,
        this.paperMargin,
        `${this.filename}.pdf`,
        this.paperSize,
        this.paperOrientation
      )
      const blobURL = URL.createObjectURL(blob)

      await nextTick()
      printWindow.location.href = blobURL

      setTimeout(() => {
        printWindow.print()
      }, 500)
    } catch (e: any) {
      console.error(e)
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForCUD()
        errorMessage.handle()
      }

      printWindow.close()
    }
  }
}
