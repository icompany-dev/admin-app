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
import { PropsPracticeDirective2 } from "~/scripts/props/PropsPracticeDirective2"
import { Application } from "~/scripts/models/Application"
import { CompanyAmendmentDescription } from "~/scripts/models/CompanyAmendmentDescription"
import { CompanyAmendmentBranch } from "~/scripts/models/CompanyAmendmentBranch"

export class PracticeDirective2ServiceController extends CompanyServiceController<CompanyAmendmentAddress> {
  companyAmendmentAddress = ref<CompanyAmendmentAddress>(new CompanyAmendmentAddress())
  companyAmendmentBranch = ref<CompanyAmendmentBranch>(new CompanyAmendmentBranch())
  companyAmendmentDescription = ref<CompanyAmendmentDescription>(new CompanyAmendmentDescription())

  targetType: Ref<string> = ref<string>("")
  wrapperRef: any | null = null

  constructor(companyId: string, targetType: string, viewType: string, emitEvents: any | null) {
    super(companyId, true, false, CompanyAmendmentAddress, useCompanyAmendmentAddressStore(), emitEvents)
    this.target = CompanyConstants.TARGET_PRACTICE_DIRECTIVE_2
    this.targetType.value = targetType
    this.setViewType(viewType)
    this.initializeData()
  }

  async initializeData(): Promise<void> {
    this.isLoading.value = true

    await this.fetchOngoingApplication()

    await this.init(this.companyAmendmentAddress.value as CompanyAmendmentAddress)

    this.isLoading.value = false
  }

  async fetchOngoingApplication(): Promise<void> {
    try {
      this.hasOngoingApplication.value = true

      let repository = null
      switch (this.targetType.value) {
        case CompanyConstants.TARGET_AMENDMENT_ADDRESS:
          repository = useCompanyAmendmentAddressStore()
          break
        case CompanyConstants.TARGET_AMENDMENT_BRANCH:
          repository = useCompanyAmendmentBranchStore()
          break
        case CompanyConstants.TARGET_AMENDMENT_DESCRIPTION:
          repository = useCompanyAmendmentDescriptionStore()
          break
      }

      if (!repository) {
        this.hasOngoingApplication.value = false
        return
      }

      let response = await repository.fetchAll(this.ongoingFilter)
      if (repository.error !== null) {
        throw repository.error
      }

      if (response.totalRecords <= 0) {
        this.hasOngoingApplication.value = false
        return
      }

      switch (this.targetType.value) {
        case CompanyConstants.TARGET_AMENDMENT_ADDRESS:
          this.companyAmendmentAddress.value = new CompanyAmendmentAddress(response.data[0])
          break
        case CompanyConstants.TARGET_AMENDMENT_BRANCH:
          this.companyAmendmentBranch.value = new CompanyAmendmentBranch(response.data[0])
          // need to set for wrapper
          this.companyAmendmentAddress.value = new CompanyAmendmentAddress(response.data[0])
          break
        case CompanyConstants.TARGET_AMENDMENT_DESCRIPTION:
          this.companyAmendmentDescription.value = new CompanyAmendmentDescription(response.data[0])
          this.companyAmendmentAddress.value = new CompanyAmendmentAddress(response.data[0])
          break
      }
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

  get serviceWrapperProps() {
    let application =
      this.viewType.value === ViewMode.New ? new CompanyAmendmentAddress() : this.companyAmendmentAddress.value
    if (this.viewType.value === ViewMode.New) {
      application.companyId = this.companyId
    }

    let isInPreviewMode = this.viewType.value === ViewMode.New ? true : false
    let showPasca = this.viewType.value === ViewMode.Existing

    let props = new PropsCompanyServiceWrapper(
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
      false,
      this.hasPaid(),
      this.price.value,
      true,
      this.hasSigned(),
      "",
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

    props.serviceWrapperProps.applicationTarget = this.targetType.value

    return props
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

  get practiceDirective2Props(): PropsPracticeDirective2 {
    let props = new PropsPracticeDirective2(this.companyId)

    switch (this.targetType.value) {
      case CompanyConstants.TARGET_AMENDMENT_ADDRESS:
        props.isUpdatingBusinessAddress = true
        props.updateAddress = this.companyAmendmentAddress.value.businessAddressLocation?.getMultilineAddress() ?? ""
        break
      case CompanyConstants.TARGET_AMENDMENT_BRANCH:
        if (this.companyAmendmentBranch.value.type === CompanyConstants.AMENDMENT_BRANCH_TYPE_ADD) {
          props.isAddingBranchAddress = true
          props.addAddress = this.companyAmendmentBranch.value.location.getMultilineAddress() ?? ""
        } else if (this.companyAmendmentBranch.value.type === CompanyConstants.AMENDMENT_BRANCH_TYPE_CHANGE) {
          props.isUpdatingBranchAddress = true
          props.updateAddress = this.companyAmendmentBranch.value.location.getMultilineAddress() ?? ""
        } else if (this.companyAmendmentBranch.value.type === CompanyConstants.AMENDMENT_BRANCH_TYPE_REMOVE) {
          props.isRemovingBranchAddress = true
          props.removeAddress = this.companyAmendmentBranch.value.location.getMultilineAddress() ?? ""
        }
        break
      case CompanyConstants.TARGET_AMENDMENT_DESCRIPTION:
        props.isUpdatingNature = true
        break
    }

    return props
  }
}
