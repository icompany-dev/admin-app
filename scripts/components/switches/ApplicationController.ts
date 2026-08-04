import { ApplicationSwitch } from "~/scripts/models/ApplicationSwitch"
import { PropsSwitchApplication } from "~/scripts/props/PropsSwitchApplication"
import type { DirectorInvitation } from "~/scripts/models/DirectorInvitation"
import type { ShareholderInvitation } from "~/scripts/models/ShareholderInvitation"
import { CompanyConstants } from "~/scripts/constants/Company"
import { PaymentOrder } from "~/scripts/models/PaymentOrder"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { User } from "~/scripts/models/User"

export class ApplicationController {
  applicationId: Ref<string> = ref<string>("")
  application: Ref<ApplicationSwitch> = ref<ApplicationSwitch>(new ApplicationSwitch())
  applicant: Ref<User> = ref<User>(new User())
  paymentOrderId: Ref<string> = ref<string>("")
  paymentOrder: Ref<PaymentOrder> = ref<PaymentOrder>(new PaymentOrder())

  emitEvents: any | null = null

  language = useLanguage()

  documentRef: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsSwitchApplication, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  async setDataFromProps(props: PropsSwitchApplication): Promise<void> {
    this.applicationId.value = props.applicationId
    await this.init()
  }

  // Data initialization
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
    let repository = useApplicationSwitchStore()
    let response = await repository.fetch(this.applicationId.value)

    if (repository.error !== null) {
      throw repository.error
    }

    this.application.value = new ApplicationSwitch(response)

    let directorPromises = this.application.value.directorInvitations.map((di: DirectorInvitation) => {
      return di.setUser(useUserStore())
    })

    let shareholderPromises = this.application.value.shareholderInvitations.map((si: ShareholderInvitation) => {
      return si.setUser(useUserStore())
    })

    let promises = directorPromises.concat(shareholderPromises)

    await Promise.all(promises)
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

  //getters
  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Permohonan" : "Application"
  }

  get serviceName(): string {
    return this.language.isMalay() ? "Pertukaran Setiausaha Syarikat" : "Reassignment of Company Secretary"
  }
}
