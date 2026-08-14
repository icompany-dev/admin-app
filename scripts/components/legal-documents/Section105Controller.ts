import { CompanyShareTransferDetail } from "~/scripts/models/CompanyShareTransferDetail"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { NumberToWords } from "~/scripts/utils/Number"
import { ShareType, ShareholdingType } from "~/scripts/constants/Shareholder"
import { StringUtil } from "~/scripts/utils/String"
import { User } from "~/scripts/models/User"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { Shareholder } from "~/scripts/models/Shareholder"

export class Section105Controller extends SdnBhdLegalDocumentController {
  companyShareTransferDetail: Ref<CompanyShareTransferDetail> = ref<CompanyShareTransferDetail>(
    new CompanyShareTransferDetail()
  )
  shareholderId: Ref<string> = ref<string>("")
  shareholder: Ref<Shareholder> = ref<Shareholder>(new Shareholder())

  currentUser: Ref<User> = ref<User>(new User())
  transferToUser: Ref<User> = ref<User>(new User())

  transferorSignatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", false))
  transferorRepSignatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", false))
  transfereeSignatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", false))
  transfereeRepSignatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", false))

  emitEvents: any | null = null

  signatureFile: Ref<string> = ref<string>("")

  constructor(companyId: string, detail: CompanyShareTransferDetail, shareholderId: string, emitEvents: any | null) {
    super("Section 105", companyId, PaperOrientation.Portrait)

    this.emitEvents = emitEvents

    this.init(detail, shareholderId)
  }

  async init(detail: CompanyShareTransferDetail, shareholderId: string): Promise<void> {
    this.currentUser.value = await CurrentUser.get()
    await this.setShareholderId(shareholderId)
    await this.setCompanyShareTransferDetail(detail)
  }

  async setCompanyShareTransferDetail(detail: CompanyShareTransferDetail): Promise<void> {
    this.companyShareTransferDetail.value = new CompanyShareTransferDetail(detail)
    this.transferToUser.value = new User(this.companyShareTransferDetail.value.getTransferToRegisteredUser())
    this.setSignatureItems()
  }

  async fetchShareholders(): Promise<void> {
    try {
      let repository = useShareholderStore()
      let response = await repository.fetchAllForCompany(this.companyId.value)
      if (repository.error === null) {
        this.shareholder.value =
          response.find((s: Shareholder) => {
            return s.id === this.shareholderId.value
          }) ?? new Shareholder()
      }
    } catch (e) {
      console.error("Error fetching shareholders:", e)
    }
  }

  async setShareholderId(shareholderId: string): Promise<void> {
    this.shareholderId.value = shareholderId
    await this.fetchShareholders()
  }

  setSignatureItems(): void {
    this.transferorSignatureItem.value = new SignatureItem(
      this.companyShareTransferDetail.value.fromSignature?.url ?? null,
      this.companyShareTransferDetail.value.fromSignatureId ? true : false,
      StringUtil.isNullOrEmpty(this.companyShareTransferDetail.value.fromSignatureId) && this.isTransferor(), // need to check if the user is the transferor
      false,
      this.companyShareTransferDetail.value.transferFromName,
      this.companyShareTransferDetail.value.transferFrom.user?.email ?? "",
      "",
      false
    )

    if (this.isTransferFromCompany()) {
      this.transferorRepSignatureItem.value = new SignatureItem(
        this.companyShareTransferDetail.value.fromRepSignature?.url ?? null,
        this.companyShareTransferDetail.value.fromRepSignatureId ? true : false,
        StringUtil.isNullOrEmpty(this.companyShareTransferDetail.value.fromRepSignatureId), // need to check if the user is the transferor's representative
        false,
        this.companyShareTransferDetail.value.transferFromRepName ?? "",
        "",
        "",
        false
      )
    }

    this.transfereeSignatureItem.value = new SignatureItem(
      this.companyShareTransferDetail.value.toSignature?.url ?? null,
      this.companyShareTransferDetail.value.toSignatureId ? true : false,
      StringUtil.isNullOrEmpty(this.companyShareTransferDetail.value.toSignatureId) && this.isTransferee(), // need to check if the user is the transferee
      false,
      this.companyShareTransferDetail.value.transferToName ?? "Transferee",
      "",
      "",
      false
    )

    if (this.isTransferToCompany()) {
      this.transfereeRepSignatureItem.value = new SignatureItem(
        this.companyShareTransferDetail.value.toRepSignature?.url ?? null,
        this.companyShareTransferDetail.value.toRepSignatureId ? true : false,
        StringUtil.isNullOrEmpty(this.companyShareTransferDetail.value.toRepSignatureId), // need to check if the user is the transferee's representative
        false,
        this.companyShareTransferDetail.value.transferToRepName ?? "",
        "",
        "",
        false
      )
    }
  }

