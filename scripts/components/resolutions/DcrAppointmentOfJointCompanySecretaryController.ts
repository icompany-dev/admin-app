import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"
import { Company } from "~/scripts/models/Company"
import { Director } from "~/scripts/models/Director"
import { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { PropsResolution } from "~/scripts/props/PropsResolution"
import { SignatureItem } from "~/scripts/types/SignatureItem"
import { ObjectUtil } from "~/scripts/utils/Object"
import { StringUtil } from "~/scripts/utils/String"

export class DcrAppointmentOfJointCompanySecretaryController {
  companyId: Ref<string> = ref<string>("")
  company = ref<Company>(new Company())
  directors: Ref<Director[]> = ref<Director[]>([])

  signatureGroups: Ref<SignatureGroup[]> = ref<SignatureGroup[]>([])

  isLoading: Ref<boolean> = ref<boolean>(true)

  emitEvents: any | null = null

  companySecretaryId: string = "d76d3a2f-a5e9-11f1-a76b-42010a8c0003" //hard code for now

  constructor(companyId: string, emitEvents: any) {
    this.emitEvents = emitEvents

    this.setCompanyId(companyId)
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
    if (this.company.value.hasConstitution) {
      return `EXTRACT OF THE DIRECTORS’ RESOLUTION IN WRITING PURSUANT TO COMPANY'S CONSTITUTION`
    }

    return `EXTRACT OF THE DIRECTORS’ RESOLUTION IN WRITING PURSUANT TO PARAGRAPH 15 OF THE THIRD SCHEDULE OF THE COMPANIES ACT 2016 PASSED ON 3 AUGUST 2026`
  }

  get signatureTitle(): string {
    return `CERTIFIED AS TRUE EXTRACT`
  }

  get signatureItems(): SignatureItem[] {
    let items: SignatureItem[] = []

    let sortedSignatures = ObjectUtil.sort<SignatureGroup>(this.signatureGroups.value, "createdAt", "desc")
    let firstSignature = sortedSignatures[0]
    let director = this.directors.value.find((d: Director) => {
      return d.id === firstSignature?.group?.id
    })

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
    return SecretaryInformation.SECRETARY_NAME_LIST[0].name
  }

  get newCosecNric(): string {
    return SecretaryInformation.SECRETARY_NAME_LIST[0].nric
  }

  get newCosecLicense(): string {
    return SecretaryInformation.SECRETARY_NAME_LIST[0].license
  }

  get newCosecCertificate(): string {
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
      "",
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
