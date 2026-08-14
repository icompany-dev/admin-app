import type { IModelApplication } from "~/scripts/models/IModelApplication"
import type { IRepositoryStore } from "~/scripts/models/IRepositoryStore"
import { Filter } from "./Filter"
import { Error } from "./Error"
import { StatusConstants } from "../constants/Status"
import type { Application } from "../models/Application"
import { DocumentsAndForms } from "./DocumentsAndForms"
import { CompanyDocument } from "~/scripts/types/CompanyDocument"
import { StringUtil } from "../utils/String"
import { CompanyConstants } from "~/scripts/constants/Company"
import { StatutoryFormKeywords } from "../constants/StatutoryForms"

export class PastApplications {
  target: string = ""
  applicationClassType: new (data: any) => Application
  applications: Application[] = []

  companyId: string = ""
  repository: IRepositoryStore

  documents: CompanyDocument[] = []

  isFetching: boolean = false

  constructor(
    companyId: string,
    applicationClassType: new (data: any) => Application,
    repository: IRepositoryStore,
    target: string
  ) {
    this.companyId = companyId
    this.applicationClassType = applicationClassType
    this.repository = repository
    this.target = target
  }

  setCompanyId(companyId: string): void {
    this.companyId = companyId
  }

  filter(): Filter {
    let filter = new Filter()
    filter.companyId = this.companyId
    filter.includeDeleted = true
    filter.statuses = [StatusConstants.COMPLETED, StatusConstants.CONVERTED]

    return filter
  }

  async fetchPastApplications(): Promise<void> {
    if (this.isFetching) {
      return
    }

    try {
      this.isFetching = true
      let response = await this.repository.fetchAll(this.filter())
      if (this.repository.error !== null) {
        throw this.repository.error
      }

      this.applications = response.data.map((d: any) => {
        return new this.applicationClassType(d)
      })

      //TODO: remove this test case
      // this.applications = this.applications.concat(this.applications).concat(this.applications)
    } catch (e: any) {
      // we don't handle the error. only set to empty
      this.applications = []
    } finally {
      this.isFetching = false
    }
  }

  async fetchDocumentsByTarget(): Promise<void> {
    if (this.isFetching) {
      return
    }

    try {
      this.isFetching = true

      this.documents = []
      let documentsAndForms = new DocumentsAndForms(this.companyId)
      await documentsAndForms.init()

      let keywords = this.getKeywords()

      if (keywords === null || StringUtil.isNullOrEmpty(keywords)) {
        return
      }

      let keywordFragments = keywords.split(",").map((d: string) => {
        return d.trim()
      })
      this.documents = documentsAndForms.documents.filter((cd: CompanyDocument) => {
        return keywordFragments.some((k: string) => {
          return StringUtil.contains(cd.documentName, k)
        })
      })
    } catch (e: any) {
      // we don't handle the error. only set to empty
      this.documents = []
    } finally {
      this.isFetching = false
    }
  }

  getKeywords(): string | null {
    let keywords = null

    switch (this.target) {
      case CompanyConstants.TARGET_ADOPT_A_CONSTITUTION:
        keywords = StatutoryFormKeywords.Constitution
        break
      case CompanyConstants.TARGET_AMENDMENT_ADDRESS:
        keywords = StatutoryFormKeywords.ChangeOfAddress
        break
      case CompanyConstants.TARGET_AMENDMENT_REGISTERED_ADDRESS:
        keywords = StatutoryFormKeywords.S46.concat(StatutoryFormKeywords.ChangeOfRegisteredAddress)
        break
      case CompanyConstants.TARGET_AMENDMENT_BRANCH:
        keywords = StatutoryFormKeywords.ChangeOfBranch.concat(StatutoryFormKeywords.PD2)
        break
      case CompanyConstants.TARGET_AMENDMENT_CONSTITUTION:
        keywords = StatutoryFormKeywords.Constitution
        break
      case CompanyConstants.TARGET_AMENDMENT_DESCRIPTION:
        keywords = StatutoryFormKeywords.ChangeOfDescription
        break
      case CompanyConstants.TARGET_AMENDMENT_NAME:
        keywords = StatutoryFormKeywords.ChangeOfName
        break
      case CompanyConstants.TARGET_AUDIT_CIRCULATION:
        keywords = null // need to add
        break
      case CompanyConstants.TARGET_AUDITOR_APPOINTMENT:
        keywords = "auditor"
        break
      case CompanyConstants.TARGET_DELEGATION_OF_AUTHORITY:
        keywords = null
        break
      case CompanyConstants.TARGET_DIRECTOR_APPOINTMENT:
        keywords = StatutoryFormKeywords.AppointDirector.concat(StatutoryFormKeywords.S58)
        break
      case CompanyConstants.TARGET_DIRECTOR_RESIGNATION:
        keywords = StatutoryFormKeywords.ResignationOfDirector.concat(StatutoryFormKeywords.S58)
        break
      case CompanyConstants.TARGET_DIVIDEND_DECLARATION:
        keywords = null // need to add
        break
      case CompanyConstants.TARGET_FINANCIAL_STATEMENT_AUTHORISED_PERSON:
        keywords = null // need to add
        break
      case CompanyConstants.TARGET_LODGE_ANNUAL_RETURN:
        keywords = StatutoryFormKeywords.AnnualReturn
        break
      case CompanyConstants.TARGET_OPEN_BANK_ACCOUNT:
        keywords = StatutoryFormKeywords.OpenBankAccount
        break
      case CompanyConstants.TARGET_PREFERENCE_SHARE_RIGHT:
        keywords = null // need to add
        break
      case CompanyConstants.TARGET_SET_FINANCIAL_YEAR_END:
        keywords = null // need to add
        break
      case CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_ALLOTMENT:
        keywords = StatutoryFormKeywords.AllotmentOfShares
        break
      case CompanyConstants.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES:
        keywords = StatutoryFormKeywords.AllotmentOfShares
        break
      case CompanyConstants.TARGET_SHAREHOLDER_TRANSFER_OF_SHARES:
        keywords = StatutoryFormKeywords.TransferOfShares
        break
      case CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_TRANSFER:
        keywords = StatutoryFormKeywords.TransferOfShares
        break
      case CompanyConstants.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER:
        keywords = StatutoryFormKeywords.TransferOfShares
        break
    }

    return keywords
  }
}
