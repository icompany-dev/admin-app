import { CompanyAppointmentOfTaxAgent } from "~/scripts/models/CompanyAppointmentOfTaxAgent"
import type { IServiceController } from "./IServiceController"
import { ServiceController } from "./ServiceController"
import { CompanyConstants } from "~/scripts/constants/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Company } from "~/scripts/models/Company"
import { File as UploadedFile } from "~/scripts/models/File"
import { Form } from "~/scripts/models/Form"
import { Error } from "~/scripts/library/Error"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StatusConstants } from "~/scripts/constants/Status"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"

export class AppointmentOfTaxAgentController
  extends ServiceController
  implements IServiceController<CompanyAppointmentOfTaxAgent, ReturnType<typeof useCompanyAppointmentOfTaxAgentStore>>
{
  application = ref<CompanyAppointmentOfTaxAgent>(new CompanyAppointmentOfTaxAgent())
  applicationId: string | null = null
  repository = useCompanyAppointmentOfTaxAgentStore()
  companyRepository = useCompanyStore()

  canSubmit = ref<boolean>(true)
  canRemove = ref<boolean>(false)

  isSaving = false
  hasPendingChanges = false

  constructor(props: any, emitEvents: any | null) {
    super(CompanyConstants.TARGET_TAX_AGENT_APPOINTMENT, props.companyId, emitEvents)

    this.applicationId = props.applicationId
    this.isInPreviewMode.value = props.isInPreviewMode

    if (!StringUtil.isNullOrEmpty(props.applicationId)) {
      this.fetchApplication(props.applicationId ?? "")
    } else {
      this.setApplication(props.companyId)
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.repository.fetch(id)

    if (!this.repository.error && response !== null) {
      this.application.value = new CompanyAppointmentOfTaxAgent(response)
      this.applicationId = id
      this.targetId = id
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.value.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.value.id)
  }

  async setApplicationStatus(status: string, application?: CompanyAppointmentOfTaxAgent): Promise<void> {
    if (application) {
      this.application.value = new CompanyAppointmentOfTaxAgent(application)
    }

    this.application.value.status = status

    if (this.dcrRef) {
      await this.dcrRef.updateApplicationContent(this.application.value)
    }

    await nextTick()
  }

  lockDocumentEdit(application?: CompanyAppointmentOfTaxAgent): void {
    if (application) {
      this.application.value = new CompanyAppointmentOfTaxAgent(application)
    }

    if (!this.application.value) {
      return
    }

    this.application.value.status = StatusConstants.CONFIRMED

    if (this.dcrRef) {
      this.dcrRef.lockDocumentEdit(this.application.value)
    }
  }

  async setApplication(companyId: string): Promise<void> {
    this.application.value = new CompanyAppointmentOfTaxAgent()
    this.application.value.companyId = companyId
    this.applicationId = null
    this.targetId = ""

    let response = await this.companyRepository.fetch(companyId)
    if (!this.companyRepository.error) {
      this.application.value.company = new Company(response)
    }

    this.canSubmit.value = StringUtil.isNullOrEmpty(this.application.value.id)
    this.canRemove.value = !StringUtil.isNullOrEmpty(this.application.value.id)
  }

  async onSubmitClicked(): Promise<void> {
    if (this.dcrRef) {
      let updatedData = this.dcrRef.getApplication() ?? null
      this.application.value = new CompanyAppointmentOfTaxAgent(updatedData)
    }

    try {
      this.emitEvents("back", this.application.value)

      if (StringUtil.isNullOrEmpty(this.applicationId)) {
        await this.onCreate()
      } else {
        await this.onUpdate()
      }

      if (this.isADirector.value) {
        await this.submitSignature()
      }

      this.emitEvents("applicationUpdated", this.application.value)
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
    await this.application.value.create(this.repository)
    this.applicationId = this.application.value.id
    this.targetId = this.application.value.id
  }

  async onUpdate(): Promise<void> {
    await this.application.value.update(this.repository)
  }

  async onDataUpdated(): Promise<void> {
    if (!this.dcrRef || StringUtil.isNullOrEmpty(this.applicationId) || this.isInPreviewMode.value) {
      return
    }

    this.hasPendingChanges = true

    if (this.isSaving) {
      return
    }

    this.isSaving = true

    try {
      while (this.hasPendingChanges) {
        this.hasPendingChanges = false

        let updatedData = this.dcrRef.getApplication()

        if (!updatedData) {
          return
        }

        this.application.value = new CompanyAppointmentOfTaxAgent(updatedData)
        this.application.value.id = this.applicationId ?? ""
        this.checkCanSetReady()
        await this.onUpdate()

        if (this.repository.error) {
          throw this.repository.error
        }
      }

      this.emitEvents("applicationUpdated", this.application.value)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        console.error("Tax Agent auto-save failed:", error)
      }
    } finally {
      this.isSaving = false

      setTimeout(() => {
        if (!this.isSaving) {
        }
      }, 1000)
    }
  }

  checkCanSetReady(): void {
    let currentData = this.dcrRef.getApplication()
    if (!currentData.id) {
      this.emitEvents("documentReady", false)
    }

    this.emitEvents("documentReady", !StringUtil.isNullOrEmpty(currentData.firmName))
  }

  async onRemove(): Promise<void> {
    if (this.applicationId === null) {
      this.emitEvents("back")
      return
    }

    // TODO: Confirm before deleting a saved application.
    this.emitEvents("back")
  }

  get isShowWatermark(): boolean {
    const status = this.application.value.status

    if (status === StatusConstants.COMPLETED) {
      return false
    }

    if (
      status === StatusConstants.DRAFT ||
      status === StatusConstants.PENDING ||
      status === StatusConstants.CANCELLED ||
      status === StatusConstants.READY
    ) {
      return true
    }

    return this.application.value.signatureGroups.length <= 0
  }

  get watermarkText(): string {
    const status = this.application.value.status

    if (status === StatusConstants.COMPLETED) {
      return ""
    }

    if (status === StatusConstants.CANCELLED) {
      return "CANCELLED"
    }

    if (status === StatusConstants.READY) {
      return "READY"
    }

    if (status === StatusConstants.DRAFT || status === StatusConstants.PENDING) {
      return "PREVIEW"
    }

    return "DRAFT"
  }

  get resolutionDocumentProps() {
    let application = this.application.value as CompanyAppointmentOfTaxAgent
    let props = new PropsResolutionDocument<CompanyAppointmentOfTaxAgent>(
      this.companyId,
      this.application.value.id,
      application,
      this.isShowWatermark,
      this.watermarkText,
      this.isInPreviewMode.value,
      false,
      ""
    )

    return props
  }
}
