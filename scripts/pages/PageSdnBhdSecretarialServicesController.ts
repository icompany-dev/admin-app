import { PageController } from "~/scripts/pages/PageController"
import { PropsBreadCrumb, PropsBreadCrumbItem } from "../props/PropsBreadCrumb"
import { PropsTableFilter, PropsDataDateFilter, PropsDataOrders } from "../props/PropsTableFilter"
import { CompanyConstants } from "~/scripts/constants/Company"
import { ServiceName, ServiceNames } from "../constants/ServiceNames"
import { StringUtil } from "../utils/String"
import { PropsSecretarialServices } from "../props/PropsSecretarialServices"

export class PageSdnBhdSecretarialServicesController extends PageController {
  targetName: Ref<string> = ref<string>("")

  searchText: Ref<string> = ref<string>("")
  sortOrder: Ref<string> = ref<string>("asc")
  isIncludeDemo: Ref<boolean> = ref<boolean>(false)

  route = useRoute()

  constructor() {
    let title: string = "Secretarial Services - iCompany Malaysia"
    let description: string = "Secretarial Services"

    super(title, description, "Secretarial Services")

    this.setTitleDescription()
  }

  onSearchInput(searchInput: string): void {
    this.searchText.value = searchInput
  }

  onSortOrderChanged(data: PropsDataOrders): void {
    if (data.orderColumn === this.sortOrderLabel) {
      this.sortOrder.value = data.sortOrder ? "desc" : "asc"
      return
    }

    if (data.orderColumn === "Show Demo") {
      this.isIncludeDemo.value = data.sortOrder ? true : false
      return
    }
  }

  setTitleDescription(): void {
    this.setTargetName()
    this.setPageAlias()
    this.setSeoMetadata(`My Sdn Bhd, ${this.pageAlias} - iCompany`, this.pageAlias)
    this.addPageViewLog()
  }

  setTargetName(): void {
    let serviceTarget = ServiceNames.names.find((name: ServiceName) => {
      return name.link !== null && name.link === this.serviceName
    })

    if (!serviceTarget) {
      this.targetName.value = "404"
      return
    }

    this.targetName.value = serviceTarget.target
  }