  numberToWords(number: number): string {
    return NumberToWords.apply(number)
  }

  shareType(): string {
    return this.companyShareTransferDetail.value.shareType === ShareType.Ordinary ? "Ordinary" : "Preference"
  }

  isTransferFromIdentificationIC(): boolean {
    return (
      this.companyShareTransferDetail.value.transferFrom.type === ShareholdingType.Individual &&
      this.companyShareTransferDetail.value.transferFrom.user?.detail?.identificationType === "ic"
    )
  }

  isTransferFromIdentificationPassport(): boolean {
    return (
      this.companyShareTransferDetail.value.transferFrom.type === ShareholdingType.Individual &&
      this.companyShareTransferDetail.value.transferFrom.user?.detail?.identificationType === "passport"
    )
  }

  isTransferFromCompany(): boolean {
    return this.companyShareTransferDetail.value.transferFrom.type === ShareholdingType.Representative
  }

  isTransferToIdentificationIC(): boolean {
    return this.companyShareTransferDetail.value.transferToIdType === "ic"
  }

  isTransferToIdentificationPassport(): boolean {
    return this.companyShareTransferDetail.value.transferToIdType === "passport"
  }

  isTransferToGovAgency(): boolean {
    return (
      this.companyShareTransferDetail.value.transferToCorporateType ===
      "Government Agencies/ Institution/ Statutory Bodies"
    )
  }

  isTransferToNatives(): boolean {
    return this.companyShareTransferDetail.value.transferToCorporateType === "Controlled by Malaysians (Malays/Natives)"
  }
  isTransferToNonNatives(): boolean {
    return (
      this.companyShareTransferDetail.value.transferToCorporateType ===
      "Controlled by Malaysians (Non-Malays/Non-Natives)"
    )
  }

  isTransferToForeign(): boolean {
    return this.companyShareTransferDetail.value.transferToCorporateType === "Controlled by Non-Malaysians"
  }

  isTransferToIndividual(): boolean {
    return this.companyShareTransferDetail.value.transferToType === ShareholdingType.Individual
  }

  isTransferToCompany(): boolean {
    return this.companyShareTransferDetail.value.transferToType === ShareholdingType.Representative
  }

  isTransferToMalay(): boolean {
    return this.transferToUser.value.detail?.race.toLowerCase() === "malay"
  }

  isTransferToChinese(): boolean {
    return this.transferToUser.value.detail?.race.toLowerCase() === "chinese"
  }

  isTransferToIndian(): boolean {
    return this.transferToUser.value.detail?.race.toLowerCase() === "indian"
  }

  isTransferToRaceOthers(): boolean {
    return this.transferToUser.value.detail?.race.toLowerCase() === "others"
  }

  transferToOtherRaces(): string {
    if (!this.isTransferToRaceOthers()) {
      return "..................." // need to return the actual race
    }

    return this.transferToUser.value.detail?.customRace ?? "..................."
  }

  isSection105Completed(): boolean {
    let allTransferorSigned =
      !StringUtil.isNullOrEmpty(this.companyShareTransferDetail.value.fromSignatureId) &&
      (!this.isTransferFromCompany() ||
        !StringUtil.isNullOrEmpty(this.companyShareTransferDetail.value.fromRepSignatureId))

    let allTransfereeSigned =
      !StringUtil.isNullOrEmpty(this.companyShareTransferDetail.value.toSignatureId) &&
      (!this.isTransferToCompany() || !StringUtil.isNullOrEmpty(this.companyShareTransferDetail.value.toRepSignatureId))

    return allTransferorSigned && allTransfereeSigned
  }

  isTransferor(): boolean {
    return this.companyShareTransferDetail.value.transferFromId === this.shareholderId.value
  }

  isTransferee(): boolean {
    return (
      this.companyShareTransferDetail.value.transferToId === this.shareholderId.value ||
      this.companyShareTransferDetail.value.transferToInvitation?.userId === this.currentUser.value.id
    )
  }

  isSignatureRequired(): boolean {
    return this.currentUser.value.email === this.shareholder.value.email && (this.isTransferor() || this.isTransferee())
  }

  hasUserSigned(): boolean {
    return (this.isTransferor() || this.isTransferee()) && !StringUtil.isNullOrEmpty(this.signatureFile.value)
  }
}
