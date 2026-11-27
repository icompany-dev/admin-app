import { StatusConstants } from "~/scripts/constants/Status"
import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { StringUtil } from "~/scripts/utils/String"
import type { IRepositoryStore } from "~/scripts/models/IRepositoryStore"
import { PropsSecretarialServices } from "~/scripts/props/PropsSecretarialServices"
import type { Company } from "~/scripts/models/Company"
import { PropsUploadDocument } from "~/scripts/props/PropsUploadDocument"
import { PropsCreateNewApplication } from "~/scripts/props/PropsCreateNewApplication"
import type { Application } from "~/scripts/models/Application"
import { Toast } from "~/scripts/library/Toast"
import type { st } from "vue-router/dist/router-CWoNjPRp.mjs"
import { PropsSendPaymentNotice } from "~/scripts/props/PropsSendPaymentNotice"
import { BillingInfo } from "~/scripts/models/BillingInfo"
import { DeliveryInfo } from "~/scripts/models/DeliveryInfo"
import { ServicePricing } from "~/scripts/models/ServicePricing"
import { Director } from "~/scripts/models/Director"

export abstract class SecretarialServicesController<T> {
  tableDataFetcher = ref<TableDataFetcher<T> | null>(null)
  repository: Ref<IRepositoryStore | null> = ref<IRepositoryStore | null>(null)

  emitEvents: any | null = null

  searchText: Ref<string | null> = ref<string | null>(null)
  isIncludeDemo: Ref<boolean> = ref<boolean>(false)
  isShowPaidOnly: Ref<boolean> = ref<boolean>(true)
  isShowCustomReso: Ref<boolean> = ref<boolean>(false)

  isShowDetails: Ref<boolean> = ref<boolean>(true)

  createDocumentRequestRef: any | null = null
  confirmToDeleteRef: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  applicationIdToRemove: Ref<string> = ref<string>("")

  itemClassType: new (data: any) => T

  target: Ref<string> = ref<string>("")
  selectedApplicationForPayment = ref<Application | null>(null)

  sendPaymentNoticeRef: any | null = null

  selectedApplicationIds: Ref<string[]> = ref<string[]>([])

  servicePricingForPaymentOrder: Ref<ServicePricing> = ref<ServicePricing>(new ServicePricing())

  directorEmails: Ref<string[]> = ref<string[]>([])

  language = useLanguage()
  router = useRouter()
  time = useLocalTime()

  constructor(
    props: PropsSecretarialServices,
    itemClassType: new (data: any) => T,
    repository: IRepositoryStore,
    emitEvents: any | null
  ) {
    this.itemClassType = itemClassType
    this.tableDataFetcher.value = new TableDataFetcher(itemClassType, repository)
    this.emitEvents = emitEvents

    this.setDataFromProps(props)
    this.repository.value = repository
  }

  async setDataFromProps(props: PropsSecretarialServices): Promise<void> {
    this.searchText.value = props.searchText
    this.isIncludeDemo.value = props.isIncludeDemo
    this.isShowPaidOnly.value = props.isShowPaidOnly
    this.isShowCustomReso.value = props.isShowCustomResolution
    this.target.value = props.target

    await this.init()
  }

  setConfirmToDeleteRef(confirmToDeleteRef: any): void {
    this.confirmToDeleteRef = confirmToDeleteRef
  }

  async init(): Promise<void> {
    if (!this.tableDataFetcher.value) {
      return
    }

    this.fetchServicePricing()

    this.tableDataFetcher.value.filter = this.filter
    await this.tableDataFetcher.value.fetchData()
  }

  async fetchServicePricing(): Promise<void> {
    try {
      let repository = useServicePricingStore()
      let response = await repository.fetchDefault(this.target.value)

      if (response) {
        this.servicePricingForPaymentOrder.value = new ServicePricing(response)
      } else {
        this.servicePricingForPaymentOrder.value = new ServicePricing()
      }
    } catch (e) {
      this.servicePricingForPaymentOrder.value = new ServicePricing()
    }
  }

  abstract onApplicationClicked(application: any): void
  abstract companyName(application: any): string
  abstract applicationDetails(application: any): string
  abstract applicationDate(application: any): string
  abstract applicationStatusClass(application: any): string
  abstract applicationStatus(application: any): string
  abstract company(application: any): Company

  setSendPaymentNoticeRef(sendPaymentNoticeRef: any): void {
    this.sendPaymentNoticeRef = sendPaymentNoticeRef
  }

  setCreateDocumentRequestRef(createDocumentRequestRef: any): void {
    this.createDocumentRequestRef = createDocumentRequestRef
  }

  onCompanyNameClicked(companyId: string): void {
    this.router.push({
      path: `/sdnbhds/${companyId}`,
    })
  }

  onCreateClicked(): void {
    //
  }

  onRemoveClicked(application: any): void {
    if (!this.repository.value || !this.confirmToDeleteRef) {
      return
    }

    this.confirmToDeleteRef.show()

    this.applicationIdToRemove.value = application.id
  }

