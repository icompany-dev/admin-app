import { Company } from "~/scripts/models/Company"
import { Filter } from "~/scripts/library/Filter"
import { Error } from "~/scripts/library/Error"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { StringUtil } from "~/scripts/utils/String"
import { DownloadFileData } from "~/scripts/types/DownloadFileData"
import { FileZipper } from "~/scripts/utils/FileZipper"
import { PropsActionInProgress } from "~/scripts/props/PropsActionInProgress"
import { CompanySecretary } from "~/scripts/models/CompanySecretary"
import {
  ActionTrayElement,
  ActionTrayElementParams,
  ActionTrayLabel,
} from "~/scripts/types/action-trays/ActionTrayElement"
import { SelectOption } from "~/scripts/types/SelectOption"

export class AssignCosecController {
  tableDataFetcher = ref<TableDataFetcher<Company>>(new TableDataFetcher(Company, useCompanyStore()))

  selectedCompanyId: Ref<string> = ref<string>("")
  selectedCompanyIds: Ref<string[]> = ref<string[]>([])

  language = useLanguage()

  filter = ref<Filter>(new Filter())

  emitEvents: any | null = null

  documentRef: any | null = null
  actionInProgressRef: any | null = null

  isGeneratingPdf: Ref<boolean> = ref<boolean>(false)

  allCompanies: Ref<Company[]> = ref<Company[]>([])
  allCompanyIds: Ref<string[]> = ref<string[]>([])
  currentBatchNumber: Ref<number> = ref<number>(0)
  batchSize: number = 5
  documentToGenerateRefs: any[] = []
  totalCompleted: Ref<number> = ref<number>(0)

  companySecretaries: Ref<CompanySecretary[]> = ref<CompanySecretary[]>([])
  selectedCompanySecretaryId: Ref<string> = ref<string>("")

