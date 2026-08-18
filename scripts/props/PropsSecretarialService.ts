export interface IPropsSecretarialService {
  companyId: string
  applicationId: string
  paymentOrderId: string
  target: string
}

export class PropsSecretarialService implements IPropsSecretarialService {
  companyId: string
  applicationId: string
  paymentOrderId: string
  target: string

  constructor(companyId: string, applicationId: string, paymentOrderId: string, target: string) {
    this.companyId = companyId
    this.applicationId = applicationId
    this.paymentOrderId = paymentOrderId
    this.target = target
  }
}
