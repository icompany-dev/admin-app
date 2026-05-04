export class DownloadFileData {
  url: string
  filename: string

  constructor(url: string, filename: string) {
    this.url = url
    this.filename = filename
  }
}
