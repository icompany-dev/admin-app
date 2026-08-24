import { NameReservationEmailTypes } from "~/scripts/constants/NameReservations"
import { Error } from "~/scripts/library/Error"
import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import { ApplicationNameReservation } from "~/scripts/models/ApplicationNameReservation"
import { File } from "~/scripts/models/File"
import { User } from "~/scripts/models/User"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"
import * as pdfjsLib from "pdfjs-dist"
import type { PDFPageProxy } from "pdfjs-dist"
import { PdfRenderer } from "~/scripts/library/PdfRenderer"

export class Section27OneFourController {
  applicationId: Ref<string> = ref<string>("")
  applicationIncorporateId: Ref<string> = ref<string>("")
  application = ref<ApplicationNameReservation>(new ApplicationNameReservation())
  applicationIncorporate = ref<ApplicationIncorporate>(new ApplicationIncorporate())
  applicant = ref<User>(new User())

  isLoading: Ref<boolean> = ref<boolean>(false)
  isPrinting: Ref<boolean> = ref<boolean>(false)

  documentRef: any | null = null

  pdfRenderer: Ref<PdfRenderer> = ref<PdfRenderer>(new PdfRenderer(""))
  canvasRefs: any[] = []
  pdfFileUrl: Ref<string> = ref<string>("")
  numberOfPages: Ref<number> = ref<number>(1)

  language = useLanguage()
  time = useLocalTime()
  dayjs = useDayjs()

  constructor(applicationId: string, applicationIncorporateId: string) {
    this.applicationIncorporateId.value = applicationIncorporateId
    this.setApplicationId(applicationId)
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  setCanvasRefs(el: any, index: number): void {
    // if (this.canvasRefs[index]) {
    //   this.canvasRefs[index] = el
    // } else {
    //   this.canvasRefs.push(el)
    // }
    this.pdfRenderer.value.setPageCanvas(index, el)
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.applicationId.value = applicationId

    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
        await this.fetchIncorporation()
      } else {
        await this.fetchApplication()
        await this.fetchIncorporation()
      }
      await this.fetchApplicant()
      await this.fetchFile()
    } catch (e: any) {
      console.error(e)
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetchAll()
        errorMessage.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async setIncorporationId(applicationIncorporateId: string): Promise<void> {
    this.applicationIncorporateId.value = applicationIncorporateId

    if (StringUtil.isNullOrEmpty(this.applicationIncorporateId.value) || this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true
      await this.fetchIncorporation()
      await this.fetchApplicant()
      await this.fetchFile()
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetchAll()
        errorMessage.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }
    let repository = useApplicationNameReservationStore()
    let response = await repository.fetch(this.applicationId.value)
    if (repository.error !== null) {
      throw repository.error
    }

    this.application.value = new ApplicationNameReservation(response)
    this.applicationIncorporateId.value = this.application.value.applicationIncorporateId
  }

  async fetchIncorporation(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationIncorporateId.value)) {
      return
    }

    let repository = useApplicationIncorporateStore()
    let response = await repository.fetch(this.applicationIncorporateId.value)
    if (repository.error !== null) {
      throw repository.error
    }

