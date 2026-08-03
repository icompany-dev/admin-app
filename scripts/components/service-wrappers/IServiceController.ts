export interface IServiceController<T, R> {
  // application: T
  applicationId: string | null
  companyId: string

  repository: R
  companyRepository: ReturnType<typeof useCompanyStore>

  target: string
  isADirector: Ref<boolean>
  directorId: Ref<string | null>
  isAShareholder: Ref<boolean>
  shareholderId: Ref<string | null>
  isSignatureRequired: Ref<boolean>
  hasPaid: Ref<boolean>
  signatureFile: Ref<string | null>

  onSubmitClicked(): Promise<void>
  onCreate(): Promise<void>
  onUpdate(): Promise<void>
  onRemove(): Promise<void>
  submitSignature(): Promise<void>
  // pay(): Promise<void>
  // helpDescription(): string
  // helpTitle(): string
}
