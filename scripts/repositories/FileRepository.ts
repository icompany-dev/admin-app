import { File } from "../models/File"
import { Repository } from "./Repository"

export class FileRepository extends Repository<File> {
  baseUrl: string = ""

  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, File)
    this.baseUrl = baseUrl
  }

  // We breakaway from ofetch library to allow file uploads
  // ofetch does not natively support uploads
  async uploadFile(
    formData: FormData,
    onUploadProgress: (event: ProgressEvent) => void
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const authToken = this.getAuthToken()

      xhr.open("POST", `${this.baseUrl}api/files`, true)

      xhr.responseType = "json"

      if (authToken) {
        xhr.setRequestHeader("Authorization", `Bearer ${authToken}`)
      }

      xhr.upload.addEventListener("progress", onUploadProgress)

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            resolve(xhr.response)
          } catch (e) {
            reject(new Error("Failed to parse response."))
          }
        } else {
          reject(new Error(`Request failed with status ${xhr.status}.`))
        }
      })

      xhr.addEventListener("error", () => {
        reject(new Error("Network error."))
      })

      xhr.send(formData)
    })
  }

  async convertImgUrlToBase64(url: string): Promise<any> {
    try {
      const data = {
        file_url: url,
      }

      let response = this.post(
        `${this.singleResourceUrl}/convert-to-base64-url`,
        data
      )
      return response
    } catch (error) {
      throw error
    }
  }
}
