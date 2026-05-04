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

  constructor(type: string, message: string) {
    this.type = type
    this.message = message
  }

  clone(error: Error) {
    this.type = error.type
    this.message = error.message
  }

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

  //Temp fix
  isMalay(): boolean {
    return false //this.i18n.locale.value === "bm"
  }

  setForFetchAll(): void {
    this.icon = "no-info"
    this.title = this.isMalay() ? "Tiada maklumat dijumpai" : "No information found"
    this.message = this.isMalay() ? "Sila log masuk dan cuba semula." : "Please re-login and try again."

    this.type = Error.ERROR_TYPE_API
  }

  setForFetch(): void {
    this.icon = "no-info"
    this.title = this.isMalay() ? "Tiada maklumat dijumpai" : "No information found"
    this.message = this.isMalay() ? "Sila log masuk dan cuba semula." : "Please re-login and try again."

    this.type = Error.ERROR_TYPE_API
  }

  setForFetchOngoing(): void {
    this.icon = "no-info"
    this.title = this.isMalay() ? "Tiada maklumat dijumpai" : "No information found"
    this.message = this.isMalay() ? "Sila log masuk dan cuba semula." : "Please re-login and try again."

    this.type = Error.ERROR_TYPE_API
  }

  setForFetchLatest(): void {
    this.icon = "no-info"
    this.title = this.isMalay() ? "Tiada maklumat dijumpai" : "No information found"
    this.message = this.isMalay() ? "Sila log masuk dan cuba semula." : "Please re-login and try again."

    this.type = Error.ERROR_TYPE_API
  }

  setForCUD(): void {
    this.title = "Your changes not saved."
    this.message = "Please try again. If the issue persists, please contact us for support."

    this.type = Error.ERROR_TYPE_API
  }

  setForIncompleteData(): void {
    this.title = this.isMalay() ? "Maklumat anda diperlukan" : "Your information is required"
    this.message = this.isMalay() ? "Sila lengkapkan semua maklumat." : "Please complete the required information."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForMyDataSSMInterruption(): void {
    this.title = this.isMalay()
      ? "Terdapat gangguan perkhidmatan MyData-SSM"
      : "MyData-SSM is facing a service interruption"
    this.message = this.isMalay()
      ? "Kami tidak berjaya memaut senarai dokumen anda. Sila cuba sebentar lagi."
      : "We are unable to fetch your documents. Please try again later."

    this.type = Error.ERROR_TYPE_API
  }

  setForMakePayment(): void {
    this.title = this.isMalay() ? "Maklumat anda diperlukan" : "Your information is required"
    this.message = this.isMalay() ? "Sila lengkapkan semua maklumat." : "Please complete the required information."

    this.type = Error.ERROR_TYPE_API
  }

  setForGenerateReceipt(): void {
    this.title = this.isMalay() ? "Tiada maklumat dijumpai" : "No information found"
    this.message = this.isMalay()
      ? "Kami tidak dapat memaut resit anda. Sila cuba lagi."
      : "We are unable to retrieve your receipt. Please try again."

    this.type = Error.ERROR_TYPE_API
  }

  setForDocumentPrint(): void {
    this.title = this.isMalay() ? "Tiada maklumat dijumpai" : "No information found"
    this.message = this.isMalay()
      ? "Kami tidak berjaya jana dokumen untuk dicetak. Sila cuba sekali lagi."
      : "We are unable to generate the document to print. Please try again."

    this.type = Error.ERROR_TYPE_API
  }

  setForDocumentDownload(): void {
    this.title = this.isMalay() ? "Tiada maklumat dijumpai" : "No information found"
    this.message = this.isMalay()
      ? "Kami tidak berjaya jana dokumen untuk dimuat turun. Sila cuba sekali lagi."
      : "We are unable to generate the document for download. Please try again."

    this.type = Error.ERROR_TYPE_API
  }

  setForDocumentToPurchase(): void {
    this.title = this.isMalay() ? "Tiada maklumat dijumpai" : "No information found"
    this.message = this.isMalay()
      ? "Kami tidak berjaya memaut butiran dokumen untuk dibeli. Sila muat semula muka ini."
      : "We are unable to retrieve details of document to purchase. Please refresh this page."

    this.type = Error.ERROR_TYPE_API
  }

  setForDocumentPurchase(): void {
    this.title = this.isMalay() ? "Tiada maklumat dijumpai" : "No information found"
    this.message = this.isMalay()
      ? "Kami tidak berjaya memaut butiran dokumen yang dibeli. Sila muat semula muka ini."
      : "We are unable to retrieve details of last purchased document. Please refresh this page."

    this.type = Error.ERROR_TYPE_API
  }

  setForFileTooBig(): void {
    this.title = this.isMalay() ? "Fail anda terlalu besar" : "Your file size is too big"
    this.message = this.isMalay() ? "Saiz fail mesti kurang dari 2MB." : "File size must be less than 2MB."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForIncorrectFileTypeImageAndPdf(): void {
    this.title = this.isMalay() ? "Jenis fail anda tidak diterima" : "Your file type is incorrect"
    this.message = this.isMalay() ? "Sila muat naik imej atau PDF sahaja." : "Upload only image files or PDF."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForIncorrectFileTypePdf(): void {
    this.title = this.isMalay() ? "Jenis fail anda tidak diterima" : "Your file type is incorrect"
    this.message = this.isMalay()
      ? "Jenis fail anda tidak diterima. Sila muat naik fail PDF sahaja."
      : "Your file type is invalid. Upload only PDF files."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForFetchCustom(nameOfDataEn: string, nameOfDataBm: string): void {
    this.title = this.isMalay() ? "Tiada maklumat dijumpai" : "Information not available"
    this.message = this.isMalay()
      ? `Kami tidak berjaya memaut ${nameOfDataBm}. Sila muat semula muka ini.`
      : `We are unable to fetch ${nameOfDataEn}. Please refresh this page and try again.`

    this.type = Error.ERROR_TYPE_API
  }

  setForUploadFileToAws(): void {
    this.title = this.isMalay() ? "Fail anda tidak dimuat naik" : "Your file type is not uploaded"
    this.message = this.isMalay() ? "Sila cuba sekali lagi." : "Please try again"

    this.type = Error.ERROR_TYPE_DATA
  }

  setForNoFileToUpload(): void {
    this.title = this.isMalay() ? "Tiada fail untuk diteruskan" : "There is no file to proceed"
    this.message = this.isMalay() ? "Sila muat naik fail untuk teruskan." : "Please upload a file to proceed."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForFileforOCR(): void {
    this.title = this.isMalay() ? "Jenis fail anda tidak diterima" : "Your file type is incorrect"
    this.message = this.isMalay()
      ? "Kami tidak dapat proses fail anda untuk OCR. Sila muat naik fail lain."
      : "We are unable to process your file for OCR. Please upload another file to proceed."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForPayment(): void {
    this.title = this.isMalay() ? "Kami tidak berjaya buat pautan pembayaran" : "We are not able to create payment link"
    this.message = this.isMalay()
      ? "Sila pastikan alamat emel dan nombor telefon anda adalah betul."
      : "Please ensure that your email address and phone number are correct."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForPaymentGateways(): void {
    this.title = this.isMalay()
      ? "Servis pembayaran tidak ada buat masa ini."
      : "Payment service is currently unavailable"
    this.message = this.isMalay() ? "Sila cuba semula." : "Please try again later."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForPaymentDetails(): void {
    this.title = this.isMalay() ? "Tiada maklumat pembayaran" : "No information for your payment"
    this.message = this.isMalay() ? "Sila muat semula halaman dan cuba lagi." : "Please refresh the page and try again."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForPaymentDetailsWithGoTo(): void {
    this.title = this.isMalay() ? "Tiada maklumat pembayaran" : "No information for your payment"
    this.message = this.isMalay()
      ? "Sila ke muka Transaksi untuk muat turun resit anda."
      : "Please go to Transactions page to download your receipt."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForSignature(): void {
    this.title = this.isMalay() ? "Tandatangan diperlukan" : "Your signature is required"
    this.message = this.isMalay() ? "Sila turunkan tandatangan anda." : "Please affix your signature to proceed."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForAI(): void {
    this.title = this.isMalay() ? "SAIRA sedang menghadapi masalah" : "SAIRA is facing an issue"
    this.message = this.isMalay() ? "Sila cuba sekali lagi." : "Please try again."

    this.type = Error.ERROR_TYPE_API
  }

  setForInProgress(processEn: string, processBm: string): void {
    this.title = this.isMalay() ? `${processBm} sedang diproses.` : `${processEn} is in progress. `
    this.message = this.isMalay() ? `Sila tunggu sehingga proses in selesai.` : `Please wait for the process to finish.`

    this.type = Error.ERROR_TYPE_DATA
  }

  setForPurchaseFail(itemEn: string, itemBm: string): void {
    this.title = this.isMalay() ? `Kami tidak berjaya membeli ${itemBm}.` : `We are unable to purchase ${itemEn}.`
    this.message = this.isMalay()
      ? `Jika bayaran sudah ditolak dari akaun anda, sila hubungi kami untuk kami selesaikan masalah ini.`
      : `If your account has been charged, please contact us and we will rectify this situation.`

    this.type = Error.ERROR_TYPE_DATA
  }

  setForNoPurchaseToGetJson(itemEn: string, itemBm: string): void {
    this.title = this.isMalay() ? `Tiada maklumat dijumpai` : `No information`
    this.message = this.isMalay()
      ? `Sila beli ${itemBm} untuk muat turun fail PDF ini.`
      : `Please purchase ${itemEn} to download the PDF file.`

    this.type = Error.ERROR_TYPE_DATA
  }

  setForAIJob(): void {
    this.title = this.isMalay() ? `SAIRA sedang menghadapi masalah` : `SAIRA is facing an issue`
    this.message = this.isMalay()
      ? "Kami tidak berjaya untuk prompt SAIRA buat masa ini. Sila cuba sekali lagi."
      : "We are unable to prompt SAIRA at the moment. Please try again."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForRetrieveDownload(): void {
    this.title = this.isMalay() ? `Tiada maklumat dijumpai` : `No information`
    this.message = this.isMalay()
      ? "Kami tidak berjaya untuk memaut dokumen untuk dimuat turun. Sila cuba sekali lagi."
      : "We are unable to fetch the document to download. Please try again."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForEmailDocument(): void {
    this.title = this.isMalay() ? `Tiada maklumat dijumpai` : `No information`
    this.message = this.isMalay()
      ? "Kami tidak berjaya untuk menghantar dokumen melalui email. Sila cuba sekali lagi."
      : "We are unable to send the document via email. Please try again."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForIncompleteBillingInfo(): void {
    this.title = this.isMalay() ? `Sila Semak Butiran Invois Anda` : `Please Check your Invoice Details`
    this.message = this.isMalay()
      ? "Klik pada Butiran Invois untuk melengkapkan."
      : "Click on Invoice Details to complete."

    this.type = Error.ERROR_TYPE_DATA
  }

  setForUnselectedPaymentMethod(): void {
    this.title = this.isMalay() ? `Sila Pilih Kaedah Pembayaran` : `Please Select your Payment Method`
    this.message = this.isMalay()
      ? "Pilihan 'Kaedah Pembayaran' berada di skrin sebelah kiri."
      : "The 'Payment Method' is on the left screen."

    this.type = Error.ERROR_TYPE_DATA
  }
}
