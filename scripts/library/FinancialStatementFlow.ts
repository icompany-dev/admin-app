import { CompanyAuditCirculation } from "../models/CompanyAuditCirculation"
import { CompanyAuditor } from "../models/CompanyAuditor"
import { CompanyAuditorAppointment } from "../models/CompanyAuditorAppointment"
import { CompanyFinancialPeriod } from "../models/CompanyFinancialPeriod"
import { CompanySetFinancialYearEnd } from "../models/CompanySetFinancialYearEnd"
import { StringUtil } from "../utils/String"
import { Filter } from "./Filter"

export class FinancialStatementFlow {
  companyId: string = ""
  isLoading: boolean = false

  currentFinancialPeriod: CompanyFinancialPeriod = new CompanyFinancialPeriod()

  hasSetFinancialYearEnd: boolean = false
  setFYEApplication: CompanySetFinancialYearEnd = new CompanySetFinancialYearEnd()

  isSubmittingAudited: boolean = true
  isFirstAuditor: boolean = true
  hasAppointedAuditor: boolean = false
  currentAuditor: CompanyAuditor = new CompanyAuditor()
  auditorAppointmentApplication: CompanyAuditorAppointment = new CompanyAuditorAppointment()

  deadlineForCirculation: string = ""
  dateOfFinancialStatement: string = ""
  lastDateForCirculation: string = ""
  lastDateForLodgement: string = ""

  auditCirculationApplication: CompanyAuditCirculation = new CompanyAuditCirculation()

  constructor(companyId: string) {
    this.companyId = companyId
  }

  async init(): Promise<void> {
    if (this.isLoading || StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    try {
      this.isLoading = true

      await Promise.all([
        this.fetchCurrentFinancialPeriod(),
        this.fetchOngoingSetFinancialYearEnd(),
        this.fetchCompanyAuditor(),
        this.fetchOngoingAuditorAppointment(),
        this.fetchOngoingAuditCirculation(),
      ])
    } catch (e) {
      // do nothing
    } finally {
      this.isLoading = false
    }
  }

  async fetchCurrentFinancialPeriod(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      this.hasSetFinancialYearEnd = false
      return
    }

    try {
      let repository = useCompanyFinancialPeriodStore()
      let response = await repository.current(this.companyId)
      if (!response) {
        this.hasSetFinancialYearEnd = false
        return
      }

      this.currentFinancialPeriod = new CompanyFinancialPeriod(response)
    } catch (e) {
      this.hasSetFinancialYearEnd = false
    }
  }

  async fetchOngoingSetFinancialYearEnd(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    try {
      let repository = useCompanySetFinancialYearEndStore()
      let response = await repository.ongoing(this.companyId)
      this.setFYEApplication = new CompanySetFinancialYearEnd(response)
    } catch (e) {
      // do nothing
    }
  }

  async fetchCompanyAuditor(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    try {
      let repository = useCompanyAuditCirculationStore()
      let filter = new Filter()
      filter.companyId = this.companyId
      filter.orderBy = "created_at"
      filter.sortOrder = "desc"
      filter.take = 1

      let response = await repository.fetchAll(filter)
      if (repository.error !== null || response.totalRecords <= 0) {
        this.isFirstAuditor = true
        this.hasAppointedAuditor = false
        return
      }

      this.currentAuditor = new CompanyAuditor(response.data[0])
    } catch (e) {
      // do nothing
    }
  }

  async fetchOngoingAuditorAppointment(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    try {
      let repository = useCompanyAuditorAppointmentStore()
      let response = await repository.fetchLast(this.companyId)
      this.auditorAppointmentApplication = new CompanyAuditorAppointment(response)
    } catch (e) {
      // do nothing
    }
  }

  async fetchOngoingAuditCirculation(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    try {
      let repository = useCompanyAuditCirculationStore()
      let filter = new Filter()
      filter.companyId = this.companyId
      filter.orderBy = "created_at"
      filter.sortOrder = "desc"
      filter.take = 1

      let response = await repository.fetchAll(filter)
      if (repository.error !== null || response.totalRecords <= 0) {
        return
      }

      this.auditCirculationApplication = new CompanyAuditCirculation(response.data[0])
    } catch (e) {
      // do nothing
    }
  }
}
