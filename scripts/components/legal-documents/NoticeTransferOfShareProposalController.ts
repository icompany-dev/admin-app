import { PaperOrientation } from "~/scripts/constants/Paper"
import { SdnBhdLegalDocumentController } from "./SdnBhdLegalDocumentController"
import { CompanyShareholderTransfer } from "~/scripts/models/CompanyShareholderTransfer"
import { ShareType, ShareholdingType } from "~/scripts/constants/Shareholder"
import { CompanyShareTransferDetail } from "~/scripts/models/CompanyShareTransferDetail"
import { CompanyShareholderTransferNotice } from "~/scripts/models/CompanyShareholderTransferNotice"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { SelectOption } from "~/scripts/types/SelectOption"
import { User } from "~/scripts/models/User"
import { CurrentUser } from "~/scripts/utils/CurrentUser"
import { StringUtil } from "~/scripts/utils/String"
import { SignatureUtil } from "~/scripts/utils/Signature"
import { Shareholder } from "~/scripts/models/Shareholder"
import { Error } from "~/scripts/library/Error"
import type { Director } from "~/scripts/models/Director"
import { SignatureGroup, SignatureGroupGroup, SignatureGroupTarget } from "~/scripts/models/SignatureGroup"
import { CompanyConstants } from "~/scripts/constants/Company"
import { ShareholderInvitation } from "~/scripts/models/ShareholderInvitation"
import { InvitationTarget } from "~/scripts/models/Invitation"

export class NoticeTransferOfShareProposalController extends SdnBhdLegalDocumentController {
  applicationId = ref<string>("")
  companyShareholderTransfer = ref<CompanyShareholderTransfer>(new CompanyShareholderTransfer())
  companyShareholderTransferNotice = ref<CompanyShareholderTransferNotice>(new CompanyShareholderTransferNotice())

  shareholderId: Ref<string> = ref<string>("")

  initiatorSignatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", true))
  shareholderSignatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", true))

  selectedShareType: Ref<string> = ref<string>(ShareType.Ordinary)
  transferDetails = ref<CompanyShareTransferDetail[]>([])

  emitEvents: any | null = null

  documentRef: any | null = null

  user = ref<User>(new User())

  directorRepository = useDirectorStore()
  shareholderRepository = useShareholderStore()

  time = useLocalTime()

  isADirector = ref<boolean>(false)
  isAShareholder = ref<boolean>(false)
  shareholders = ref<Shareholder[]>([])

  isConsented = ref<boolean>(false)

  isLoading = ref<boolean>(true)

  isReadOnly = ref<boolean>(false)

  constructor(
    companyId: string,
    applicationId: string,
    shareholderId: string,
    isReadOnly: boolean,
    isInPreviewMode: boolean,
    emitEvents: any | null
  ) {
    super("Notice of Proposed Share Transfer", companyId, PaperOrientation.Portrait)

    this.isInPreviewMode.value = isInPreviewMode

    this.emitEvents = emitEvents

    this.setIsReadOnly(isReadOnly)

    this.init(applicationId, shareholderId)
  }

  async init(applicationId: string, shareholderId: string): Promise<void> {
    this.user.value = await CurrentUser.get()
    await Promise.all([this.fetchShareholders(), this.fetchDirectors()])

    await this.setApplicationId(applicationId)
    this.setShareholderId(shareholderId)
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.isLoading.value = true
    this.applicationId.value = applicationId

    await Promise.all([this.fetchTransfer(), this.fetchTransferNotice()])

    this.setTransferDetails()
    this.setInitiatorSignatureItem()
    this.isLoading.value = false
  }

  setApplication(application: CompanyShareholderTransfer): void {
    this.companyShareholderTransfer.value = new CompanyShareholderTransfer(application)
    this.setTransferDetails()
  }

  setShareholderId(shareholderId: string): void {
    this.shareholderId.value = shareholderId
    this.setShareholderSignatureItem()
    this.setConsented()
  }

