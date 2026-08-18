export interface IPropsSecretarialService {
  companyId: string
  applicationId: string
  paymentOrderId: string
}

export class PropsSecretarialService implements IPropsSecretarialService {
  companyId: string
  applicationId: string
  paymentOrderId: string

  constructor(companyId: string, applicationId: string, paymentOrderId: string) {
    this.companyId = companyId
    this.applicationId = applicationId
    this.paymentOrderId = paymentOrderId
  }
}