  constructor(emitEvents: any) {
    this.emitEvents = emitEvents

    this.init()
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  setActionInProgressRef(actionInProgressRef: any): void {
    this.actionInProgressRef = actionInProgressRef
  }

  setDocumentToGenerateRefs(documentToGenerateRef: any, index: number): void {
    this.documentToGenerateRefs[index] = documentToGenerateRef
  }

  async init(): Promise<void> {
    this.tableDataFetcher.value.filter.take = 20
    this.tableDataFetcher.value.filter.takeAll = false
    this.tableDataFetcher.value.filter.orderBy = "name"
    this.tableDataFetcher.value.filter.sortOrder = "asc"

    // For the table
    let repository = useCompanyStore()
    let promises = [
      this.fetchCompanySecretaries(),
      this.tableDataFetcher.value.fetchData(),
      repository.fetchCompact("take_all=1").then((response) => {
        this.allCompanies.value = response.map((item: any) => {
          return new Company(item)
        })

        this.allCompanyIds.value = response.map((item: any) => {
          return item.id
        })
      }),
    ]
    await Promise.allSettled(promises)

    this.selectedCompanyId.value =
      this.tableDataFetcher.value.data.length > 0 ? this.tableDataFetcher.value.data[0].id : ""
  }

  async setSearch(searchText: string): Promise<void> {
    this.tableDataFetcher.value.filter.searchText = searchText
    await this.tableDataFetcher.value.fetchData()

    this.selectedCompanyId.value =
      this.tableDataFetcher.value.data.length > 0 ? this.tableDataFetcher.value.data[0].id : ""
  }

  async setSortOrder(sortOrder: string): Promise<void> {
    this.tableDataFetcher.value.filter.sortOrder = sortOrder
    await this.tableDataFetcher.value.fetchData()

    this.selectedCompanyId.value =
      this.tableDataFetcher.value.data.length > 0 ? this.tableDataFetcher.value.data[0].id : ""
  }

  async setIsIncludeDemo(isIncludeDemo: boolean): Promise<void> {
    this.tableDataFetcher.value.filter.includeTestAccount = isIncludeDemo
    await this.tableDataFetcher.value.fetchData()

    this.selectedCompanyId.value =
      this.tableDataFetcher.value.data.length > 0 ? this.tableDataFetcher.value.data[0].id : ""
  }

  async fetchCompanySecretaries(): Promise<void> {
    let repository = useCompanySecretaryStore()
    let response = await repository.fetchAll(new Filter())
    this.companySecretaries.value = response.data.map((d: any) => {
      return new CompanySecretary(d)
    })

    if (response.totalRecords <= 0) {
      return
    }

    this.selectedCompanySecretaryId.value = this.companySecretaries.value[0].id
  }

  async goToPage(page: number): Promise<void> {
    this.selectedCompanyIds.value = []
    await this.tableDataFetcher.value.goToPage(page)
  }

  onCompanySelected(companyId: string): void {
    this.selectedCompanyId.value = companyId
  }

  onCompanyUnselected(): void {
    this.selectedCompanyId.value = ""
  }

  isCompanySelected(companyId: string): boolean {
    return this.selectedCompanyIds.value.includes(companyId)
  }

  onCompanyCheckboxClicked(companyId: string): void {
    if (this.isCompanySelected(companyId)) {
      this.selectedCompanyIds.value = this.selectedCompanyIds.value.filter((id: string) => {
        return id !== companyId
      })
    } else {
      this.selectedCompanyIds.value.push(companyId)
    }
  }

  async onAssignSelected(): Promise<void> {
    if (!this.canAssignCosec || !this.documentRef) {
      return
    }

    if (this.actionInProgressRef) {
      this.actionInProgressRef.show()
    }

    this.isGeneratingPdf.value = true

    try {
      // Wait for backend for cosec assign values

      let blobs: Blob[] = []
      let files: DownloadFileData[] = []

      for (let i = 0; i < this.selectedCompanyIds.value.length; i++) {
        let selectedCompanyId = this.selectedCompanyIds.value[i]
        let company = this.allCompanies.value.find((c: Company) => {
          return c.id === selectedCompanyId
        })

        if (!company) {
          continue
        }

        this.selectedCompanyId.value = company.id

        await nextTick()
        await this.documentRef.isPageReady()

        let filename = `${company.name.toUpperCase()} - Assignment of Company Secretary.pdf`
        let blob = await this.documentRef.onGenerateBlob(filename, company.id)
        if (!blob) {
          continue
        }

        blobs.push(blob)
        files.push(new DownloadFileData(URL.createObjectURL(blob), filename))
        this.totalCompleted.value = this.totalCompleted.value + 1
      }

      await FileZipper.zipAndDownload(files, `DCR Appointment of Joint Company Secretary.zip`)
    } catch (e) {
      let error = new Error()
      error.setForCUD()
      error.handle()
    } finally {
      this.isGeneratingPdf.value = false

      if (this.actionInProgressRef) {
        this.actionInProgressRef.hide()
      }
    }
  }

  onSelectAllClicked(): void {
    if (this.selectedCompanyIds.value.length === this.tableDataFetcher.value.data.length) {
      this.selectedCompanyIds.value = []
      return
    }

    this.selectedCompanyIds.value = this.tableDataFetcher.value.data.map((c: Company) => {
      return c.id
    })
  }

  onCosecSelected(data?: ActionTrayElementParams): void {
    if (!data) {
      return
    }

    this.selectedCompanySecretaryId.value = data.outcome
  }

  async onDownloadAll(): Promise<void> {
    if (!this.documentRef) {
      return
    }

    if (this.actionInProgressRef) {
      this.actionInProgressRef.show()
    }

    this.isGeneratingPdf.value = true

    try {
      let blobs: Blob[] = []
      let files: DownloadFileData[] = []

      for (let i = 0; i < this.allCompanies.value.length; i++) {
        let company = this.allCompanies.value[i]
        this.selectedCompanyId.value = company.id

        await nextTick()
        await this.documentRef.isPageReady()

        let filename = `${company.name.toUpperCase()} - Assignment of Company Secretary.pdf`
        let blob = await this.documentRef.onGenerateBlob(filename, company.id)
        if (!blob) {
          continue
        }

        blobs.push(blob)
        files.push(new DownloadFileData(URL.createObjectURL(blob), filename))
        this.totalCompleted.value = this.totalCompleted.value + 1
      }

      await FileZipper.zipAndDownload(files, `DCR Appointment of Joint Company Secretary.zip`)
    } catch (e) {
      console.error(e)
    } finally {
      this.isGeneratingPdf.value = false

      if (this.actionInProgressRef) {
        this.actionInProgressRef.hide()
      }
    }
  }

  // getters
  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Sdn Bhd" : "Sdn Bhds"
  }