  setIsReadOnly(isReadOnly: boolean): void {
    this.isReadOnly.value = isReadOnly

    this.setInitiatorSignatureItem()
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  setInitiatorSignatureItem(): void {
    let initiator = new User(this.companyShareholderTransferNotice.value.initiator)
    if (StringUtil.isNullOrEmpty(initiator.id)) {
      initiator = new User(this.user.value)
    }

    let signatureUrl = this.companyShareholderTransferNotice.value.signature?.url ?? null

    let isSignatureEditable = initiator.email === this.user.value.email && signatureUrl === null && this.canEdit()

    let roles = []
    if (this.isADirector.value) {
      roles.push("Director")
    }

    if (this.isAShareholder.value) {
      roles.push("Member")
    }
    let role = StringUtil.oxfordJoin("&", roles)

    this.initiatorSignatureItem.value = new SignatureItem(
      signatureUrl,
      signatureUrl !== null,
      isSignatureEditable,
      false,
      initiator.name,
      initiator.email,
      role,
      false
    )
  }

  setTransferDetails(): void {
    this.transferDetails.value = this.companyShareholderTransfer.value.transferDetails.map(
      (d: CompanyShareTransferDetail) => {
        return new CompanyShareTransferDetail(d)
      }
    )

    if (this.transferDetails.value.length <= 0) {
      this.onAddTransferDetail()
    }

    this.setConsented()
  }

  setConsented(): void {
    let transferDetail = this.transferDetails.value.find((d: CompanyShareTransferDetail) => {
      return d.transferFromId === this.shareholderId.value || d.transferToId === this.shareholderId.value
    })

    if (!transferDetail) {
      return
    }

    if (transferDetail.transferFromId === this.shareholderId.value) {
      this.isConsented.value = transferDetail.isTransferFromConsented ?? false
    }

    if (transferDetail.transferToId === this.shareholderId.value) {
      this.isConsented.value = transferDetail.isTransferToConsented ?? false
    }
  }

  setShareholderSignatureItem(): void {
    let shareholderInFocus = this.shareholders.value.find((s: Shareholder) => {
      return s.id === this.shareholderId.value
    })

    if (!shareholderInFocus) {
      return
    }

    let signature = this.companyShareholderTransferNotice.value.signatureGroups.find((sg: any) => {
      if (!shareholderInFocus) {
        return null
      }

      return sg.email === shareholderInFocus.email
    })

    let signatureUrl = signature?.signature?.url ?? null

    this.shareholderSignatureItem.value = new SignatureItem(
      signatureUrl,
      signatureUrl !== null,
      shareholderInFocus.email === this.user.value.email && !this.isInPreviewMode.value,
      false,
      shareholderInFocus.name,
      shareholderInFocus.email,
      "Member",
      false
    )
  }

  async fetchTransfer(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    try {
      let repository = useCompanyShareholderTransferStore()
      let response = await repository.fetch(this.applicationId.value)
      if (repository.error !== null) {
        throw repository.error
      }

      this.companyShareholderTransfer.value = new CompanyShareholderTransfer(response)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async fetchTransferNotice(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    try {
      let repository = useCompanyShareholderTransferNoticeStore()
      let response = await repository.fetchForTransfer(this.applicationId.value)
      if (repository.error !== null) {
        throw repository.error
      }
      this.companyShareholderTransferNotice.value = new CompanyShareholderTransferNotice(response)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async fetchShareholders(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    try {
      let response = await this.shareholderRepository.fetchAllForCompany(this.companyId.value)
      if (this.shareholderRepository.error !== null) {
        throw this.shareholderRepository.error
      }

      this.shareholders.value = response.map((s: any) => {
        return new Shareholder(s)
      })

      this.isAShareholder.value = this.shareholders.value.some((s: Shareholder) => {
        return s.email === this.user.value.email
      })
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchAll()
        errorMessage.handle()
      }
    }
  }

  async fetchDirectors(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    try {
      let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
      if (this.shareholderRepository.error !== null) {
        throw this.shareholderRepository.error
      }

      this.isADirector.value = response.some((d: Director) => {
        return d.email === this.user.value.email
      })
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchAll()
        errorMessage.handle()
      }
    }
  }

  shareTypeOptions(): SelectOption[] {
    return [
      new SelectOption(ShareType.Ordinary, ShareType.Ordinary, "Ordinary Shares"),
      new SelectOption(ShareType.Preference, ShareType.Preference, "Preference Shares"),
    ]
  }

  isDocumentEditable(): boolean {
    if (this.isInPreviewMode.value) {
      return false
    }

    return this.companyShareholderTransferNotice.value.signature === null
  }

  onShareTypeSelected(): void {
    this.companyShareholderTransfer.value.shareType = this.selectedShareType.value
  }

  onAddTransferDetail(): void {
    let newTransferDetail = new CompanyShareTransferDetail()
    newTransferDetail.id = crypto.randomUUID()
    this.transferDetails.value.push(newTransferDetail)

    this.emitEvents("transferDetailsUpdated", this.transferDetails.value)
  }

  onRemoveTransferDetail(transferDetailId: string): void {
    nextTick(() => {
      this.transferDetails.value = this.transferDetails.value.filter((d: CompanyShareTransferDetail) => {
        return d.id !== transferDetailId
      })

      this.emitEvents("transferDetailsUpdated", this.transferDetails.value)
    })
  }

  onAssignToTransferFrom(index: number, event: Event): void {
    if (!this.transferDetails.value[index]) {
      return
    }

    let target = event.target as HTMLSelectElement
    let selectedValue = target.value

    let shareholder = this.shareholders.value.find((s: Shareholder) => {
      return s.id === selectedValue
    })

    if (!shareholder) {
      return
    }

    this.transferDetails.value[index].transferFromId = shareholder.id
    this.transferDetails.value[index].transferFromName = shareholder.fullName()
    this.transferDetails.value[index].transferFrom = new Shareholder(shareholder)

    this.emitEvents("transferDetailsUpdated", this.transferDetails.value)
  }

  onAssignToTransferTo(index: number, event: Event): void {
    if (!this.transferDetails.value[index]) {
      return
    }

    let target = event.target as HTMLSelectElement
    let selectedValue = target.value

    let shareholder = this.shareholders.value.find((s: Shareholder) => {
      return s.id === selectedValue
    })

    if (!shareholder) {
      return
    }

    this.transferDetails.value[index].transferToId = shareholder.id
    this.transferDetails.value[index].transferToName = shareholder.fullName()
    this.transferDetails.value[index].transferTo = new Shareholder(shareholder)

    this.emitEvents("transferDetailsUpdated", this.transferDetails.value)
  }

  onAmountUpdated(index: number): void {
    let transferDetail = this.transferDetails.value[index] ?? null
    if (!transferDetail) {
      return
    }

    if (transferDetail.unitsOfShare > this.maxToTransferFrom(index)) {
      transferDetail.unitsOfShare = this.maxToTransferFrom(index)

      let error = new Error(Error.ERROR_TYPE_DATA, "")
      error.title = `${transferDetail.transferFromName} has <b>${this.maxToTransferFrom(index)}</b> shares.`
      error.message = `You cannot transfer more than this number of shares.`
      error.handle()
    }

    this.emitEvents("transferDetailsUpdated", this.transferDetails.value)
  }

  isTransferToNew(transferDetail: CompanyShareTransferDetail): boolean {
    return transferDetail.transferToInvitation !== null
  }

  onTransferToExisting(transferDetail: CompanyShareTransferDetail): void {
    transferDetail.transferToInvitation = null
  }

  onTransferToNew(transferDetail: CompanyShareTransferDetail): void {
    let newInvitation = new ShareholderInvitation()
    newInvitation.target = new InvitationTarget()
    newInvitation.target.target = "company"
    newInvitation.target.id = this.companyId.value
    transferDetail.transferToInvitation = newInvitation
    transferDetail.transferToId = null
  }

  isTransferToCorporateBody(transferDetail: CompanyShareTransferDetail): boolean {
    return transferDetail.transferToType === ShareholdingType.Representative
  }

  placeholderForName(transferDetail: CompanyShareTransferDetail): string {
    if (this.isTransferToCorporateBody(transferDetail)) {
      return "NAME OF CORPORATE BODY"
    }

    return "NAME OF NEW SHAREHOLDER"
  }

  placeholderForEmail(transferDetail: CompanyShareTransferDetail): string {
    if (this.isTransferToCorporateBody(transferDetail)) {
      return "EMAIL OF REPRESENTATIVE"
    }

    return "NEW SHAREHOLDER'S EMAIL"
  }

  placeholderForIdentification(transferDetail: CompanyShareTransferDetail): string {
    if (this.isTransferToCorporateBody(transferDetail)) {
      return "COMPANY'S REGISTRATION NO."
    }

    return "NRIC / PASSPORT NO."
  }

  placeholderForIdentificationOld(transferDetail: CompanyShareTransferDetail): string {
    return "COMPANY'S REGISTRATION NO. (OLD)"
  }

  onSetEmail(event: Event, transferDetail: CompanyShareTransferDetail): void {
    if (!this.isTransferToNew(transferDetail) || !transferDetail.transferToInvitation) {
      return
    }

    let target = event.target as HTMLInputElement
    let email = target.value

    transferDetail.transferToInvitation.email = email
  }

  maxToTransferFrom(index: number): number {
    let transferDetail = this.transferDetails.value[index] ?? null
    if (!transferDetail) {
      return 0 // cannot transfer anything
    }

    let shareholder = this.shareholders.value.find((s: Shareholder) => {
      return s.id === transferDetail.transferFromId
    })

    if (!shareholder) {
      return 0 // cannot transfer anything
    }

    return Number(shareholder.ordinaryShares)
  }

  canEdit(): boolean {
    return !this.isReadOnly.value && !this.isInPreviewMode.value
  }

  canRespond(): boolean {
    let shareholderInFocus = this.shareholders.value.find((s: Shareholder) => {
      return s.id === this.shareholderId.value
    })

    if (!shareholderInFocus) {
      return false
    }

    let signature = this.companyShareholderTransferNotice.value.signatureGroups.find((sg: any) => {
      if (!shareholderInFocus) {
        return null
      }

      return sg.email === shareholderInFocus.email
    })

    let signatureUrl = signature?.signature?.url ?? null

    return shareholderInFocus.email === this.user.value.email && signatureUrl === null
  }

  canProceed(): boolean {
    let notTransferringToSelf = this.transferDetails.value.every((d: CompanyShareTransferDetail) => {
      return d.transferFromId !== d.transferToId
    })

    let allDetailsFilled = this.transferDetails.value.every((d: CompanyShareTransferDetail) => {
      if (!this.isTransferToNew(d) && StringUtil.isNullOrEmpty(d.transferToId)) {
        return false
      }

      if (
        this.isTransferToNew(d) &&
        (d.transferToInvitation === null || StringUtil.isNullOrEmpty(d.transferToInvitation.email))
      ) {
        return false
      }

      return (
        !StringUtil.isNullOrEmpty(d.transferFromId) &&
        !StringUtil.isNullOrEmpty(String(d.unitsOfShare)) &&
        Number(d.unitsOfShare) > 0
      )
    })

    let transferWithinLimit = this.transferDetails.value.every((b: CompanyShareTransferDetail) => {
      let shareholder = this.shareholders.value.find((s: Shareholder) => {
        return s.id === b.transferFromId
      })

      if (!shareholder) {
        return false
      }

      return shareholder.ordinaryShares >= Number(b.unitsOfShare)
    })

    return notTransferringToSelf && allDetailsFilled && transferWithinLimit
  }

  async updateShareTransfer(): Promise<void> {
    let totalSharesToTransfer = this.transferDetails.value.reduce((a, b: CompanyShareTransferDetail) => {
      return a + Number(b.unitsOfShare)
    }, 1)

    this.companyShareholderTransfer.value.sharesToTransfer = totalSharesToTransfer

    let invitationsToSend = this.transferDetails.value
      .filter((d: CompanyShareTransferDetail) => {
        return this.isTransferToNew(d)
      })
      .map((d: CompanyShareTransferDetail) => {
        if (!d.transferToInvitation) {
          return null
        }

        d.transferToInvitation.type = d.transferToType
        if (d.transferToType === ShareholdingType.Representative) {
          d.transferToInvitation.company.name = d.transferToName
          d.transferToInvitation.company.registrationNumberOld = d.transferToIdentificationAdditional
          d.transferToInvitation.company.registrationNumberNew = d.transferToIdentification
        }

        return d.transferToInvitation
      })
      .filter((si: ShareholderInvitation | null) => {
        return si !== null
      })
    await Promise.all(
      invitationsToSend.map((si: ShareholderInvitation | null) => {
        if (!si) {
          return
        }

        return si.create(useShareholderInvitationStore())
      })
    )

    this.companyShareholderTransfer.value.transferDetails = this.transferDetails.value.map(
      (d: CompanyShareTransferDetail) => {
        let newDetail = new CompanyShareTransferDetail(d)
        if (this.isTransferToNew(newDetail)) {
          newDetail.transferToInvitationId = d.transferToInvitation?.id ?? ""
        }
        return newDetail
      }
    )

    await this.companyShareholderTransfer.value.update(useCompanyShareholderTransferStore())
  }

  async onInitiatorSigned(signatureFileData: string): Promise<void> {
    if (!this.canProceed()) {
      let error = new Error(
        Error.ERROR_TYPE_DATA,
        "Please check the transfer details. Ensure that the transferor, transferee and amount to transfer are correctly filled in."
      )
      error.handle()
      this.setInitiatorSignatureItem()
      return
    }

    try {
      await this.updateShareTransfer()

      let signatureFile = await SignatureUtil.submit(signatureFileData)

      let time = useLocalTime()

      if (!this.isAShareholder.value) {
        this.emitEvents("signed", this.companyShareholderTransferNotice.value)
      }

      this.companyShareholderTransferNotice.value.signature = signatureFile
      this.companyShareholderTransferNotice.value.noticeDate = time.formatDateOnlySystem("")

      await this.companyShareholderTransferNotice.value.update(useCompanyShareholderTransferNoticeStore())
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        console.error(e)
      }
    }
  }

  async onShareholderSigned(signatureFileData: string): Promise<void> {
    if (this.canRespond()) {
      let transferorDetail = this.transferDetails.value.find((t: CompanyShareTransferDetail) => {
        return t.transferFromId === this.shareholderId.value
      })

      if (transferorDetail) {
        transferorDetail.isTransferFromConsented = this.isConsented.value
        await transferorDetail.submitTransferorConsent(useCompanyShareholderTransferStore())
      }

      let transfereeDetail = this.transferDetails.value.find((t: CompanyShareTransferDetail) => {
        return t.transferToId === this.shareholderId.value
      })

      if (transfereeDetail) {
        transfereeDetail.isTransferFromConsented = this.isConsented.value
        await transfereeDetail.submitTransfereeConsent(useCompanyShareholderTransferStore())
      }
    }

    let signatureGroup = new SignatureGroup()
    signatureGroup.target = new SignatureGroupTarget(
      this.companyShareholderTransferNotice.value.id,
      CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_TRANSFER
    )
    signatureGroup.group = new SignatureGroupGroup(this.shareholderId.value, "shareholder")

    let time = useLocalTime()
    let signatureDate = time.formatDateOnlySystem("")

    this.emitEvents("signed", this.companyShareholderTransferNotice.value)
    await signatureGroup.create(signatureFileData, useFileStore(), useSignatureStore(), signatureDate)
  }

  getCompanyShareholderTransfer(): CompanyShareholderTransfer {
    this.companyShareholderTransfer.value.transferDetails = this.transferDetails.value.map(
      (d: CompanyShareTransferDetail) => {
        return new CompanyShareTransferDetail(d)
      }
    )

    this.companyShareholderTransfer.value.sharesToTransfer = this.transferDetails.value.reduce(
      (a, b: CompanyShareTransferDetail) => {
        return a + Number(b.unitsOfShare)
      },
      1
    )

    return new CompanyShareholderTransfer(this.companyShareholderTransfer.value)
  }

  getCompanyShareholderTransferNotice(): CompanyShareholderTransferNotice {
    return new CompanyShareholderTransferNotice(this.companyShareholderTransferNotice.value)
  }

  onConsentClicked(): void {
    this.isConsented.value = !this.isConsented.value
  }

  isConsentRequired(): boolean {
    return this.transferDetails.value.some((d: CompanyShareTransferDetail) => {
      return d.transferFromId === this.shareholderId.value || d.transferToId === this.shareholderId.value
    })
  }

  shareholderInFocus(): Shareholder | null {
    return (
      this.shareholders.value.find((s: Shareholder) => {
        return s.id === this.shareholderId.value
      }) ?? null
    )
  }

  noticeDate(): string {
    if (StringUtil.isNullOrEmpty(this.companyShareholderTransferNotice.value.noticeDate)) {
      return "To be determined"
    }

    return this.time.formatDateOnlyFull(this.companyShareholderTransferNotice.value.noticeDate)
  }

  hasNoticeDate(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyShareholderTransferNotice.value.noticeDate)
  }

  signatureDate(): string {
    let shareholder = this.shareholderInFocus()
    if (!shareholder) {
      return "Pending Signature"
    }

    let signatureGroup = this.companyShareholderTransferNotice.value.signatureGroups.find((sg: any) => {
      return sg.email === shareholder?.email
    })

    if (!signatureGroup) {
      return "Pending Signature"
    }

    return this.time.formatDateOnlyFull(signatureGroup.createdAt ?? "")
  }

  hasSigned(): boolean {
    let shareholder = this.shareholderInFocus()
    if (!shareholder) {
      return false
    }

    let signatureGroup = this.companyShareholderTransferNotice.value.signatureGroups.find((sg: any) => {
      return sg.email === shareholder?.email
    })

    return signatureGroup !== undefined && signatureGroup.signature !== null
  }

  attentionTo(): string {
    let shareholder = this.shareholderInFocus()
    if (!shareholder) {
      return "(Unknown)"
    }

    return shareholder.fullName()
  }

  acknowledgementTitle(): string {
    return "Acknowledgement" //check if need to give consent
  }

  pronoun(): string {
    let shareholder = this.shareholderInFocus()
    if (!shareholder) {
      return "I"
    }

    return shareholder.isCorporateRepresentative() ? "We" : "I"
  }

  possessivePronoun(): string {
    let shareholder = this.shareholderInFocus()
    if (!shareholder) {
      return "I"
    }

    return shareholder.isCorporateRepresentative() ? "our" : "my"
  }

  shareholderName(): string {
    let shareholder = this.shareholderInFocus()
    if (!shareholder) {
      return "(Unknown)"
    }

    return shareholder.fullName()
  }

  typeOfShares(): string {
    return this.companyShareholderTransfer.value.shareType === ShareType.Ordinary ? "Ordinary" : "Preference"
  }

  numberOfTransfers(): number {
    return this.transferDetails.value.length
  }

  showAcknowledgementOnFirstPage(): boolean {
    return this.numberOfTransfers() <= 1 && !this.isDocumentEditable()
  }

  canAddTransferDetails(): boolean {
    return this.isDocumentEditable() && this.numberOfTransfers() < 5 && this.canEdit()
  }

  canRemoveTransferDetails(): boolean {
    return this.isDocumentEditable() && this.numberOfTransfers() > 1 && this.canEdit()
  }
}
