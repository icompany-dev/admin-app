import JSZip from "jszip"
import type { DownloadFileData } from "../types/DownloadFileData"
import { saveAs } from "file-saver"

export class FileZipper {
  static async zipAndDownload(
    downloadFiles: DownloadFileData[],
    zipFilename: string
  ): Promise<void> {
    const zip = new JSZip()

    const fetchPromises = downloadFiles.map(async (file: DownloadFileData) => {
      try {
        const response: Blob = await $fetch(file.url, { responseType: "blob" }) //NOTE: use nuxt fetch
        zip.file(file.filename, response)
      } catch (error) {
        console.error(`Failed to fetch file: ${file.filename}`, error)
      }
    })

    await Promise.all(fetchPromises)

    try {
      const blob = await zip.generateAsync({ type: "blob" })

      saveAs(blob, zipFilename)
    } catch (error) {
      console.error(`An error occured while generating zip file`, error)
    }
  }
}
