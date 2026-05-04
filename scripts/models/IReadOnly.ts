export interface IReadOnly<T> {
  convertFromResponse: (data: any) => void
  clone: (data: T) => void
}
