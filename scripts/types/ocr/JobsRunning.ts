export class JobsRunning {
  jobIds: string[] = []
  fileData: string | null = null

  constructor(jobIds: string[], fileData: string | null) {
    this.jobIds = jobIds
    this.fileData = fileData
  }
}
