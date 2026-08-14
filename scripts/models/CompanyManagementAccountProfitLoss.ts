import { ManagementAccountConstants } from "../constants/ManagementAccounts"
import { Error } from "../library/Error"
import { CompanyManagementAccountData } from "./CompanyManagementAccountData"

export class CompanyManagementAccountProfitLoss {
  revenue: CompanyManagementAccountData[] = []
  costOfGoodSold: CompanyManagementAccountData[] = []
  otherIncome: CompanyManagementAccountData[] = []
  administrationExpenses: CompanyManagementAccountData[] = []
  employmentExpenses: CompanyManagementAccountData[] = []
  travellingExpenses: CompanyManagementAccountData[] = []
  maintenanceExpenses: CompanyManagementAccountData[] = []
  generalExpenses: CompanyManagementAccountData[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyManagementAccountProfitLoss) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.revenue =
      data.revenue?.length > 0
        ? data.revenue.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.costOfGoodSold =
      data.cost_of_good_sold?.length > 0
        ? data.cost_of_good_sold.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.otherIncome =
      data.other_income?.length > 0
        ? data.other_income.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []

    this.administrationExpenses =
      data.administration_expenses?.length > 0
        ? data.administration_expenses.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.employmentExpenses =
      data.employment_expenses?.length > 0
        ? data.employment_expenses.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.travellingExpenses =
      data.travelling_expenses?.length > 0
        ? data.travelling_expenses.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.maintenanceExpenses =
      data.maintenance_expenses?.length > 0
        ? data.maintenance_expenses.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.generalExpenses =
      data.general_expenses?.length > 0
        ? data.general_expenses.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
  }

  clone(data: CompanyManagementAccountProfitLoss): void {
    this.revenue = data.revenue
    this.costOfGoodSold = data.costOfGoodSold
    this.otherIncome = data.otherIncome
    this.administrationExpenses = data.administrationExpenses
    this.employmentExpenses = data.employmentExpenses
    this.travellingExpenses = data.travellingExpenses
    this.maintenanceExpenses = data.maintenanceExpenses
    this.generalExpenses = data.generalExpenses
  }

  getRequestBody(): object {
    return {
      revenue: this.revenue.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
      cost_of_good_sold: this.costOfGoodSold.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
      other_income: this.otherIncome.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
      administration_expenses: this.administrationExpenses.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
      employment_expenses: this.employmentExpenses.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
      travelling_expenses: this.travellingExpenses.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
      maintenance_expenses: this.maintenanceExpenses.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
      general_expenses: this.generalExpenses.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
    }
  }

  isTheSame(record: CompanyManagementAccountProfitLoss): boolean {
    return (
      this.areItemsTheSame(this.revenue, record.revenue) &&
      this.areItemsTheSame(this.costOfGoodSold, record.costOfGoodSold) &&
      this.areItemsTheSame(this.otherIncome, record.otherIncome) &&
      this.areItemsTheSame(this.administrationExpenses, record.administrationExpenses) &&
      this.areItemsTheSame(this.employmentExpenses, record.employmentExpenses) &&
      this.areItemsTheSame(this.travellingExpenses, record.travellingExpenses) &&
      this.areItemsTheSame(this.maintenanceExpenses, record.maintenanceExpenses) &&
      this.areItemsTheSame(this.generalExpenses, record.generalExpenses)
    )
  }

  areItemsTheSame(itemsA: CompanyManagementAccountData[], itemsB: CompanyManagementAccountData[]): boolean {
    return (
      itemsA.every((a: CompanyManagementAccountData) => {
        return itemsB.some((b: CompanyManagementAccountData) => {
          return b.isTheSame(a)
        })
      }) &&
      itemsB.every((b: CompanyManagementAccountData) => {
        return itemsA.some((a: CompanyManagementAccountData) => {
          return a.isTheSame(b)
        })
      })
    )
  }

  getList(target: string): CompanyManagementAccountData[] {
    switch (target) {
      case ManagementAccountConstants.CONTENT_TYPE_REVENUE:
        return this.revenue
      case ManagementAccountConstants.CONTENT_TYPE_COGS:
        return this.costOfGoodSold
      case ManagementAccountConstants.CONTENT_TYPE_OTHER_INCOME:
        return this.otherIncome
      case ManagementAccountConstants.CONTENT_TYPE_ADMIN_EXPENSES:
        return this.administrationExpenses
      case ManagementAccountConstants.CONTENT_TYPE_EMPLOYMENT_EXPENSES:
        return this.employmentExpenses
      case ManagementAccountConstants.CONTENT_TYPE_TRAVELLING_EXPENSES:
        return this.travellingExpenses
      case ManagementAccountConstants.CONTENT_TYPE_MAINTENANCE_EXPENSES:
        return this.maintenanceExpenses
      case ManagementAccountConstants.CONTENT_TYPE_GENERAL_EXPENSES:
        return this.generalExpenses
      default:
        return []
    }
  }

  setList(target: string, list: CompanyManagementAccountData[]): void {
    switch (target) {
      case ManagementAccountConstants.CONTENT_TYPE_REVENUE:
        this.revenue = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_COGS:
        this.costOfGoodSold = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_OTHER_INCOME:
        this.otherIncome = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_ADMIN_EXPENSES:
        this.administrationExpenses = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_EMPLOYMENT_EXPENSES:
        this.employmentExpenses = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_TRAVELLING_EXPENSES:
        this.travellingExpenses = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_MAINTENANCE_EXPENSES:
        this.maintenanceExpenses = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_GENERAL_EXPENSES:
        this.generalExpenses = list
        break
    }
  }

  add(target: string): void {
    if (!ManagementAccountConstants.PROFIT_LOSS_CONTENT_TYPES.includes(target)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }
    const data = new CompanyManagementAccountData()
    this.getList(target).push(data)
  }

  remove(target: string, id: string): void {
    if (!ManagementAccountConstants.PROFIT_LOSS_CONTENT_TYPES.includes(target)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }

    let targetList = this.getList(target)
    const list = targetList.filter((item: CompanyManagementAccountData) => {
      return item.id !== id
    })
    this.setList(target, list)
  }

  isEmpty(): boolean {
    return (
      this.revenue?.length <= 0 &&
      this.costOfGoodSold?.length <= 0 &&
      this.otherIncome?.length <= 0 &&
      this.administrationExpenses?.length <= 0 &&
      this.employmentExpenses?.length <= 0 &&
      this.travellingExpenses?.length <= 0 &&
      this.maintenanceExpenses?.length <= 0 &&
      this.generalExpenses?.length <= 0
    )
  }

  hasExpensess(): boolean {
    return (
      this.administrationExpenses.length > 0 ||
      this.employmentExpenses.length > 0 ||
      this.travellingExpenses.length > 0 ||
      this.maintenanceExpenses.length > 0 ||
      this.generalExpenses.length > 0
    )
  }

  numberOfExpenseItem(): number {
    return (
      this.administrationExpenses?.length +
      this.employmentExpenses?.length +
      this.travellingExpenses?.length +
      this.maintenanceExpenses?.length +
      this.generalExpenses?.length
    )
  }

  numberOfItems(): number {
    return (
      this.revenue?.length +
      this.costOfGoodSold?.length +
      this.otherIncome?.length +
      this.administrationExpenses?.length +
      this.employmentExpenses?.length +
      this.travellingExpenses?.length +
      this.maintenanceExpenses?.length +
      this.generalExpenses?.length
    )
  }

  // Get Total
  getTotalRevenue(): number {
    const total = this.revenue.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0.0)
    return parseFloat(total.toFixed(2))
  }

  getTotalCostOfGoodSold(): number {
    const total = this.costOfGoodSold.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0.0)
    return parseFloat(total.toFixed(2))
  }

  getTotalOtherIncome(): number {
    const total = this.otherIncome.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0.0)
    return parseFloat(total.toFixed(2))
  }

  getTotalAdministrationExpenses(): number {
    const total = this.administrationExpenses.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0.0)
    return parseFloat(total.toFixed(2))
  }

  getTotalEmploymentExpenses(): number {
    const total = this.employmentExpenses.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0.0)
    return parseFloat(total.toFixed(2))
  }

  getTotalTravellingExpenses(): number {
    const total = this.travellingExpenses.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0.0)
    return parseFloat(total.toFixed(2))
  }

  getTotalMaintenanceExpenses(): number {
    const total = this.maintenanceExpenses.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0.0)
    return parseFloat(total.toFixed(2))
  }

  getTotalGeneralExpenses(): number {
    const total = this.generalExpenses.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0.0)
    return parseFloat(total.toFixed(2))
  }

  getTotalExpenses(): number {
    const total =
      this.getTotalAdministrationExpenses() +
      this.getTotalEmploymentExpenses() +
      this.getTotalTravellingExpenses() +
      this.getTotalMaintenanceExpenses() +
      this.getTotalGeneralExpenses()
    return parseFloat(total.toFixed(2))
  }

  getTotalGrossProfit(): number {
    const total = this.getTotalRevenue() - this.getTotalCostOfGoodSold()
    return parseFloat(total.toFixed(2))
  }

  getTotalProfitBeforeTax(): number {
    const total = this.getTotalGrossProfit() + this.getTotalOtherIncome() - this.getTotalExpenses()
    return parseFloat(total.toFixed(2))
  }

  // Validation
  isRevenueValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }

    return this.revenue.every((item) => {
      return item.isDataValid(checkValidity)
    })
  }

  isCostOfGoodSoldValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }

    return this.costOfGoodSold.every((item) => {
      return item.isDataValid(checkValidity)
    })
  }

  isOtherIncomeValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }

    return this.otherIncome.every((item) => {
      return item.isDataValid(checkValidity)
    })
  }

  isExpensesValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }

    const administrationExpenses = this.administrationExpenses.every((item) => {
      return item.isDataValid(checkValidity)
    })
    const employmentExpenses = this.employmentExpenses.every((item) => {
      return item.isDataValid(checkValidity)
    })
    const travellingExpenses = this.travellingExpenses.every((item) => {
      return item.isDataValid(checkValidity)
    })
    const maintenanceExpenses = this.maintenanceExpenses.every((item) => {
      return item.isDataValid(checkValidity)
    })
    const generalExpenses = this.generalExpenses.every((item) => {
      return item.isDataValid(checkValidity)
    })

    return administrationExpenses && employmentExpenses && travellingExpenses && maintenanceExpenses && generalExpenses
  }

  canSubmit(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }

    return (
      this.isRevenueValid(checkValidity) &&
      this.isCostOfGoodSoldValid(checkValidity) &&
      this.isOtherIncomeValid(checkValidity) &&
      this.isExpensesValid(checkValidity)
    )
  }
}
