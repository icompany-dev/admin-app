//NOTE: This class is for mapping of backend response when fetchAll or any that is similar to it is called

export class ApiRecord<TItem> {
  data: TItem[] = []
  totalRecords: number = 0
  page: number = 1
  take: number = 10
  totalPages: number = 1
  searchText: string | null = ''

  constructor(apiResponse: any, classType: new (data: any) => TItem) {
    this.data =
      apiResponse.data && Array.isArray(apiResponse.data)
        ? apiResponse.data.map((d: any) => {
            return new classType(d)
          })
        : []
    this.totalRecords = apiResponse.total_records ?? 0
    this.page = apiResponse.page ?? 1
    this.take = apiResponse.take ?? 10
    this.totalPages = apiResponse.totalPages ?? 1
    this.searchText = apiResponse.searchText ?? null
  }
}