    this.applicationIncorporate.value = new ApplicationIncorporate(response)
  }

  async fetchApplicant(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationIncorporate.value.applicantId)) {
      return
    }

    let repository = useUserStore()
    let response = await repository.fetch(this.applicationIncorporate.value.applicantId)
    if (repository.error !== null) {
      throw repository.error
    }

    this.applicant.value = new User(response)
  }

  async fetchFile(): Promise<void> {
    if (
      this.applicationIncorporate.value &&
      this.applicationIncorporate.value.metaData &&
      this.applicationIncorporate.value.metaData.notification_of_name_reservation
    ) {
      let fileRepository = useFileStore()
      let fileResponse = await fileRepository.fetch(
        this.applicationIncorporate.value.metaData.notification_of_name_reservation
      )
      let file = new File(fileResponse)
      this.pdfFileUrl.value = file.url
    }

    if (this.isShowPdfFile) {
      this.pdfRenderer.value.pdfUrl = this.pdfFileUrl.value
      await this.pdfRenderer.value.loadPdf()
      this.numberOfPages.value = this.pdfRenderer.value.numberOfPages
      await nextTick()
      await this.pdfRenderer.value.renderAllPages()
    }
  }

  async loadPdf() {
    const loadingTask = pdfjsLib.getDocument(this.pdfFileUrl.value)
    const pdf = await loadingTask.promise
    this.numberOfPages.value = pdf.numPages
    return pdf
  }

  async renderPdf(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.pdfFileUrl.value)) {
      return
    }

    await this.renderAllPages()
  }

  async renderPage(page: PDFPageProxy, canvas: HTMLCanvasElement): Promise<void> {
    const defaultViewport = page.getViewport({ scale: 1 })
    const viewportWidth = defaultViewport.width
    const viewportHeight = defaultViewport.height
    // this.documentScaler.value.setViewPortScale(viewportWidth, viewportHeight)

    const viewport = page.getViewport({ scale: 1.3 })
    // this.documentHeight.value = viewport.height

    const context = canvas.getContext("2d")

    if (!context) {
      return
    }

    canvas.width = viewport.width
    canvas.height = viewport.height

    await page.render({ canvas: canvas, canvasContext: context, viewport }).promise
  }

  async renderAllPages(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.pdfFileUrl.value)) {
      return
    }

    const pdf = await this.loadPdf()

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const canvas = this.canvasRefs[pageNumber]
      if (!canvas) {
        continue
      }

      const page = await pdf.getPage(pageNumber)
      nextTick(async () => {
        await this.renderPage(page, canvas)
      })
    }
  }

  proposedName(): string {
    let name = ""
    if (
      StringUtil.isNullOrEmpty(this.application.value.id) &&
      !StringUtil.isNullOrEmpty(this.applicationIncorporate.value.nameSelected?.name ?? "")
    ) {
      name = this.applicationIncorporate.value.nameSelected?.getCompleteName() ?? ""
    } else {
      name = this.application.value.name.toUpperCase()

      if (this.application.value.nameType === "sdnbhd") {
        name = `${name} SDN.BHD.`
      }
    }

    return name
  }

  applicantIdentificationId(): string {
    if (StringUtil.isNullOrEmpty(this.applicant.value.detail?.identification ?? null)) {
      return "-"
    }

    return this.applicant.value.detail?.identification ?? "-"
  }

  applicantAddress(): string {
    if (!this.applicant.value.detail) {
      return "-"
    }

    return this.applicant.value.detail.location?.getOnelineAddress() ?? "-"
  }

  promoterIdentificationType(): string {
    return this.applicant.value.detail?.identificationType === "passport" ? "Passport" : "NRIC"
  }

  isIdentificationTypeNRIC(): boolean {
    return this.promoterIdentificationType() === "NRIC"
  }

  dateOfBirth(): string {
    if (!this.isIdentificationTypeNRIC()) {
      return "-"
    }

    let identification = this.applicant.value.detail?.identification ?? "-"
    if (identification === "-") {
      return "-"
    }

    let currentYear = this.dayjs().year()
    let firstTwoNumber = currentYear.toString().substring(0, 2)
    let yearOfBirthString = `${firstTwoNumber}${identification.substring(0, 2)}`
    let yearOfBirth = parseInt(yearOfBirthString)
    if (yearOfBirth > currentYear) {
      yearOfBirth = yearOfBirth - 100
    }

    let birthMonth = identification.substring(2, 4)
    let birthDate = identification.substring(4, 2)

    return this.time.formatDateOnlyFull(`${yearOfBirth}-${birthMonth}-${birthDate}`)
  }

  applicationDate(): string {
    return this.time.formatDateOnlyWithSlash(this.application.value.submittedAt)
  }

  async getPdfPages(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    this.isPrinting.value = true

    await nextTick()
    let pdfPages = await PdfPaperUtil.getPdfElements(this.documentRef)

    this.isPrinting.value = false

    return pdfPages
  }

  get isShowPdfFile(): boolean {
    return !StringUtil.isNullOrEmpty(this.pdfFileUrl.value)
  }

  get pdfPaperRanges(): number[] {
    return Array.from({ length: this.numberOfPages.value }, (_, i) => i)
  }
}
