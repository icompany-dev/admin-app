import { CompanyAmendmentName } from "~/scripts/models/CompanyAmendmentName"
import { NameReservationVariant } from "~/scripts/models/NameReservationVariant"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { useCompanyAmendmentNameStore } from "~/stores/CompanyAmendmentNames"
import { useCompanyStore } from "~/stores/Companies"
import { Company } from "~/scripts/models/Company"
import { CompanyConstants } from "~/scripts/constants/Company"
import { NameReservation } from "~/scripts/types/NameReservation"
import type { CompanyNameReservation } from "~/scripts/models/CompanyNameReservation"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StatusConstants } from "~/scripts/constants/Status"

export class Section27ForCompanyController
  extends ServiceController
  implements IServiceController<CompanyAmendmentName, ReturnType<typeof useCompanyAmendmentNameStore>>
{
  application: CompanyAmendmentName = new CompanyAmendmentName()
  applicationRef = ref<CompanyAmendmentName>(new CompanyAmendmentName())
  applicationId: string | null = null
  repository = useCompanyAmendmentNameStore()
  companyRepository = useCompanyStore()

  showMcrFirst = ref<boolean>(false)

  noticeRef: any | null = null

  nameReservations = ref<NameReservation[]>([])

  proposedName1 = ref<string | null>(null)
  proposedName2 = ref<string | null>(null)
  proposedName3 = ref<string | null>(null)

  constructor(companyId: string, emitEvents: any | null, applicationId: string | null = null) {
    super(CompanyConstants.TARGET_AMENDMENT_NAME, companyId, emitEvents)

    if (!StringUtil.isNullOrEmpty(applicationId)) {
      this.fetchApplication(applicationId ?? "")
    }
  }

  setNoticeRef(noticeRef: any | null) {
    this.noticeRef = noticeRef
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)
    if (!this.repository.error) {
      this.application = new CompanyAmendmentName(response)
      this.applicationRef.value = new CompanyAmendmentName(response)
      this.applicationId = this.application.id
      this.targetId = this.application.id
    }
  }

  async setApplication(companyId: string): Promise<void> {
    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application = new CompanyAmendmentName()
      this.applicationRef.value = new CompanyAmendmentName()
      this.application.companyId = companyId
      this.application.company = new Company(response)
    }
  }

  onNamesSet(nameReservationsProxy: NameReservation[]): void {
    let nameReservations = toRaw(nameReservationsProxy)
    if (nameReservations[0]) {
      let nameReservation = nameReservations[0]
      this.application.name1 = new NameReservationVariant(
        nameReservation.name ?? "",
        nameReservation.type,
        nameReservation.description,
        null
      )
      this.application.name1.supportingDocumentId = nameReservation.supportingDocumentId
      this.proposedName1.value = nameReservation.name
    } else {
      this.proposedName1.value = null
    }

    if (nameReservations[1]) {
      let nameReservation = nameReservations[1]
      this.application.name2 = new NameReservationVariant(
        nameReservation.name ?? "",
        nameReservation.type,
        nameReservation.description,
        null
      )
      this.application.name2.supportingDocumentId = nameReservation.supportingDocumentId
      this.proposedName2.value = nameReservation.name
    } else {
      this.proposedName2.value = null
    }

    if (nameReservations[2]) {
      let nameReservation = nameReservations[2]
      this.application.name3 = new NameReservationVariant(
        nameReservation.name ?? "",
        nameReservation.type,
        nameReservation.description,
        null
      )
      this.application.name3.supportingDocumentId = nameReservation.supportingDocumentId
      this.proposedName3.value = nameReservation.name
    } else {
      this.proposedName3.value = null
    }

    this.nameReservations.value = []
    this.nameReservations.value = nameReservations.map((nr: NameReservation) => {
      let newNameReservation = new NameReservation("", "")
      newNameReservation.clone(nr)
      return newNameReservation
    })
  }

  async handleSubmitReProposeName(): Promise<void> {
    if (!this.application.canProposeNewName()) {
      return
    }

    if (StringUtil.isNullOrEmpty(this.application.name1?.name ?? "")) {
      return
    }

    let nameReservation = this.application.nameReservations.find((nr: CompanyNameReservation) => {
      return StringUtil.isNullOrEmpty(nr.proposedName)
    })
    if (nameReservation) {
      nameReservation.proposedName = this.application.name1?.name ?? ""
      await nameReservation.update(useCompanyNameReservationStore())
    }

    await this.application.update(this.repository)
  }

  onShowMcrFirstClicked(): void {
    this.showMcrFirst.value = !this.showMcrFirst.value
  }

  async onSubmitClicked(): Promise<void> {
    if (!StringUtil.isNullOrEmpty(this.application.name1?.name ?? "")) {
      this.onProceedClicked()
      return
    }

    if (!this.noticeRef) {
      return
    }

    this.noticeRef.show()
  }

  async onProceedClicked(): Promise<void> {
    try {
      this.emitEvents("back", this.application)
      await this.onUpdate()
      if (this.isADirector.value || this.isAShareholder.value) {
        await this.submitSignature()
      }

      this.emitEvents("applicationUpdated", this.application)
    } catch (error: any) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForCUD()
        errorMessage.handle()
      }
    }
  }

  async onCreate(): Promise<void> {
    this.application.companyId = this.companyId
    await this.application.create(this.repository)
    this.applicationId = this.application.id
    this.targetId = this.application.id
  }

  async onUpdate(): Promise<void> {
    await this.application.update(this.repository)
    this.applicationRef.value = new CompanyAmendmentName(this.application)
  }

  async onRemove(): Promise<void> {
    if (this.applicationId === null) {
      this.emitEvents("back")
    }
    // TODO: update function
    // Must ask for confirmation before it proceeds to delete
    // await this.application.remove(this.repository)
    this.emitEvents("back")
  }

  helpTitle(): string {
    return this.language.isMalay()
      ? `Resolusi Pengarah & Pemegang Saham untuk Menukar Nama Perniagaan`
      : "DCR & MCR to Change Business Name"
  }

  helpDescription(): string {
    return this.language.isMalay()
      ? `Resolusi ini memerlukan:
        <ul>
          <li>Sekurang-kurangnya satu (1) <b>Cadangan Nama</b>. Ketersediaan nama adalah tertakluk kepada SSM.</li>
          <li><b>Resolusi Khas</b> mesti mencapai majoriti sekurang-kurangnya <b>75%</b> daripada Pemegang Saham.</li>
        </ul>
        Anda boleh Beli & Muat Turun Profil Korporat SSM sebagai pengesahan perubahan (pilihan).
        `
      : `This resolution requires:
          <ul>
            <li>At least one (1) <b>Proposed Name</b>. The availability of name is subjected to SSM.</li>
            <li>The <b>Special Resolution</b> must reach a majority of at least <b>75%</b> of the Shareholders.</li>
          </ul>
          You can Purchase & Download SSM Corporate Profile as confirmation of the change (optional).
        `
  }

  get isDraft(): boolean {
    return this.application.signatureGroups.length <= 0
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAmendmentName>(
      this.companyId,
      this.applicationRef.value.id,
      this.applicationRef.value as CompanyAmendmentName,
      this.isDraft,
      "DRAFT",
      false,
      false,
      null,
      null,
      this.nameReservations.value,
      null,
      null
    )
  }

  get applicationValue(): CompanyAmendmentName {
    return this.applicationRef.value as CompanyAmendmentName
  }
}
