export abstract class BaseModel<T> {
  id: string = ""
  createdAt: string | null = null
  updatedAt: string | null = null

  constructor() {}

  convertFromResponse(data: any): void {
    //must override
  }

  clone(data: T) {
    //must override
  }
}
