import { Director } from "~/scripts/models/Director"
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
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { ObjectUtil } from "~/scripts/utils/Object"

export class Section201ForDirectorServiceController {
  applicationId: Ref<string> = ref<string>("")
  director = ref<Director>(new Director())
  signatureGroup = ref<SignatureGroup>(new SignatureGroup())

  isLoading: Ref<boolean> = ref<boolean>(false)
  isSubmitting: Ref<boolean> = ref<boolean>(false)
  target: string = CompanyConstants.TARGET_DIRECTOR

  name: Ref<string> = ref<string>("")
  registrationNumber: Ref<string> = ref<string>("")

  user = ref<User>(new User())
  directorUser = ref<User>(new User())
  signatureItem = ref<SignatureItem>(new SignatureItem(null, false, false, false, "", "", "", false))

  repository = useDirectorStore()

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

      this.director.value = new Director(response)

      await this.director.value.setCompany(useCompanyStore())
      await this.fetchFirstSignature()

      this.name.value = this.director.value.company?.getFullName() ?? ""
      this.registrationNumber.value = `${this.director.value.company?.registrationNumberNew} (${this.director.value.company?.registrationNumberOld})`
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

  async fetchFirstSignature(): Promise<void> {
    this.signatureGroup.value = new SignatureGroup()

    if (this.director.value.companyId === null) {
      return
    }

    let repository = useSignatureStore()
    let response = await repository.fetchByGroup(this.director.value.companyId, "director")
    if (!response) {
      return
    }

    let signatureGroups = response
      .map((d: any) => {
        return new SignatureGroup(d)
      })
      .filter((sg: SignatureGroup) => {
        return sg.group?.id === this.director.value.id
      })

    if (signatureGroups.length <= 0) {
      return
    }

    let orderedSignatureGroups = ObjectUtil.sort<SignatureGroup>(signatureGroups, "createdAt", "asc")

    this.signatureGroup.value = new SignatureGroup(orderedSignatureGroups[0])
  }

  setSignatureItem(): void {
    this.signatureItem.value = new SignatureItem(
      this.signatureGroup.value.signature?.url ?? null,
      this.signatureGroup.value.signature !== null,
      false,
      false,
      this.director.value.user?.name ?? "",
      this.director.value.user?.email ?? "",
      "",
      false
    )
  }

  signatureDate(): string {
    if (!this.signatureGroup.value || StringUtil.isNullOrEmpty(this.signatureGroup.value.id)) {
      return "Your Signing Date"
    }

    let time = useLocalTime()
    let dayjs = useDayjs()
    let signatureDate = this.signatureGroup.value.createdAt ?? dayjs().format("YYYY-MM-DD")

    return time.formatDateOnlyFull(signatureDate)
  }

  hasSigned(): boolean {
    return !StringUtil.isNullOrEmpty(this.signatureGroup.value.id)
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
      `${this.name.value}, ${this.director.value.user?.name} - Declaration under Section 201.pdf`,
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

    let filename = `${this.name.value}, ${this.director.value.user?.name} - Declaration under Section 201.pdf`
    let pdfBlob = await PdfPaperUtil.getPdfBlob(pages, 20, filename, PaperSize.A4, PaperOrientation.Portrait)
    let pdfFile = new File([pdfBlob], filename, {
      type: "application/pdf",
    })

    let uploadedFile = new UploadedFile()
    await uploadedFile.uploadFile(pdfFile, useFileStore())

    return uploadedFile.id
  }

  async onGenerateBlob(): Promise<Blob | null> {
    if (!this.documentRef) {
      return null
    }

    let pages: HTMLElement[] = await this.documentRef.getPdfPages()

    if (pages.length <= 0) {
      return null
    }

    let filename = `${this.name.value}, ${this.director.value.user?.name} - Declaration under Section 201.pdf`
    let pdfBlob = await PdfPaperUtil.getPdfBlob(pages, 20, filename, PaperSize.A4, PaperOrientation.Portrait)

    return pdfBlob
  }

  isPageReady(): boolean {
    return !this.isLoading.value
  }

  async waitForReady(): Promise<void> {
    await nextTick()
    while (this.isLoading.value) {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
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
