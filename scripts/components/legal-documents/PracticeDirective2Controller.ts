import type { PropsPracticeDirective2 } from "~/scripts/props/PropsPracticeDirective2"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { PaperOrientation } from "~/scripts/constants/Paper"

export class PracticeDirective2Controller extends SdnBhdLegalDocumentController {
  emitEvents: any | null = null

  isPrinting: Ref<boolean> = ref<boolean>(false)

  isAddingBusinessAddress: Ref<boolean> = ref<boolean>(false)
  isUpdatingBusinessAddress: Ref<boolean> = ref<boolean>(false)
  isRemovingBusinessAddress: Ref<boolean> = ref<boolean>(false)

  isAddingBranchAddress: Ref<boolean> = ref<boolean>(false)
  isUpdatingBranchAddress: Ref<boolean> = ref<boolean>(false)
  isRemovingBranchAddress: Ref<boolean> = ref<boolean>(false)

  isUpdatingNature: Ref<boolean> = ref<boolean>(false)

  addAddress: Ref<string> = ref<string>("")
  addAddressEffectiveDate: Ref<string | null> = ref<string | null>(null)

  updateAddress: Ref<string> = ref<string>("")
  updateAddressEffectiveDate: Ref<string | null> = ref<string | null>(null)

  removeAddress: Ref<string> = ref<string>("")
  removeAddressEffectiveDate: Ref<string | null> = ref<string | null>(null)

  dateOfChange: Ref<string | null> = ref<string | null>(null)

  additionalCssClass: string = "pd2"

  constructor(props: PropsPracticeDirective2, emitEvents: any) {
    super("Practice Directive 2/2017", props.companyId, PaperOrientation.Portrait)

    this.setData(props)
    this.emitEvents = emitEvents
  }

  setData(props: PropsPracticeDirective2): void {
    this.isAddingBusinessAddress.value = props.isAddingBusinessAddress
    this.isUpdatingBusinessAddress.value = props.isUpdatingBusinessAddress
    this.isRemovingBusinessAddress.value = props.isRemovingBusinessAddress
    this.isAddingBranchAddress.value = props.isAddingBranchAddress
    this.isUpdatingBranchAddress.value = props.isUpdatingBranchAddress
    this.isRemovingBranchAddress.value = props.isRemovingBranchAddress
    this.isUpdatingNature.value = props.isUpdatingNature
    this.addAddress.value = props.addAddress ?? ""
    this.addAddressEffectiveDate.value = props.addAddressEffectiveDate
    this.updateAddress.value = props.updateAddress ?? ""
    this.updateAddressEffectiveDate.value = props.updateAddressEffectiveDate
    this.removeAddress.value = props.removeAddress ?? ""
    this.removeAddressEffectiveDate.value = props.removeAddressEffectiveDate
  }

  totalPages(): number {
    return 2
  }

  get isChangingAddress(): boolean {
    return (
      this.isUpdatingBusinessAddress.value ||
      this.isUpdatingBusinessAddress.value ||
      this.isAddingBranchAddress.value ||
      this.isUpdatingBranchAddress.value ||
      this.isRemovingBranchAddress.value
    )
  }

  get isAddingAddress(): boolean {
    return this.isAddingBusinessAddress.value || this.isAddingBusinessAddress.value
  }

  get isUpdatingAddress(): boolean {
    return this.isUpdatingBusinessAddress.value || this.isUpdatingBusinessAddress.value
  }

  get isRemovingAddress(): boolean {
    return this.isRemovingBusinessAddress.value || this.isRemovingBusinessAddress.value
  }

  get formattedAddAddressEffectiveDate(): string {
    let time = useLocalTime()

    if (!this.addAddressEffectiveDate.value) {
      let dayjs = useDayjs()
      let today = dayjs().format("YYYY-MM-DD")

      return time.formatDateOnlyFull(today)
    }

    return time.formatDateOnlyFull(this.addAddressEffectiveDate.value)
  }

  get formattedUpdateAddressEffectiveDate(): string {
    let time = useLocalTime()

    if (!this.updateAddressEffectiveDate.value) {
      let dayjs = useDayjs()
      let today = dayjs().format("YYYY-MM-DD")

      return time.formatDateOnlyFull(today)
    }

    return time.formatDateOnlyFull(this.updateAddressEffectiveDate.value)
  }

  get formattedRemoveAddressEffectiveDate(): string {
    let time = useLocalTime()

    if (!this.removeAddressEffectiveDate.value) {
      let dayjs = useDayjs()
      let today = dayjs().format("YYYY-MM-DD")

      return time.formatDateOnlyFull(today)
    }

    return time.formatDateOnlyFull(this.removeAddressEffectiveDate.value)
  }

  get formattedDateOfChange(): string {
    let time = useLocalTime()

    if (!this.dateOfChange.value) {
      let dayjs = useDayjs()
      let today = dayjs().format("YYYY-MM-DD")

      return time.formatDateOnlyFull(today)
    }

    return time.formatDateOnlyFull(this.dateOfChange.value)
  }
}
