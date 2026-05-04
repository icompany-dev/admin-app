import * as pdfjsLib from "pdfjs-dist"

export default defineNuxtPlugin(() => {
  // This plugin only runs on the client side
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs"
})
