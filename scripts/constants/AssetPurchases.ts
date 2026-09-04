export enum AssetCategory {
  MotorVehicle = "motor-vehicle",
  Machinery = "machinery",
  Equipment = "equipment",
  ICTEquipment = "ict-equipment",
  FurnitureFittings = "furniture-fittings",
  Property = "property",
  Others = "others",
}

export enum AssetModeOfAcquisition {
  CashPurchase = "cash-purchase",
  BankFinancing = "bank-financing",
  HirePurchase = "hire-purchase",
  Leasing = "leasing",
  DirectorAdvance = "director-advance",
  Other = "other",
}

export class AssetPurchases {
  static getAssetCategoryName(assetCategory: AssetCategory): string {
    switch (assetCategory) {
      case AssetCategory.MotorVehicle:
        return "Motor Vehicle"
      case AssetCategory.Machinery:
        return "Machinery"
      case AssetCategory.Equipment:
        return "Equipment"
      case AssetCategory.ICTEquipment:
        return "ICT Equipment"
      case AssetCategory.FurnitureFittings:
        return "Furniture & Fittings"
      case AssetCategory.Property:
        return "Property"
      case AssetCategory.Others:
        return "Others"
    }
  }

  static getAssetModeOfAcquisition(mode: AssetModeOfAcquisition): string {
    switch (mode) {
      case AssetModeOfAcquisition.CashPurchase:
        return "Cash Purchase"
      case AssetModeOfAcquisition.BankFinancing:
        return "Bank Financing"
      case AssetModeOfAcquisition.HirePurchase:
        return "Hire Purchase"
      case AssetModeOfAcquisition.Leasing:
        return "Leasing"
      case AssetModeOfAcquisition.DirectorAdvance:
        return "Director's Advance"
      case AssetModeOfAcquisition.Other:
        return "Other"
    }
  }
}
