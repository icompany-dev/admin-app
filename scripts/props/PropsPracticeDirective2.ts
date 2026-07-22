export interface IPropsPracticeDirective2 {
  companyId: string
}

export class PropsPracticeDirective2 implements IPropsPracticeDirective2 {
  companyId: string

  constructor(companyId: string) {
    this.companyId = companyId
  }
}
