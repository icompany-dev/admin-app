import type { Invitation } from "./Invitation"

export interface IInvitation<T> {
  convertFromResponse: (data: any) => void
  convertFromResponseDetails: (data: any) => void
  clone: (data: Invitation) => void
  cloneDetails: (data: T) => void
}
