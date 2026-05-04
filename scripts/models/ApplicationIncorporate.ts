import _ from "lodash"
import { DirectorInvitation } from "./DirectorInvitation"
import { File } from "./File"
import type { IApplication } from "./IApplication"
import { Location } from "./Location"
import { MsicCodeAssign } from "./MsicCodeAssign"
import { NameReservationVariant } from "./NameReservationVariant"
import { ShareholderInvitation } from "./ShareholderInvitation"
import { SignatureGroup } from "./SignatureGroup"
import { StringUtil } from "../utils/String"
import { Error } from "../library/Error"
import { ApplicationNameReservation } from "./ApplicationNameReservation"
import { CompanyConstants } from "../constants/Company"

export class ApplicationIncorporate implements IApplication {
  id: string = ""
  refNo: string = ""
  name1: NameReservationVariant = new NameReservationVariant("", CompanyConstants.TYPE_ID_SDNBHD, null, null)
  name2: NameReservationVariant | null = null
  name3: NameReservationVariant | null = null
  nameSelected: NameReservationVariant | null = null
  ordinaryShares: number = 0
  preferenceShares: number = 0
  totalShares: number = 0
  directorInvitations: DirectorInvitation[] = []
  shareholderInvitations: ShareholderInvitation[] = []
  msicCodeAssigns: MsicCodeAssign[] = []
  businessDescription: string = ""
  hasBusinessAddress: boolean = true
  canReceiveMail: boolean = true
  businessAddressLocationId: string | null = null
  businessAddressLocation: Location | null = null
  image: File | null = null
  signatureGroups: SignatureGroup[] = []
  signatureGroupStatus: string = ""
  applicantId: string = ""
  nameReservationApplications: ApplicationNameReservation[] = []
  status: string = ""
  metaData: any = null
  paidAt: string | null = null
  submittedAt: string | null = null
  completedAt: string | null = null
  createdAt: string = ""
  updatedAt: string = ""
  deletedAt: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof ApplicationIncorporate) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id ?? data.application_incorporation_id
    this.refNo = data.ref_no
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
    if (!StringUtil.isNullOrEmpty(data.name_selected)) {
      this.nameSelected = new NameReservationVariant(
        data.name_selected,
        data.name_type_selected,
        data.name_description_selected,
        data.supporting_documen_selectedt
      )
    }
    this.ordinaryShares = data.ordinary_shares ?? 0
    this.preferenceShares = data.preference_shares ?? 0
    this.totalShares = data.total_shares ?? 0
    this.directorInvitations =
      data.director_invitations && Array.isArray(data.director_invitations)
        ? data.director_invitations.map((di: any) => {
            return new DirectorInvitation(di)
          })
        : []
    this.shareholderInvitations =
      data.shareholder_invitations && Array.isArray(data.shareholder_invitations)
        ? data.shareholder_invitations.map((si: any) => {
            return new ShareholderInvitation(si)
          })
        : []
    this.msicCodeAssigns =
      data.msic_code_assigns && Array.isArray(data.msic_code_assigns)
        ? data.msic_code_assigns.map((mca: any) => {
            return new MsicCodeAssign(mca)
          })
        : []
    this.businessDescription = data.business_description ?? ""
    this.hasBusinessAddress = data.has_business_address ?? true
    this.canReceiveMail = data.can_receive_mail ?? false
    this.businessAddressLocationId = data.business_address_location?.id ?? null
    this.businessAddressLocation = data.business_address_location ? new Location(data.business_address_location) : null
    this.image = data.image ?? null
    this.signatureGroups =
      data.signature_groups && Array.isArray(data.signature_groups)
        ? data.signature_groups.map((sg: any) => {
            return new SignatureGroup(sg)
          })
        : []
    this.signatureGroupStatus = data.signature_group_status ?? ""
    this.applicantId = data.applicant_id ?? ""
    this.nameReservationApplications =
      data.name_reservation_applications && Array.isArray(data.name_reservation_applications)
        ? data.name_reservation_applications.map((d: any) => {
            return new ApplicationNameReservation(d)
          })
        : []
    this.status = data.status ?? ""
    this.metaData = data.meta_data ? _.cloneDeep(data.meta_data) : null
    this.paidAt = data.paid_at ?? null
    this.submittedAt = data.submitted_at ?? null
    this.completedAt = data.completed_at ?? null
    this.createdAt = data.created_at ?? ""
    this.updatedAt = data.updated_at ?? ""
    this.deletedAt = data.deleted_at ?? ""
  }

  clone(data: ApplicationIncorporate): void {
    this.id = data.id
    this.refNo = data.refNo
    this.name1.clone(data.name1)
    if (data.name2) {
      if (!this.name2) {
        this.name2 = new NameReservationVariant("", "", null, null)
      }
      this.name2.clone(data.name2)
    } else {
      this.name2 = null
    }
    if (data.name3) {
      if (!this.name3) {
        this.name3 = new NameReservationVariant("", "", null, null)
      }
      this.name3.clone(data.name3)
    } else {
      this.name3 = null
    }
    if (data.nameSelected) {
      if (!this.nameSelected) {
        this.nameSelected = new NameReservationVariant("", "", null, null)
      }
      this.nameSelected.clone(data.nameSelected)
    } else {
      this.nameSelected = null
    }
    this.ordinaryShares = data.ordinaryShares
    this.preferenceShares = data.preferenceShares
    this.totalShares = data.totalShares
    this.directorInvitations = data.directorInvitations.map((di: DirectorInvitation) => {
      return new DirectorInvitation(di)
    })
    this.shareholderInvitations = data.shareholderInvitations.map((si: ShareholderInvitation) => {
      return new ShareholderInvitation(si)
    })
    this.msicCodeAssigns = data.msicCodeAssigns.map((mca: MsicCodeAssign) => {
      return new MsicCodeAssign(mca)
    })
    this.businessDescription = data.businessDescription
    this.hasBusinessAddress = data.hasBusinessAddress
    this.canReceiveMail = data.canReceiveMail
    this.businessAddressLocationId = data.businessAddressLocationId
    this.businessAddressLocation = data.businessAddressLocation ? new Location(data.businessAddressLocation) : null
    this.image = data.image
    this.signatureGroups = data.signatureGroups.map((sg: SignatureGroup) => {
      return new SignatureGroup(sg)
    })
    this.signatureGroupStatus = data.signatureGroupStatus
    this.applicantId = data.applicantId
    this.nameReservationApplications = data.nameReservationApplications.map((d: any) => {
      return new ApplicationNameReservation(d)
    })
    this.status = data.status
    this.metaData = _.cloneDeep(data.metaData)
    this.paidAt = data.paidAt
    this.submittedAt = data.submittedAt
    this.completedAt = data.completedAt
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.deletedAt = data.deletedAt
  }

  getRequestBody(): object {
    return {
      name_1: this.name1.name,
      name_type_1: this.name1.nameType,
      name_description_1: this.name1.nameDescription,
      supporting_document_1: this.name1.supportingDocumentId,
      name_2: this.name2?.name ?? null,
      name_type_2: this.name2?.nameType ?? null,
      name_description_2: this.name2?.nameDescription ?? null,
      supporting_document_2: this.name2?.supportingDocumentId ?? null,
      name_3: this.name3?.name ?? null,
      name_type_3: this.name3?.nameType ?? null,
      name_description_3: this.name3?.nameDescription ?? null,
      supporting_document_3: this.name3?.supportingDocumentId ?? null,
      name_selected: this.nameSelected?.name ?? null,
      name_type_selected: this.nameSelected?.nameType ?? null,
      name_description_selected: this.nameSelected?.nameDescription ?? null,
      supporting_document_selected: this.nameSelected?.supportingDocumentId ?? null,
      business_description: this.businessDescription,
      has_business_address: this.hasBusinessAddress,
      can_receive_mail: this.canReceiveMail,
      business_address_location_id: this.businessAddressLocationId,
      business_address_location: this.businessAddressLocation ? this.businessAddressLocation.getRequestBody() : null,
      image_id: this.image?.id ?? null,
      status: this.status,
    }
  }

  getName(): string {
    return this.nameSelected?.name ?? this.name1.name
  }

  canSubmitNameReservation(): boolean {
    return !StringUtil.isNullOrEmpty(this.name1.name)
  }

  getRequestBodyForNamesReservations(): object {
    return {
      name_1: this.name1.name,
      name_type_1: this.name1.nameType,
      name_description_1: this.name1.nameDescription,
      supporting_document_1: this.name1.supportingDocumentId,
      name_2: this.name2?.name ?? null,
      name_type_2: this.name2?.nameType ?? null,
      name_description_2: this.name2?.nameDescription ?? null,
      supporting_document_2: this.name2?.supportingDocumentId ?? null,
      name_3: this.name3?.name ?? null,
      name_type_3: this.name3?.nameType ?? null,
      name_description_3: this.name3?.nameDescription ?? null,
      supporting_document_3: this.name3?.supportingDocumentId ?? null,
    }
  }

  async createOrUpdateNamesReservations(repository: ReturnType<typeof useApplicationIncorporateStore>): Promise<void> {
    if (!this.canSubmitNameReservation()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBodyForNamesReservations()
    if (StringUtil.isNullOrEmpty(this.id)) {
      let response = await repository.createNameReservations(data)
      if (repository.error !== null) {
        let error: Error = new Error("", "")
        error.setForCUD()
        throw error
      }

      if (response) {
        this.clone(response)
      }
    } else {
      let response = await repository.updateNameReservations(this.id, data)
      if (repository.error !== null) {
        let error: Error = new Error("", "")
        error.setForCUD()
        throw error
      }

      if (response) {
        this.clone(response)
      }
    }
  }

  canSubmitBusinessDescriptionAndMsicCodes(msicCodeIds: string[]): boolean {
    return !StringUtil.isNullOrEmpty(this.businessDescription) && msicCodeIds.length > 0
  }

  getRequestBodyForBusinessDescriptionAndMsicCodes(msicCodeIds: string[]): object {
    return {
      business_description: this.businessDescription,
      msic_code_ids: msicCodeIds
        .filter((id: string) => {
          return !StringUtil.isNullOrEmpty(id)
        })
        .map((id: string) => {
          return { id: id }
        }),
    }
  }

  async updateBusinessDescriptionAndMsicCodes(
    msicCodeIds: string[],
    repository: ReturnType<typeof useApplicationIncorporateStore>
  ): Promise<void> {
    if (!this.canSubmitBusinessDescriptionAndMsicCodes(msicCodeIds)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBodyForBusinessDescriptionAndMsicCodes(msicCodeIds)
    let response = await repository.updateDescriptionMsicCodes(this.id, data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  canSubmitBusinessAddress(): boolean {
    if (!this.hasBusinessAddress) {
      return true
    }

    return this.businessAddressLocation !== null && this.businessAddressLocation.canCreate()
  }

  getRequestBodyForBusinessAddress(): object {
    if (!this.hasBusinessAddress) {
      return {
        has_business_address: false,
      }
    }

    if (!StringUtil.isNullOrEmpty(this.businessAddressLocationId)) {
      return {
        has_business_address: true,
        business_address_location_id: this.businessAddressLocationId,
      }
    }

    return {
      has_business_address: true,
      business_address_location: this.businessAddressLocation ? this.businessAddressLocation.getRequestBody() : null,
    }
  }

  async updateBusinessAddress(repository: ReturnType<typeof useApplicationIncorporateStore>): Promise<void> {
    if (!this.canSubmitBusinessAddress()) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBodyForBusinessAddress()
    let response = await repository.updateBusinessAddress(this.id, data)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }

    this.convertFromResponse(response)
  }

  async delete(repository: ReturnType<typeof useApplicationIncorporateStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    await repository.remove(this.id)
    if (repository.error !== null) {
      let error: Error = new Error("", "")
      error.setForCUD()
      throw error
    }
  }
}
