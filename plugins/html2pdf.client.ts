import html2pdf from "html2pdf.js"

export default defineNuxtPlugin(() => {
  return {
    provide: {
      html2pdf: (element: HTMLElement, options: object) => {
        return html2pdf(element, options)
      },
    },
  }
})
