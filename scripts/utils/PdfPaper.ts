import html2pdf from "html2pdf.js"
import type { FileBase64Response } from "../models/File"
import { PaperOrientation, PaperSize } from "../constants/Paper"
import { NumberUtil } from "./Number"

export class PdfPaperUtil {
  static async getPdfElements(parentNode: HTMLElement): Promise<HTMLElement[]> {
    let fileRepository = useFileStore()

    const paperNodes = parentNode.getElementsByClassName("print paper")
    const pages: HTMLElement[] = []

    for (const originalPaper of Array.from(paperNodes)) {
      const paper = originalPaper.cloneNode(true) as HTMLElement
      paper.classList.add("is-printing")

      // Copy the drawn pixels into the print copy.
      const originalCanvases = originalPaper.querySelectorAll("canvas")
      const clonedCanvases = paper.querySelectorAll("canvas")

      originalCanvases.forEach((canvas, index) => {
        clonedCanvases[index].getContext("2d")?.drawImage(canvas, 0, 0)
      })

      paper.querySelectorAll(".no-print").forEach((element) => {
        element.remove()
      })

      const dateInputs = paper.querySelectorAll<HTMLInputElement>('input[type="date"]')
      dateInputs.forEach((input) => {
        const textNode = document.createElement("span")
        textNode.className = input.className

        if (input.value) {
          const [year, month, day] = input.value.split("-").map(Number)
          const date = new Date(year, month - 1, day)

          textNode.textContent = date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        }

        input.replaceWith(textNode)
      })

      const textInputs = paper.querySelectorAll<HTMLInputElement>('input[type="text"]')
      textInputs.forEach((input) => {
        const textNode = document.createElement("span")
        textNode.className = input.className
        textNode.textContent = input.value
        input.replaceWith(textNode)
      })

      const selectInputs = paper.querySelectorAll("select")
      selectInputs.forEach((input) => {
        const isNumericOrDecimal = /^\d+(\.\d+)?$/.test(input.value)
        const textNode = document.createElement("span")
        textNode.className = input.className
        textNode.textContent = isNumericOrDecimal ? NumberUtil.thousandSeparator(Number(input.value)) : input.value

        input.replaceWith(textNode)
      })

      const imgElements = paper.querySelectorAll("img")
      for (const image of Array.from(imgElements)) {
        if (image.id === "signatureBackground") {
          continue
        }

        const fileUrl = image.getAttribute("src")
        if (!fileUrl) {
          continue
        }

        const fileBase64: FileBase64Response | null = await fileRepository.convertImgToBase64(fileUrl)
        if (!fileBase64) {
          continue
        }

        image.src = `data:image/png;base64,${fileBase64.base64}`
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

    try {
      await html2pdf().set(html2PdfOptions).from(container).save()
    } finally {
      container.remove()
    }
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

        onclone: (clonedDocument: Document) => {
          const elements = clonedDocument.querySelectorAll("html2canvaspseudoelement")

          for (const element of elements) {
            if (window.getComputedStyle(element).backgroundColor === "") {
              element.remove()
            }
          }
        },
      },
      jsPDF: { unit: "mm", format: paperSize, orientation: paperOrientation },
    }

    return html2PdfOptions
  }
}
