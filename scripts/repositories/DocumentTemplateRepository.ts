import { DocumentTemplate } from "../models/DocumentTemplate"
import { Repository } from "./Repository"

export class DocumentTemplateRepository extends Repository<DocumentTemplate> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, DocumentTemplate)
  }
}
