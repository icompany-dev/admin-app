export enum AccessRoles {
  DIRECTOR = "Director",
  SHAREHOLDER = "Shareholder",
  CORPORATE_REPRESENTATIVE = "Corporate Representative",
  AUDITOR = "Auditor",
}

export enum AccessRuleTypes {
  VIEW = "view",
  INITIATE = "initiate",
  EDIT = "edit",
  PAY = "pay",
  REMOVE = "remove",
  SIGN = "sign",
  MANAGE = "manage",
}

export enum AccessRuleModules {
  BUSINESS = "Business",
  DIRECTOR = "Director",
  SHAREHOLDER = "Shareholder",
  BANKING = "Banking",
  AUDIT = "Audit",
  MANAGEMENT = "Management",
}

export class MultipleRoleConstants {
  static LOCKED_ROLES: string[] = [
    AccessRoles.DIRECTOR,
    AccessRoles.SHAREHOLDER,
    AccessRoles.CORPORATE_REPRESENTATIVE,
    AccessRoles.AUDITOR,
  ]

  static ACCESS_RULE_TYPES: string[] = [
    AccessRuleTypes.VIEW,
    AccessRuleTypes.INITIATE,
    AccessRuleTypes.EDIT,
    AccessRuleTypes.PAY,
    AccessRuleTypes.REMOVE,
    AccessRuleTypes.SIGN,
    AccessRuleTypes.MANAGE,
  ]

  static ACCESS_RULE_MODULES = [
    AccessRuleModules.BUSINESS,
    AccessRuleModules.DIRECTOR,
    AccessRuleModules.SHAREHOLDER,
    AccessRuleModules.BANKING,
    AccessRuleModules.AUDIT,
    AccessRuleModules.MANAGEMENT,
  ]

  static MANAGER_VIEW_ACCESS_ROLE = "access-role"
  static MANAGER_VIEW_MANAGE_ROLE = "manage-role"
  static MANAGER_VIEW_MANAGER = "manager"
}
