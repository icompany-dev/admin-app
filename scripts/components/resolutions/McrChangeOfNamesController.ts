import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
import { ResolutionController } from "./ResolutionController"
import { useCompanyAmendmentNameStore } from "~/stores/CompanyAmendmentNames"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"
import { NameReservation } from "~/scripts/types/NameReservation"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StatusConstants } from "~/scripts/constants/Status"

export class McrChangeOfNamesController extends ResolutionController<CompanyAmendmentName> {
  companyAmendmentNameRepository = useCompanyAmendmentNameStore()
  companyRepository = useCompanyStore()
  nameReservations = ref<NameReservation[]>([])

  constructor(props: IPropsResolutionDocument<CompanyAmendmentName>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyAmendmentName,
      props.isInPreviewMode,
      false,
      true,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )
    this.setNameReservations(props.nameReservations)

    this.hasAccompanyingDocument.value = true
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

  setNameReservations(nameReservations: NameReservation[]): void {
    this.nameReservations.value = toRaw(nameReservations).map((nr: NameReservation) => {
      let newNameReservation = new NameReservation("", "")
      newNameReservation.clone(nr)
      return newNameReservation
    })
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyAmendmentNameRepository.fetch(id)
    if (!this.companyAmendmentNameRepository.error && response) {
      this.application.value = new CompanyAmendmentName(response)
      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    let response = await this.companyRepository.fetch(this.companyId.value)
    if (!this.companyRepository.error && response) {
      this.application.value = new CompanyAmendmentName()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(response)
      this.initializeData()
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    // do nothing
  }

  setContent(): void {
    // do nothing
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
    this.nameReservations.value = []
    this.nameReservations.value = nameReservations.map((nr: NameReservation) => {
      let newNameReservation = new NameReservation("", "")
      newNameReservation.clone(nr)
      return newNameReservation
    })
    this.handlePageChanges()

    this.emitEvents("nameChanged", nameReservations)
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
    let hasChangedInParams = nameReservations.some((nr: NameReservation) => {
      let nrInHere = this.nameReservations.value.find((nrp: NameReservation) => {
        return nr.id === nrp.id
      })
      if (!nrInHere) {
        return true
      }

      return !nr.isEqual(nrInHere)
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

    this.emitEvents("nameChanged", nameReservations)
  }

  handlePageChanges(): void {
    let numberOfNames = this.nameReservations.value.length
    let isAnySupportingDocumentsRequired = this.nameReservations.value.some((nr: NameReservation) => {
      return nr.isSupportingDocumentRequired
    })

    if (!isAnySupportingDocumentsRequired && numberOfNames <= 2) {
      this.signatureStartOnPage.value = 1
      this.maxSignatureOnFirstPage.value = 4
    } else {
      this.signatureStartOnPage.value = 1
      this.maxSignatureOnFirstPage.value = 2
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
