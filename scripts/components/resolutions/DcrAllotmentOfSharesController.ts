import { CompanyShareholderAllotment, CompanyShareAllotTo } from "~/scripts/models/CompanyShareholderAllotment"
import { ResolutionController } from "./ResolutionController"
import { useCompanyShareholderAllotmentStore } from "~/stores/CompanyShareholderAllotments"
import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Shareholder } from "~/scripts/models/Shareholder"
import { Error } from "~/scripts/library/Error"
import { SelectOption } from "~/scripts/types/SelectOption"
import { ShareType, ShareholdingType } from "~/scripts/constants/Shareholder"
import { AllotTo } from "~/scripts/types/AllotTo"
import { AlloteeType } from "~/scripts/constants/AllotmentOfShares"
import { ShareholderInvitation } from "~/scripts/models/ShareholderInvitation"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrAllotmentOfSharesController extends ResolutionController<CompanyShareholderAllotment> {
  companyShareholderAllotmentRepository = useCompanyShareholderAllotmentStore()
  companyRepository = useCompanyStore()

  allotTos = ref<AllotTo[]>([])

  shareholders = ref<Shareholder[]>([])
  shareholderOptions = ref<SelectOption[]>([])

  isChangeHandlingRequired: Ref<boolean> = ref<boolean>(false)

  constructor(props: IPropsResolutionDocument<CompanyShareholderAllotment>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyShareholderAllotment,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 4
    this.maxSignatureOnOtherPages.value = 6
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyShareholderAllotmentRepository.fetch(id)
    if (!this.companyShareholderAllotmentRepository.error) {
      this.application.value = new CompanyShareholderAllotment(response)
      this.setAllotTos()
      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyShareholderAllotment()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(response)
      this.application.value.shareAllotTos.push(new CompanyShareAllotTo())
      this.setAllotTos()
      this.initializeData()
    }
  }

  async otherDataInitiation(): Promise<void> {
    this.shareholders.value = []

    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    try {
      let response = await this.shareholderRepository.fetchAllForCompany(this.companyId.value)
      this.shareholders.value = response.map((s: Shareholder) => {
        return new Shareholder(s)
      })
      this.setShareholderOptions()
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchCustom("list of your shareholders", "senarai pemegang saham anda")
        errorMessage.handle()
      }
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    //do nothing
  }

  setContent(): void {
    // do nothing
  }

  // NOTE: This is to capture data changes from the MCR
  // -- MCR can update the data for allot tos
  onApplicationChanged(application: CompanyShareholderAllotment): void {
    this.application.value = new CompanyShareholderAllotment(application)

    this.setAllotTos()
  }

  setShareholderOptions(): void {
    this.shareholderOptions.value = this.shareholders.value.map((s: Shareholder) => {
      let name =
        s.type === ShareholdingType.Representative ? (s.company?.getFullName() ?? "") : (s.user?.name ?? s.name)
      return new SelectOption(s.id, s.id, name)
    })
  }

  setAllotTos(): void {
    if (!this.application.value) {
      this.allotTos.value = []
      return
    }

    this.allotTos.value = this.application.value.shareAllotTos.map((allotee: CompanyShareAllotTo) => {
      let type = allotee.shareholderInvitation !== null ? AlloteeType.New : AlloteeType.Existing
      let isDisabled = allotee.shareholderId !== null

      let allotTo = new AllotTo(type, allotee, isDisabled)
      if (type === AlloteeType.New && allotee.shareholderInvitation !== null) {
        allotTo.email = allotee.shareholderInvitation.email
        allotTo.shareholdingType =
          allotee.shareholderInvitation.company !== null &&
          !StringUtil.isNullOrEmpty(allotee.shareholderInvitation.company.name)
            ? ShareholdingType.Representative
            : ShareholdingType.Individual
        allotTo.companyName = allotee.shareholderInvitation.company.name ?? ""
        allotTo.companyType = allotee.shareholderInvitation.company.type ?? ""
      }

      return allotTo
    })
  }

  getShareholderOptionsForIndex(allotee: CompanyShareAllotTo): SelectOption[] {
    return this.shareholderOptions.value.filter((so: SelectOption) => {
      return !this.allotTos.value.some((allotTo: AllotTo) => {
        return allotTo.allotee.id !== allotee.id && allotTo.allotee.shareholderId === so.value
      })
    })
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return 1
    }

    return (
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )
    )
  }

  async onAddAllotTo(type: AlloteeType): Promise<void> {
    let newAllotTo = new CompanyShareAllotTo()
    newAllotTo.id = crypto.randomUUID()
    let allotTo = new AllotTo(type, newAllotTo, false)
    this.allotTos.value.push(allotTo)

    await nextTick(() => {
      this.setMaxSignatureOnFirstPage()
    })
  }

  onRemoveAllotTo(allotToId: string): void {
    this.allotTos.value = this.allotTos.value.filter((allotTo: AllotTo) => {
      return allotTo.allotee.id !== allotToId
    })

    if (!this.application.value) {
      return
    }

    this.application.value.shareAllotTos = this.application.value.shareAllotTos.filter(
      (allotTo: CompanyShareAllotTo) => {
        return allotTo.id !== allotToId
      }
    )

    this.setMaxSignatureOnFirstPage()
  }

  getAllotTos(): AllotTo[] {
    return this.allotTos.value
  }

  changeAllotToType(index: number): void {
    let allotTo = this.allotTos.value[index] ?? null

    if (!allotTo) {
      return
    }

    allotTo.type = allotTo.type === AlloteeType.Existing ? AlloteeType.New : AlloteeType.Existing

    if (allotTo.type === AlloteeType.Existing) {
      Object.assign(allotTo.allotee, {
        shareholderInvitation: null,
        shareholderName: "",
        shareholderIdentification: "",
        shareholderIdentificationType: "",
      })
    } else {
      Object.assign(allotTo.allotee, {
        shareholderId: null,
        shareholder: null,
      })
    }

    this.setMaxSignatureOnFirstPage()
  }

  setMaxSignatureOnFirstPage(): void {
    this.signatureStartOnPage.value = 1

    let totalRows = this.allotTos.value.length
    let lowerLimit = 4
    let upperLimit = 11
    if (this.isDocumentEditable()) {
      let existingRows = this.allotTos.value.filter((allotTo: AllotTo) => {
        return allotTo.type === AlloteeType.Existing
      }).length

      let newRows =
        this.allotTos.value.filter((allotTo: AllotTo) => {
          return allotTo.type === AlloteeType.New
        }).length * 3

      totalRows = existingRows + newRows

      lowerLimit = 3
      upperLimit = 8
    }

    this.maxSignatureOnFirstPage.value = totalRows <= lowerLimit ? 4 : 2

    if (totalRows > upperLimit) {
      this.maxSignatureOnFirstPage.value = 6
      this.signatureStartOnPage.value = 2
    }
  }

  totalShares(): number {
    return this.allotTos.value.reduce((a: number, b: AllotTo) => {
      return a + Number(b.allotee.sharesAllotted)
    }, 0)
  }

  shareholderTypeOptions(): SelectOption[] {
    let individualType = "Individual"
    let corporateBodyType = "Corporate Body"

    return [
      new SelectOption(ShareholdingType.Individual, ShareholdingType.Individual, individualType),
      new SelectOption(ShareholdingType.Representative, ShareholdingType.Representative, corporateBodyType),
    ]
  }

  getNameLabel(allotTo: AllotTo): string {
    return allotTo.shareholdingType === ShareholdingType.Individual ? "MEMBER" : "REPRESENTATIVE"
  }

  getApplicationData(): CompanyShareholderAllotment {
    if (!this.application.value) {
      this.application.value = new CompanyShareholderAllotment()
    }

    let shareType = this.application.value?.shareType ?? ShareType.Ordinary
    this.application.value.shareAllotTos = this.allotTos.value.map((allotTo: AllotTo) => {
      allotTo.allotee.sharesType = shareType

      if (allotTo.type === AlloteeType.New) {
        allotTo.allotee.shareholderId = null

        if (
          allotTo.allotee.shareholderInvitation === null ||
          StringUtil.isNullOrEmpty(allotTo.allotee.shareholderInvitation.id)
        ) {
          allotTo.allotee.shareholderInvitation = new ShareholderInvitation()
        }

        allotTo.allotee.shareholderInvitation.email = allotTo.email
        allotTo.allotee.shareholderInvitation.company.name = allotTo.companyName
        allotTo.allotee.shareholderInvitation.company.type = allotTo.companyType
        allotTo.allotee.shareholderInvitation.ordinaryShares =
          shareType === ShareType.Ordinary ? allotTo.allotee.sharesAllotted : 0
        allotTo.allotee.shareholderInvitation.preferenceShares =
          shareType === ShareType.Preference ? allotTo.allotee.sharesAllotted : 0
        allotTo.allotee.shareholderInvitation.totalShares = allotTo.allotee.sharesAllotted
        allotTo.allotee.shareholderInvitation.target.target = "company"
        allotTo.allotee.shareholderInvitation.target.id = this.application.value?.companyId ?? ""
      } else {
        allotTo.allotee.shareholderInvitation = null
      }
      return new CompanyShareAllotTo(allotTo.allotee)
    })

    this.application.value.sharesAllotted = this.totalShares()

    return this.application.value as CompanyShareholderAllotment
  }

  allotToName(allotTo: AllotTo): string {
    if (this.isInPreviewMode.value) {
      return "NAME OF ALLOTEE"
    }

    return allotTo.name()
  }

  allotToShares(allotTo: AllotTo): string {
    if (this.isInPreviewMode.value) {
      return "NO. OF SHARES"
    }

    return `${allotTo.allotee.sharesAllotted}`
  }

  override async updateApplicationContent(updatedApplicationData: CompanyShareholderAllotment): Promise<void> {
    if (!this.isChangeHandlingRequired.value) {
      return
    }

    nextTick(async () => {
      if (!this.application.value) {
        this.application.value = new CompanyShareholderAllotment()
      }

      this.application.value.cloneDetails(updatedApplicationData)
      this.setAllotTos()
      await this.getPersonsToSign()

      this.isChangeHandlingRequired.value = false
    })
  }

  setIsChangeHandlingRequired(isChangeHandlingRequired: boolean): void {
    this.isChangeHandlingRequired.value = isChangeHandlingRequired
  }
}
