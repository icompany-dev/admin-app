import { ToDo } from "../models/ToDo";
import { Repository } from "./Repository";

export class ToDoRepository extends Repository<ToDo> {
  constructor(
    resourceUrl: string,
    singleResourceUrl: string,
    baseUrl: string,
    getAuthToken: () => string | null | undefined,
  ) {
    super(resourceUrl, singleResourceUrl, baseUrl, getAuthToken, ToDo)
  }

  async fetchList(): Promise<ToDo[]> {
    try {
      const response = this.get<ToDo[]>(`/api/services/todos`)
      return response
    } catch (error) {
      throw error
    }
  }
}