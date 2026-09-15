import type { PropsSecretarialService } from "~/scripts/props/PropsSecretarialService"
import { SecretarialServiceController } from "./SecretarialServiceController"
import { CompanyAnnualReturnRequest } from "~/scripts/models/CompanyAnnualReturnRequest"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { CompanyConstants } from "~/scripts/constants/Company"
import { Company } from "~/scripts/models/Company"
import { Director } from "~/scripts/models/Director"
import { Shareholder } from "~/scripts/models/Shareholder"
import { Form } from "~/scripts/models/Form"
import { Filter } from "~/scripts/library/Filter"
import { PropsUserDetail } from "~/scripts/props/PropsUserDetail"
import { User } from "~/scripts/models/User"

export class LodgeAnnualReturnController extends SecretarialServiceController<
  CompanyAnnualReturnRequest,
  ReturnType<typeof useCompanyAnnualReturnRequestStore>
> {
  application = ref<CompanyAnnualReturnRequest>(new CompanyAnnualReturnRequest())

  company = ref<Company>(new Company())
  directors: Ref<Director[]> = ref<Director[]>([])
  shareholders: Ref<Shareholder[]> = ref<Shareholder[]>([])
  forms: Ref<Form[]> = ref<Form[]>([])

  constructor(props: PropsSecretarialService, emitEvents: any) {
    super(props, CompanyConstants.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES, emitEvents)
  }

  async fetchData(): Promise<void> {
    // 1. Company Details - name, registration number, description, msic code, business address, registered address
    // 2. Director Details - name, address, ic/passport
    // 3. Shareholder Details - name, address, ic/passport, shareholding
    // 4. Any allotment of shares for the year? Any Transfer of Shares for the year
    // 5. Documents uploaded for the company

    try {
      await Promise.allSettled([
        this.fetchCompany(),
        this.fetchDirectors(),
        this.fetchShareholders(),
        this.fetchForms(),
      ])

      this.emitEvents("company", this.company.value)
    } catch (e) {
      console.error(e)
    }
  }

  async fetchCompany(): Promise<void> {
    let repository = useCompanyStore()
    let response = await repository.fetch(this.companyId.value)

    this.company.value = new Company(response)
  }

  async fetchDirectors(): Promise<void> {
    let repository = useDirectorStore()
    let filter = new Filter()
    filter.companyId = this.companyId.value
    let response = await repository.fetchAll(filter)

    this.directors.value = response.data.map((d: any) => {
      return new Director(d)
    })
  }

  async fetchShareholders(): Promise<void> {
    let repository = useShareholderStore()
    let filter = new Filter()
    filter.companyId = this.companyId.value
    let response = await repository.fetchAll(filter)

    this.shareholders.value = response.data.map((d: any) => {
      return new Shareholder(d)
    })
  }

  async fetchForms(): Promise<void> {
    let repository = useFormStore()
    let filter = new Filter()
    filter.companyId = this.companyId.value
    let response = await repository.fetchAll(filter)

    this.forms.value = response.data.map((d: any) => {
      return new Form(d)
    })
  }

  async fetchApplication(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.applicationId.value)) {
      return
    }

    let repository = useCompanyAnnualReturnRequestStore()
    let response = await repository.fetch(this.applicationId.value)

    this.application.value = new CompanyAnnualReturnRequest(response)

    this.companyId.value = this.application.value.companyId

    await this.fetchData()
  }

  getUserDetailsProps(role: Director | Shareholder): PropsUserDetail {
    return new PropsUserDetail(role.id, role.user ?? new User(), role)
  }
}
