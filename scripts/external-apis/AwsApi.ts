import { ExternalApi } from "./ExternalApi"
import {
  S3Client,
  HeadObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3"
export class AwsApi extends ExternalApi {
  region: string = ""
  accessKeyId: string = ""
  secretAccessKey: string = ""
  bucketName: string = ""

  constructor(
    region: string,
    accessKeyId: string,
    secretAccessKey: string,
    bucketName: string
  ) {
    super("", "", "", null)

    this.region = region
    this.accessKeyId = accessKeyId
    this.secretAccessKey = secretAccessKey
    this.bucketName = bucketName
  }

  async getReceiptFile(filename: string): Promise<any> {
    try {
      const s3Client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey,
        },
      })

      const bucketName = this.bucketName

      const fileKey = `public/users/receipts/${filename}.pdf`

      await s3Client.send(
        new HeadObjectCommand({
          Bucket: bucketName,
          Key: fileKey,
        })
      )

      const getObjectCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      })

      const response = await s3Client.send(getObjectCommand)

      const fileStream = response.Body
      if (!fileStream) {
        throw new Error("S3 response body is empty.")
      }

      const buffer = await fileStream.transformToByteArray()

      return {
        Body: buffer,
        ContentType: response.ContentType,
      }
    } catch (error) {
      throw error
    }
  }
}
