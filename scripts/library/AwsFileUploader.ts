// This is to upload directly to AWS S3 public buckets.
// It should only be used for files that we do not mind anyone having access to.
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { Error } from "./Error"

export class AwsFileUploader {
  s3Client: S3Client

  constructor() {
    let config = useRuntimeConfig()
    this.s3Client = new S3Client({
      region: config.public.awsRegion,
      credentials: {
        accessKeyId: config.public.awsAccessKeyId,
        secretAccessKey: config.public.awsSecretAccessKey,
      },
    })
  }

  async uploadFileToPublic(file: File, folderName: string, userId: string): Promise<boolean> {
    let config = useRuntimeConfig()

    let key = `public/users/${userId}/${folderName}/${file.name}`

    const command = new PutObjectCommand({
      Bucket: config.public.awsBucket,
      Key: key,
      Body: file,
    })

    try {
      const response = await this.s3Client.send(command)
      return true
    } catch (e: any) {
      let errorMessage: Error = new Error("", "")
      errorMessage.setForUploadFileToAws()
      errorMessage.handle()
      return false
    }
  }
}
