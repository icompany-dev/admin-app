import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"
import { Company } from "~/scripts/models/Company"
import { Director } from "~/scripts/models/Director"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { PropsResolution } from "~/scripts/props/PropsResolution"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { ObjectUtil } from "~/scripts/utils/Object"
import { PdfPaperUtil } from "~/scripts/utils/PdfPaper"
import { StringUtil } from "~/scripts/utils/String"

export class DcrAppointmentOfJointCompanySecretaryController {
  companyId: Ref<string> = ref<string>("")
  company = ref<Company>(new Company())
  directors: Ref<Director[]> = ref<Director[]>([])

  signatureGroups: Ref<SignatureGroup[]> = ref<SignatureGroup[]>([])

  isLoading: Ref<boolean> = ref<boolean>(true)

  emitEvents: any | null = null

  documentRef: any | null = null

  selectedDirectorId: Ref<string> = ref<string>("")
  secretaryName: Ref<string> = ref<string>("")
  secretaryIc: Ref<string> = ref<string>("")
  secretaryLicense: Ref<string> = ref<string>("")
  secretaryCertificate: Ref<string> = ref<string>("")

  companySecretaryId: string = "d76d3a2f-a5e9-11f1-a76b-42010a8c0003" //hard code for now

  resolutionDate: Ref<string> = ref<string>("")

  dayjs = useDayjs()
  time = useLocalTime()

  constructor(companyId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setCompanyId(companyId)

    this.resolutionDate.value = this.dayjs().subtract(1, "month").format("YYYY-MM-DD")
  }

  async setCompanyId(companyId: string): Promise<void> {
    this.isLoading.value = true

    try {
      this.companyId.value = companyId

      await Promise.allSettled([this.fetchCompany(), this.fetchDirectors(), this.fetchSignatures()])
    } catch (e) {
      //
    } finally {
      this.isLoading.value = false
    }
  }

  setSelectedDirectorId(selectedDirectorId: string): void {
    this.selectedDirectorId.value = selectedDirectorId
  }

  setSecretaryName(secretaryName: string): void {
    this.secretaryName.value = secretaryName
  }

  setSecretaryIc(secretaryIc: string): void {
    this.secretaryIc.value = secretaryIc
  }

  setSecretaryLicense(secretaryLicense: string): void {
    this.secretaryLicense.value = secretaryLicense
  }

  setSecretaryCertificate(secretaryCertificate: string): void {
    this.secretaryCertificate.value = secretaryCertificate
  }

  setDocumentRef(documentRef: any | null): void {
    this.documentRef = documentRef
  }

  async fetchCompany(): Promise<void> {
    this.company.value = new Company()

    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useCompanyStore()
    let response = await repository.fetch(this.companyId.value)
    if (!response) {
      return
    }

    this.company.value = new Company(response)
  }

  async fetchDirectors(): Promise<void> {
    this.directors.value = []

    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useDirectorStore()
    let response = await repository.fetchAllForCompany(this.companyId.value)
    if (!response) {
      return
    }

    this.directors.value = response.map((item: any) => {
      return new Director(item)
    })
  }

  async fetchSignatures(): Promise<void> {
    this.signatureGroups.value = []
    if (StringUtil.isNullOrEmpty(this.companyId.value)) {
      return
    }

    let repository = useSignatureStore()
    let response = await repository.fetchByGroup(this.companyId.value, "director")
    if (!response) {
      return
    }

    this.signatureGroups.value = response.map((item: any) => {
      return new SignatureGroup(item)
    })
  }

