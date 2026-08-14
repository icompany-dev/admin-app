import { CompanyBankAccountClosure } from "~/scripts/models/CompanyBankAccountClosure"
import { Company } from "~/scripts/models/Company"
import { Director } from "~/scripts/models/Director"
import { DocumentTemplate } from "~/scripts/models/DocumentTemplate"
import { ResolutionController } from "./ResolutionController"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import { TemplateProcessor } from "~/scripts/library/TemplateProcessor"
import { Shareholder } from "~/scripts/models/Shareholder"
import { CompanyBank } from "~/scripts/models/CompanyBank"
import { Filter } from "~/scripts/library/Filter"
import { Bank } from "~/scripts/models/Bank"
import { BankBranch } from "~/scripts/models/BankBranch"
import { ObjectUtil } from "~/scripts/utils/Object"
import type { State } from "~/scripts/models/Location"

export class DcrClosureOfBankAccountController extends ResolutionController<CompanyBankAccountClosure> {
  companyBankAccountClosureRepository = useCompanyBankAccountClosureStore()
  companyRepository = useCompanyStore()
  documentTemplateRepository = useDocumentTemplateStore()

  banks: Ref<Bank[]> = ref<Bank[]>([])
  bankBranchSearchText: Ref<string> = ref<string>("")
  showBranchOption: Ref<boolean> = ref<boolean>(false)

  companyBankId: Ref<string | null> = ref<string | null>(null)
  companyBank = ref<CompanyBank | null>(null)

  directors = ref<Director[]>([])
  shareholders = ref<Shareholder[]>([])

  companyBanks = ref<CompanyBank[]>([])

  documentTemplate = ref<DocumentTemplate>(new DocumentTemplate())

  originalTemplateContent: string = ""

  private documentTemplateId: string = "bfbad03b-45fe-41fb-a9d2-6cc6f7f8372b"

  constructor(props: IPropsResolutionDocument<CompanyBankAccountClosure>, emitEvents: any | null) {
    super(
      props.companyId,
      props.applicationId,
      props.application,
      CompanyBankAccountClosure,
      props.isInPreviewMode,
      true,
      false,
      props.showWatermark,
      props.watermarkText,
      emitEvents
    )

    this.signatureStartOnPage.value = 1
    this.maxSignatureOnFirstPage.value = 2
    this.maxSignatureOnOtherPages.value = 6
    this.companyBankId.value = props.companyBankId
  }

  async setCompanyBankId(companyBankId: string | null): Promise<void> {
    this.companyBankId.value = companyBankId

    await this.fetchCompanyBank()
    this.setContent()
  }

  async setApplicationId(id: string | null): Promise<void> {
    if (StringUtil.isNullOrEmpty(id)) {
      await this.setApplication()
      return
    } else {
      await this.fetchApplication(id ?? "")
    }
  }

  async fetchApplication(id: string): Promise<void> {
    let response = await this.companyBankAccountClosureRepository.fetch(id)
    if (!this.companyBankAccountClosureRepository.error && response !== null) {
      this.application.value = new CompanyBankAccountClosure(response)
      this.initializeData()
    }
  }

  async setApplication(): Promise<void> {
    if (this.application.value && !StringUtil.isNullOrEmpty(this.application.value.id)) {
      return
    }

    let response = await this.companyRepository.fetch(this.companyId.value)
    let company = new Company(response)
    if (!this.companyRepository.error) {
      this.application.value = new CompanyBankAccountClosure()
      this.application.value.companyId = this.companyId.value
      this.application.value.company = new Company(company)
      this.initializeData()
    }
  }

  async fetchDocumentTemplate(): Promise<void> {
    try {
      let response = await this.documentTemplateRepository.fetch(this.documentTemplateId)
      if (this.documentTemplateRepository.error) {
        throw this.documentTemplateRepository.error
      }

      this.documentTemplate.value = new DocumentTemplate(response)
      this.originalTemplateContent = this.documentTemplate.value.content
    } catch (e) {
      if (e instanceof Error) {
        e.handle()
      } else {
        let errorMessage: Error = new Error("", "")
        errorMessage.setForFetch()
        errorMessage.handle()
      }
    }
  }

