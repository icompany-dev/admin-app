import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
import { ResolutionController } from "./ResolutionController"
import { useCompanyAmendmentNameStore } from "~/stores/CompanyAmendmentNames"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"
import { NameReservation } from "~/scripts/types/NameReservation"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StatusConstants } from "~/scripts/constants/Status"

export class DcrChangeOfNamesController extends ResolutionController<CompanyAmendmentName> {
  companyAmendmentNameRepository = useCompanyAmendmentNameStore()
  companyRepository = useCompanyStore()
  nameReservations = ref<NameReservation[]>([])

  documentTemplateId: string = "0dfe6e41-6f28-4e26-8bf7-b18c81fcc135"
  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())
  originalTemplateContent: string = ""

  resolutionContent: Ref<string> = ref<string>("")

  constructor(props: IPropsResolutionDocument<CompanyAmendmentName>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyAmendmentName,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )
    this.setNameReservations(props.nameReservations)
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }

    await this.getPersonsToSign()
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyAmendmentNameRepository.fetch(id)
    if (!this.companyAmendmentNameRepository.error && response !== null) {
      this.application.value = new CompanyAmendmentName(response)
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    let company = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyAmendmentName()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
    }
  }

  setNameReservations(nameReservations: NameReservation[]): void {
    this.nameReservations.value = []
    this.nameReservations.value = nameReservations.map((nr: NameReservation) => {
      let newNameReservation = new NameReservation("", "")
      newNameReservation.clone(nr)
      return newNameReservation
    })
  }

  async fetchDocumentTemplate(): Promise<void> {
    try {
      let repository = useDocumentTemplateStore()
      let response = await repository.fetch(this.documentTemplateId)
      if (repository.error !== null) {
        throw repository.error
      }

      this.documentTemplate.value = new DocumentTemplate(response)
      this.originalTemplateContent = this.documentTemplate.value.content
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        console.error(e) // not handling the error for now
      }
    }
  }

  async otherDataInitiation(): Promise<void> {
    // do nothing
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

  pursuantSectionNumber(): string {
    if (!this.application.value?.company?.hasConstitution) {
      return "Section 300 of the Companies Act, 2016"
    }

    return "Company's Constitution"
  }

  setContent(): void {
    this.resolutionContent.value = this.getContent()
  }

  getContent(): string {
    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    if (this.isInPreviewMode.value) {
      return templateProcessor.getContentForPreview(this.application.value)
    }

    return this.isDocumentEditable()
      ? templateProcessor.getContent(this.application.value, false)
      : templateProcessor.getContentForPrint(this.application.value)
  }

  //handle name search
  namesToChangeTo(): string {
    if (!this.application.value) {
      return ""
    }

    const names = [
      this.application.value.name1?.getCompleteName() ?? "",
      this.application.value.name2?.getCompleteName() ?? "",
      this.application.value.name3?.getCompleteName() ?? "",
    ]

    let nameChangeTo = names
      .filter((n) => {
        return n.length > 0
      })
      .join(" / ")

    if (StringUtil.isNullOrEmpty(nameChangeTo)) {
      return "YOUR PROPOSE NAME SDN BHD"
    }

    return nameChangeTo
  }

  handleNumberOfNamesChanged(nameReservations: NameReservation[]): void {
    this.nameReservations.value = nameReservations.map((nr: NameReservation) => {
      let newNameReservation = new NameReservation("", "")
      newNameReservation.clone(nr)
      return newNameReservation
    })
    this.handlePageChanges()
    this.emitEvents("nameChanged", this.nameReservations.value)
  }

  handleNameChanges(nameReservations: NameReservation[]): void {
    // check if there are any changes first\
    let hasChanged = this.nameReservations.value.some((nr: NameReservation) => {
      let nrInParam = nameReservations.find((nrp: NameReservation) => {
        return nr.id === nrp.id
      })
      if (!nrInParam) {
        return true
      }

      return !nr.isEqual(nrInParam)
    })
    let hasChangedInParams = nameReservations.some((nrInParam: NameReservation) => {
      let nrInHere = this.nameReservations.value.find((x: NameReservation) => {
        return nrInParam.id === x.id
      })

      return !nrInHere || !nrInParam.isEqual(nrInHere)
    })
    let anyChanges = this.nameReservations.value.length !== nameReservations.length || hasChanged || hasChangedInParams
    if (!anyChanges) {
      return
    }

    this.nameReservations.value = nameReservations.map((nr: NameReservation) => {
      let newNameReservation = new NameReservation("", "")
      newNameReservation.clone(nr)
      return newNameReservation
    })
    this.handlePageChanges()

    this.emitEvents("nameChanged", this.nameReservations.value)
  }

  handlePageChanges(): void {
    let numberOfNames = this.nameReservations.value.length
    let isAnySupportingDocumentsRequired = this.nameReservations.value.some((nr: NameReservation) => {
      return nr.isSupportingDocumentRequired
    })

    if (!isAnySupportingDocumentsRequired && numberOfNames <= 1) {
      this.signatureStartOnPage.value = 1
      this.maxSignatureOnFirstPage.value = 2
    } else {
      this.signatureStartOnPage.value = 2
      this.maxSignatureOnFirstPage.value = 6
    }
  }

  override isDocumentEditable(): boolean {
    if (this.isInPreviewMode.value) {
      return false
    }

    if (!this.application.value) {
      return false
    }

    if (this.application.value.canProposeNewName()) {
      return true
    }

    if (this.application.value.signatureGroups.length > 0) {
      return false
    }

    return (
      this.application.value &&
      (StringUtil.isNullOrEmpty(this.application.value.id) ||
        this.application.value.status === StatusConstants.DRAFT ||
        this.application.value.status === StatusConstants.PENDING ||
        this.application.value.status === StatusConstants.PAID)
    )
  }
}
