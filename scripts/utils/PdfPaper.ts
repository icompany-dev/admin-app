import html2pdf from "html2pdf.js"
import type { FileBase64Response } from "../models/File"
import { PaperOrientation, PaperSize } from "../constants/Paper"

export class PdfPaperUtil {
  static async getPdfElements(parentNode: HTMLElement): Promise<HTMLElement[]> {
    let fileRepository = useFileStore()

    const paperNodes = parentNode.getElementsByClassName("print paper")
    const pages = []

    for (let i = 0; i < paperNodes.length; i++) {
      const paper = paperNodes[i].cloneNode(true) as HTMLElement

      paper.classList.add("is-printing")

      const watermarks = paper.getElementsByClassName("no-print")
      while (watermarks.length > 0) {
        watermarks[0].parentNode?.removeChild(watermarks[0])
      }

      const imgElements = paper.getElementsByTagName("img")
      for (let j = 0; j < imgElements.length; j++) {
        if (imgElements[j].id !== "signatureBackground") {
          const fileUrl = imgElements[j].getAttribute("src")
          if (!fileUrl) {
            continue
          }

          const fileBase64: FileBase64Response | null = await fileRepository.convertImgToBase64(fileUrl)
          if (!fileBase64) {
            continue
          }

          imgElements[j].setAttribute("src", `data:image/png;base64, ${fileBase64.base64}`)
        }
      }

      pages.push(paper)
    }

    return pages
  }

  static async getPdfBlob(
    pages: HTMLElement[],
    margin: number,
    filename: string,
    paperSize: string,
    paperOrientation: "portrait" | "landscape" | undefined
  ): Promise<Blob> {
    const container = document.createElement("div")
    pages.forEach((paper: HTMLElement, index: number) => {
      container.appendChild(paper)
    })

    document.body.appendChild(container)

    const html2PdfOptions = this.getHtml2PdfOptions(margin, filename, paperSize, paperOrientation)
    const blob = await html2pdf().set(html2PdfOptions).from(container).outputPdf("blob")

    document.body.removeChild(container)

    return blob as Blob
  }

  static async generatePdfFile(
    pages: HTMLElement[],
    margin: number,
    filename: string,
    paperSize: string,
    paperOrientation: "portrait" | "landscape" | undefined
  ): Promise<void> {
    const container = document.createElement("div")
    pages.forEach((paper: HTMLElement, index: number) => {
      container.appendChild(paper)
    })

    if (paperSize === PaperSize.A4) {
      container.style.width = paperOrientation === PaperOrientation.Portrait ? "190mm" : "257mm"
      let height = paperOrientation === PaperOrientation.Portrait ? 257 : 190
      container.style.height = `${height * pages.length}mm`
    }

    document.body.appendChild(container)

    const html2PdfOptions = this.getHtml2PdfOptions(margin, filename, paperSize, paperOrientation)

    await html2pdf().set(html2PdfOptions).from(container).save()

    document.body.removeChild(container)
  }

  static getHtml2PdfOptions(
    margin: number,
    filename: string,
    paperSize: string,
    paperOrientation: "portrait" | "landscape" | undefined
  ): object {
    const imageType: "jpeg" | "png" | "webp" | undefined = "jpeg"
    const html2PdfOptions = {
      margin,
      filename,
      image: { type: imageType, quality: 1 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        proxy: "https://icompany.com",
      },
      jsPDF: { unit: "mm", format: paperSize, orientation: paperOrientation },
    }

    return html2PdfOptions
  }
}
