export interface IAutoSaveEnabled<T, R> {
  id: string
  cloneDetails: (record: T) => void
  isTheSame: (record: T) => boolean
  getRequestBody: () => object
  create: (repository: R) => Promise<void>
  update: (repository: R) => Promise<void>
}
