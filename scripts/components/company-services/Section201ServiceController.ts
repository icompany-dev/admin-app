import { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { CompanyDirectorAppointment } from "~/scripts/models/CompanyDirectorAppointment"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { Company } from "~/scripts/models/Company"
import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import { ApplicationSwitch } from "~/scripts/models/ApplicationSwitch"
import { User } from "~/scripts/models/User"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { PaperOrientation, PaperSize } from "~/scripts/constants/Paper"
import { File as UploadedFile } from "~/scripts/models/File"

export class Section201ServiceController {
  applicationId: Ref<string> = ref<string>("")
  directorInvitation = ref<DirectorInvitation>(new DirectorInvitation())

  isLoading: Ref<boolean> = ref<boolean>(false)
  isSubmitting: Ref<boolean> = ref<boolean>(false)
  target: string = CompanyConstants.TARGET_DIRECTOR_INVITATION

  name: Ref<string> = ref<string>("")
  registrationNumber: Ref<string> = ref<string>("")

  user = ref<User>(new User())
  directorUser = ref<User>(new User())
  signatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", false))

  repository = useDirectorInvitationStore()

  emitEvents: any | null = null

  documentRef: any | null = null
  wrapperRef: any | null = null

  constructor(applicationId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setApplicationId(applicationId)
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  setWrapperRef(wrapperRef: any): void {
    this.wrapperRef = wrapperRef
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.applicationId.value = applicationId

    await this.fetchApplication()
    await Promise.all([this.fetchTarget(), this.fetchUser()])
    this.setSignatureItem()
  }

  async fetchApplication(): Promise<void> {
    if (this.isLoading.value || StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    try {
      this.isLoading.value = true
      let response = await this.repository.fetch(this.applicationId.value)
      if (this.repository.error !== null || !response) {
        throw this.repository.error
      }

      this.directorInvitation.value = new DirectorInvitation(response)
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForFetch()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchTarget(): Promise<void> {
    if (this.directorInvitation.value.target.target === "company") {
      let repository = useCompanyStore()
      let response = await repository.fetchPublic(this.directorInvitation.value.target.id)
      let company = new Company(response)
      this.name.value = company.getFullName()
      this.registrationNumber.value = `${company.registrationNumberNew} (${company.registrationNumberOld})`
      return
    }

    if (this.directorInvitation.value.target.target === CompanyConstants.TARGET_APPLICATION_INCORPORATE) {
      let repository = useApplicationIncorporateStore()
      let response = await repository.fetch(this.directorInvitation.value.target.id)
      let application = new ApplicationIncorporate(response)
      this.name.value = application.getName()
      this.registrationNumber.value = ""
      if (
        application.metaData !== null &&
        application.metaData.company_data &&
        StringUtil.isNullOrEmpty(application.metaData.company_data.registrationNumberNew)
      ) {
        this.name.value = `${this.name.value} SDN BHD`
        this.registrationNumber.value = `${application.metaData.company_data.registrationNumberNew} (${application.metaData.company_data.registrationNumberOld})`
      }
      return
    }

    if (this.directorInvitation.value.target.target === CompanyConstants.TARGET_APPLICATION_SWITCH) {
      let repository = useApplicationSwitchStore()
      let response = await repository.fetch(this.directorInvitation.value.target.id)
      let application = new ApplicationSwitch(response)
      this.name.value = `${application.name.toUpperCase()} SDN BHD`
      this.registrationNumber.value = `${application.registrationNumberNew} (${application.registrationNumberOld})`
    }
  }

  async fetchUser(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.directorInvitation.value.userId)) {
      return
    }

    let repository = useUserStore()
    let response = await repository.fetch(this.directorInvitation.value.userId ?? "")
    this.directorUser.value = new User(response)
  }

  setSignatureItem(): void {
    this.signatureItem.value = new SignatureItem(
      this.directorInvitation.value.signature?.url ?? null,
      this.directorInvitation.value.signatureId !== null,
      this.directorInvitation.value.email === this.user.value.email &&
        this.directorInvitation.value.signatureId === null,
      false,
      this.directorUser.value.name,
      this.directorUser.value.email,
      "",
      false
    )
  }

  signatureDate(): string {
    if (!this.directorInvitation.value.signatureId) {
      return "Your Signing Date"
    }

    let time = useLocalTime()
    let dayjs = useDayjs()
    let signatureDate = this.directorInvitation.value.signature?.createdAt ?? dayjs().format("YYYY-MM-DD")

    return time.formatDateOnlyFull(signatureDate)
  }

  hasSigned(): boolean {
    return this.directorInvitation.value.signatureId !== null
  }

  onExpandDocument(): void {
    if (this.wrapperRef) {
      this.wrapperRef.handleDocumentClicked()
    }
  }

  async onDownloadClicked(): Promise<void> {
    if (!this.documentRef) {
      return
    }

    let pages: HTMLElement[] = await this.documentRef.getPdfPages()

    if (pages.length <= 0) {
      return
    }

    await PdfPaperUtil.generatePdfFile(
      pages,
      20,
      `${this.directorInvitation.value.name} - Declaration under Section 201.pdf`,
      PaperSize.A4,
      PaperOrientation.Portrait
    )
  }

  async onGenerateClicked(): Promise<string | null> {
    if (!this.documentRef) {
      return null
    }

    let pages: HTMLElement[] = await this.documentRef.getPdfPages()

    if (pages.length <= 0) {
      return null
    }

    let filename = `${this.directorInvitation.value.name} - Declaration under Section 201.pdf`
    let pdfBlob = await PdfPaperUtil.getPdfBlob(pages, 20, filename, PaperSize.A4, PaperOrientation.Portrait)
    let pdfFile = new File([pdfBlob], filename, {
      type: "application/pdf",
    })

    let uploadedFile = new UploadedFile()
    await uploadedFile.uploadFile(pdfFile, useFileStore())

    return uploadedFile.id
  }

  get serviceWrapperProps() {
    let application = new CompanyDirectorAppointment()
    application.id = this.applicationId.value
    application.status = "paid"

    let props = new PropsCompanyServiceWrapper(
      application, // this is needed to bypass the service wrapper's setting
      "",
      this.target,
      "",
      ViewMode.Existing,
      true,
      false,
      this.applicationId.value,
      1,
      1,
      "NOTICE",
      false,
      true,
      19,
      false,
      false,
      null,
      false,
      false,
      0,
      0,
      false,
      true,
      "",
      "",
      "",
      false,
      this.isSubmitting.value,
      CompanyDirectorAppointment,
      useCompanyDirectorAppointmentStore()
    )

    return props
  }
}