  setPageAlias() {
    if (StringUtil.isNullOrEmpty(this.targetName.value)) {
      return
    }

    switch (this.targetName.value) {
      case CompanyConstants.TARGET_AMENDMENT_ADDRESS:
        this.pageAlias = "Change Business Address"
        break
      case CompanyConstants.TARGET_AMENDMENT_BRANCH:
        this.pageAlias = "Add/Change/Remove Business Branch Address"
        break
      case CompanyConstants.TARGET_AMENDMENT_CONSTITUTION:
        this.pageAlias = "Adopt / Amend / Abolish Constitution"
        break
      case CompanyConstants.TARGET_AMENDMENT_DESCRIPTION:
        this.pageAlias = "Change Business Nature"
        break
      case CompanyConstants.TARGET_AMENDMENT_NAME:
        this.pageAlias = "Change Business Name"
        break
      case CompanyConstants.TARGET_AUDIT_CIRCULATION:
        this.pageAlias = "Financial Statement Circulation"
        break
      case CompanyConstants.TARGET_AUDIT_EXTENSION_OF_TIME:
        this.pageAlias = "Extension of Time to Circulate and/or Lodge Financial Statement"
        break
      case CompanyConstants.TARGET_COMMON_SEAL:
        this.pageAlias = "Adopt Common Seal"
        break
      case CompanyConstants.TARGET_CONTRACT_ENTER:
        this.pageAlias = "Contracts & Agreements"
        break
      case CompanyConstants.TARGET_DELEGATION_OF_AUTHORITY:
        this.pageAlias = "Delegation of Authority"
        break
      case CompanyConstants.TARGET_DIRECTOR_APPOINTMENT:
        this.pageAlias = "Appoint New Director"
        break
      case CompanyConstants.TARGET_DIRECTOR_LOAN:
        this.pageAlias = "Loan to Director"
        break
      case CompanyConstants.TARGET_DIRECTOR_CHAIRMAN_APPOINTMENT:
        this.pageAlias = "Appoint Chairperson"
        break
      case CompanyConstants.TARGET_DIRECTOR_MANAGER_APPOINTMENT:
        this.pageAlias = "Appoint a CEO"
        break
      case CompanyConstants.TARGET_DIRECTOR_RESIGNATION:
        this.pageAlias = "Resign as Director"
        break
      case CompanyConstants.TARGET_SECTION_47:
        this.pageAlias = "Declare document not kept in registered address"
        break
      case CompanyConstants.TARGET_AUDITOR_APPOINTMENT:
        this.pageAlias = "Appointment of Auditor"
        break
      case CompanyConstants.TARGET_SET_FINANCIAL_YEAR_END:
        this.pageAlias = "Set/Change Financial Year End"
        break
      case CompanyConstants.TARGET_DIVIDEND_DECLARATION:
        this.pageAlias = "Dividend Declaration"
        break
      case CompanyConstants.TARGET_FINANCIAL_STATEMENT_AUTHORISED_PERSON:
        this.pageAlias = "Appoint Authorised Persons for Financial Statements"
        break
      case CompanyConstants.TARGET_LODGE_ANNUAL_RETURN:
        this.pageAlias = "Lodge Annual Return"
        break
      case CompanyConstants.TARGET_NO_CONSTITUTION:
        this.pageAlias = "Declaration of No Constitution"
        break
      case CompanyConstants.TARGET_OPEN_BANK_ACCOUNT:
        this.pageAlias = "Open New Bank Account"
        break
      case CompanyConstants.TARGET_OPEN_BANK_ACCOUNT:
        this.pageAlias = "Purchase of Asset"
        break
      case CompanyConstants.TARGET_SET_FINANCIAL_YEAR_END:
        this.pageAlias = "Set / Change Financial Year End"
        break
      // case CompanyConstants.TARGET_SHARE_TRANSMISSION:
      //   this.pageAlias = "Transmission of Shares"
      //   break
      case CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_ALLOTMENT:
        this.pageAlias = "Propose Allotmnent of Shares"
        break
      case CompanyConstants.TARGET_SHAREHOLDER_ALLOTMENT_OF_SHARES:
        this.pageAlias = "Allotment of Shares"
        break
      case CompanyConstants.TARGET_SHAREHOLDER_PROPOSE_TRANSFER:
        this.pageAlias = "Propose Transfer of Shares"
        break
      case CompanyConstants.TARGET_SHAREHOLDER_POST_SHARE_TRANSFER:
        this.pageAlias = "Register / Delay / Refuse Transfer of Shares"
        break
      case CompanyConstants.TARGET_SUBSCRIBE_BUSINESS_ADDRESS:
        this.pageAlias = "Use of iCompany Business Address"
        break
      case CompanyConstants.TARGET_SWITCH_OUT:
        this.pageAlias = "Switch Out"
        break
      case CompanyConstants.TARGET_AMENDMENT_REGISTERED_ADDRESS:
        this.pageAlias = "Change of Registered Address"
        break
      case CompanyConstants.TARGET_CLOSE_BANK_ACCOUNT:
        this.pageAlias = "Terminate Bank Account"
        break
      // case CompanyConstants.TARGET_CHANGE_BANK_SIGNATORY:
      //   this.pageAlias = "Change Bank Account Signatory"
      //   break
    }
  }

  onClearSelected(): void {
    //
  }

  get serviceName(): string {
    return Array.isArray(this.route.params.service_name)
      ? this.route.params.service_name[0]
      : this.route.params.service_name
  }

  get breadCrumbProps(): PropsBreadCrumb {
    return new PropsBreadCrumb([new PropsBreadCrumbItem("Services", ""), new PropsBreadCrumbItem(this.pageAlias, "")])
  }

  get sortOrderLabel(): string {
    return this.sortOrder.value === "asc" ? "By A/Z" : "By Z/A"
  }

  get propsDataOrders(): PropsDataOrders[] {
    return [new PropsDataOrders(this.sortOrderLabel, "asc"), new PropsDataOrders("Show Demo", "false")]
  }

  get tableFilterProps(): PropsTableFilter {
    return new PropsTableFilter(
      true,
      this.searchText.value,
      true,
      this.propsDataOrders,
      false,
      new PropsDataDateFilter("", "", ""),
      false
    )
  }

  get secretarialServicesProps(): PropsSecretarialServices {
    return new PropsSecretarialServices(this.searchText.value, this.isIncludeDemo.value, this.targetName.value)
  }
}
