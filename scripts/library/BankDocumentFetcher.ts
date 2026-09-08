import { Form } from "~/scripts/models/Form"
import { Filter } from "~/scripts/library/Filter"
import { StringUtil } from "~/scripts/utils/String"
import { StatutoryFormKeywords } from "../constants/StatutoryForms"
import { ObjectUtil } from "../utils/Object"

export class BankDocumentFetcher {
  companyId: string = ""

  repository = useFormStore()
  forms: Form[] = []

  isLoading: boolean = false

  section14FileUrl: string = ""
  section15FileUrl: string = ""
  section17FileUrl: string = ""
  section46FileUrl: string = ""
  section51FileUrl: string = ""
  section58FileUrl: string = ""
  section78FileUrl: string = ""
  constitutionFileUrl: string = ""

  constructor(companyId: string) {
    this.companyId = companyId
  }

  setCompanyId(companyId: string): void {
    this.companyId = companyId
  }

  async fetchForms(): Promise<void> {
    if (this.isLoading || StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    try {
      this.isLoading = true

      let filter = new Filter()
      filter.companyId = this.companyId
      filter.takeAll = true

      let response = await this.repository.searchFetchAll(filter)

      if (this.repository.error !== null) {
        throw this.repository.error
      }

      this.forms = response.map((d: any) => {
        return new Form(d)
      })

      this.forms = ObjectUtil.sort<Form>(this.forms, "createdAt", "desc")

      this.setSection14FileUrl()
      this.setSection15FileUrl()
      this.setSection17FileUrl()
      this.setSection46FileUrl()
      this.setSection51FileUrl()
      this.setSection58FileUrl()
      this.setSection78FileUrl()
      this.setConstitutionFileUrl()
    } catch (e) {
      // do something
      this.forms = []
    } finally {
      this.isLoading = false
    }
  }

  setSection14FileUrl(): void {
    let form = this.forms.find((f: Form) => {
      if (!f.file) {
        return false
      }

      let splitKeywords = StatutoryFormKeywords.S14.split(",")

      return splitKeywords.some((s: string) => {
        if (!f.file) {
          return false
        }
        return StringUtil.contains(f.file.name, s)
      })
    })

    if (!form) {
      this.section14FileUrl = ""
      return
    }

    this.section14FileUrl = form.file?.url ?? ""
  }

  setSection15FileUrl(): void {
    let form = this.forms.find((f: Form) => {
      if (!f.file) {
        return false
      }

      let splitKeywords = StatutoryFormKeywords.S15.split(",")

      return splitKeywords.some((s: string) => {
        if (!f.file) {
          return false
        }
        return StringUtil.contains(f.file.name, s)
      })
    })

    if (!form) {
      this.section15FileUrl = ""
      return
    }

    this.section15FileUrl = form.file?.url ?? ""
  }

  setSection17FileUrl(): void {
    let form = this.forms.find((f: Form) => {
      if (!f.file) {
        return false
      }
      return StringUtil.contains(f.file.name, StatutoryFormKeywords.COI)
    })

    if (!form) {
      this.section17FileUrl = ""
      return
    }

    this.section17FileUrl = form.file?.url ?? ""
  }

  setSection46FileUrl(): void {
    let form = this.forms.find((f: Form) => {
      if (!f.file) {
        return false
      }
      let splitKeywords = StatutoryFormKeywords.S46.split(",")

      return splitKeywords.some((s: string) => {
        if (!f.file) {
          return false
        }
        return StringUtil.contains(f.file.name, s)
      })
    })

    if (!form) {
      this.section46FileUrl = ""
      return
    }

    this.section46FileUrl = form.file?.url ?? ""
  }

  setSection51FileUrl(): void {
    let form = this.forms.find((f: Form) => {
      if (!f.file) {
        return false
      }
      let splitKeywords = StatutoryFormKeywords.S51.split(",")

      return splitKeywords.some((s: string) => {
        if (!f.file) {
          return false
        }
        return StringUtil.contains(f.file.name, s)
      })
    })

    if (!form) {
      this.section51FileUrl = ""
      return
    }

    this.section51FileUrl = form.file?.url ?? ""
  }

  setSection58FileUrl(): void {
    let form = this.forms.find((f: Form) => {
      if (!f.file) {
        return false
      }
      let splitKeywords = StatutoryFormKeywords.S58.split(",")

      return splitKeywords.some((s: string) => {
        if (!f.file) {
          return false
        }
        return StringUtil.contains(f.file.name, s)
      })
    })

    if (!form) {
      this.section58FileUrl = ""
      return
    }

    this.section58FileUrl = form.file?.url ?? ""
  }

  setSection78FileUrl(): void {
    let form = this.forms.find((f: Form) => {
      if (!f.file) {
        return false
      }
      let splitKeywords = StatutoryFormKeywords.S78.split(",")

      return splitKeywords.some((s: string) => {
        if (!f.file) {
          return false
        }
        return StringUtil.contains(f.file.name, s)
      })
    })

    if (!form) {
      this.section78FileUrl = ""
      return
    }

    this.section78FileUrl = form.file?.url ?? ""
  }

  setConstitutionFileUrl(): void {
    let form = this.forms.find((f: Form) => {
      if (!f.file) {
        return false
      }
      return StringUtil.contains(f.file.name, StatutoryFormKeywords.Constitution)
    })

    if (!form) {
      this.constitutionFileUrl = ""
      return
    }

    this.constitutionFileUrl = form.file?.url ?? ""
  }
}
