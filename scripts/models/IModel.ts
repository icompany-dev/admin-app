export interface IModel<T> {
  convertFromResponse: (data: any) => void
  clone: (data: T) => void
  getRequestBody: () => object
}
