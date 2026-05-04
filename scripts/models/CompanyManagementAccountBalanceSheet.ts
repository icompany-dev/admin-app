import { ManagementAccountConstants } from "../constants/ManagementAccounts"
import { Error } from "../library/Error"
import { CompanyManagementAccountData } from "./CompanyManagementAccountData"

export class CompanyManagementAccountBalanceSheet {
  bankCash: CompanyManagementAccountData[] = []
  currentAssets: CompanyManagementAccountData[] = []
  propertyPlantEquipment: CompanyManagementAccountData[] = []
  motorVehicle: CompanyManagementAccountData[] = []
  furnituresFittings: CompanyManagementAccountData[] = []
  computerSoftware: CompanyManagementAccountData[] = []
  renovation: CompanyManagementAccountData[] = []
  otherAssets: CompanyManagementAccountData[] = []
  currentLiabilities: CompanyManagementAccountData[] = []
  accruals: CompanyManagementAccountData[] = []
  corporateFinancing: CompanyManagementAccountData[] = []
  hirePurchase: CompanyManagementAccountData[] = []
  otherLiabilities: CompanyManagementAccountData[] = []
  equity: CompanyManagementAccountData[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof CompanyManagementAccountBalanceSheet) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.bankCash =
      data.bank_cash?.length > 0
        ? data.bank_cash.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.currentAssets =
      data.current_assets?.length > 0
        ? data.current_assets.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.propertyPlantEquipment =
      data.property_plant_equipment?.length > 0
        ? data.property_plant_equipment.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.motorVehicle =
      data.motor_vehicle?.length > 0
        ? data.motor_vehicle.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.furnituresFittings =
      data.furnitures_fittings?.length > 0
        ? data.furnitures_fittings.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.computerSoftware =
      data.computer_software?.length > 0
        ? data.computer_software.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.renovation =
      data.renovation?.length > 0
        ? data.renovation.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.otherAssets =
      data.other_assets?.length > 0
        ? data.other_assets.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.currentLiabilities =
      data.current_liabilities?.length > 0
        ? data.current_liabilities.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.accruals =
      data.accruals?.length > 0
        ? data.accruals.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.corporateFinancing =
      data.corporate_financing?.length > 0
        ? data.corporate_financing.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.hirePurchase =
      data.hire_purchase?.length > 0
        ? data.hire_purchase.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.otherLiabilities =
      data.other_liabilities?.length > 0
        ? data.other_liabilities.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
    this.equity =
      data.equity?.length > 0
        ? data.equity.map((val: any) => {
            return new CompanyManagementAccountData(val)
          })
        : []
  }

  clone(data: CompanyManagementAccountBalanceSheet): void {
    this.bankCash = data.bankCash.map((val: CompanyManagementAccountData) => {
      return new CompanyManagementAccountData(val)
    })
    this.currentAssets = data.currentAssets.map((val: CompanyManagementAccountData) => {
      return new CompanyManagementAccountData(val)
    })
    this.propertyPlantEquipment = data.propertyPlantEquipment.map((val: CompanyManagementAccountData) => {
      return new CompanyManagementAccountData(val)
    })
    this.motorVehicle = data.motorVehicle.map((val: CompanyManagementAccountData) => {
      return new CompanyManagementAccountData(val)
    })
    this.furnituresFittings = data.furnituresFittings.map((val: CompanyManagementAccountData) => {
      return new CompanyManagementAccountData(val)
    })
    this.computerSoftware = data.computerSoftware.map((val: CompanyManagementAccountData) => {
      return new CompanyManagementAccountData(val)
    })
    this.renovation = data.renovation.map((val: CompanyManagementAccountData) => {
      return new CompanyManagementAccountData(val)
    })
    this.otherAssets = data.otherAssets.map((val: CompanyManagementAccountData) => {
      return new CompanyManagementAccountData(val)
    })
    this.currentLiabilities = data.currentLiabilities.map((val: CompanyManagementAccountData) => {
      return new CompanyManagementAccountData(val)
    })
    this.accruals = data.accruals.map((val: CompanyManagementAccountData) => {
      return new CompanyManagementAccountData(val)
    })
    this.corporateFinancing = data.corporateFinancing.map((val: CompanyManagementAccountData) => {
      return new CompanyManagementAccountData(val)
    })
    this.hirePurchase = data.hirePurchase.map((val: CompanyManagementAccountData) => {
      return new CompanyManagementAccountData(val)
    })
    this.otherLiabilities = data.otherLiabilities.map((val: CompanyManagementAccountData) => {
      return new CompanyManagementAccountData(val)
    })
    this.equity = data.equity.map((val: CompanyManagementAccountData) => {
      return new CompanyManagementAccountData(val)
    })
  }

  getRequestBody(): object {
    return {
      bank_cash: this.bankCash.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
      current_assets: this.currentAssets.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),

      property_plant_equipment: this.propertyPlantEquipment.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
      motor_vehicle: this.motorVehicle.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
      furnitures_fittings: this.furnituresFittings.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
      computer_software: this.computerSoftware.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
      renovation: this.renovation.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),

      other_assets: this.otherAssets.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),

      current_liabilities: this.currentLiabilities.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
      accruals: this.accruals.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),

      corporate_financing: this.corporateFinancing.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
      hire_purchase: this.hirePurchase.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),

      other_liabilities: this.otherLiabilities.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),

      equity: this.equity.map((item: CompanyManagementAccountData) => {
        return item.getRequestBody()
      }),
    }
  }

  isTheSame(record: CompanyManagementAccountBalanceSheet): boolean {
    return (
      this.areItemsTheSame(this.bankCash, record.bankCash) &&
      this.areItemsTheSame(this.currentAssets, record.currentAssets) &&
      this.areItemsTheSame(this.propertyPlantEquipment, record.propertyPlantEquipment) &&
      this.areItemsTheSame(this.motorVehicle, record.motorVehicle) &&
      this.areItemsTheSame(this.furnituresFittings, record.furnituresFittings) &&
      this.areItemsTheSame(this.computerSoftware, record.computerSoftware) &&
      this.areItemsTheSame(this.renovation, record.renovation) &&
      this.areItemsTheSame(this.otherAssets, record.otherAssets) &&
      this.areItemsTheSame(this.currentLiabilities, record.currentLiabilities) &&
      this.areItemsTheSame(this.accruals, record.accruals) &&
      this.areItemsTheSame(this.corporateFinancing, record.corporateFinancing) &&
      this.areItemsTheSame(this.hirePurchase, record.hirePurchase) &&
      this.areItemsTheSame(this.otherLiabilities, record.otherLiabilities) &&
      this.areItemsTheSame(this.equity, record.equity)
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

  isEmpty(): boolean {
    return (
      this.currentAssets.length <= 0 &&
      this.bankCash.length <= 0 &&
      this.propertyPlantEquipment.length <= 0 &&
      this.motorVehicle.length <= 0 &&
      this.furnituresFittings.length <= 0 &&
      this.computerSoftware.length <= 0 &&
      this.renovation.length <= 0 &&
      this.otherAssets.length <= 0 &&
      this.currentLiabilities.length <= 0 &&
      this.accruals.length <= 0 &&
      this.corporateFinancing.length <= 0 &&
      this.hirePurchase.length <= 0 &&
      this.equity.length <= 0 &&
      this.otherLiabilities.length <= 0
    )
  }

  hasCurrentAssets(): boolean {
    return this.currentAssets.length > 0 || this.bankCash.length > 0
  }

  hasNonCurrentAssets(): boolean {
    return (
      this.propertyPlantEquipment.length > 0 ||
      this.motorVehicle.length > 0 ||
      this.furnituresFittings.length > 0 ||
      this.computerSoftware.length > 0 ||
      this.renovation.length > 0
    )
  }

  hasCurrentLiabilities(): boolean {
    return this.currentLiabilities.length > 0 || this.accruals.length > 0
  }

  hasNonCurrentLiabilities(): boolean {
    return this.corporateFinancing.length > 0 || this.hirePurchase.length > 0
  }

  numberOfItems(): number {
    return (
      this.currentAssets.length +
      this.bankCash.length +
      this.propertyPlantEquipment.length +
      this.motorVehicle.length +
      this.furnituresFittings.length +
      this.computerSoftware.length +
      this.renovation.length +
      this.otherAssets.length +
      this.currentLiabilities.length +
      this.accruals.length +
      this.corporateFinancing.length +
      this.hirePurchase.length +
      this.equity.length +
      this.otherLiabilities.length
    )
  }

  getList(target: string): CompanyManagementAccountData[] {
    switch (target) {
      case ManagementAccountConstants.CONTENT_TYPE_BANK_CASH:
        return this.bankCash
      case ManagementAccountConstants.CONTENT_TYPE_CURRENT_ASSETS:
        return this.currentAssets
      case ManagementAccountConstants.CONTENT_TYPE_PPE:
        return this.propertyPlantEquipment
      case ManagementAccountConstants.CONTENT_TYPE_MOTOR_VEHICLE:
        return this.motorVehicle
      case ManagementAccountConstants.CONTENT_TYPE_FURNITURE_FITTINGS:
        return this.furnituresFittings
      case ManagementAccountConstants.CONTENT_TYPE_COMPUTER_SOFTWARE:
        return this.computerSoftware
      case ManagementAccountConstants.CONTENT_TYPE_RENOVATION:
        return this.renovation
      case ManagementAccountConstants.CONTENT_TYPE_OTHER_ASSETS:
        return this.otherAssets
      case ManagementAccountConstants.CONTENT_TYPE_CURRENT_LIABILITIES:
        return this.currentLiabilities
      case ManagementAccountConstants.CONTENT_TYPE_ACCRUALS:
        return this.accruals
      case ManagementAccountConstants.CONTENT_TYPE_CORPORATE_FINANCING:
        return this.corporateFinancing
      case ManagementAccountConstants.CONTENT_TYPE_HIRE_PURCHASE:
        return this.hirePurchase
      case ManagementAccountConstants.CONTENT_TYPE_OTHER_LIABILITIES:
        return this.otherLiabilities
      case ManagementAccountConstants.CONTENT_TYPE_EQUITY:
        return this.equity
      default:
        ;[]
    }

    return []
  }

  setList(target: string, list: CompanyManagementAccountData[]): void {
    switch (target) {
      case ManagementAccountConstants.CONTENT_TYPE_BANK_CASH:
        this.bankCash = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_CURRENT_ASSETS:
        this.currentAssets = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_PPE:
        this.propertyPlantEquipment = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_MOTOR_VEHICLE:
        this.motorVehicle = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_FURNITURE_FITTINGS:
        this.furnituresFittings = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_COMPUTER_SOFTWARE:
        this.computerSoftware = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_RENOVATION:
        this.renovation = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_OTHER_ASSETS:
        this.otherAssets = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_CURRENT_LIABILITIES:
        this.currentLiabilities = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_ACCRUALS:
        this.accruals = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_CORPORATE_FINANCING:
        this.corporateFinancing = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_HIRE_PURCHASE:
        this.hirePurchase = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_OTHER_LIABILITIES:
        this.otherLiabilities = list
        break
      case ManagementAccountConstants.CONTENT_TYPE_EQUITY:
        this.equity = list
        break
    }
  }

  add(target: string): void {
    if (!ManagementAccountConstants.BALANCE_SHEET_CONTENT_TYPES.includes(target)) {
      let error: Error = new Error("", "")
      error.setForIncompleteData()
      throw error
    }
    const data = new CompanyManagementAccountData()
    this.getList(target).push(data)
  }

  remove(target: string, id: string): void {
    if (!ManagementAccountConstants.BALANCE_SHEET_CONTENT_TYPES.includes(target)) {
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

  // Get Total
  getTotalBankCash(): number {
    const total = this.bankCash.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0)
    return parseFloat(total.toFixed(2))
  }

  getTotalCurrentAssets(): number {
    const currentAssets = this.currentAssets.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0)
    const total = this.getTotalBankCash() + currentAssets
    return parseFloat(total.toFixed(2))
  }

  getTotalPropertyPlantEquipment(): number {
    const total = this.propertyPlantEquipment.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0)
    return parseFloat(total.toFixed(2))
  }

  getTotalMotorVehicle(): number {
    const total = this.motorVehicle.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0)
    return parseFloat(total.toFixed(2))
  }

  getTotalFurnituresFittings(): number {
    const total = this.furnituresFittings.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0)
    return parseFloat(total.toFixed(2))
  }

  getTotalComputerSoftware(): number {
    const total = this.computerSoftware.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0)
    return parseFloat(total.toFixed(2))
  }

  getTotalRenovation(): number {
    const total = this.renovation.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0)
    return parseFloat(total.toFixed(2))
  }

  getTotalNonCurrentAssets(): number {
    const total =
      this.getTotalPropertyPlantEquipment() +
      this.getTotalMotorVehicle() +
      this.getTotalFurnituresFittings() +
      this.getTotalComputerSoftware() +
      this.getTotalRenovation()

    return parseFloat(total.toFixed(2))
  }

  getTotalOtherAssets(): number {
    const total = this.otherAssets.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0)
    return parseFloat(total.toFixed(2))
  }

  getTotalAssets(): number {
    const total = this.getTotalCurrentAssets() + this.getTotalNonCurrentAssets() + this.getTotalOtherAssets()
    return parseFloat(total.toFixed(2))
  }

  getTotalEquity(): number {
    const total = this.equity.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0)
    return parseFloat(total.toFixed(2))
  }

  getTotalAccruals(): number {
    const total = this.accruals.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0)
    return parseFloat(total.toFixed(2))
  }

  getTotalCurrentLiabilities(): number {
    const currentLiabilities = this.currentLiabilities.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0)
    const total = this.getTotalAccruals() + currentLiabilities
    return parseFloat(total.toFixed(2))
  }

  getTotalCorporateFinancing(): number {
    const total = this.corporateFinancing.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0)
    return parseFloat(total.toFixed(2))
  }

  getTotalHirePurchase(): number {
    const total = this.hirePurchase.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0)
    return parseFloat(total.toFixed(2))
  }

  getTotalNonCurrentLiabilities(): number {
    const total = this.getTotalCorporateFinancing() + this.getTotalHirePurchase()
    return parseFloat(total.toFixed(2))
  }

  getTotalOtherLiabilities(): number {
    const total = this.otherLiabilities.reduce((a, b) => {
      return a + Number(b.amount)
    }, 0)
    return parseFloat(total.toFixed(2))
  }

  getTotalLiabilities(): number {
    const total =
      this.getTotalCurrentLiabilities() + this.getTotalNonCurrentLiabilities() + this.getTotalOtherLiabilities()
    return parseFloat(total.toFixed(2))
  }

  getTotalEquityLiabilities(): number {
    const total = this.getTotalEquity() + this.getTotalLiabilities()
    return parseFloat(total.toFixed(2))
  }

  // Validation
  isAssetValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }

    return this.getTotalAssets() === this.getTotalEquityLiabilities()
  }

  isEquityLiabilitiesValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }
    return this.getTotalAssets() === this.getTotalEquityLiabilities()
  }

  isCurrentAssetsValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }
    const currentAssetsValid = this.currentAssets.every((item) => {
      return item.isDataValid(checkValidity)
    })
    const bankCashValid = this.bankCash.every((item) => {
      return item.isDataValid(checkValidity)
    })

    return currentAssetsValid && bankCashValid
  }

  isNonCurrentAssetsValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }
    const propertyPlantEquipment = this.propertyPlantEquipment.every((item) => {
      return item.isDataValid(checkValidity)
    })
    const motorVehicle = this.motorVehicle.every((item) => {
      return item.isDataValid(checkValidity)
    })
    const furnituresFittings = this.furnituresFittings.every((item) => {
      return item.isDataValid(checkValidity)
    })
    const computerSoftware = this.computerSoftware.every((item) => {
      return item.isDataValid(checkValidity)
    })
    const renovation = this.renovation.every((item) => {
      return item.isDataValid(checkValidity)
    })

    return propertyPlantEquipment && motorVehicle && furnituresFittings && computerSoftware && renovation
  }

  isOtherAssetsValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }
    return this.otherAssets.every((item) => {
      return item.isDataValid(checkValidity)
    })
  }

  isEquityValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }
    return this.equity.every((item) => {
      return item.isDataValid(checkValidity)
    })
  }

  isCurrentLiabilitiesValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }

    const accruals = this.accruals.every((item) => {
      return item.isDataValid(checkValidity)
    })

    const currentLiabilities = this.currentLiabilities.every((item) => {
      return item.isDataValid(checkValidity)
    })

    return currentLiabilities && accruals
  }

  isNonCurrentLiabilitiesValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }

    const corporateFinancing = this.corporateFinancing.every((item) => {
      return item.isDataValid(checkValidity)
    })
    const hirePurchase = this.hirePurchase.every((item) => {
      return item.isDataValid(checkValidity)
    })

    return corporateFinancing && hirePurchase
  }

  isOtherLiabilitiesValid(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }
    return this.otherLiabilities.every((item) => {
      return item.isDataValid(checkValidity)
    })
  }

  canSubmit(checkValidity: boolean): boolean {
    if (!checkValidity) {
      return true
    }

    return (
      this.isAssetValid(checkValidity) &&
      this.isEquityLiabilitiesValid(checkValidity) &&
      this.isOtherLiabilitiesValid(checkValidity) &&
      this.isNonCurrentLiabilitiesValid(checkValidity) &&
      this.isCurrentLiabilitiesValid(checkValidity) &&
      this.isEquityValid(checkValidity) &&
      this.isOtherAssetsValid(checkValidity) &&
      this.isNonCurrentAssetsValid(checkValidity) &&
      this.isCurrentAssetsValid(checkValidity)
    )
  }
}
