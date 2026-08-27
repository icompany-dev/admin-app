import * as pdfjsLib from "pdfjs-dist"
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url"

export default defineNuxtPlugin(() => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

  return {
    provide: {
      pdfjs: pdfjsLib,
    },
  }
})
