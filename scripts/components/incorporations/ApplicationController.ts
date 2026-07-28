import { CompanyConstants } from "~/scripts/constants/Company"
import { Error } from "~/scripts/library/Error"
import { ApplicationIncorporate } from "~/scripts/models/ApplicationIncorporate"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { User } from "~/scripts/models/User"
import { PropsIncorporationApplication } from "~/scripts/props/PropsIncorporationApplication"
import { StringUtil } from "~/scripts/utils/String"
import { PropsServiceApplication } from "~/scripts/props/PropsServiceApplication"
import { PropsShipApplication } from "~/scripts/props/PropsShipApplication"
import { DocumentTargets } from "~/scripts/constants/DocumentTargets"

/**
 * THINGS THEY WANT TO KNOW
 * 1. Payment
 * 2. Section 201
 * 3. Names proposed
 * 4. Directors
 * 5. Shareholders
 * 6. Upload documents for each stage
 * 7. Name rejected
 * 8. Complete incorporation
 */

export class ApplicationController {
  applicationId: Ref<string> = ref<string>("")
  application: Ref<ApplicationIncorporate> = ref<ApplicationIncorporate>(new ApplicationIncorporate())
  applicant: Ref<User> = ref<User>(new User())

  paymentOrderId: Ref<string> = ref<string>("")
  paymentOrder: Ref<PaymentOrder> = ref<PaymentOrder>(new PaymentOrder())

  emitEvents: any | null = null

  language = useLanguage()

  isLoading: Ref<boolean> = ref<boolean>(false)

  selectedDocumentTarget: Ref<string> = ref<string>(DocumentTargets.TARGET_RECEIPT)

  constructor(props: PropsIncorporationApplication, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  async setDataFromProps(props: PropsIncorporationApplication): Promise<void> {
    this.applicationId.value = props.applicationId
    await this.init()
  }

  async init(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      let error = new Error()
      error.title = this.language.isMalay() ? "ID Permohonan Tiada" : "No Application ID found"
      error.message = this.language.isMalay()
        ? "Anda akan dibawa ke laman utama"
        : "You will be redirected to the main page."
      error.promptWarning()

      this.emitEvents("back")
      return
    }

    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      await Promise.allSettled([this.fetchApplication(), this.fetchPaymentOrder()])

      await this.fetchApplicant()

      this.application.value.paidAt = this.paymentOrder.value.paidAt
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

  async fetchApplication(): Promise<void> {
    let repository = useApplicationIncorporateStore()
    let response = await repository.fetch(this.applicationId.value)

    if (repository.error !== null) {
      throw repository.error
    }

    this.application.value = new ApplicationIncorporate(response)
  }

  async fetchPaymentOrder(): Promise<void> {
    let repository = usePaymentOrderStore()
    let response = await repository.fetchByTarget(
      CompanyConstants.TARGET_APPLICATION_INCORPORATE,
      this.applicationId.value
    )

    if (!response || repository.error !== null) {
      this.paymentOrderId.value = ""
      return
    }

    this.paymentOrder.value = new PaymentOrder(response)
    this.paymentOrderId.value = this.paymentOrder.value.id
  }

  async fetchApplicant(): Promise<void> {
    let repository = useUserStore()
    let response = await repository.fetch(this.application.value.applicantId)

    if (repository.error !== null) {
      throw repository.error
    }

    this.applicant.value = new User(response)
  }

  // getters
  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Permohonan" : "Application"
  }

  get serviceName(): string {
    return this.language.isMalay() ? "Pemerbadanan Sdn Bhd Baharu" : "Incorporation of New Sdn Bhd"
  }

  get isNameApproved(): boolean {
    return this.application.value.nameSelected !== null
  }

  get otherProposedNameLabel(): string {
    return this.language.isMalay() ? "Cadangan Nama Lain" : "Other Proposed Names"
  }

  get otherProposedName(): string {
    let names = [
      this.application.value.name1.name,
      this.application.value.name2?.name ?? "",
      this.application.value.name3?.name ?? "",
    ]

    let filteredNames = names.filter((s: string) => {
      if (StringUtil.isNullOrEmpty(s)) {
        return false
      }
      return (
        !(this.application.value.nameSelected && this.application.value.nameSelected.name === s) ||
        !this.application.value.nameSelected
      )
    })

    if (filteredNames.length <= 0) {
      return this.language.isMalay() ? "Tiada" : "None"
    }

    return StringUtil.oxfordJoin("&", filteredNames)
  }

  get applicantLabel(): string {
    return this.language.isMalay() ? "Butiran Pemohon" : "Details of Applicant"
  }

  get applicantName(): string {
    return this.applicant.value.name
  }

  get applicantEmail(): string {
    return this.applicant.value.email
  }

  get applicantPhone(): string {
    return this.applicant.value.phone
  }

  get applicantIdentification(): string {
    return this.applicant.value.detail?.identification ?? "-"
  }

  get serviceApplicationProps(): PropsServiceApplication {
    let props = new PropsServiceApplication(this.serviceName, true, false)

    props.application = this.application.value

    return props
  }
}
