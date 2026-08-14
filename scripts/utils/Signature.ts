import { File } from "~/scripts/models/File"

export class SignatureUtil {
  static async submit(signatureFileData: string): Promise<File> {
    let fileRepository = useFileStore()
    let time = useLocalTime()
    let signatureDate = time.currentDataTimeForSignature()

    let fileName = crypto.randomUUID()

    let uploadFileData = {
      base64attachment: signatureFileData,
      name: fileName,
      description: `${fileName} Sign on ${signatureDate}`,
      slug: fileName,
    }

    let uploadedFile = await fileRepository.create(uploadFileData)
    if (fileRepository.error) {
      throw fileRepository.error
    }

    return uploadedFile
  }
}