  async otherDataInitiation(): Promise<void> {
    let promises = [this.fetchShareholders(), this.fetchCompanyBanks(), this.fetchBanks()]

    if (!StringUtil.isNullOrEmpty(this.companyBankId.value)) {
      promises.push(this.fetchCompanyBank())
    }

    await Promise.all(promises)
  }

  async fetchShareholders(): Promise<void> {
    let response = await this.shareholderRepository.fetchAllForCompany(this.companyId.value)
    this.shareholders.value = response.map((s: any) => {
      return new Shareholder(s)
    })
  }

  async fetchCompanyBanks(): Promise<void> {
    let repository = useCompanyBankStore()
    let filter = new Filter()
    filter.companyId = this.companyId.value
    filter.takeAll = true

    let response = await repository.fetchAll(filter)
    this.companyBanks.value = response.data.map((d: any) => {
      return new CompanyBank(d)
    })
  }

  async fetchCompanyBank(): Promise<void> {
    if (!this.companyBankId.value || StringUtil.isNullOrEmpty(this.companyBankId.value)) {
      this.companyBank.value = null
      return
    }

    let repository = useCompanyBankStore()
    let response = await repository.fetch(this.companyBankId.value)
    if (response) {
      this.companyBank.value = new CompanyBank(response)
    }
  }

  async fetchBanks(): Promise<void> {
    let repository = useBankStore()
    let filter = new Filter()
    filter.takeAll = true

    let response = await repository.fetchAll(filter)
    this.banks.value = response.data.map((d: any) => {
      return new Bank(d)
    })

    this.banks.value = ObjectUtil.sort<Bank>(this.banks.value, "name", "asc")
  }

  setContent(): void {
    if (
      this.application.value &&
      this.companyBanks.value.length > 1 &&
      StringUtil.isNullOrEmpty(this.application.value.transferToBeneficiary)
    ) {
      this.application.value.transferToBeneficiary = this.companyName()
    }

    this.resolutionContent.value = this.getContent()
  }

  getBankNameOptions(): string {
    if (this.companyBank.value !== null) {
      return this.companyBank.value.bank.name.toUpperCase()
    }

    if (this.isInPreviewMode.value || !this.application.value) {
      return '<span class="value-placeholder">BANK NAME</span>'
    }

    if (this.isDocumentEditable()) {
      if (this.bankNames.length <= 0) {
        return ""
      }

      if (this.bankNames.length === 1) {
        return this.bankNames[0].toUpperCase()
      }

      let options = this.bankNames.map((bankName: string) => {
        let selected = this.application.value && this.application.value.bankName === bankName ? "selected" : ""

        return `
          <option value="${bankName}" ${selected}>
            ${bankName}
          </option>
        `
      })

      return `
        <select name='bankName' id='bankName' placeholder='Select Your Bank' class='form-control in-resolution bank-name'>
          <option></option>
          ${options.join("")}
        </select>
      `
    }

    return this.application.value.bankName
  }

