import { MyDataDocument, MyDataDocuments } from "~/scripts/models/MyDataDocuments"
import { Form } from "~/scripts/models/Form"
import { Error } from "~/scripts/library/Error"
import { Filter } from "~/scripts/library/Filter"
import { CompanyDocument } from "~/scripts/types/CompanyDocument"
import { StringUtil } from "../utils/String"
import { Company } from "../models/Company"
import { StatutoryFormKeywords } from "~/scripts/constants/StatutoryForms"

export class DocumentsAndForms {
  companyId: string = ""
  company: Company | null = null
  defaultDocumentDate: Date = new Date()

  documents: CompanyDocument[] = []
  forms: Form[] = []
  myDataDocuments: MyDataDocuments = new MyDataDocuments()

  isFetchingDocuments: boolean = false

  formRepository = useFormStore()
  myDataRepository = useMyDataStore()

  constructor(companyId: string) {
    this.companyId = companyId
  }

  async init(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    try {
      await this.fetchCompany()
      await this.fetchDocuments()
    } catch (e: any) {
      throw e
    }
  }

  async fetchCompany(): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.companyId)) {
      return
    }

    let repository = useCompanyStore()
    let response = await repository.fetch(this.companyId)
    if (repository.error !== null) {
      throw repository.error
    }

    this.company = new Company(response)
    this.defaultDocumentDate = new Date(this.company?.incorporatedAt ?? "")
  }

  async fetchDocuments(): Promise<void> {
    if (this.isFetchingDocuments) {
      return
    }

    try {
      this.isFetchingDocuments = true
      await Promise.all([this.fetchForms(), this.fetchMyDataDocuments()])
      this.setDocuments()
    } catch (e: any) {
      throw e // let the controller handle the error
    } finally {
      this.isFetchingDocuments = false
    }
  }

  async fetchForms(): Promise<void> {
    let filter = new Filter()
    filter.companyId = this.companyId
    filter.takeAll = true
    let response = await this.formRepository.searchFetchAll(filter)
    if (this.formRepository.error !== null) {
      throw this.formRepository.error
    }

    this.forms = response
      .map((data: any) => {
        return new Form(data)
      })
      .filter((form: Form) => {
        return form.file !== null && form.file.url !== null && form.file.url.toLowerCase().endsWith(".pdf")
      })
  }

  async fetchMyDataDocuments(): Promise<void> {
    let filter = new Filter()
    filter.companyId = this.companyId
    let myDataDocuments: MyDataDocuments | null = await this.myDataRepository.fetchAllDocuments(filter)
    if (this.myDataRepository.error !== null) {
      throw this.myDataRepository.error
    }

    this.myDataDocuments = new MyDataDocuments(myDataDocuments)
  }

  setDocuments(): void {
    this.documents = []

    this.myDataDocuments?.documents.forEach((document: MyDataDocument) => {
      this.documents.push(
        new CompanyDocument(
          crypto.randomUUID(),
          false,
          document.formDescription,
          null,
          true,
          new Date(document.documentDate),
          `${document.myDataFileId}`,
          document.totalPages
        )
      )
    })

    this.forms.forEach((form: Form) => {
      let documentDate = form.createdAt ? new Date(form.createdAt) : new Date(this.company?.incorporatedAt ?? "")
      this.documents.push(
        new CompanyDocument(
          crypto.randomUUID(),
          false,
          form.file?.name ?? "",
          form.file?.url ?? null,
          false,
          documentDate,
          form.file?.id ?? "",
          form.noOfPages
        )
      )
    })
  }

  getStatutoryForms(): CompanyDocument[] {
    let selectedDocuments: CompanyDocument[] = []

    // current list that we have - superform, s15, coi, s32, s51, s78, s58, s105, s352
    selectedDocuments.push(this.getCertificateOfIncorporation("Certificate of Incorporation", false, false))
    selectedDocuments.push(this.getSection14("Section 14 - Superform", false, false))
    selectedDocuments.push(this.getSection15("Section 15 - Notification of Incorporation", false, false))
    selectedDocuments = selectedDocuments.concat(this.getAllSection58s(false, false))
    selectedDocuments = selectedDocuments.concat(this.getAllSection78s(false, false))
    selectedDocuments = selectedDocuments.concat(this.getAllSubmittedAnnualReturns(false, false))
    selectedDocuments = selectedDocuments.concat(this.getAllSubmittedAuditReports(false, false))

    selectedDocuments.sort((a: CompanyDocument, b: CompanyDocument) => {
      return new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()
    })

    return selectedDocuments
  }

  getCompanyDocuments(): CompanyDocument[] {
    return this.documents
  }

  getDocumentsFormMOFApplication(): CompanyDocument[] {
    let selectedDocuments: CompanyDocument[] = []

    selectedDocuments = this.getBankAccountResolutions(false, true)

    selectedDocuments.push(this.getCorporateProfile("SSM Corporate Profile", false, true))

    selectedDocuments.push(
      new CompanyDocument(
        crypto.randomUUID(),
        true,
        "Borang Pengisytiharan MOF",
        null, // The link will be from our storage??
        false,
        this.defaultDocumentDate,
        "",
        1,
        true,
        false
      )
    )

    selectedDocuments.push(
      new CompanyDocument(
        crypto.randomUUID(),
        true,
        "Surat Akuan Syarikat - Lampiran 11",
        null, // The link will be from our storage??
        false,
        this.defaultDocumentDate,
        "",
        1,
        true,
        false
      )
    )

    selectedDocuments.push(
      new CompanyDocument(
        crypto.randomUUID(),
        true,
        "Borang Pengesahan Akaun Bank",
        null,
        false,
        this.defaultDocumentDate,
        "",
        1,
        true,
        false
      )
    )

    return selectedDocuments
  }

  getDocumentsForCIDBApplication(): CompanyDocument[] {
    let selectedDocuments: CompanyDocument[] = []

    let latestAnnualReturn = this.getLatestSubmittedAnnualReturn("Latest Available Annual Return", false, true)
    if (latestAnnualReturn) {
      selectedDocuments.push(latestAnnualReturn)
    }

    let latestAuditReport = this.getLatestSubmittedAuditReport("Latest Available Audited Report", false, true)
    if (latestAuditReport) {
      selectedDocuments.push(latestAuditReport)
    }

    selectedDocuments.push(this.getCorporateProfile("SSM Corporate Profile", false, false))

    selectedDocuments.push(
      this.getCertificateOfIncorporation("Form 9 or Section 17 - Certificate of Incorporation", false, false)
    )

    let latestSection78 = this.getLatestSection78("Form 24 or Section 78 - Return of Allotment", false, false)
    if (latestSection78) {
      selectedDocuments.push(latestSection78)
    }

    let latestSection58 = this.getSection58(
      "Form 49 or Section 58 - Register of Directors, Managers & Secretaries",
      false,
      false
    )
    if (latestSection58) {
      selectedDocuments.push(latestSection58)
    }

    return selectedDocuments
  }

  getDocumentsForCDS(): CompanyDocument[] {
    let documents: CompanyDocument[] = []

    let coi = this.getCertificateOfIncorporation("Certificate of Incorporation", false, false)
    documents.push(coi)

    let latestAuditReport = this.getLatestSubmittedAuditReport("Latest Available Audited Report", false, true)
    if (latestAuditReport) {
      documents.push(latestAuditReport)
    }

    let allSection58s = this.getAllSection58s(false, false)
    documents = documents.concat(allSection58s)

    let allSection78s = this.getAllSection78s(false, false)
    documents = documents.concat(allSection78s)

    let section46 = this.getSection46("Latest Change of Registered Address", false, false)
    if (section46) {
      documents.push(section46)
    }

    return documents
  }

  onSearchDocuments(getDocumentFunction: () => CompanyDocument[], keyword: string): CompanyDocument[] {
    let allDocuments = getDocumentFunction()

    // possible that it has more than one
    let parts = keyword.split(",").map((d: string) => {
      return d.trim()
    })

    return allDocuments.filter((doc: CompanyDocument) => {
      return (
        StringUtil.contains(doc.documentName, keyword) ||
        StringUtil.contains(keyword, doc.documentName) ||
        parts.some((d: string) => {
          return StringUtil.contains(d, doc.documentName) || StringUtil.contains(doc.documentName, d)
        })
      )
    })
  }

  onSortDocumentsByName(getDocumentFunction: () => CompanyDocument[], isAscending: boolean): CompanyDocument[] {
    let allDocuments = getDocumentFunction()
    return allDocuments.sort((a: CompanyDocument, b: CompanyDocument) => {
      if (isAscending) {
        return a.documentName.localeCompare(b.documentName)
      } else {
        return b.documentName.localeCompare(a.documentName)
      }
    })
  }

  onSortDocumentsByDate(getDocumentFunction: () => CompanyDocument[], isAscending: boolean): CompanyDocument[] {
    let allDocuments = getDocumentFunction()
    return allDocuments.sort((a: CompanyDocument, b: CompanyDocument) => {
      if (isAscending) {
        return new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime()
      } else {
        return new Date(b.documentDate).getTime() - new Date(a.documentDate).getTime()
      }
    })
  }

  onSortDocuments(
    getDocumentFunction: () => CompanyDocument[],
    isByName: boolean,
    isByDate: boolean,
    isSortByNameAscending: boolean,
    isSortByDateAscending: boolean
  ): CompanyDocument[] {
    const allDocuments = [...getDocumentFunction()]

    allDocuments.sort((a, b) => {
      if (a.fileUrl !== b.fileUrl) {
        if (a.fileUrl === null) {
          return 1
        }

        if (b.fileUrl === null) {
          return -1
        }
      }

      if (isByName) {
        const nameComparison = a.documentName.localeCompare(b.documentName)
        if (nameComparison !== 0) {
          return isSortByNameAscending ? nameComparison : -nameComparison
        }
      }

      if (isByDate) {
        const dateA = new Date(a.documentDate).getTime()
        const dateB = new Date(b.documentDate).getTime()
        const dateComparison = dateA - dateB

        if (dateComparison !== 0) {
          return isSortByDateAscending ? dateComparison : -dateComparison
        }
      }

      return 0
    })

    return allDocuments
  }

  getLatestSubmittedAnnualReturn(
    documentName: string,
    isDisabled: boolean,
    isPriority: boolean
  ): CompanyDocument | null {
    let annualReturns = this.documents.filter((cd: CompanyDocument) => {
      return StringUtil.contains(cd.documentName, StatutoryFormKeywords.AnnualReturn)
    })

    if (annualReturns.length <= 0) {
      return null
    }

    annualReturns.sort((a: CompanyDocument, b: CompanyDocument) => {
      return new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime()
    })

    let latestAnnualReturn = annualReturns[0]

    return new CompanyDocument(
      crypto.randomUUID(),
      true,
      documentName,
      latestAnnualReturn.fileUrl,
      latestAnnualReturn.isFromMyData,
      latestAnnualReturn.documentDate,
      latestAnnualReturn.fileId,
      latestAnnualReturn.totalPages,
      isDisabled,
      isPriority
    )
  }

  getAllSubmittedAnnualReturns(isDisabled: boolean, isPriority: boolean): CompanyDocument[] {
    return this.documents
      .filter((cd: CompanyDocument) => {
        return StringUtil.contains(cd.documentName, StatutoryFormKeywords.AnnualReturn)
      })
      .map((document: CompanyDocument) => {
        return new CompanyDocument(
          crypto.randomUUID(),
          true,
          document.documentName,
          document.fileUrl,
          document.isFromMyData,
          document.documentDate,
          document.fileId,
          document.totalPages,
          isDisabled,
          isPriority
        )
      })
  }

  getLatestSubmittedAuditReport(
    documentName: string,
    isDisabled: boolean,
    isPriority: boolean
  ): CompanyDocument | null {
    let auditReports = this.documents.filter((cd: CompanyDocument) => {
      return (
        StringUtil.contains(cd.documentName, "audit") ||
        StringUtil.contains(cd.documentName, "financial statement") ||
        StringUtil.contains(cd.documentName, "annual report")
      )
    })
    if (auditReports.length <= 0) {
      return null
    }

    auditReports.sort((a: CompanyDocument, b: CompanyDocument) => {
      return new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime()
    })

    let latest = auditReports[0]

    return new CompanyDocument(
      crypto.randomUUID(),
      true,
      documentName,
      latest.fileUrl,
      latest.isFromMyData,
      latest.documentDate,
      latest.fileId,
      latest.totalPages,
      isDisabled,
      isPriority
    )
  }

  getAllSubmittedAuditReports(isDisabled: boolean, isPriority: boolean): CompanyDocument[] {
    return this.documents
      .filter((cd: CompanyDocument) => {
        return (
          StringUtil.contains(cd.documentName, "audit") ||
          StringUtil.contains(cd.documentName, "financial statement") ||
          StringUtil.contains(cd.documentName, "annual report")
        )
      })
      .map((document: CompanyDocument) => {
        return new CompanyDocument(
          crypto.randomUUID(),
          true,
          document.documentName,
          document.fileUrl,
          document.isFromMyData,
          document.documentDate,
          document.fileId,
          document.totalPages,
          isDisabled,
          isPriority
        )
      })
  }

  getCorporateProfile(documentName: string, isDisabled: boolean, isPriority: boolean): CompanyDocument {
    return new CompanyDocument(
      crypto.randomUUID(),
      true,
      documentName,
      null,
      true,
      this.defaultDocumentDate,
      "",
      5, // can be more
      isDisabled,
      isPriority
    )
  }

  getCertificateOfIncorporation(documentName: string, isDisabled: boolean, isPriority: boolean): CompanyDocument {
    let coi = this.forms.find((cd: Form) => {
      if (!cd.file) {
        return false
      }

      return StringUtil.contains(cd.file.name, StatutoryFormKeywords.COI)
    })

    return new CompanyDocument(
      crypto.randomUUID(),
      false,
      documentName,
      coi?.file?.url ?? null,
      false,
      coi?.createdAt ? new Date(coi?.createdAt) : this.defaultDocumentDate,
      coi?.file?.id ?? "",
      coi?.noOfPages ?? 1,
      isDisabled,
      isPriority
    )
  }

  getLatestSection78(documentName: string, isDisabled: boolean, isPriority: boolean): CompanyDocument | null {
    let selectedDocuments = this.documents.filter((cd: CompanyDocument) => {
      let keyword = StatutoryFormKeywords.S78.split(",")

      return keyword.some((k: string) => {
        return StringUtil.contains(cd.documentName, k)
      })
    })
    if (selectedDocuments.length <= 0) {
      return null
    }

    selectedDocuments.sort((a: CompanyDocument, b: CompanyDocument) => {
      return new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime()
    })

    let latest = selectedDocuments[0]

    return new CompanyDocument(
      crypto.randomUUID(),
      true,
      documentName,
      latest.fileUrl,
      latest.isFromMyData,
      latest.documentDate,
      latest.fileId,
      latest.totalPages,
      isDisabled,
      isPriority
    )
  }

  getAllSection78s(isDisabled: boolean, isPriority: boolean): CompanyDocument[] {
    return this.documents
      .filter((cd: CompanyDocument) => {
        let keyword = StatutoryFormKeywords.S78.split(",")

        return keyword.some((k: string) => {
          return StringUtil.contains(cd.documentName, k)
        })
      })
      .map((doc: CompanyDocument) => {
        return new CompanyDocument(
          crypto.randomUUID(),
          true,
          doc.documentName,
          doc.fileUrl,
          doc.isFromMyData,
          doc.documentDate,
          doc.fileId,
          doc.totalPages,
          isDisabled,
          isPriority
        )
      })
  }

  getSection58(documentName: string, isDisabled: boolean, isPriority: boolean): CompanyDocument | null {
    let selectedDocuments = this.documents.filter((cd: CompanyDocument) => {
      let keyword = StatutoryFormKeywords.S58.split(",")

      return keyword.some((k: string) => {
        return StringUtil.contains(cd.documentName, k)
      })
    })
    if (selectedDocuments.length <= 0) {
      return null
    }

    selectedDocuments.sort((a: CompanyDocument, b: CompanyDocument) => {
      return new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime()
    })

    let latest = selectedDocuments[0]

    return new CompanyDocument(
      crypto.randomUUID(),
      true,
      documentName,
      latest.fileUrl,
      latest.isFromMyData,
      latest.documentDate,
      latest.fileId,
      latest.totalPages,
      isDisabled,
      isPriority
    )
  }

  getAllSection58s(isDisabled: boolean, isPriority: boolean): CompanyDocument[] {
    return this.documents
      .filter((cd: CompanyDocument) => {
        let keyword = StatutoryFormKeywords.S58.split(",")

        return keyword.some((k: string) => {
          return StringUtil.contains(cd.documentName, k)
        })
      })
      .map((doc: CompanyDocument) => {
        return new CompanyDocument(
          crypto.randomUUID(),
          true,
          doc.documentName,
          doc.fileUrl,
          doc.isFromMyData,
          doc.documentDate,
          doc.fileId,
          doc.totalPages,
          isDisabled,
          isPriority
        )
      })
  }

  getSection14(documentName: string, isDisabled: boolean, isPriority: boolean): CompanyDocument {
    let s14 = this.forms.find((cd: Form) => {
      let keyword = StatutoryFormKeywords.S14.split(",")

      return keyword.some((k: string) => {
        if (!cd.file) {
          return false
        }

        return StringUtil.contains(cd.file.name, k)
      })
    })

    return new CompanyDocument(
      crypto.randomUUID(),
      false,
      documentName,
      s14?.file?.url ?? null,
      false,
      s14?.createdAt ? new Date(s14?.createdAt) : this.defaultDocumentDate,
      s14?.file?.id ?? "",
      s14?.noOfPages ?? 1,
      isDisabled,
      isPriority
    )
  }

  getSection15(documentName: string, isDisabled: boolean, isPriority: boolean): CompanyDocument {
    let s15 = this.forms.find((cd: Form) => {
      let keyword = StatutoryFormKeywords.S15.split(",")

      return keyword.some((k: string) => {
        if (!cd.file) {
          return false
        }

        return StringUtil.contains(cd.file.name, k)
      })
    })

    return new CompanyDocument(
      crypto.randomUUID(),
      false,
      documentName,
      s15?.file?.url ?? null,
      false,
      s15?.createdAt ? new Date(s15?.createdAt) : this.defaultDocumentDate,
      s15?.file?.id ?? "",
      s15?.noOfPages ?? 1,
      isDisabled,
      isPriority
    )
  }

  getBankAccountResolutions(isDisabled: boolean, isPriority: boolean): CompanyDocument[] {
    let selectedDocuments: CompanyDocument[] = []
    let bankAccountOpeningResolutions = this.forms.filter((d: Form) => {
      if (!d.file) {
        return false
      }

      return StringUtil.contains(d.file.name, StatutoryFormKeywords.BankAccountResolution)
    })

    if (bankAccountOpeningResolutions.length > 0) {
      bankAccountOpeningResolutions.forEach((d: Form) => {
        let documentDate = d.createdAt ? new Date(d.createdAt) : this.defaultDocumentDate
        selectedDocuments.push(
          new CompanyDocument(
            crypto.randomUUID(),
            true,
            d.file?.name ?? "Resolution to Open New Bank Account",
            d.file?.url ?? null,
            false,
            documentDate,
            d.file?.id ?? "",
            d.noOfPages ?? 1,
            isDisabled,
            isPriority
          )
        )
      })
    }

    return selectedDocuments
  }

  getSection46(documentName: string, isDisabled: boolean, isPriority: boolean): CompanyDocument | null {
    let selectedDocuments = this.documents.filter((cd: CompanyDocument) => {
      let keyword = StatutoryFormKeywords.S46.split(",")

      return keyword.some((k: string) => {
        return StringUtil.contains(cd.documentName, k)
      })
    })
    if (selectedDocuments.length <= 0) {
      return null
    }

    selectedDocuments.sort((a: CompanyDocument, b: CompanyDocument) => {
      return new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime()
    })

    let latest = selectedDocuments[0]

    return new CompanyDocument(
      crypto.randomUUID(),
      true,
      documentName,
      latest.fileUrl,
      latest.isFromMyData,
      latest.documentDate,
      latest.fileId,
      latest.totalPages,
      isDisabled,
      isPriority
    )
  }

  getSection51(documentName: string, isDisabled: boolean, isPriority: boolean): CompanyDocument | null {
    let selectedDocuments = this.documents.filter((cd: CompanyDocument) => {
      let keyword = StatutoryFormKeywords.S51.split(",")

      return keyword.some((k: string) => {
        return StringUtil.contains(cd.documentName, k)
      })
    })
    if (selectedDocuments.length <= 0) {
      return null
    }

    selectedDocuments.sort((a: CompanyDocument, b: CompanyDocument) => {
      return new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime()
    })

    let latest = selectedDocuments[0]

    return new CompanyDocument(
      crypto.randomUUID(),
      true,
      documentName,
      latest.fileUrl,
      latest.isFromMyData,
      latest.documentDate,
      latest.fileId,
      latest.totalPages,
      isDisabled,
      isPriority
    )
  }

  getPD2(documentName: string, isDisabled: boolean, isPriority: boolean): CompanyDocument | null {
    let selectedDocuments = this.documents.filter((cd: CompanyDocument) => {
      let keyword = StatutoryFormKeywords.PD2.split(",")

      return keyword.some((k: string) => {
        return StringUtil.contains(cd.documentName, k)
      })
    })
    if (selectedDocuments.length <= 0) {
      return null
    }

    selectedDocuments.sort((a: CompanyDocument, b: CompanyDocument) => {
      return new Date(a.documentDate).getTime() - new Date(b.documentDate).getTime()
    })

    let latest = selectedDocuments[0]

    return new CompanyDocument(
      crypto.randomUUID(),
      true,
      documentName,
      latest.fileUrl,
      latest.isFromMyData,
      latest.documentDate,
      latest.fileId,
      latest.totalPages,
      isDisabled,
      isPriority
    )
  }
}
