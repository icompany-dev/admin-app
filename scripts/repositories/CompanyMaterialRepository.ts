import { CompanyMaterial } from "../models/CompanyMaterial"
import { Repository } from "./Repository"

export class CompanyMaterialRepository extends Repository<CompanyMaterial> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, CompanyMaterial)
  }
}
