import { CompanySwitchOut } from "~/scripts/models/CompanySwitchOut"
import { CompanyServiceController } from "./CompanyServiceController"
import { Error } from "~/scripts/library/Error"
import { StringUtil } from "~/scripts/utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentConstants } from "~/scripts/constants/Payment"
import { PropsCompanyServiceWrapper } from "~/scripts/props/PropsCompanyServiceWrapper"
import { EmitMessages } from "~/scripts/constants/EmitMessages"
import { ViewMode } from "~/scripts/constants/ViewMode"
import { MakePayment } from "~/scripts/library/MakePayment"
import { City, Country, State } from "~/scripts/models/Location"
import type { SignatureGroup } from "~/scripts/models/SignatureGroup"
import { ObjectUtil } from "~/scripts/utils/Object"
import { PropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { Filter } from "~/scripts/library/Filter"

export class LetterResignAsCosecServiceController extends CompanyServiceController<CompanySwitchOut> {
  companySwitchOut = ref<CompanySwitchOut>(new CompanySwitchOut())

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanySwitchOut, useCompanySwitchOutStore(), emitEvents)
    this.target = CompanyConstants.TARGET_COSEC_RESIGNATION
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.companySwitchOut.value = new CompanySwitchOut()
    this.companySwitchOut.value.id = this.companyId
    this.companySwitchOut.value.companyId = this.companyId
    this.companySwitchOut.value.status = "paid"
    // this.isLoading.value = true

    // let filter = new Filter()
    // filter.companyId = this.companyId
    // let response = await this.repository.fetchAll(filter)
    // if (response.totalRecords > 0) {
    //   let data = response.data.map((d: any) => {
    //     return new CompanySwitchOut(d)
    //   })

    //   let orderedData = ObjectUtil.sort<CompanySwitchOut>(data, "createdAt", "desc")
    //   this.companySwitchOut.value = new CompanySwitchOut(orderedData[0])
    //   this.hasOngoingApplication.value = true
    //   this.viewType.value = "existing"
    // } else {
    //   this.companySwitchOut.value = new CompanySwitchOut()
    //   this.hasOngoingApplication.value = false
    //   this.viewType.value = "new"
    // }

    // this.isInPreviewMode.value = false

    // await this.init(this.companySwitchOut.value as CompanySwitchOut)

    // this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companySwitchOut.value = new CompanySwitchOut()
        this.companySwitchOut.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companySwitchOut.value = new CompanySwitchOut(apiRecord.data[0])
      this.isInPreviewMode.value = false
      this.hasOngoingApplication.value = true
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async fetchPreviousSubmission(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.lastSubmissionFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.hasSubmittedBefore.value = false
        this.lastApplicationDate.value = ""
        this.hasPastApplications.value = false
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, false)
        return
      }

      let lastApplication = new CompanySwitchOut(apiRecord.data[0])
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
      this.hasPastApplications.value = true
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, true)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async onApplicationUpdated(application: CompanySwitchOut): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companySwitchOut.value)
    }
  }

  setApplicationData(applicationData: CompanySwitchOut): void {
    if (!applicationData) {
      return
    }

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(applicationData)
    }
  }

  async makePayment(): Promise<void> {
    if (this.isSubmitting.value) {
      return
    }

    try {
      this.isSubmitting.value = true

      await this.submitApplication()

      let makePayment = new MakePayment(
        PaymentConstants.PAYMENT_CART_ENTITY_TYPE_COMPANY,
        this.companyId,
        this.target,
        this.companySwitchOut.value.id
      )

      await makePayment.setPaymentCart()

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error()
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async submitApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companySwitchOut.value.id)) {
      this.companySwitchOut.value.companyId = this.companyId
      await this.companySwitchOut.value.create(useCompanySwitchOutStore())
    } else {
      await this.companySwitchOut.value.update(useCompanySwitchOutStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companySwitchOut.value.id) || !this.hasPaid()) {
      this.makePayment()
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef
  }

  slipCaseTitle(): string {
    return this.language.isMalay() ? "Resolusi: Menukar Alamat Perniagaan" : "Resolution: Change Business Address"
  }

  override backLabel(): string {
    return this.language.isMalay() ? "Kembali" : "Back"
  }

  alertTitle(): string {
    return this.language.isMalay()
      ? "Maklumat Lanjut: Tukar / Kemas Kini Alamat Perniagaan"
      : "Learn More: Change / Update Business Address"
  }

  alertContent(): string {
    if (this.language.isMalay()) {
      return `
        <ul>
          <li>
            Sesebuah syarikat boleh menukar atau mengemas kini alamat perniagaannya dengan memaklumkan alamat baharu kepada 
            SSM melalui borang yang ditetapkan.
          </li>
          <li>
            <span class='glossary' id='business-address'>Alamat Perniagaan</span> merujuk kepada tempat utama di mana 
            operasi perniagaan dijalankan. Alamat ini adalah berbeza daripada <span class='glossary' id='registered-address'>Alamat Berdaftar syarikat</span>. 
            Pertukaran tersebut hanya akan berkuat kuasa setelah penyerahsimpanan dan pendaftaran dilakukan oleh SSM. Sila ambil perhatian 
            bahawa proses ini memerlukan penyerahan manual melalui <span class='glossary' id='business-address'>Borang PD2</span>, 
            dan bukannya kemas kini sistem secara serta-merta.
          </li>
          <li>
            Pertukaran alamat perniagaan tidak menjejaskan identiti undang-undang, hak, kewajipan, atau kontrak sedia ada syarikat. 
            Bergantung kepada jenis perniagaan anda, terutamanya jika lokasi merupakan faktor material, juruaudit anda mungkin 
            memerlukan dokumen sokongan untuk mengesahkan pertukaran atau kemas kini tersebut.
          </li>
          <li>
            Anda diingatkan untuk memastikan semua rekod statutori, surat-menyurat, dan pihak-pihak yang berkaitan dikemas kini 
            sewajarnya bagi mencerminkan alamat perniagaan yang baharu.
          </li>
        </ul>
        <b>Rujukan:</b> Seksyen 46 Akta Syarikat 2016.
      `
    }

    return `
      <ul>
        <li>
          A company may change or update its business address by notifying SSM of the new address in the 
          prescribed form.
        </li>
        <li>
          The <span class='glossary' id='business-address'>Business Address</span> refers to the 
          principal place where the business operations are carried out. This is separate from the 
          <span class='glossary' id='registered-address'>Registered Address</span> of the company.
        </li>
        <li>
          The change will only take effect upon lodgement and registration by SSM. Please note that this process 
          requires a manual submission via <span class='glossary' id='business-address'>Form PD2</span>, 
          and is not an instant system update.
        </li>
        <li>
          Changing the business address does not affect the company’s legal identity, rights, obligations, 
          or existing contracts. Depending on your business nature, where location is a material factor, your 
          auditor may require supporting documents to substantiate the change or update.
        </li>
        <li>
          You are reminded to ensure that all statutory records, correspondence, and relevant parties are 
          updated accordingly to reflect the new business address.
        </li>
      </ul>
      <b>Reference:</b> Section 46 of the Companies Act 2016
    `
  }

  // PASCA functions
  isMajorityReached(): boolean {
    if (!this.application.value) {
      return false
    }

    let totalSigned = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
      return sg.group?.target === "director"
    }).length

    let percentage = Math.ceil((totalSigned / this.totalNumberOfDirectors.value) * 100)

    return percentage >= 50
  }

  override isStepStatusVisible(): boolean {
    if (!this.application.value) {
      return false
    }

    return this.application.value.paidAt !== null && this.isMajorityReached()
  }

  signatureDate(): string {
    if (!this.application.value) {
      return ""
    }

    if (this.application.value.signatureGroups.length <= 0) {
      return ""
    }

    if (this.isMajorityReached()) {
      let directorSignatures = this.application.value.signatureGroups.filter((sg: SignatureGroup) => {
        return sg.group?.target === "director"
      })

      if (directorSignatures.length > 0) {
        let sorted = ObjectUtil.sort<SignatureGroup>(directorSignatures, "createdAt", "desc")

        return this.time.formatDateOnlyShort(sorted[0].createdAt ?? "")
      }
    }

    if (this.hasSigned()) {
      return this.userSignatureDate()
    }

    return ""
  }

  get serviceWrapperProps() {
    let application = this.viewType.value === ViewMode.New ? new CompanySwitchOut() : this.companySwitchOut.value
    if (this.viewType.value === ViewMode.New) {
      application.companyId = this.companyId
    }

    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companySwitchOut.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companySwitchOut.value.id,
      this.currentPage.value,
      this.totalPages.value,
      "DCR",
      showPasca,
      this.hasPaid(),
      this.price.value,
      this.isMajorityReached(),
      this.hasSigned(),
      this.signatureDate(),
      this.hasDcr.value,
      this.hasMcr.value,
      this.totalNumberOfDirectors.value,
      this.totalNumberOfShareholders.value,
      false,
      true,
      this.backLabel(),
      this.payLabel(),
      this.hoveredButtonLabel(),
      this.isInPreviewMode.value,
      this.isSubmitting.value,
      CompanySwitchOut,
      useCompanySwitchOutStore(),
      false,
      true
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanySwitchOut>(
      this.companyId,
      this.companySwitchOut.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
