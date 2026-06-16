import { CompanyAmendmentAddress } from "~/scripts/models/CompanyAmendmentAddress"
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

export class ChangeOfBusinessAddressServiceController extends CompanyServiceController<CompanyAmendmentAddress> {
  companyAmendmentAddress = ref<CompanyAmendmentAddress>(new CompanyAmendmentAddress())

  wrapperRef: any | null = null

  constructor(companyId: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyAmendmentAddress, useCompanyAmendmentAddressStore(), emitEvents)
    this.target = CompanyConstants.TARGET_AMENDMENT_ADDRESS
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    switch (this.viewType.value) {
      case ViewMode.New:
        this.isInPreviewMode.value = true
        this.companyAmendmentAddress.value = new CompanyAmendmentAddress(this.companyServiceInitializer.newApplication)
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        if (this.companyServiceInitializer.existingApplication) {
          this.hasOngoingApplication.value = true //We need to warn users
        }
        break
      case ViewMode.Existing:
        this.isInPreviewMode.value = false
        this.hasOngoingApplication.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setExistingApplication()])
        this.companyAmendmentAddress.value = new CompanyAmendmentAddress(
          this.companyServiceInitializer.existingApplication
        )

        if (StringUtil.isNullOrEmpty(this.companyAmendmentAddress.value.id)) {
          this.hasOngoingApplication.value = false
          this.isInPreviewMode.value = true
        }
        break
      case ViewMode.Past:
        this.isInPreviewMode.value = true
        await Promise.all([this.fetchPrice(), this.companyServiceInitializer.setPastApplications()])
        this.hasPastApplications.value = this.companyServiceInitializer.pastApplications.length > 0
        this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, this.hasPastApplications.value)
        break
    }

    this.init(this.companyAmendmentAddress.value as CompanyAmendmentAddress)

    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      let apiRecord = await this.repository.fetchAll(this.ongoingFilter)
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      if (apiRecord.totalRecords <= 0) {
        this.companyAmendmentAddress.value = new CompanyAmendmentAddress()
        this.companyAmendmentAddress.value.companyId = this.companyId
        this.hasOngoingApplication.value = false
        return
      }

      this.companyAmendmentAddress.value = new CompanyAmendmentAddress(apiRecord.data[0])
      this.isInPreviewMode.value = false
      this.hasOngoingApplication.value = true
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchOngoing()
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

      let lastApplication = new CompanyAmendmentAddress(apiRecord.data[0])
      this.lastApplicationDate.value = this.time.formatDateOnlyFull(lastApplication.updatedAt)
      this.hasPastApplications.value = true
      this.emitEvents(EmitMessages.HAS_PAST_APPLICATIONS, true)
    } catch (error) {
      if (error instanceof Error) {
        error.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetchLatest()
        errorMessage.handle()
      }
    }
  }

  async onApplicationUpdated(application: CompanyAmendmentAddress): Promise<void> {
    await this.fetchOngoingApplication()

    if (this.dcrRef) {
      this.dcrRef.updateApplicationContent(this.companyAmendmentAddress.value)
    }
  }

  setApplicationData(applicationData: CompanyAmendmentAddress): void {
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
        this.companyAmendmentAddress.value.id
      )

      await makePayment.setPaymentCart()

      this.emitEvents("pay", makePayment.paymentCart)
    } catch (e: any) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForMakePayment()
        errorMessage.handle()
      }
    } finally {
      this.isSubmitting.value = false
    }
  }

  async submitApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyAmendmentAddress.value.id)) {
      this.companyAmendmentAddress.value.businessAddressLocation.addressLine1 = "-"
      this.companyAmendmentAddress.value.businessAddressLocation.postcode = "40400"
      this.companyAmendmentAddress.value.businessAddressLocation.city = new City()
      this.companyAmendmentAddress.value.businessAddressLocation.city.id = 61096
      this.companyAmendmentAddress.value.businessAddressLocation.state = new State()
      this.companyAmendmentAddress.value.businessAddressLocation.state.id = 23
      this.companyAmendmentAddress.value.businessAddressLocation.country = new Country()
      this.companyAmendmentAddress.value.businessAddressLocation.country.id = 87
      this.companyAmendmentAddress.value.companyId = this.companyId
      await this.companyAmendmentAddress.value.create(useCompanyAmendmentAddressStore())
    } else {
      await this.companyAmendmentAddress.value.update(useCompanyAmendmentAddressStore())
    }
  }

  async onProceedClicked(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyAmendmentAddress.value.id) || !this.hasPaid()) {
      this.makePayment()
      return
    }

    if (this.wrapperRef) {
      this.wrapperRef.enlarge()
    }
  }

  setWrapperRef(wrapperRef: any | null): void {
    this.wrapperRef = wrapperRef

    this.setOptionButtons()
  }

  setOptionButtons(): void {
    if (!this.wrapperRef) {
      return
    }

    let label = this.language.isMalay() ? "Tukar Alamat Syarikat" : "Update Company Address"
  }

  helpTitle(): string {
    return this.language.isMalay() ? "Tukar Alamat Syarikat" : "Update Company Address"
  }

  helpDescription(): string {
    if (this.language.isMalay()) {
      return `Apabila sesebuah syarikat menukar alamat perniagaan atau cawangan, syarikat
        tersebut perlu memberitahu SSM (Suruhanjaya Syarikat Malaysia) mengenai
        perubahan itu dalam tempoh empat belas hari dari tarikh kuat kuasa perubahan.
        Perkara ini dilakukan melalui borang khusus untuk "Pemberitahuan Pertukaran
        Alamat Perniagaan/Cawangan dan/atau Jenis Perniagaan".
        <br><br>
        Pemberitahuan pertukaran alamat perniagaan hendaklah dibuat dalam borang dan
        cara yang ditetapkan oleh Arahan Amalan SSM 2/2017. Merupakan suatu kesalahan
        di bawah Seksyen 591 Akta Syarikat 2016 untuk memberikan maklumat palsu atau
        mengelirukan kepada Pendaftar.`
    }

    return `When a company changes its business or branch address, it must notify
      SSM of the change within fourteen days from the effective date of the change.
      This is done through a specific form for "Notification of Change in the
      Business/Branch Address and/or Nature of Business".
      <br><br>
      The notification of change in business address is to be done in the form
      and manner specified by SSM's Practice Directive 2/2017. It is an offense
      under Section 591 of the Companies Act 2016 to provide false or misleading
      information to the Registrar.`
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
    let application =
      this.viewType.value === ViewMode.New ? new CompanyAmendmentAddress() : this.companyAmendmentAddress.value
    if (this.viewType.value === ViewMode.New) {
      application.companyId = this.companyId
    }

    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    return new PropsCompanyServiceWrapper(
      this.companyAmendmentAddress.value,
      this.companyId,
      this.target,
      this.slipCaseTitle(),
      this.viewType.value,
      this.hasOngoingApplication.value,
      this.hasPastApplications.value,
      this.companyAmendmentAddress.value.id,
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
      CompanyAmendmentAddress,
      useCompanyAmendmentAddressStore(),
      false,
      true
    )
  }

  get resolutionDocumentProps() {
    return new PropsResolutionDocument<CompanyAmendmentAddress>(
      this.companyId,
      this.companyAmendmentAddress.value.id,
      null,
      this.showWatermark(),
      this.watermarkText(),
      this.isInPreviewMode.value,
      false
    )
  }
}
