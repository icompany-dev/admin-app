import { CompanyChangeBankSignatory } from "~/scripts/models/CompanyChangeBankSignatory"
import { useCompanyChangeBankSignatoryStore } from "#imports"
import { useCompanyStore } from "#imports"
import { ResolutionController } from "./ResolutionController"
import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { Director } from "~/scripts/models/Director"
import { IdentificationTypes, IdentificationType } from "~/scripts/constants/IdentificationTypes"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { CompanyBank } from "~/scripts/models/CompanyBank"
import { CompanyBankSignatory } from "~/scripts/models/CompanyBankSignatory"
import { PropsResolution } from "~/scripts/props/PropsResolution"
import { SignatureItem } from "~/scripts/types/SignatureItem"

export class DcrChangeBankSignatoriesController extends ResolutionController<CompanyChangeBankSignatory> {
  companyChangeBankSignatoryRepository = useCompanyChangeBankSignatoryStore()
  companyRepository = useCompanyStore()

  companyBankId: Ref<string> = ref<string>("")
  companyBank: Ref<CompanyBank> = ref<CompanyBank>(new CompanyBank())
  directors = ref<Director[]>([])

  identificationTypeOptions: Array<IdentificationType> = IdentificationTypes.OPTIONS
  directorName: string | null = null
  directorEmail: string | null = null
  directorIdentificationType: string = IdentificationTypes.IC.id
  directorIdentification: string | null = null

