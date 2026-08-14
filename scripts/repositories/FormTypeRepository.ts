import { FormType } from "../models/FormType"
import { Repository } from "./Repository"

export class FormTypeRepository extends Repository<FormType> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, FormType)
  }
}
