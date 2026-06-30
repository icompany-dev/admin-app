export interface IPropsDocumentSlipCase {
  title: string
  backButtonLabel: string
  proceedButtonLabel: string
  hoveredProceedButtonLabel: string
  isLoading: boolean
}

export class PropsDocumentSlipCase implements IPropsDocumentSlipCase {
  title: string
  backButtonLabel: string
  proceedButtonLabel: string
  hoveredProceedButtonLabel: string
  isLoading: boolean

  constructor(
    title: string,
    backButtonLabel: string | null,
    proceedButtonLabel: string | null,
    hoveredProceedButtonLabel: string | null,
    isLoading: boolean | null
  ) {
    this.title = title
    this.backButtonLabel = backButtonLabel ?? "Back"
    this.proceedButtonLabel = proceedButtonLabel ?? "Add to Bag"
    this.hoveredProceedButtonLabel = hoveredProceedButtonLabel ?? "Proceed"
    this.isLoading = isLoading ?? false
  }
}