  constructor(props: IPropsResolutionDocument<CompanyChangeBankSignatory>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyChangeBankSignatory,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )
    this.isDcr.value = true

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 2
    this.maxSignatureOnOtherPages.value = 6
    // this.isReadOnly.value = false
    this.setCompanyBankId(props.companyBankId ?? "")
  }

  async setCompanyBankId(companyBankId: string): Promise<void> {
    this.companyBankId.value = companyBankId

    if (!StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return //values should depend on the application itself
    }

    if (StringUtil.isNullOrEmpty(this.companyBankId.value)) {
      this.companyBank.value = new CompanyBank()
      if (this.application.value) {
        this.application.value.companyBankId = this.companyBankId.value
        this.application.value.companyBank = new CompanyBank()
      }
      return
    }

    try {
      let repository = useCompanyBankStore()
      let response = await repository.fetch(this.companyBankId.value)

      if (!response || repository.error !== null) {
        throw ""
      }

      this.companyBank.value = new CompanyBank(response)
      if (this.application.value) {
        this.application.value.companyBankId = this.companyBankId.value
        this.application.value.companyBank = new CompanyBank(this.companyBank.value)
        this.application.value.signatories = this.companyBank.value.signatories.map((d: any) => {
          return new CompanyBankSignatory(d)
        })
      }
    } catch (e) {
      //
    }
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
    let response = await this.companyChangeBankSignatoryRepository.fetch(id)
    if (!this.companyChangeBankSignatoryRepository.error && response !== null) {
      this.application.value = new CompanyChangeBankSignatory(response)
      this.companyBankId.value = this.application.value.companyBankId
      this.companyBank.value = new CompanyBank(this.application.value.companyBank)
      if (this.application.value.signatories.length <= 0) {
        this.application.value.signatories = this.companyBank.value.signatories.map((d: any) => {
          return new CompanyBankSignatory(d)
        })
      }

      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    this.application.value = new CompanyChangeBankSignatory()
    this.application.value.companyId = this.companyId.value

    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value.company = new Company(response)
    }

    if (this.application.value) {
      this.application.value.companyBankId = this.companyBankId.value
      this.application.value.companyBank = new CompanyBank(this.companyBank.value)
      this.application.value.signatories = this.companyBank.value.signatories.map((d: any) => {
        return new CompanyBankSignatory(d)
      })
    }

    this.initializeData()
  }

  async fetchDocumentTemplate(): Promise<void> {
    //
  }

  async otherDataInitiation(): Promise<void> {
    let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
    this.directors.value = response.map((d: Director) => {
      return new Director(d)
    })
  }

  setContent(): void {
    //
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

  override async getPersonsToSign(): Promise<void> {
    let directors: Director[] = []
    let response = await this.directorRepository.fetchAllForCompany(this.companyId.value)
    directors = response.map((d: any) => {
      return new Director(d)
    })
    this.signatureItems.value = directors
      .filter((d: Director) => {
        if (!this.excludeResigningDirectors) {
          return true
        }

        return !new Director(d).isResignationInProgress
      })
      .map((d: Director) => {
        return new SignatureItem(
          null,
          this.hasSigned(d.email, "director"),
          false,
          d.email !== this.currentUser.email,
          d.name,
          d.email,
          "Director"
        )
      })
  }

  directorNameOptions(index: number): string[] {
    let signatory = this.signatories[index] ?? null

    if (!signatory) {
      return []
    }

    return this.directors.value
      .filter((d: Director) => {
        if (!signatory) {
          return true
        }

        return !this.signatories.some((s: CompanyBankSignatory, i: number) => {
          if (i === index) {
            return false
          }

          return s.name === d.name
        })
      })
      .map((d: Director) => {
        return d.name
      })
  }

  onNameChanged(index: number): void {
    let signatory = this.signatories[index] ?? null
    if (!signatory) {
      return
    }

    let matchedDirector = this.directors.value.find((d: Director) => {
      return d.name === signatory.name
    })

    if (!matchedDirector) {
      return
    }

    signatory.type = matchedDirector.identificationType
    signatory.identification = matchedDirector.identification
  }

  onAddSignatory(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.signatories.push(new CompanyBankSignatory())
  }

  onRemoveSignatory(index: number): void {
    if (!this.application.value) {
      return
    }

    this.application.value.signatories.splice(index, 1)
  }

  handleDataUpdated(): void {
    if (!this.application.value) {
      return
    }

    let areAllDataCompleted =
      this.application.value.signatories.length > 0 &&
      this.application.value.signatories.every((cbs: CompanyBankSignatory) => {
        return cbs.canCreate()
      })

    if (!areAllDataCompleted) {
      return
    }

    this.emitEvents("dataUpdated", this.application.value)
  }

  get areAllDataCompleted(): boolean {
    if (!this.application.value) {
      return false
    }

    return (
      this.application.value.signatories.length > 0 &&
      this.application.value.signatories.every((cbs: CompanyBankSignatory) => {
        return cbs.canCreate()
      })
    )
  }

  get bankName(): string {
    return this.companyBank.value.bank.name
  }

  get branchDetails(): string {
    return this.companyBank.value.bankBranch.name
  }

  get bankAddress(): string {
    return this.companyBank.value.bankBranch.address
  }

  get bankAccountNumber(): string {
    return this.companyBank.value.accountNumber
  }

  get signatories(): CompanyBankSignatory[] {
    if (!this.application.value || this.application.value.signatories.length <= 0) {
      return [new CompanyBankSignatory()]
    }

    return this.application.value.signatories
  }

  override get resolutionProps() {
    let props = new PropsResolution(
      this.companyName(), //companyName
      this.registrationNumberOld(), //registrationNumberOld
      this.registrationNumberNew(), //registrationNumberNew
      this.resolutionTitle(), //resolutionTitle
      "", //resolutionName
      this.signatureTitle(), //signatureTitle
      this.signatureItems.value, //signatureItems
      this.resolutionDate(), //resolutionDate
      this.totalPages(), //totalPages
      this.signatureStartOnPage.value, //signatureStartOnPage
      this.maxSignatureOnFirstPage.value, //maxSignatureOnFirstPage
      this.maxSignatureOnOtherPages.value, //maxSignatureOnOtherPage
      this.hasAccompanyingDocument.value, //hasAccompanyingDocument
      this.isDcr.value, //isDcr
      this.showWatermark.value, //showWatermark
      this.watermarkText.value, //watermarkText
      [], //contentPages
      this.isUsingTemplate.value, //isUsingTemplate
      this.isLoading.value //isLoading
    )

    props.isSignatureTinted = true
    props.signatureTintLabel = "Your Signature is required in Wet Ink"

    return props
  }
}
