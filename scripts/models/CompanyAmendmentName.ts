import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { Application } from "./Application"
import { NameReservationVariant } from "./NameReservationVariant"
import type { IModelApplication } from "./IModelApplication"
import { CompanyNameReservation } from "./CompanyNameReservation"
import { ObjectUtil } from "../utils/Object"
import { StatusConstants } from "../constants/Status"

export class CompanyAmendmentName
  extends Application
  implements IModelApplication<CompanyAmendmentName, ReturnType<typeof useCompanyAmendmentNameStore>>
{
  refNo: string = ""
  currentName: string = ""

  name1: NameReservationVariant | null = null
  name2: NameReservationVariant | null = null
  name3: NameReservationVariant | null = null
  confirmedName: NameReservationVariant | null = null

  nameReservations: CompanyNameReservation[] = []

  constructor(data: any | null = null) {
    super()

    if (!data) {
      return
    }

    if (data instanceof CompanyAmendmentName) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.refNo = data.ref_no ?? ""
    this.currentName = data.current_name ?? ""
    this.name1 = new NameReservationVariant(
      data.name_1,
      data.name_type_1,
      data.name_description_1,
      data.supporting_document_1
    )
    if (!StringUtil.isNullOrEmpty(data.name_2)) {
      this.name2 = new NameReservationVariant(
        data.name_2,
        data.name_type_2,
        data.name_description_2,
        data.supporting_document_2
      )
    }
    if (!StringUtil.isNullOrEmpty(data.name_3)) {
      this.name3 = new NameReservationVariant(
        data.name_3,
        data.name_type_3,
        data.name_description_3,
        data.supporting_document_3
      )
    }
    if (!StringUtil.isNullOrEmpty(data.confirmed_name)) {
      this.confirmedName = new NameReservationVariant(
        data.confirmed_name,
        data.confirmed_name_type,
        data.confirmed_name_description,
        data.confirmed_supporting_document
      )
    }

    this.nameReservations =
      data.name_reservations && Array.isArray(data.name_reservations)
        ? data.name_reservations.map((item: any) => {
            return new CompanyNameReservation(item)
          })
        : []
  }

  cloneDetails(data: CompanyAmendmentName): void {
    super.clone(data)

    this.refNo = data.refNo ?? ""
    this.currentName = data.currentName ?? ""
    this.name1 = new NameReservationVariant("", "", "", null)
    this.name1.clone(data.name1)
    this.name2 = new NameReservationVariant("", "", "", null)
    this.name2.clone(data.name2)
    this.name3 = new NameReservationVariant("", "", "", null)
    this.name3.clone(data.name3)
    this.confirmedName = new NameReservationVariant("", "", "", null)
    this.confirmedName.clone(data.confirmedName)
    this.nameReservations = data.nameReservations.map((item: any) => {
      return new CompanyNameReservation(item)
    })
  }

  getRequestBody(): object {
    let data: any = {
      company_id: this.companyId,
    }

    if (!StringUtil.isNullOrEmpty(this.name1?.name ?? "")) {
      data.name_1 = this.name1?.name
    }
    if (!StringUtil.isNullOrEmpty(this.name1?.nameType ?? "")) {
      data.name_type_1 = this.name1?.nameType
    }
    if (!StringUtil.isNullOrEmpty(this.name1?.nameDescription ?? "")) {
      data.name_description_1 = this.name1?.nameDescription
    }
    if (!StringUtil.isNullOrEmpty(this.name1?.supportingDocumentId ?? "")) {
      data.supporting_document_id_1 = this.name1?.supportingDocumentId
    }

    if (!StringUtil.isNullOrEmpty(this.name2?.name ?? "")) {
      data.name_2 = this.name2?.name
    }
    if (!StringUtil.isNullOrEmpty(this.name2?.nameType ?? "")) {
      data.name_type_2 = this.name2?.nameType
    }
    if (!StringUtil.isNullOrEmpty(this.name2?.nameDescription ?? "")) {
      data.name_description_2 = this.name2?.nameDescription
    }
    if (!StringUtil.isNullOrEmpty(this.name2?.supportingDocumentId ?? "")) {
      data.supporting_document_id_2 = this.name2?.supportingDocumentId
    }

    if (!StringUtil.isNullOrEmpty(this.name3?.name ?? "")) {
      data.name_3 = this.name3?.name
    }
    if (!StringUtil.isNullOrEmpty(this.name3?.nameType ?? "")) {
      data.name_type_3 = this.name3?.nameType
    }
    if (!StringUtil.isNullOrEmpty(this.name3?.nameDescription ?? "")) {
      data.name_description_3 = this.name3?.nameDescription
    }
    if (!StringUtil.isNullOrEmpty(this.name3?.supportingDocumentId ?? "")) {
      data.supporting_document_id_3 = this.name3?.supportingDocumentId
    }

    return data
  }

  canSubmit() {
    return (
      !StringUtil.isNullOrEmpty(this.companyId) &&
      !StringUtil.isNullOrEmpty(this.name1?.name ?? "") &&
      !StringUtil.isNullOrEmpty(this.name1?.nameType ?? "")
    )
  }

  async create(repository: ReturnType<typeof useCompanyAmendmentNameStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyAmendmentNameStore>): Promise<void> {
    if (!this.canSubmit() || StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyAmendmentNameStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    return response
  }

  isNewProposeNameRequired(): boolean {
    let totalNamesAlreadyProposed = [this.name1, this.name2, this.name3].filter((name) => {
      return name !== null && !StringUtil.isNullOrEmpty(name.name)
    }).length

    if (this.nameReservations.length < totalNamesAlreadyProposed) {
      return false
    }

    let sortedNameReservation = ObjectUtil.sort<CompanyNameReservation>(this.nameReservations, "createdAt", "desc")
    return sortedNameReservation[0].status === StatusConstants.REJECTED
  }

  canProposeNewName(): boolean {
    if (this.nameReservations.length < 2) {
      return false
    }

    let sortedNameReservation = ObjectUtil.sort<CompanyNameReservation>(this.nameReservations, "createdAt", "desc")
    return (
      sortedNameReservation[1].status === StatusConstants.REJECTED &&
      sortedNameReservation[0].status === StatusConstants.PAID &&
      StringUtil.isNullOrEmpty(sortedNameReservation[0].proposedName)
    ) // they must pay first
  }
}
