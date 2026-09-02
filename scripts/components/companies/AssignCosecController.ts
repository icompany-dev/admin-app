import { Company } from "~/scripts/models/Company"
import { Filter } from "~/scripts/library/Filter"
import { Error } from "~/scripts/library/Error"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { StringUtil } from "~/scripts/utils/String"
import { DownloadFileData } from "~/scripts/types/DownloadFileData"
import { FileZipper } from "~/scripts/utils/FileZipper"

export class AssignCosecController {
  tableDataFetcher = ref<TableDataFetcher<Company>>(new TableDataFetcher(Company, useCompanyStore()))

  selectedCompanyId: Ref<string> = ref<string>("")

  language = useLanguage()

  filter = ref<Filter>(new Filter())

  emitEvents: any | null = null

  documentRef: any | null = null

  isGeneratingPdf: Ref<boolean> = ref<boolean>(false)

  constructor(emitEvents: any) {
    this.emitEvents = emitEvents

    this.init()
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  async init(): Promise<void> {
    this.tableDataFetcher.value.filter.take = 20
    this.tableDataFetcher.value.filter.takeAll = false
    this.tableDataFetcher.value.filter.orderBy = "name"
    this.tableDataFetcher.value.filter.sortOrder = "asc"

    await this.tableDataFetcher.value.fetchData()

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

  async goToPage(page: number): Promise<void> {
    await this.tableDataFetcher.value.goToPage(page)
  }

  onCompanySelected(companyId: string): void {
    this.selectedCompanyId.value = companyId

    // let router = useRouter()
    // router.push(`/sdnbhds/${this.selectedCompanyId.value}`)
    //this.emitEvents("sdnbhdSelected")
  }

  onCompanyUnselected(): void {
    this.selectedCompanyId.value = ""
  }

  async onDownloadAll(): Promise<void> {
    if (!this.documentRef) {
      return
    }

    this.isGeneratingPdf.value = true

    try {
      let repository = useCompanyStore()
      let response = await repository.fetchCompact("")
      let companies = response.map((item: any) => {
        return new Company(item)
      })

      let blobs: Blob[] = []
      let files: DownloadFileData[] = []
      for (let index = 0; index < companies.length; index++) {
        let company = companies[index]
        this.selectedCompanyId.value = company.id
        await nextTick()
        let filename = `${company.getFullName().toUpperCase()} - Assignment of Company Secretary.pdf`
        console.log(`Generating PDF for ${company.getFullName()}...`)
        let blob = await this.documentRef.onGenerateBlob(filename)
        if (!blob) {
          continue
        }
        console.log("blob", blob)
        blobs.push(blob)
        files.push(new DownloadFileData(URL.createObjectURL(blob), filename))
      }

      console.log("blobs", blobs.length)
      console.log("files", files.length)

      await FileZipper.zipAndDownload(files, "assignment-of-company-secretary.zip")

      console.log(`All PDFs generated and downloaded successfully.`)
    } catch (e) {
      console.error(e)
    } finally {
      this.isGeneratingPdf.value = false
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
}