  totalPages(): number {
    return 1
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

  async getPdfPages(): Promise<HTMLElement[]> {
    if (!this.documentRef) {
      return []
    }

    await nextTick()
    let pdfPages = await PdfPaperUtil.getPdfElements(this.documentRef)

    return pdfPages
  }

  onResolutionDateChanged(event: Event): void {
    let target = event.target as HTMLInputElement
    this.resolutionDate.value = target.value
  }

  get companyName(): string {
    return this.company.value.getFullName()
  }

  get registrationNumberOld(): string {
    return this.company.value.registrationNumberOld
  }

  get registrationNumberNew(): string {
    return this.company.value.registrationNumberNew
  }

  get resolutionTitle(): string {
    let resolutionDate = this.time.formatDateOnlyFull(this.resolutionDate.value).toUpperCase()

    if (this.company.value.hasConstitution) {
      return `EXTRACT OF THE DIRECTORS’ RESOLUTION IN WRITING PURSUANT TO COMPANY'S CONSTITUTION PASSED ON ${resolutionDate}`
    }

    return `EXTRACT OF THE DIRECTORS’ RESOLUTION IN WRITING PURSUANT TO PARAGRAPH 15 OF THE THIRD SCHEDULE OF THE COMPANIES ACT 2016 PASSED ON ${resolutionDate}`
  }

  get signatureTitle(): string {
    return `CERTIFIED AS TRUE EXTRACT`
  }

  get signatureItems(): SignatureItem[] {
    let items: SignatureItem[] = []

    let sortedSignatures = ObjectUtil.sort<SignatureGroup>(this.signatureGroups.value, "createdAt", "desc")
    let firstSignature: SignatureGroup | null = sortedSignatures[0] ?? null
    let director = this.directors.value.find((d: Director) => {
      return d.id === firstSignature?.group?.id
    })

    if (!StringUtil.isNullOrEmpty(this.selectedDirectorId.value)) {
      firstSignature =
        sortedSignatures.find((sg: SignatureGroup) => {
          return sg.group?.id === this.selectedDirectorId.value && sg.group.target === "director"
        }) ?? null

      director = this.directors.value.find((d: Director) => {
        return d.id === this.selectedDirectorId.value
      })
    }

    if (firstSignature && director) {
      items.push(
        new SignatureItem(
          firstSignature.signature?.url ?? null,
          firstSignature.signature !== null,
          false,
          false,
          director.name,
          director.email,
          "DIRECTOR",
          false
        )
      )
    } else {
      director = this.directors.value[0] ?? null

      items.push(
        new SignatureItem(
          "https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/signatures/dummy-signature.jpeg",
          true,
          false,
          false,
          director?.name ?? "",
          director?.email ?? "",
          "DIRECTOR",
          false
        )
      )
    }
    items.push(
      new SignatureItem(
        "https://icompany-public.s3.ap-southeast-1.amazonaws.com/public/signatures/cosec-signature.png",
        true,
        false,
        false,
        "NUR ASHIKIN BINTI SHAHARUDIN",
        "",
        `(${SecretaryInformation.SECRETARY_LICENSE} / SSM PC No. ${SecretaryInformation.SECRETARY_SSM_PC_NO})<br>COMPANY SECRETARY`
      )
    )

    return items
  }

  get newCosecName(): string {
    if (!StringUtil.isNullOrEmpty(this.secretaryName.value)) {
      return this.secretaryName.value
    }

    return SecretaryInformation.SECRETARY_NAME_LIST[0].name
  }

  get newCosecNric(): string {
    if (!StringUtil.isNullOrEmpty(this.secretaryIc.value)) {
      return this.secretaryIc.value
    }

    return SecretaryInformation.SECRETARY_NAME_LIST[0].nric
  }

  get newCosecLicense(): string {
    if (!StringUtil.isNullOrEmpty(this.secretaryLicense.value)) {
      return this.secretaryLicense.value
    }

    return SecretaryInformation.SECRETARY_NAME_LIST[0].license
  }

  get newCosecCertificate(): string {
    if (!StringUtil.isNullOrEmpty(this.secretaryCertificate.value)) {
      return this.secretaryCertificate.value
    }

    return SecretaryInformation.SECRETARY_NAME_LIST[0].certificate
  }

  get resolutionProps(): PropsResolution {
    return new PropsResolution(
      this.companyName,
      this.registrationNumberOld,
      this.registrationNumberNew,
      this.resolutionTitle,
      "",
      this.signatureTitle,
      this.signatureItems,
      this.resolutionDate.value,
      1,
      1,
      2,
      6,
      false,
      true,
      false,
      "",
      [],
      false,
      this.isLoading.value
    )
  }
}
