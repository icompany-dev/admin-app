import { AdminToDo } from "~/scripts/models/AdminToDo"
import { Filter } from "~/scripts/library/Filter"
import { Error } from "~/scripts/library/Error"
import { PropsTablePagination } from "~/scripts/props/PropsTablePagination"

export class ActivitiesController {
  todos = ref<AdminToDo[]>([])

  isLoading: Ref<boolean> = ref<boolean>(false)

  filter = ref<Filter>(new Filter())

  emitEvents: any | null = null

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents

    this.filter.value = new Filter()
    this.filter.value.take = 30
    this.filter.value.page = 1
    this.filter.value.totalPages = 1
    this.filter.value.totalRecords = 1

    this.fetchToDos()
  }

  async fetchToDos(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true
      let repository = useAdminToDoStore()

      let response = await repository.fetchAll(this.filter.value)
      this.filter.value.totalPages = Math.ceil(response.totalRecords / this.filter.value.take)
      this.filter.value.totalRecords = response.totalRecords

      this.todos.value = response.data.map((d: any) => {
        return new AdminToDo(d)
      })
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let error = new Error(Error.ERROR_TYPE_API, "")
        error.setForFetchAll()
        error.handle()
      }
    } finally {
      this.isLoading.value = false
    }
  }

  async goToPage(page: number): Promise<void> {
    this.filter.value.page = page
    // await this.fetchToDos()
  }

  get tablePaginationProps(): PropsTablePagination {
    return new PropsTablePagination(this.filter.value)
  }
}
