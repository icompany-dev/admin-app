import { AdminToDo } from "../models/AdminToDo"
import { Repository } from "./Repository"
import { ApiRecord } from "~/scripts/library/ApiRecord"
import { Filter } from "~/scripts/library/Filter"

export class AdminToDoRepository extends Repository<AdminToDo> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, AdminToDo)
  }

  // override fetchAll<AdminToDo>(filter: Filter): Promise<ApiRecord<AdminToDo>> {
  //   try {
  //     let slug = filter.getSlug()
  //     let response = this.get
  //   } catch (e) {
  //     throw e
  //   }
  // }
}
