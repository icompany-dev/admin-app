import { Tag } from "../models/Tag"
import { Repository } from "./Repository"

export class TagRepository extends Repository<Tag> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Tag)
  }
}