  async onProceedRemove(): Promise<void> {
    if (!this.repository.value) {
      return
    }

    try {
      await this.repository.value.remove(this.applicationIdToRemove.value)

      this.tableDataFetcher.value?.fetchData()

      let toastTitle = this.language.isMalay() ? "Permohonan telah dipadamkan." : "Application is Removed"
      let toast = new Toast(toastTitle, "")
      toast.success()
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error()
        error.setForCUD()
        error.handle()
      }
    }
  }

  async onSendPaymentNoticeClicked(application: any): Promise<void> {
    this.selectedApplicationForPayment.value = application

    if (application.companyId && !StringUtil.isNullOrEmpty(application.companyId)) {
      let repository = useDirectorStore()
      let response = await repository.fetchAllForCompany(application.companyId)
      this.directorEmails.value = response
        .map((d: any) => {
          return new Director(d)
        })
        .map((d: Director) => {
          return d.email
        })
        .filter((s: string) => {
          return !StringUtil.isNullOrEmpty(s)
        })
    }

    if (this.sendPaymentNoticeRef) {
      this.sendPaymentNoticeRef.show()
    }
  }

  getApplicationFullPath(application: any): string {
    let route = useRoute()
    return `${route.fullPath}/${application.id ?? ""}`
  }

  onCheckboxClicked(applicationId: string): void {
    if (this.isApplicationSelected(applicationId)) {
      this.selectedApplicationIds.value = this.selectedApplicationIds.value.filter((id: string) => {
        return id !== applicationId
      })
    } else {
      this.selectedApplicationIds.value.push(applicationId)
    }
  }

  isApplicationSelected(applicationId: string): boolean {
    return this.selectedApplicationIds.value.includes(applicationId)
  }

  get sendPaymentNoticeProps(): PropsSendPaymentNotice {
    let props = new PropsSendPaymentNotice(
      "Company",
      this.selectedApplicationForPayment.value?.companyId ?? "",
      this.selectedApplicationForPayment.value?.company?.getFullName() ?? "",
      this.target.value,
      this.selectedApplicationForPayment.value?.id ?? "",
      this.selectedApplicationForPayment.value?.company?.billingInfo() ?? new BillingInfo(),
      this.selectedApplicationForPayment.value?.company?.deliveryInfo() ?? new DeliveryInfo()
    )

    props.selectedServicePricings = [this.servicePricingForPaymentOrder.value]
    props.targetIds = this.selectedApplicationIds.value
    props.emailRecipients = this.directorEmails.value

    if (this.selectedApplicationIds.value.length > 0) {
      props.selectedServicePricings = this.selectedApplicationIds.value.map((s: string) => {
        return this.servicePricingForPaymentOrder.value
      })
    }

    return props
  }

  //getters
  get filter(): Filter {
    let filter = new Filter()
    filter.take = 20
    filter.takeAll = false
    filter.sortOrder = "desc"
    filter.orderBy = "created_at"
    filter.includeTestAccount = this.isIncludeDemo.value
    filter.statuses = [
      StatusConstants.READY,
      StatusConstants.PAID,
      StatusConstants.CONFIRMED,
      StatusConstants.NAME_REJECTED,
      StatusConstants.STAMPING,
      StatusConstants.SHIPPED,
      StatusConstants.APPROVED,
      StatusConstants.REJECTED,
      StatusConstants.SUBMITTED,
      StatusConstants.COMPLETED,
      StatusConstants.CANCELLED,
    ]

    if (!this.isShowPaidOnly.value) {
      filter.statuses.push(StatusConstants.DRAFT)
      filter.statuses.push(StatusConstants.PENDING)
    }

    if (!StringUtil.isNullOrEmpty(this.searchText.value)) {
      filter.searchText = this.searchText.value
    }

    return filter
  }

  get loaderLabel(): string {
    return this.language.isMalay() ? "Memaut Semua" : "Retrieving All"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Permohonan" : "Applications"
  }

  get noRecordTitle(): string {
    return this.language.isMalay() ? `Tiada Permohonan Ditemui.` : `No Application Found`
  }

  get noRecordSubtitle(): string {
    if (!StringUtil.isNullOrEmpty(this.tableDataFetcher.value?.filter.searchText ?? "")) {
      return this.language.isMalay()
        ? `Tiada permohonan ditemui dengan kata kunci tersebut.`
        : `Use a different keyword and search again.`
    }

    return this.language.isMalay()
      ? `Data akan dipaparkan apabila tersedia.`
      : `Data will appear once it becomes available.`
  }

  get viewApplicationLabel(): string {
    return this.language.isMalay() ? "Lihat" : "View"
  }

  get removeApplicationLabel(): string {
    return this.language.isMalay() ? "Buang" : "Remove"
  }

  get askPaymentApplicationLabel(): string {
    return this.language.isMalay() ? "+ Payment Order" : "+ Payment Order"
  }

  get createLabel(): string {
    return this.language.isMalay() ? "+ Tambah" : "+ Create"
  }

  get uploadDocumentsProps(): PropsUploadDocument {
    return new PropsUploadDocument("")
  }

  get addApplicationProps(): PropsCreateNewApplication {
    return new PropsCreateNewApplication(this.repository.value, this.target.value)
  }

  get itemToRemoveName(): string {
    return this.language.isMalay() ? "Permohonan" : "Application"
  }
}
