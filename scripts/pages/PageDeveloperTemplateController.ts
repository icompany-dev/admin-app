import type { DocumentsAndForms } from "../library/DocumentsAndForms"
import { Filter } from "../library/Filter"
import { Company } from "../models/Company"
import { Director } from "../models/Director"

export class PageDeveloperTemplateController {
  companies: Ref<Company[]> = ref<Company[]>([])
  directors: Ref<Director[]> = ref<Director[]>([])

  companyDocuments: Record<string, DocumentsAndForms> = {}
  uploaded201: Record<string, string[]> = {}

  constructor() {}

  async fetchCompanies(): Promise<void> {
    let repository = useCompanyStore()
    let filter = new Filter()
    filter.takeAll = true
    let response = await repository.fetchCompact(filter.getSlug())

    this.companies.value = response.data.map((t: any) => {
      return new Company(t)
    })

    for (let i = 0; i < this.companies.value.length; i++) {}
  }

  async fetchDirectors(): Promise<void> {
    let repository = useDirectorStore()
    let filter = new Filter()
    filter.takeAll = true
    let response = await repository.fetchAll(filter)

    this.directors.value = response.data.map((d: any) => {
      return new Director(d)
    })
  }

  async checkSection201(): Promise<void> {
    for (let i = 0; i < this.directors.value.length; i++) {
      let director = this.directors.value[i] ?? null

      if (!director) {
        continue
      }
    }
  }

  get companyIds(): string[] {
    return this.companies.value.map((c: Company) => {
      return c.id
    })
  }
}
