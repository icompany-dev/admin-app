import { NameReservationEmailTypes } from "~/scripts/constants/NameReservations"
import { Error } from "~/scripts/library/Error"
import { ApplicationNameReservation } from "~/scripts/models/ApplicationNameReservation"
import { StringUtil } from "~/scripts/utils/String"

export class NameReservationEmailController {
  applicationId: Ref<string> = ref<string>("")
  application = ref<ApplicationNameReservation>(new ApplicationNameReservation())
  emailType = ref<NameReservationEmailTypes>(NameReservationEmailTypes.Submitted)

  isLoading: Ref<boolean> = ref<boolean>(false)

  language = useLanguage()
  time = useLocalTime()

  constructor(applicationId: string, emailType: NameReservationEmailTypes) {
    this.setApplicationId(applicationId)
    this.setEmailType(emailType)
  }

  setEmailType(emailType: NameReservationEmailTypes): void {
    this.emailType.value = emailType
  }

  async setApplicationId(applicationId: string): Promise<void> {
    this.applicationId.value = applicationId

    await this.fetchApplication()
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value) || this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      let repository = useApplicationNameReservationStore()
      let response = await repository.fetch(this.applicationId.value)
      if (repository.error !== null) {
        throw repository.error
      }

      this.application.value = new ApplicationNameReservation(response)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  isShowResultDetails(): boolean {
    return (
      this.emailType.value === NameReservationEmailTypes.Query ||
      this.emailType.value === NameReservationEmailTypes.Approved ||
      this.emailType.value === NameReservationEmailTypes.Rejected
    )
  }

  formatDate(date: string): string {
    if (StringUtil.isNullOrEmpty(date)) {
      return "(Pending)"
    }

    return this.time.formatDateOnlyWithSlash(date)
  }

  emailDate(): string {
    switch (this.emailType.value) {
      case NameReservationEmailTypes.Submitted:
        return this.time.formatDateFullForEmail(this.application.value.submittedAt)
      case NameReservationEmailTypes.Query:
        return this.time.formatDateFullForEmail(this.application.value.submittedAt) // we don't have this date
      case NameReservationEmailTypes.Resubmitted:
        return this.time.formatDateFullForEmail(this.application.value.resubmittedAt)
      case NameReservationEmailTypes.Approved:
      case NameReservationEmailTypes.Rejected:
        return this.time.formatDateFullForEmail(this.application.value.resultAt)
      default:
        return "Pending Submission"
    }
  }

  emailSubjectMatter(): string {
    switch (this.emailType.value) {
      case NameReservationEmailTypes.Submitted:
        return "SUBMISSION"
      case NameReservationEmailTypes.Query:
        return "QUERY FOR CLARIFICATION"
      case NameReservationEmailTypes.Resubmitted:
        return "RESUBMISSION"
      case NameReservationEmailTypes.Approved:
        return "APPROVAL"
      case NameReservationEmailTypes.Rejected:
        return "REJECTION"
      default:
        return "PENDING SUBMISSION"
    }
  }

  proposedName(): string {
    let name = this.application.value.name.toUpperCase()

    if (this.application.value.nameType === "sdnbhd") {
      name = `${name} SDN.BHD.`
    }

    return name
  }

  applicationStatus(language: string): string {
    switch (this.emailType.value) {
      case NameReservationEmailTypes.Submitted:
        return language === "bm" ? "Hantar" : "Submitted"
      case NameReservationEmailTypes.Query:
        return language === "bm" ? "Kueri" : "Queried"
      case NameReservationEmailTypes.Resubmitted:
        return language === "bm" ? "Hantar Semula" : "Resubmitted"
      case NameReservationEmailTypes.Approved:
        return language === "bm" ? "Lulus" : "Approved"
      case NameReservationEmailTypes.Rejected:
        return language === "bm" ? "Tidak Lulus" : "Rejected"
      default:
        return language === "bm" ? "" : ""
    }
  }

  emailContent(language: string): string {
    switch (this.emailType.value) {
      case NameReservationEmailTypes.Submitted:
      case NameReservationEmailTypes.Resubmitted:
        return language === "bm"
          ? `
            Permohonan tuan/puan telah dihantar ke Suruhanjaya Syarikat Malaysia (SSM) untuk diproses.
            Tuan/Puan akan dimaklumkan melalui emel apabila keputusan dikeluarkan.
          `
          : `
            Your application has been submitted to Suruhanjaya Syarikat Malaysia (SSM) for processing. Notification
            result will be sent to your email.
          `
      case NameReservationEmailTypes.Query:
        if (language === "bm") {
          return `
            Pejabat ini memaklumkan nama yang dicadangkan : ${this.proposedName()}  adalah dalam pertimbangan 
            tertakluk kepada :
            <br><br>
            ${this.application.value.ssmQueryBm?.replaceAll("\n", "<br>") ?? ""}
            <br><br>
            Sila jawab dalam tempoh 14 hari, jika tidak permohonan tuan/puan adalah dianggap batal.
          `
        }

        return `
          We would like to inform you that the proposed name: ${this.proposedName()} is under consideration, this 
          due to :
          <br><br>
          ${this.application.value.ssmQueryEn?.replaceAll("\n", "<br>") ?? ""}
          <br><br>
          Please reply within 14 days or request will be void.
        `
      case NameReservationEmailTypes.Approved:
        if (language === "bm") {
          return `
            Pejabat ini memaklumkan nama yang dicadangkan : ${this.proposedName()} boleh digunakan 
            sebagai nama syarikat, dan dengan ini ianya dirizabkan selama tiga puluh (30) hari dari tarikh notis ini.
            <br><br>
            Templet asal dan surat kebenaran (jika ada) hendaklah dilampirkan bersama dokumen 
            penubuhan/penukaran nama syarikat tuan.
          `
        }

        return `
          We would like to inform you that the proposed name : ${this.proposedName()} can be used as
          company name, and will be reserved for thirty (30) days period starting by this result date.
          <br><br>
          The name template with consent (if applicable) must be attached with your company’s incorporation and 
          change of name documents.
        `
      case NameReservationEmailTypes.Rejected:
        if (language === "bm") {
          return `
            Pejabat ini memaklumkan nama yang dicadangkan : ${this.proposedName()}  tidak dapat diluluskan
            kerana :
            <br><br>
            ${this.application.value.ssmRemarksBm?.replaceAll("\n", "<br>") ?? ""}
          `
        }
        return `
          We would like to inform you that the proposed name : ${this.proposedName()} cannot be approved
          because: 
          <br><br>
          ${this.application.value.ssmRemarksEn?.replaceAll("\n", "<br>") ?? ""}
        `
      default:
        return language === "bm" ? "" : ""
    }
  }
}