  getBranchOptions(): string {
    if (this.companyBank.value !== null) {
      return this.companyBank.value.bankBranch.name.toUpperCase()
    }

    if (this.isInPreviewMode.value || !this.application.value) {
      return '<span class="value-placeholder">BRANCH NAME</span>'
    }

    if (this.isDocumentEditable()) {
      if (this.bankBranches.length <= 0) {
        return ""
      }

      if (this.bankBranches.length === 1) {
        return this.bankBranches[0].toUpperCase()
      }

      if (this.bankBranches.length <= 5) {
        let options = this.bankBranches.map((branchName: string) => {
          let selected = this.application.value && this.application.value.bankBranch === branchName ? "selected" : ""

          return `
          <option value="${branchName}" ${selected}>
          ${branchName}
          </option>
          `
        })

        return `
        <select name='bankBranch' id='bankBranch' placeholder='Select Your Branch' class='form-control in-resolution bank-branch'>
        ${options.join("")}
        </select>
        `
      }

      let content: string[] = []

      let states = this.selectedBank.branches.map((b: BankBranch) => {
        return b.state
      })
      let uniqueStates = new Set(states)
      let orderedStates = ObjectUtil.sort<State>(Array.from(uniqueStates), "name", "asc")

      let stateIds = new Set(
        orderedStates.map((d: State) => {
          return d.id
        })
      )

      stateIds.forEach((stateId: number) => {
        let branchesInState = this.selectedBank.branches.filter((b: BankBranch) => {
          return b.stateId === stateId
        })

        if (branchesInState.length <= 0) {
          return
        }

        branchesInState = ObjectUtil.sort<BankBranch>(branchesInState, "name", "asc")
        let addedNames: string[] = []

        let stateName = branchesInState[0].state.name
        let options = branchesInState
          .map((b: BankBranch) => {
            if (
              !StringUtil.isNullOrEmpty(this.bankBranchSearchText.value) &&
              !StringUtil.contains(b.name, this.bankBranchSearchText.value) &&
              !StringUtil.contains(stateName, this.bankBranchSearchText.value)
            ) {
              return ""
            }

            if (StringUtil.inArray(b.name.trim(), addedNames)) {
              return ""
            }

            addedNames.push(b.name.trim())

            return `<span id='${b.name}' class='branch-to-select dropdown-item'>${b.name}</span>`
          })
          .filter((s: string) => {
            return !StringUtil.isNullOrEmpty(s)
          })

        options = [...new Set(options)]

        if (options.length <= 0) {
          return
        }

        content.push(`
        <span class='dropdown-divider'>${stateName}</span>
        ${options.join("")}
      `)
      })

      let selectedValue = StringUtil.isNullOrEmpty(this.application?.value?.bankBranch ?? "")
        ? "YOUR SELECTED BRANCH"
        : (this.application.value?.bankBranch ?? "")

      let placeholderClass = StringUtil.isNullOrEmpty(this.application?.value?.bankBranch ?? "")
        ? "value-placeholder"
        : ""

      let showClass = this.showBranchOption.value ? "show" : ""
      let visibleClass = this.showBranchOption.value ? "dropdown-visible" : ""

      return `
      <div class='searchable-dropdown branch-select ${visibleClass}'>
        <div class='selected-value dropdown'>
          <span class='selected-value-name ${placeholderClass}'>${selectedValue}</span>
          <i class='fa-solid fa-caret-down ${this.showBranchOption.value ? "rotate" : ""}'></i>
        </div>
        <div class='dropdown-menu ${showClass}'>
          <input type='text' class='form-control search-field' value='${this.bankBranchSearchText.value}'>
          ${content.join("")}
        </div>
      </div>
    `
    }

    return this.application.value.bankBranch
  }

  getBankAccountNumberOption(): string {
    if (this.companyBank.value !== null) {
      return this.companyBank.value.accountNumber
    }

    if (this.isInPreviewMode.value || !this.application.value) {
      return '<span class="value-placeholder">BANK ACCOUNT NUMBER</span>'
    }

    if (this.isDocumentEditable()) {
      if (this.bankAccountNumbers.length <= 0) {
        return `
          <input 
            type='text' 
            class='form-control in-resolution bank-account-no' 
            name='bankAccountNo'
            id='bankAccountNo' 
            placeholder='Your Bank Account'
            value='${this.application.value.bankAccountNo}'>
        `
      }

      if (this.bankAccountNumbers.length === 1) {
        return this.bankAccountNumbers[0]
      }

      let options = this.bankAccountNumbers.map((bankAccountNumber: string) => {
        let selected =
          this.application.value && this.application.value.bankAccountNo === bankAccountNumber ? "selected" : ""

        return `
          <option value="${bankAccountNumber}" ${selected}>
            ${bankAccountNumber}
          </option>
        `
      })

      return `
        <select name='bankAccountNo' id='bankAccountNo' placeholder='Select Your Bank Account' class='form-control in-resolution bank-account-no'>
          ${options.join("")}
        </select>
      `
    }

    return this.application.value.bankAccountNo
  }

