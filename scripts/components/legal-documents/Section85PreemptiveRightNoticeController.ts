import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { CompanyShareIssuanceResponse } from "~/scripts/models/CompanyShareIssuanceResponse"
import { ShareholdingType } from "~/scripts/constants/Shareholder"
import { StringUtil } from "~/scripts/utils/String"

export class Section85PreemptiveRightNoticeController extends SdnBhdLegalDocumentController {
  initiatorSignatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", true))
  noticeResponse = ref<CompanyShareIssuanceResponse>(new CompanyShareIssuanceResponse())
  responseSignatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", true))

  notificationDate: Ref<string> = ref<string>("")
  expiryDate: Ref<string> = ref<string>("")

  emitEvents: any | null = null

  time = useLocalTime()

  initiatorSignatureFile = ref<string>("")
  responseSignatureFile = ref<string>("")

  constructor(
    companyId: string,
    initiatorSignatureItem: SignatureItem,
    noticeResponse: CompanyShareIssuanceResponse,
    responseSignatureItem: SignatureItem,
    notificationDate: string,
    expiryDate: string,
    emitEvents: any | null
  ) {
    super(
      "Notice of Pre-Emptive Rights Pursuant to Section 85 of the Companies Act 2016",
      companyId,
      PaperOrientation.Portrait
    )

    this.emitEvents = emitEvents

    this.setNotificationDate(notificationDate)
    this.setExpiryDate(expiryDate)
    this.setInitiatorSignatureItem(initiatorSignatureItem)
    this.setNoticeResponse(noticeResponse)
    this.setResponseSignatureItem(responseSignatureItem)
  }

  setNotificationDate(notificationDate: string): void {
    this.notificationDate.value = notificationDate
  }

  setExpiryDate(expiryDate: string): void {
    this.expiryDate.value = expiryDate
  }

  setInitiatorSignatureItem(initiatorSignatureItem: SignatureItem): void {
    this.initiatorSignatureItem.value = new SignatureItem(
      initiatorSignatureItem.signatureUrl,
      initiatorSignatureItem.hasSigned,
      initiatorSignatureItem.isSignatureEditable,
      initiatorSignatureItem.isSignatureHidden,
      initiatorSignatureItem.name,
      initiatorSignatureItem.email,
      initiatorSignatureItem.role,
      initiatorSignatureItem.canAbstain
    )
  }

  setNoticeResponse(noticeResponse: CompanyShareIssuanceResponse): void {
    this.noticeResponse.value = new CompanyShareIssuanceResponse(noticeResponse)
  }

  setResponseSignatureItem(responseSignatureItem: SignatureItem): void {
    this.responseSignatureItem.value = new SignatureItem(
      responseSignatureItem.signatureUrl,
      responseSignatureItem.hasSigned,
      responseSignatureItem.isSignatureEditable,
      responseSignatureItem.isSignatureHidden,
      responseSignatureItem.name,
      responseSignatureItem.email,
      responseSignatureItem.role,
      responseSignatureItem.canAbstain
    )
  }

  formattedNotificationDate(): string {
    return this.time.formatDateOnlyFull(this.notificationDate.value)
  }

  formattedExpiryDate(): string {
    return this.time.formatDateOnlyFull(this.expiryDate.value)
  }

  shareholderName(): string {
    let shareholder = this.noticeResponse.value.shareholder

    if (shareholder.type === ShareholdingType.Representative) {
      return shareholder.company?.getFullName().toUpperCase() ?? ""
    }

    return shareholder.name
  }

  pronoun(): string {
    let shareholder = this.noticeResponse.value.shareholder

    return shareholder.type === ShareholdingType.Representative ? "We" : "I"
  }

  possesivePronoun(): string {
    let shareholder = this.noticeResponse.value.shareholder

    return shareholder.type === ShareholdingType.Representative ? "our" : "my"
  }

  onCheckboxClick(isSubscribe: boolean): void {
    this.noticeResponse.value.isWaived = !isSubscribe
    this.emitEvents("responded", this.noticeResponse.value)
  }

  isSubscribe(): boolean {
    return !this.noticeResponse.value.isWaived
  }

  isWaived(): boolean {
    return this.noticeResponse.value.isWaived
  }

  canRespond(): boolean {
    return this.noticeResponse.value.responseDate === null // need to add condition
  }

  hasResponseDate(): boolean {
    return (
      this.noticeResponse.value.responseDate !== null || !StringUtil.isNullOrEmpty(this.responseSignatureFile.value)
    )
  }

  formattedResponseDate(): string {
    return this.time.formatDateOnlyFull(this.noticeResponse.value.responseDate ?? "")
  }

  onInitiatorSign(signatureFile: string): void {
    this.initiatorSignatureFile.value = signatureFile
    this.emitEvents("initiatorSigned", signatureFile)
  }

  onResponseSign(signatureFile: string): void {
    this.responseSignatureFile.value = signatureFile

    let dayjs = useDayjs()
    this.noticeResponse.value.responseDate = dayjs().format("YYYY-MM-DD")
    this.emitEvents("responseSigned", signatureFile)
  }

  getInitiatorSignature(): string {
    return this.initiatorSignatureFile.value
  }

  getResponseSignature(): string {
    return this.responseSignatureFile.value
  }

  getNoticeResponse(): CompanyShareIssuanceResponse {
    return this.noticeResponse.value
  }
}
