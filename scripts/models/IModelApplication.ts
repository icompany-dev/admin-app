export interface IModelApplication<T, R> {
  convertFromResponseDetails: (data: any) => void
  cloneDetails: (data: T) => void
  getRequestBody: () => object
  canSubmit: () => boolean
  create: (repository: R) => Promise<void>
  update: (repository: R) => Promise<void>
  remove: (repository: R) => Promise<void>
}
