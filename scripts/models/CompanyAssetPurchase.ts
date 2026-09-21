import { Application } from "./Application"
import type { IModelApplication } from "./IModelApplication"
import { Error } from "../library/Error"
import { StringUtil } from "../utils/String"
import { AssetCategory, AssetModeOfAcquisition } from "../constants/AssetPurchases"

export class CompanyAssetPurchase
  extends Application
  implements IModelApplication<CompanyAssetPurchase, ReturnType<typeof useCompanyAssetPurchaseStore>>
{
  assetCategory: string | null = AssetCategory.MotorVehicle
  assetDescription: string | null = ""
  makeModel: string | null = ""
  serialNo: string | null = ""
  vendorName: string | null = ""
  purchaseAmount: number | null = 0
  modeOfAcquisition: string | null = AssetModeOfAcquisition.CashPurchase
  purpose: string | null = ""
  isFinancingRequired: boolean = false
  financeAmount: number | null = 0
  financier: string | null = ""
  isDirectorAdvanced: boolean = false
  nameOfDirector: string | null = ""
  isMachineInstallationRequired: boolean = false
  authorisedPerson: string | null = ""

  constructor(data: any | null = null) {
    super()
    if (!data) {
      return
    }

    if (data instanceof CompanyAssetPurchase) {
      this.cloneDetails(data)
    } else {
      this.convertFromResponseDetails(data)
    }
  }

  convertFromResponseDetails(data: any): void {
    super.convertFromResponse(data)
    this.assetCategory = data.asset_category ?? AssetCategory.MotorVehicle
    this.assetDescription = data.asset_description ?? ""
    this.makeModel = data.make_model ?? ""
    this.serialNo = data.serial_no ?? ""
    this.vendorName = data.vendor_name ?? ""
    this.purchaseAmount = data.purchase_amount ?? ""
    this.modeOfAcquisition = data.mode_of_acquisition ?? AssetModeOfAcquisition.CashPurchase
    this.purpose = data.purpose ?? ""
    this.isFinancingRequired = data.is_financing_required ?? false
    this.financeAmount = data.finance_amount ?? ""
    this.financier = data.financier ?? ""
    this.isDirectorAdvanced = data.is_director_advanced ?? false
    this.nameOfDirector = data.name_of_director ?? ""
    this.isMachineInstallationRequired = data.is_machine_installation_required ?? false
    this.authorisedPerson = data.authorised_person ?? ""
  }

  cloneDetails(data: CompanyAssetPurchase): void {
    super.clone(data)
    this.assetCategory = data.assetCategory
    this.assetDescription = data.assetDescription
    this.makeModel = data.makeModel
    this.serialNo = data.serialNo
    this.vendorName = data.vendorName
    this.purchaseAmount = data.purchaseAmount
    this.modeOfAcquisition = data.modeOfAcquisition
    this.purpose = data.purpose
    this.isFinancingRequired = data.isFinancingRequired
    this.financeAmount = data.financeAmount
    this.financier = data.financier
    this.isDirectorAdvanced = data.isDirectorAdvanced
    this.nameOfDirector = data.nameOfDirector
    this.isMachineInstallationRequired = data.isMachineInstallationRequired
    this.authorisedPerson = data.authorisedPerson
  }

  getRequestBody(): object {
    return {
      company_id: this.companyId,
      asset_category: this.assetCategory,
      asset_description: this.assetDescription,
      make_model: this.makeModel,
      serial_no: this.serialNo,
      vendor_name: this.vendorName,
      purchase_amount: this.purchaseAmount,
      mode_of_acquisition: this.modeOfAcquisition,
      purpose: this.purpose,
      is_financing_required: this.isFinancingRequired,
      finance_amount: this.financeAmount,
      financier: this.financier,
      is_director_advanced: this.isDirectorAdvanced,
      name_of_director: this.nameOfDirector,
      is_machine_installation_required: this.isMachineInstallationRequired,
      authorised_person: this.authorisedPerson,
      status: this.status,
    }
  }

  canSubmit(): boolean {
    return !StringUtil.isNullOrEmpty(this.companyId)
  }

  async create(repository: ReturnType<typeof useCompanyAssetPurchaseStore>): Promise<void> {
    if (!this.canSubmit()) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.create(data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async update(repository: ReturnType<typeof useCompanyAssetPurchaseStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id) || !this.canSubmit()) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    let data = this.getRequestBody()
    const response = await repository.update(this.id, data)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    this.convertFromResponseDetails(response)
  }

  async remove(repository: ReturnType<typeof useCompanyAssetPurchaseStore>): Promise<void> {
    if (StringUtil.isNullOrEmpty(this.id)) {
      let error: Error = new Error()
      error.setForIncompleteData()
      throw error
    }

    const response = await repository.remove(this.id)
    if (repository.error) {
      let error: Error = new Error()
      error.setForCUD()
      throw error
    }

    return response
  }
}
