import { CompanyDirectorAppointment } from "~/scripts/models/CompanyDirectorAppointment"
import { useCompanyDirectorAppointmentStore } from "#imports"
import { useCompanyStore } from "#imports"
import { ResolutionController } from "./ResolutionController"
import { Company } from "~/scripts/models/Company"
import { IdentificationTypes, IdentificationType } from "~/scripts/constants/IdentificationTypes"

export class DcrChangeBankSignatoriesController extends ResolutionController<CompanyDirectorAppointment> {
  companyDirectorAppointmentRepository = useCompanyDirectorAppointmentStore()
  companyRepository = useCompanyStore()
  signatureStartOnPage = ref<number>(1)
  maxSignatureOnFirstPage = ref<number>(4)
  maxSignatureOnOtherPages = ref<number>(6)

  identificationTypeOptions: Array<IdentificationType> = IdentificationTypes.OPTIONS
  directorName: string | null = null
  directorEmail: string | null = null
  directorIdentificationType: string = IdentificationTypes.IC.id
  directorIdentification: string | null = null

  constructor(
    companyId: string,
    applicationId: string | null,
    application: CompanyDirectorAppointment | null,
    emitEvents: any | null
  ) {
    super(application, CompanyDirectorAppointment, emitEvents)
    this.isDcr.value = true

    if (applicationId !== null) {
      this.fetchApplication(applicationId)
    } else {
      this.setApplication(companyId)
    }
  }

  async fetchApplication(id: string): Promise<void> {
    if (this.companyDirectorAppointmentRepository.isLoading) {
      setTimeout(() => {
        this.fetchApplication(id)
      }, 1000)
      return
    }

    let response = await this.companyDirectorAppointmentRepository.fetch(id)
    if (!this.companyDirectorAppointmentRepository.error) {
      this.application.value = new CompanyDirectorAppointment(response)
    }
    this.initializeData()
  }

  async setApplication(companyId: string): Promise<void> {
    if (this.companyRepository.isLoading) {
      setTimeout(() => {
        this.setApplication(companyId)
      }, 1000)
      return
    }

    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyDirectorAppointment()
      this.application.value.companyId = companyId
      this.application.value.company = new Company(response)
    }
    this.initializeData()
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

  identificationType(): string {
    if (!this.application.value?.directorIdentificationType) {
      return IdentificationTypes.IC.value
    }

    return (
      this.identificationTypeOptions.find((idt: IdentificationType) => {
        return idt.id === this.application.value?.directorIdentificationType
      })?.value ?? IdentificationTypes.IC.value
    )
  }

  onDirectorNameChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.directorName = this.directorName
  }

  onDirectorEmailChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.emailAddress = this.directorEmail
  }

  onDirectorIdentificationTypeChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.directorIdentificationType = this.directorIdentificationType
  }

  onDirectorIdentificationChanged(): void {
    if (!this.application.value) {
      return
    }

    this.application.value.directorIdentification = this.directorIdentification
  }
}
