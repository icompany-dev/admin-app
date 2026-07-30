import { useNuxtApp } from "#app"
export class Error {
  static ERROR_TYPE_API = "api"
  static ERROR_TYPE_DATA = "data"
  static ERROR_TYPE_CODE = "code"

  type: string = ""
  message: string = ""
  title: string = ""
  icon: string = "error"
  nuxtApp = useNuxtApp()
  // i18n = useI18n()
  isMalay: boolean = false

  constructor() {}

  handle() {
    if (this.type === Error.ERROR_TYPE_API) {
      this.promptError()
    }
    if (this.type === Error.ERROR_TYPE_DATA) {
      this.promptWarning()
    }
    if (this.type === Error.ERROR_TYPE_CODE) {
      this.promptError()
    }
  }

  promptError() {
    if (this.title === "") {
      this.title = "Error Encountered"
    }

    this.nuxtApp.$iziToast.error({
      title: this.title,
      message: this.message,
      icon: this.icon,
      iconColor: "transparent",
      position: "bottomRight",
      pauseOnHover: true,
      close: false,
      timeout: 5000,
    })
  }

  promptWarning() {
    if (this.title === "") {
      this.title = "Warning"
    }

    this.nuxtApp.$iziToast.warning({
      title: this.title,
      message: this.message,
      icon: "warning",
      iconColor: "transparent",
      position: "bottomRight",
      pauseOnHover: true,
      close: false,
      timeout: 5000,
    })
  }

  setForFetchAll(): void {
    this.title = this.isMalay ? `Tiada Maklumat Dijumpai` : `No Information Found`
    this.message = this.isMalay
      ? "Sila muat semula muka ini dan cuba sekali lagi. Jika isu ini berulang, sila log masuk semula."
      : "Please refresh the page and try again. If the issue persists, please re-login."

    this.type = Error.ERROR_TYPE_API
  }

  setForFetch(): void {
    this.title = this.isMalay ? `Tiada Maklumat Dijumpai` : `No Information Found`
    this.message = this.isMalay
      ? "Sila muat semula muka ini dan cuba sekali lagi. Jika isu ini berulang, sila log masuk semula."
      : "Please refresh the page and try again. If the issue persists, please re-login."

    this.type = Error.ERROR_TYPE_API
  }

  setForCUD(): void {
    this.title = this.isMalay ? `Maklumat tidak Dikemaskini` : `Changes not Saved`
    this.message = this.isMalay
      ? "Sila muat semula muka ini dan cuba sekali lagi. Jika isu ini berulang, sila log masuk semula."
      : "Please refresh the page and try again. If the issue persists, please re-login."

    this.type = Error.ERROR_TYPE_API
  }

  setForIncompleteData(): void {
    this.title = this.isMalay ? "Maklumat anda diperlukan" : "Your information is required"
    this.message = this.isMalay ? "Sila lengkapkan semua maklumat." : "Please complete the required information."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForFileTooBig(): void {
    this.title = this.isMalay ? "Fail anda terlalu besar" : "Your file size is too big"
    this.message = this.isMalay ? "Saiz fail mesti kurang dari 2MB." : "File size must be less than 2MB."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForIncorrectFileTypePdf(): void {
    this.title = this.isMalay ? "Jenis fail anda tidak diterima" : "Your file type is incorrect"
    this.message = this.isMalay
      ? "Jenis fail anda tidak diterima. Sila muat naik fail PDF sahaja."
      : "Your file type is invalid. Upload only PDF files."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForIncorrectFileTypeImageAndPdf(): void {
    this.title = this.isMalay ? "Jenis fail anda tidak diterima" : "Your file type is incorrect"
    this.message = this.isMalay ? "Sila muat naik imej atau PDF sahaja." : "Upload only image files or PDF."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForFailedUpload(): void {
    this.title = this.isMalay ? "Fail tidak dimuat naik ke server." : "Your File is not uploaded to server."
    this.message = this.isMalay
      ? "Sila muat naik semula fail dan cuba semula. Jika masalah ini berulang, sila hubungi IT Support."
      : "Please re-upload the file and try again. If the problem persists, please contact Support."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForPaymentDetails(): void {
    this.title = this.isMalay ? "Tiada maklumat pembayaran" : "No information for your payment"
    this.message = this.isMalay ? "Sila muat semula halaman dan cuba lagi." : "Please refresh the page and try again."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForPaymentGateways(): void {
    this.title = this.isMalay
      ? "Servis pembayaran tidak ada buat masa ini."
      : "Payment service is currently unavailable"
    this.message = this.isMalay ? "Sila cuba semula." : "Please try again later."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForDocumentDownload(): void {
    this.title = this.isMalay ? "Tiada maklumat untuk Sdn Bhd anda" : "No information found for your Sdn Bhd"
    this.message = this.isMalay
      ? "Kami tidak berjaya jana dokumen untuk dimuat turun. Sila cuba sekali lagi."
      : "We are unable to generate the document for download. Please try again."

    this.type = Error.ERROR_TYPE_API
  }

  setForInProgress(processEn: string, processBm: string): void {
    this.title = this.isMalay ? `${processBm} sedang diproses.` : `${processEn} is in progress. `
    this.message = this.isMalay ? `Sila tunggu sehingga proses in selesai.` : `Please wait for the process to finish.`

    this.type = Error.ERROR_TYPE_DATA
  }

  setForPurchaseFail(itemEn: string, itemBm: string): void {
    this.title = this.isMalay ? `Kami tidak berjaya membeli ${itemBm}.` : `We are unable to purchase ${itemEn}.`
    this.message = this.isMalay
      ? `Jika bayaran sudah ditolak dari akaun anda, sila hubungi kami untuk kami selesaikan masalah ini.`
      : `If your account has been charged, please contact us and we will rectify this situation.`

    this.type = Error.ERROR_TYPE_DATA
  }

  setForNoPurchaseToGetJson(itemEn: string, itemBm: string): void {
    this.title = this.isMalay ? `Tiada maklumat untuk Sdn Bhd anda` : `No information for your Sdn Bhd`
    this.message = this.isMalay
      ? `Sila beli ${itemBm} untuk muat turun fail PDF ini.`
      : `Please purchase ${itemEn} to download the PDF file.`

    this.type = Error.ERROR_TYPE_DATA
  }
}
