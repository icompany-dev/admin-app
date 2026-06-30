import { type IApplication } from "../models/IApplication"

export interface IPropsServiceStep {
  application: IApplication | null
  target: string
  price: number
  hasPaid: boolean
  haveAllSigned: boolean
  hasUserSigned: boolean
  signatureDate: string
  isDcr: boolean
  isMcr: boolean
  numberOfDirectors: number
  numberOfShareholders: number
  canSkipToConfirmation: boolean
  useDefaultConfirmation: boolean
  hasMajorityRule: boolean
  hasCustomAffirmation: boolean
  isPascaInPasca: boolean
}

export class PropsServiceStep implements IPropsServiceStep {
  application: IApplication | null
  target: string
  price: number
  hasPaid: boolean
  haveAllSigned: boolean
  hasUserSigned: boolean
  signatureDate: string
  isDcr: boolean
  isMcr: boolean
  numberOfDirectors: number
  numberOfShareholders: number
  canSkipToConfirmation: boolean
  useDefaultConfirmation: boolean
  hasMajorityRule: boolean
  hasCustomAffirmation: boolean
  isPascaInPasca: boolean = false

  constructor(
    application: IApplication | null,
    target: string,
    price: number | null,
    hasPaid: boolean | null,
    haveAllSigned: boolean | null,
    hasUserSigned: boolean | null,
    signatureDate: string | null,
    isDcr: boolean | null,
    isMcr: boolean | null,
    numberOfDirectors: number | null,
    numberOfShareholders: number | null,
    canSkipToConfirmation: boolean | null,
    useDefaultConfirmation: boolean | null,
    hasMajorityRule: boolean = false,
    hasCustomAffirmation: boolean = false
  ) {
    this.application = application
    this.target = target
    this.price = price ?? 19
    this.hasPaid = hasPaid ?? false
    this.haveAllSigned = haveAllSigned ?? false
    this.hasUserSigned = hasUserSigned ?? false
    this.signatureDate = signatureDate ?? ""
    this.isDcr = isDcr ?? false
    this.isMcr = isMcr ?? false
    this.numberOfDirectors = numberOfDirectors ?? 1
    this.numberOfShareholders = numberOfShareholders ?? 1
    this.canSkipToConfirmation = canSkipToConfirmation ?? false
    this.useDefaultConfirmation = useDefaultConfirmation ?? true
    this.hasMajorityRule = hasMajorityRule
    this.hasCustomAffirmation = hasCustomAffirmation
  }
}
