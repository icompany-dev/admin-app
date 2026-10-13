import { DocumentHandover } from "../models/DocumentHandover"
import { Repository } from "./Repository"

export class DocumentHandoverRepository extends Repository<DocumentHandover> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, DocumentHandover)
  }
}
