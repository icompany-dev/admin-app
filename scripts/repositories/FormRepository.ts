import type { ApiRecord } from "../library/ApiRecord"
import type { Filter } from "../library/Filter"
import { Form } from "../models/Form"
import { Repository } from "./Repository"

export class FormRepository extends Repository<Form> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, Form)
  }

  async searchFetchAll(filter: Filter | null = null): Promise<ApiRecord<Form>> {
    try {
      const slug = filter?.getSlug() ?? null
      const response = this.get<ApiRecord<Form>>(`${this.singleResourceUrl}/fetch-all${slug ? "?" + slug : ""}`)
      return response
    } catch (error) {
      throw error
    }
  }

  async formDownload(id: string, fileId: string | null = null): Promise<Form> {
    try {
      const data = fileId ? { file_id: fileId } : null
      const response = this.update<Form>(`${this.singleResourceUrl}/downloads/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  }
}