  getBankName(): string {
    if (this.companyBank.value !== null) {
      return this.companyBank.value.bank.name.toUpperCase()
    }

    if (!this.application.value || StringUtil.isNullOrEmpty(this.application.value.bankName)) {
      return "<span class='value-placeholder'>BANK NAME</span>"
    }

    return this.application.value.bankName.toUpperCase()
  }

  getBankAccountNumber(): string {
    if (this.companyBank.value !== null) {
      return this.companyBank.value.accountNumber
    }

    if (!this.application.value || StringUtil.isNullOrEmpty(this.application.value.bankAccountNo)) {
      return "<span class='value-placeholder'>BANK ACCOUNT NUMBER</span>"
    }

    return this.application.value.bankAccountNo
  }

  getTransferToBeneficiaryOptions(): string {
    if (this.isInPreviewMode.value || !this.application.value) {
      return "<span class='value-placeholder'>NAME OF ACCOUNT TO TRANSFER TO</span>"
    }

    if (this.isDocumentEditable()) {
      if (this.companyBanks.value.length > 1) {
        return this.companyName()
      }

      let options = this.shareholders.value.map((s: Shareholder) => {
        let selected =
          this.application.value && this.application.value.transferToBeneficiary === s.fullName() ? "selected" : ""

        return `
          <option value='${s.fullName()}' ${selected}>
            ${s.fullName()}
          </option>
        `
      })

      return `
        <select name='transferToBeneficiary' id='transferToBeneficiary' class='form-control in-resolution'>
          ${options.join("")}
        </select>
      `
    }

    return this.application.value.transferToBeneficiary
  }

  getTransferToBankNameOptions(): string {
    if (this.isInPreviewMode.value || !this.application.value) {
      return "<span class='value-placeholder'>NAME OF BANK</span>"
    }

    if (this.isDocumentEditable()) {
      if (this.companyBanks.value.length > 1) {
        let companyBanks = this.companyBanks.value.filter((cb: CompanyBank) => {
          if (!this.application.value || StringUtil.isNullOrEmpty(this.application.value.bankName)) {
            return true
          }

          return this.application.value.bankName !== cb.bank.name.toUpperCase()
        })

        if (!StringUtil.isNullOrEmpty(this.application.value.bankAccountNo) && companyBanks.length > 0) {
          companyBanks = companyBanks.filter((cb: CompanyBank) => {
            if (!this.application.value || StringUtil.isNullOrEmpty(this.application.value.bankAccountNo)) {
              return true
            }

            return this.application.value.bankAccountNo !== cb.accountNumber
          })
        }

        let options = companyBanks.map((cb: CompanyBank) => {
          let selected =
            this.application.value && this.application.value.transferToBankName === cb.bank.name.toUpperCase()
              ? "selected"
              : ""

          return `
            <option value='${cb.bank.name.toUpperCase()}' ${selected}>
              ${cb.bank.name.toUpperCase()}
            </option>
          `
        })

        return `
          <select name='transferToBankName' id='transferToBankName' class='form-control in-resolution transfer-to-bank-name'>
            ${options.join("")}
          </select>
        `
      } else {
        let options = this.banks.value.map((b: Bank) => {
          let selected =
            this.application.value && this.application.value.transferToBankName === b.name.toUpperCase()
              ? "selected"
              : ""

          return `
            <option value='${b.name.toUpperCase()}' ${selected}>
              ${b.name.toUpperCase()}
            </option>
          `
        })

        return `
          <select 
            name='transferToBankName' 
            class='form-control in-resolution transfer-to-bank-name'
            placeholder='BANK NAME'
          >
            <option></option>
            ${options.join("")}
          </select>
        `
      }
    }

    return this.application.value.transferToBankName
  }

