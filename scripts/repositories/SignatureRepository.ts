import { SignatureGroup } from '../models/SignatureGroup'
import { Repository } from './Repository'

export class SignatureRepository extends Repository<SignatureGroup> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined,
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, SignatureGroup)
  }
}