  get noRecordTitle(): string {
    return this.language.isMalay() ? `Tiada Syarikat Ditemui.` : `No Company Found`
  }

  get noRecordSubtitle(): string {
    if (!StringUtil.isNullOrEmpty(this.tableDataFetcher.value.filter.searchText)) {
      return this.language.isMalay()
        ? `Tiada syarikat ditemui dengan kata kunci tersebut.`
        : `Use a different keyword and search again.`
    }

    return this.language.isMalay()
      ? `Data akan dipaparkan apabila tersedia.`
      : `Data will appear once it becomes available.`
  }

  get tablePaginationProps(): PropsTablePagination {
    return new PropsTablePagination(this.tableDataFetcher.value.filter)
  }

  get isShowDocument(): boolean {
    return !StringUtil.isNullOrEmpty(this.selectedCompanyId.value)
  }

  get actionInProgressProps(): PropsActionInProgress {
    return new PropsActionInProgress(
      this.totalCompaniesToGenerate,
      this.totalCompleted.value,
      this.language.isMalay() ? "menjana resolusi" : "generating the resolutions"
    )
  }

  get totalCompaniesToGenerate(): number {
    return this.selectedCompanyIds.value.length > 0
      ? this.selectedCompanyIds.value.length
      : this.allCompanies.value.length
  }

  get anyCompanySelected(): boolean {
    return this.selectedCompanyIds.value.length > 0
  }

  get areAllSelected(): boolean {
    return this.selectedCompanyIds.value.length >= this.tableDataFetcher.value.data.length
  }

  get canAssignCosec(): boolean {
    return this.anyCompanySelected && !StringUtil.isNullOrEmpty(this.selectedCompanySecretaryId.value)
  }

  get actionTrayElements(): ActionTrayElement[] {
    let selectAllLabelEn = this.areAllSelected ? "Clear Selection" : "Select All"
    let selectAllLabelBm = this.areAllSelected ? "Buang Pilihan" : "Pilih Semua"

    if (this.selectedCompanyIds.value.length > 0) {
      let totalSelected = this.selectedCompanyIds.value.length
      selectAllLabelEn = `${selectAllLabelEn} (${totalSelected})`
      selectAllLabelBm = `${selectAllLabelBm} (${totalSelected})`
    }

    return [
      new ActionTrayElement("select-all", this.onSelectAllClicked.bind(this), {
        label: new ActionTrayLabel(selectAllLabelEn, selectAllLabelBm),
      }),
      new ActionTrayElement("cosec-option", this.onCosecSelected.bind(this), {
        label: new ActionTrayLabel("", ""),
        isSelectElement: true,
        selectElementOptions: this.cosecOptions,
      }),
      new ActionTrayElement("assign", this.onAssignSelected.bind(this), {
        label: new ActionTrayLabel("Assign", "Serah"),
        isDisabled: !this.canAssignCosec,
      }),
    ]
  }

  get cosecOptions(): SelectOption[] {
    return this.companySecretaries.value.map((cs: CompanySecretary) => {
      return new SelectOption(cs.id, cs.id, `${cs.name} (${cs.license})`)
    })
  }
}