  getTransferToBankAccountNoOptions(): string {
    if (this.isInPreviewMode.value || !this.application.value) {
      return "<span class='value-placeholder'>BANK ACCOUNT NUMBER</span>"
    }

    if (this.isDocumentEditable()) {
      if (this.companyBanks.value.length > 1) {
        let companyBanks = this.companyBanks.value.filter((cb: CompanyBank) => {
          if (!this.application.value || StringUtil.isNullOrEmpty(this.application.value.bankName)) {
            return true
          }

          return this.application.value.bankName !== cb.bank.name.toUpperCase()
        })

        if (!StringUtil.isNullOrEmpty(this.application.value.bankAccountNo) && companyBanks.length > 0) {
          companyBanks = companyBanks.filter((cb: CompanyBank) => {
            if (!this.application.value || StringUtil.isNullOrEmpty(this.application.value.bankAccountNo)) {
              return true
            }

            return this.application.value.bankAccountNo !== cb.accountNumber
          })
        }

        let options = companyBanks.map((cb: CompanyBank) => {
          let selected =
            this.application.value && this.application.value.transferToBankAccountNo === cb.accountNumber
              ? "selected"
              : ""

          return `
            <option value='${cb.accountNumber}' ${selected}>
              ${cb.accountNumber}
            </option>
          `
        })

        return `
          <select name='transferToBankAccountNo' id='transferToBankAccountNo' class='form-control in-resolution transfer-to-bank-account-no'>
            ${options.join("")}
          </select>
        `
      } else {
        return `<input type='text' 
          name='transferToBankAccountNo' 
          class='form-control in-resolution transfer-to-bank-account-no'
          placeholder='BANK ACCOUNT NUMBER'
          value='${this.application.value.transferToBankAccountNo}'>`
      }
    }

    return this.application.value.transferToBankAccountNo
  }

  getContent(): string {
    this.documentTemplate.value.content = this.originalTemplateContent

    let bankNameSearchString = "$text.&lt;name=bankName&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      bankNameSearchString,
      this.getBankNameOptions()
    )

