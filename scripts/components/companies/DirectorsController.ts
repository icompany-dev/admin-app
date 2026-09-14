import { Director } from "~/scripts/models/Director"
import { Filter } from "~/scripts/library/Filter"
import { Error } from "~/scripts/library/Error"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"
import { TableDataFetcher } from "~/scripts/library/TableDataFetcher"
import { StringUtil } from "~/scripts/utils/String"
import { ActionTrayElement, ActionTrayLabel } from "~/scripts/types/action-trays/ActionTrayElement"
import { PropsActionInProgress } from "~/scripts/props/PropsActionInProgress"
import { DownloadFileData } from "~/scripts/types/DownloadFileData"

export class DirectorsController {
  tableDataFetcher = ref<TableDataFetcher<Director>>(new TableDataFetcher(Director, useDirectorStore()))

  selectedDirectorId: Ref<string> = ref<string>("")

  language = useLanguage()

  filter = ref<Filter>(new Filter())

  emitEvents: any | null = null

  documentRef: any | null = null
  actionInProgressRef: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)
  isDownloading: Ref<boolean> = ref<boolean>(false)
  totalDownloaded: Ref<number> = ref<number>(0)

  constructor(emitEvents: any) {
    this.emitEvents = emitEvents

    this.tableDataFetcher.value.filter.take = 20
    this.tableDataFetcher.value.filter.takeAll = false
    this.tableDataFetcher.value.filter.orderBy = "created_at"
    this.tableDataFetcher.value.filter.sortOrder = "asc"

    this.fetchData()
  }

  setDocumentRef(documentRef: any): void {
    this.documentRef = documentRef
  }

  setActionInProgressRef(actionInProgressRef: any): void {
    this.actionInProgressRef = actionInProgressRef
  }

  async setSearch(searchText: string): Promise<void> {
    this.tableDataFetcher.value.filter.searchText = searchText
    await this.fetchData()
  }

  async setSortOrder(sortOrder: string): Promise<void> {
    this.tableDataFetcher.value.filter.sortOrder = sortOrder
    await this.fetchData()
  }

  async setIsIncludeDemo(isIncludeDemo: boolean): Promise<void> {
    this.tableDataFetcher.value.filter.includeTestAccount = isIncludeDemo
    await this.fetchData()
  }

  async goToPage(page: number): Promise<void> {
    await this.tableDataFetcher.value.goToPage(page)
  }

  async fetchData(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      await this.tableDataFetcher.value.fetchData()

      let promises = this.tableDataFetcher.value.data.map((d: Director) => {
        return d.setCompany(useCompanyStore())
      })

      await Promise.allSettled(promises)

      this.selectedDirectorId.value = this.tableDataFetcher.value.data[0].id
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

  onDirectorSelected(directorId: string): void {
    this.selectedDirectorId.value = directorId

    // let router = useRouter()
    // router.push(`/sdnbhds/directors/${this.selectedDirectorId.value}`)
  }

  onDirectorUnselected(): void {
    this.selectedDirectorId.value = ""
  }

  async onDownloadAll(): Promise<void> {
    if (this.isDownloading.value) {
      return
    }

    if (this.actionInProgressRef) {
      this.actionInProgressRef.show()
    }

    try {
      this.isDownloading.value = true

      let blobs: Blob[] = []
      let files: DownloadFileData[] = []

      for (let i = 0; i < this.tableDataFetcher.value.data.length; i++) {
        let director = this.tableDataFetcher.value.data[i]
        if (StringUtil.isNullOrEmpty(director.userId) || StringUtil.isNullOrEmpty(director.company?.id ?? "")) {
          continue
        }

        this.selectedDirectorId.value = this.tableDataFetcher.value.data[i].id

        await nextTick()
        await this.documentRef.waitForReady()

        let filename = `${director.company?.getFullName().toUpperCase()}, ${director.user?.name.toUpperCase()} - Declaration under Section 201.pdf`
        let blob = await this.documentRef.onGenerateBlob()
        if (!blob) {
          continue
        }

        blobs.push(blob)
        files.push(new DownloadFileData(URL.createObjectURL(blob), filename))
        this.totalDownloaded.value = this.totalDownloaded.value + 1
      }
    } catch (e) {
      //
    } finally {
      this.tableDataFetcher.value.filter.takeAll = false
      this.isDownloading.value = false
    }
  }

  // getters
  get loaderLabel(): string {
    return this.language.isMalay() ? "Sedang Memaut" : "Retrieving the"
  }

  get loaderSublabel(): string {
    return this.language.isMalay() ? "Pengarah" : "Directors"
  }

  get noRecordTitle(): string {
    return this.language.isMalay() ? `Tiada Pengarah Ditemui.` : `No Director Found`
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

  get isShowSelectedSdnBhd(): boolean {
    return !StringUtil.isNullOrEmpty(this.selectedDirectorId.value)
  }

  get actionTrayElements(): ActionTrayElement[] {
    return [
      // new ActionTrayElement("select-all", this.onSelectAllClicked.bind(this), {
      //   label: new ActionTrayLabel(selectAllLabelEn, selectAllLabelBm),
      // }),
      // new ActionTrayElement("cosec-option", this.onCosecSelected.bind(this), {
      //   label: new ActionTrayLabel("", ""),
      //   isSelectElement: true,
      //   selectElementOptions: this.cosecOptions,
      // }),
      new ActionTrayElement("download", this.onDownloadAll.bind(this), {
        label: new ActionTrayLabel("Download All", "Muat Turun"),
        isDisabled: this.isDownloading.value,
      }),
    ]
  }

  get actionInProgressProps(): PropsActionInProgress {
    return new PropsActionInProgress(
      this.tableDataFetcher.value.data.length,
      this.totalDownloaded.value,
      this.language.isMalay() ? "menjana pengisytiharan" : "generating the declarations"
    )
  }
}