    let bankBranchSearchString = "$text.&lt;name=bankBranchName&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      bankBranchSearchString,
      this.getBranchOptions()
    )

    let bankAccountNumberSearchString = "$text.&lt;name=bankAccountNumber&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      bankAccountNumberSearchString,
      this.getBankAccountNumberOption()
    )

    let nameSearchString = `%bankName%`
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      nameSearchString,
      this.getBankName()
    )

    let accountNumberSearchString = `%bankAccountNumber%`
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      accountNumberSearchString,
      this.getBankAccountNumber()
    )

    let transferToBeneficiarySearchString = "$text.&lt;name=transferToBeneficiary&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      transferToBeneficiarySearchString,
      this.getTransferToBeneficiaryOptions()
    )

    let transferToBankNameSearchString = "$text.&lt;name=transferToBankName&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      transferToBankNameSearchString,
      this.getTransferToBankNameOptions()
    )

    let transferToBankAccountNoSearchString = "$text.&lt;name=transferToBankAccountNo&gt;$"
    this.documentTemplate.value.content = this.documentTemplate.value.content.replace(
      transferToBankAccountNoSearchString,
      this.getTransferToBankAccountNoOptions()
    )

    let templateProcessor = new TemplateProcessor(this.documentTemplate.value)

    if (this.isInPreviewMode.value) {
      return templateProcessor.getContentForPreview(this.application.value)
    }

    let content = this.isDocumentEditable()
      ? templateProcessor.getContent(this.application.value, this.isInPreviewMode.value)
      : templateProcessor.getContentForPrint(this.application.value)

    return content
  }

  totalPages(): number {
    if (this.directorRepository.isLoading || this.signatureItems.value.length <= 0) {
      return 1
    }

    return (
      this.signatureStartOnPage.value +
      Math.ceil(
        (this.signatureItems.value.length - this.maxSignatureOnFirstPage.value) / this.maxSignatureOnOtherPages.value
      )
    )
  }

  handleBankSelectionChanges(changedValue: string): void {
    if (!this.application.value) {
      return
    }

    if (!StringUtil.isNullOrEmpty(this.application.value.bankName) && changedValue === "name") {
      let companyBanks = this.companyBanks.value.filter((cb: CompanyBank) => {
        if (!this.application.value) {
          return false
        }

        return this.application.value.bankName === cb.bank.name.toUpperCase()
      })

      if (companyBanks.length === 1) {
        this.application.value.bankBranch = companyBanks[0].bankBranch.name
        this.application.value.bankAccountNo = companyBanks[0].accountNumber
      }
    }

    if (!StringUtil.isNullOrEmpty(this.application.value.bankBranch) && changedValue === "branch") {
      let companyBanks = this.companyBanks.value.filter((cb: CompanyBank) => {
        if (!this.application.value) {
          return false
        }

        return this.application.value.bankBranch === cb.bankBranch.name.toUpperCase()
      })

      if (companyBanks.length === 1) {
        this.application.value.bankName = companyBanks[0].bank.name.toUpperCase()
        this.application.value.bankAccountNo = companyBanks[0].accountNumber
      }

      let branch = this.selectedBank.branches.find((b: BankBranch) => {
        return b.name.toUpperCase() === this.application.value?.bankBranch.toUpperCase()
      })
      if (branch) {
        this.application.value.bankAddress = branch.address
      }
    }

    if (!StringUtil.isNullOrEmpty(this.application.value.bankAccountNo) && changedValue === "account") {
      let companyBanks = this.companyBanks.value.filter((cb: CompanyBank) => {
        if (!this.application.value) {
          return false
        }

        return this.application.value.bankAccountNo === cb.accountNumber
      })

      if (companyBanks.length === 1) {
        this.application.value.bankName = companyBanks[0].bank.name.toUpperCase()
        this.application.value.bankBranch = companyBanks[0].bankBranch.name
      }
    }

    if (
      !StringUtil.isNullOrEmpty(this.application.value.bankName) &&
      !StringUtil.isNullOrEmpty(this.application.value.bankBranch) &&
      !StringUtil.isNullOrEmpty(this.application.value.bankAccountNo)
    ) {
      let selectedCompanyBank = this.companyBanks.value.find((cb: CompanyBank) => {
        if (!this.application.value) {
          return false
        }

        return (
          cb.bank.name === this.application.value.bankName &&
          cb.bankBranch.name === this.application.value.bankBranch &&
          cb.accountNumber === this.application.value.bankAccountNo
        )
      })

      this.application.value.companyBankId = selectedCompanyBank?.id ?? ""
    }
  }

  handleBankName(event: Event): void {
    if (!this.application.value) {
      return
    }

    const selectField = event.target as HTMLSelectElement

    this.application.value.bankName = selectField.value
    this.handleBankSelectionChanges("name")

    nextTick(() => {
      this.setContent()
    })
  }

  handlebranchSelectClick(event: Event): void {
    this.showBranchOption.value = !this.showBranchOption.value

    nextTick(() => {
      this.setContent()
    })
  }

  handleSearchSelect(event: Event): void {
    let target = event.target as HTMLInputElement
    let value = target.value

    this.bankBranchSearchText.value = value

    nextTick(() => {
      this.setContent()
    })
  }

  handleBranchSelect(event: Event): void {
    if (this.application.value === null) {
      return
    }

    let target = event.target as HTMLSpanElement
    let value = target.id

    this.application.value.bankBranch = value

    this.showBranchOption.value = false
    nextTick(() => {
      this.setContent()
    })

    this.handleBankSelectionChanges("branch")
  }

  handleBankBranch(event: Event): void {
    if (!this.application.value) {
      return
    }

    const selectField = event.target as HTMLSelectElement

    this.application.value.bankBranch = selectField.value

    this.handleBankSelectionChanges("branch")

    nextTick(() => {
      this.setContent()
    })
  }

  handleBankAccountNo(event: Event): void {
    if (!this.application.value) {
      return
    }

    const selectField = event.target as HTMLInputElement

    this.application.value.bankAccountNo = selectField.value

    this.handleBankSelectionChanges("account")

    nextTick(() => {
      this.setContent()
    })
  }

  handleTransferToBankName(event: Event): void {
    if (!this.application.value) {
      return
    }

    const selectField = event.target as HTMLSelectElement

    this.application.value.transferToBankName = selectField.value

    let matchedCompanyBanks = this.companyBanks.value.filter((cb: CompanyBank) => {
      if (!this.application.value) {
        return false
      }

      return cb.bank.name.toUpperCase() === this.application.value.transferToBankName
    })

    if (matchedCompanyBanks.length === 1) {
      this.application.value.transferToBankAccountNo = matchedCompanyBanks[0].accountNumber
    }

    nextTick(() => {
      this.setContent()
    })
  }

  attachEventListeners(): void {
    if (!this.isDocumentEditable()) {
      return
    }

    const bankNameSelectors = document.querySelectorAll(".bank-name")
    bankNameSelectors.forEach((bs) => {
      bs.removeEventListener("click", this.handleBankName.bind(this))
      bs.addEventListener("click", this.handleBankName.bind(this))
    })

    const branchSelect = document.querySelectorAll(".dropdown")
    branchSelect.forEach((bs) => {
      bs.removeEventListener("click", this.handlebranchSelectClick.bind(this))
      bs.addEventListener("click", this.handlebranchSelectClick.bind(this))
    })

    const branchesToSelect = document.querySelectorAll(".branch-to-select")
    branchesToSelect.forEach((branchToSelect) => {
      branchToSelect.removeEventListener("click", this.handleBranchSelect.bind(this))
      branchToSelect.addEventListener("click", this.handleBranchSelect.bind(this))
    })

    const searchField = document.querySelectorAll(".search-field")
    searchField.forEach((sf) => {
      sf.removeEventListener("change", this.handleSearchSelect.bind(this))
      sf.addEventListener("change", this.handleSearchSelect.bind(this))
    })

    const bankBranchSelectors = document.querySelectorAll(".bank-branch")
    bankBranchSelectors.forEach((bankBranchSelector) => {
      bankBranchSelector.removeEventListener("change", this.handleBankBranch.bind(this))
      bankBranchSelector.addEventListener("change", this.handleBankBranch.bind(this))
    })

    const bankAccountNoSelectors = document.querySelectorAll(".bank-account-no")
    bankAccountNoSelectors.forEach((bankAccountNoSelector) => {
      bankAccountNoSelector.removeEventListener("change", this.handleBankAccountNo.bind(this))
      bankAccountNoSelector.addEventListener("change", this.handleBankAccountNo.bind(this))
    })

    const transferToBankNameSelectors = document.querySelectorAll(".transfer-to-bank-name")
    transferToBankNameSelectors.forEach((transferToBankNameSelector) => {
      transferToBankNameSelector.removeEventListener("change", this.handleTransferToBankName.bind(this))
      transferToBankNameSelector.addEventListener("change", this.handleTransferToBankName.bind(this))
    })
  }

  get bankNames(): string[] {
    if (this.companyBanks.value.length <= 0) {
      return this.banks.value.map((b: Bank) => {
        return b.name.toUpperCase()
      })
    }

    return this.companyBanks.value.map((cb: CompanyBank) => {
      return cb.bank.name.toUpperCase()
    })
  }

  get bankBranches(): string[] {
    if (this.companyBanks.value.length <= 0 && this.banks.value.length > 0) {
      let bank = new Bank()
      if (!this.application.value || StringUtil.isNullOrEmpty(this.application.value.bankName)) {
        bank = this.banks.value[0]
      } else {
        bank =
          this.banks.value.find((b: Bank) => {
            return b.name.toUpperCase() === this.application.value?.bankName.toUpperCase()
          }) ?? this.banks.value[0]
      }

      return bank.branches.map((b: BankBranch) => {
        return b.name.toUpperCase()
      })
    }

    return this.companyBanks.value.map((cb: CompanyBank) => {
      return cb.bankBranch.name.toUpperCase()
    })
  }

  get selectedBank(): Bank {
    if (this.companyBanks.value.length > 0) {
      return new Bank()
    }

    return (
      this.banks.value.find((b: Bank) => {
        return b.name.toUpperCase() === this.application.value?.bankName.toUpperCase()
      }) ?? this.banks.value[0]
    )
  }

  get bankAccountNumbers(): string[] {
    return this.companyBanks.value.map((cb: CompanyBank) => {
      return cb.accountNumber
    })
  }
}
