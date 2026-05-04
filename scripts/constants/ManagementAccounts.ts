export class ManagementAccountItemExample {
  name: string = ""
  description: string = ""
  whyItMatters: string = ""

  constructor(name: string, description: string, whyItMatters: string) {
    this.name = name
    this.description = description
    this.whyItMatters = whyItMatters
  }
}

export class ManagementAccountItem {
  target: string = ""
  name: string = ""
  whatIsIt: string = ""
  importance: string = ""
  types: string = ""
  examples: ManagementAccountItemExample[] = []

  constructor(
    target: string,
    name: string,
    whatIsIt: string,
    importance: string,
    types: string,
    examples: ManagementAccountItemExample[]
  ) {
    this.target = target
    this.name = name
    this.whatIsIt = whatIsIt
    this.importance = importance
    this.types = types
    this.examples = examples
  }
}

export class ManagementAccountConstants {
  static CONTENT_TYPE_BANK_CASH: string = "bankCash"
  static CONTENT_TYPE_CURRENT_ASSETS: string = "currentAssets"
  static CONTENT_TYPE_PPE: string = "propertyPlantEquipment"
  static CONTENT_TYPE_MOTOR_VEHICLE: string = "motorVehicle"
  static CONTENT_TYPE_FURNITURE_FITTINGS: string = "furnituresFittings"
  static CONTENT_TYPE_COMPUTER_SOFTWARE: string = "computerSoftware"
  static CONTENT_TYPE_RENOVATION: string = "renovation"
  static CONTENT_TYPE_OTHER_ASSETS: string = "otherAssets"
  static CONTENT_TYPE_CURRENT_LIABILITIES: string = "currentLiabilities"
  static CONTENT_TYPE_ACCRUALS: string = "accruals"
  static CONTENT_TYPE_CORPORATE_FINANCING: string = "corporateFinancing"
  static CONTENT_TYPE_HIRE_PURCHASE: string = "hirePurchase"
  static CONTENT_TYPE_OTHER_LIABILITIES: string = "otherLiabilities"
  static CONTENT_TYPE_EQUITY: string = "equity"
  static CONTENT_TYPE_REVENUE: string = "revenue"
  static CONTENT_TYPE_COGS: string = "costOfGoodSold"
  static CONTENT_TYPE_OTHER_INCOME: string = "otherIncome"
  static CONTENT_TYPE_ADMIN_EXPENSES: string = "administrationExpenses"
  static CONTENT_TYPE_EMPLOYMENT_EXPENSES: string = "employmentExpenses"
  static CONTENT_TYPE_TRAVELLING_EXPENSES: string = "travellingExpenses"
  static CONTENT_TYPE_MAINTENANCE_EXPENSES: string = "maintenanceExpenses"
  static CONTENT_TYPE_GENERAL_EXPENSES: string = "generalExpenses"

  static BANK_CASH_OPTION_BANK: string = "Bank"
  static BANK_CASH_OPTION_CASH_IN_HAND: string = "Cash in Hand"
  static BANK_CASH_OPTION_PETTY_CASH: string = "Petty Cash"

  static CURRENT_ASSETS_OPTION_DEBTOR: string = "Trade Receivable or Debtor"
  static CURRENT_ASSETS_OPTION_INVENTORY: string = "Inventory"
  static CURRENT_ASSETS_OPTION_AMOUNT_DUE_DIRECTOR: string = "Amount Due from Director"
  static CURRENT_ASSETS_OPTION_AMOUNT_DUE_RELATED_COMPANY: string = "Amount Due from Related Company"

  static PPE_OPTION_AT_COST: string = "Property, Plant, & Equipment at Cost"
  static PPE_OPTION_ACCUMULATED_DEPRECIATION: string = "Accumulated Depreciation Property, Plant & Equipment"

  static MOTOR_VEHICLE_OPTION_AT_COST: string = "Motor Vehicle at Cost"
  static MOTOR_VEHICLE_OPTION_ACCUMULATED_DEPRECIATION: string = "Accumulated Depreciation Motor Vehicle"

  static FURNITURE_FITTINGS_OPTION_AT_COST: string = "Furnitures & Fittings at Cost"
  static FURNITURE_FITTINGS_OPTION_ACCUMULATED_DEPRECIATION: string = "Accumulated Depreciation Furniture & Fittings"

  static COMPUTER_SOFTWARE_OPTION_AT_COST: string = "Computer & Software at Cost"
  static COMPUTER_SOFTWARE_OPTION_ACCUMULATED_DEPRECIATION: string = "Accumulated Depreciation Computer & Software"

  static RENOVATION_OPTION_AT_COST: string = "Renovation at Cost"
  static RENOVATION_OPTION_ACCUMULATED_DEPRECIATION: string = "Accumulated Depreciation Renovation"

  static OTHER_ASSETS_OPTION_INVESTMENT: string = "Investment"
  static OTHER_ASSETS_OPTION_DEPOSIT_PREPAYMENT: string = "Deposit & Prepayment"
  static OTHER_ASSETS_OPTION_ADVANCE_LOAN: string = "Advance & Loan"

  static EQUITY_OPTION_SHARE_CAPITAL: string = "Share Capital"
  static EQUITY_OPTION_RETAINED_EARNING: string = "Retained Earning"

  static CURRENT_LIABILITIES_OPTION_TRADE_PAYABLE: string = "Trade Payable or Creditor"

  static ACCRUAL_OPTION_SALARY: string = "Accrual Salary"
  static ACCRUAL_OPTION_EPF_SOCSO: string = "Accrual EPF, SOCSO & EIS"
  static ACCRUAL_OPTION_PCB: string = "Accrual PCB"
  static ACCRUAL_OPTION_AMOUNT_DUE_DIRECTOR: string = "Amount Due to Director"
  static ACCRUAL_OPTION_AMOUNT_DUE_RELATED_COMPANY: string = "Amount Due to Related Company"
  static ACCRUAL_OPTION_TAXATION: string = "Provision for Taxation"
  static ACCRUAL_OPTION_OTHERS: string = "Other Accrual"

  static CORPORATE_FINANCING_OPTION_LOAN: string = "Corporate Loan or Financing"
  static CORPORATE_FINANCING_OPTION_INTEREST: string = "Corporate Loan or Financing Interest"

  static HIRE_PURCHASE_OPTION_FINANCING: string = "Hire Purchase Financing"
  static HIRE_PURCHASE_OPTION_INTEREST: string = "Hire Purchase Interest"

  static OTHER_LIABILITIES_OPTION_WARRANTIES_PAYABLE: string = "Warranties Payable"

  static REVENUE_OPTION_SALES: string = "Sales"
  static REVENUE_OPTION_RETURN_INWARDS: string = "Return Inward or Sales Return"
  static REVENUE_OPTION_DISCOUNTS_GIVEN: string = "Discount Given"

  static COGS_OPTION_SALES: string = "Cost of Sales"
  static COGS_OPTION_RETURN_OUTWARD: string = "Return Outward or Purchase Return"
  static COGS_OPTION_DISCOUNTS_RECEIVED: string = "Discount Received"

  static ADMIN_EXPENSES_OPTION_ACCOUNTING_FEES: string = "Accounting Fees"
  static ADMIN_EXPENSES_OPTION_AUDIT_FEES: string = "Audit Fees"
  static ADMIN_EXPENSES_OPTION_DUES_SUBSCRIPTIONS: string = "Dues & Subscriptions"
  static ADMIN_EXPENSES_OPTION_LEGAL_PROFESSIONAL_FEES: string = "Legal & Professional Fees"
  static ADMIN_EXPENSES_OPTION_MARKETING_PROMOTION: string = "Marketing & Promotion"
  static ADMIN_EXPENSES_OPTION_PANTRY_REFRESHMENT: string = "Pantry & Refreshment"
  static ADMIN_EXPENSES_OPTION_PRINTING_STATIONERY: string = "Printing & Stationery"
  static ADMIN_EXPENSES_OPTION_PREMISE_RENTAL: string = "Rental of Premises"
  static ADMIN_EXPENSES_OPTION_STAFF_MEAL: string = "Staff Meal"
  static ADMIN_EXPENSES_OPTION_TELEPHONE_INTERNET: string = "Telephone & Internet"
  static ADMIN_EXPENSES_OPTION_WATER_ELECTRICITY: string = "Water & Electricity"

  static EMPLOYMENT_EXPENSES_OPTION_BONUS: string = "Bonus & Aid"
  static EMPLOYMENT_EXPENSES_OPTION_EPF: string = "EPF, SOCSO & EIS"
  static EMPLOYMENT_EXPENSES_OPTION_INSURANCE: string = "Medical & Insurance"
  static EMPLOYMENT_EXPENSES_OPTION_OVERTIME: string = "Overtime"
  static EMPLOYMENT_EXPENSES_OPTION_SALARIES: string = "Salaries & Wages"
  static EMPLOYMENT_EXPENSES_OPTION_TELEPHONE_ALLOWANCE: string = "Telephone Allowance"
  static EMPLOYMENT_EXPENSES_OPTION_TRAVEL_ALLOWANCE: string = "Travel Allowance"

  static TRAVELLING_EXPENSES_OPTION_ACCOMMODATION: string = "Accommodation"
  static TRAVELLING_EXPENSES_OPTION_FOOD_BEVERAGES: string = "Food & Beverages"
  static TRAVELLING_EXPENSES_OPTION_PETROL: string = "Petrol, Toll & Parking"
  static TRAVELLING_EXPENSES_OPTION_VISA_PERMIT: string = "Visa & Permit"

  static MAINTENANCE_EXPENSES_OPTION_MOTOR_VEHICLE: string = "Motor Vehicle"
  static MAINTENANCE_EXPENSES_OPTION_PREMISE: string = "Premises"
  static MAINTENANCE_EXPENSES_OPTION_SEWERAGE: string = "Sewerage"

  static GENERAL_EXPENSES_OPTION_BANK_CHARGES: string = "Bank Charges"
  static GENERAL_EXPENSES_OPTION_DEPRECIATION: string = "Depreciation"
  static GENERAL_EXPENSES_OPTION_FINE_SUMMON: string = "Fine & Summon"
  static GENERAL_EXPENSES_OPTION_GIFT_DONATION: string = "Gift & Donation"
  static GENERAL_EXPENSES_OPTION_INTEREST_ON_LOAN: string = "Interest on Loan"
  static GENERAL_EXPENSES_OPTION_SALES_COMMISSION: string = "Sales Commission"

  static OTHER_EXPENSES_OPTION_TAXATION: string = "Taxation"

  static OTHER_INCOME_OPTION_DELIVERY: string = "Delivery Income"

  static BALANCE_SHEET_CONTENT_TYPES: string[] = [
    this.CONTENT_TYPE_BANK_CASH,
    this.CONTENT_TYPE_CURRENT_ASSETS,
    this.CONTENT_TYPE_PPE,
    this.CONTENT_TYPE_MOTOR_VEHICLE,
    this.CONTENT_TYPE_FURNITURE_FITTINGS,
    this.CONTENT_TYPE_COMPUTER_SOFTWARE,
    this.CONTENT_TYPE_RENOVATION,
    this.CONTENT_TYPE_OTHER_ASSETS,
    this.CONTENT_TYPE_CURRENT_LIABILITIES,
    this.CONTENT_TYPE_ACCRUALS,
    this.CONTENT_TYPE_CORPORATE_FINANCING,
    this.CONTENT_TYPE_HIRE_PURCHASE,
    this.CONTENT_TYPE_OTHER_LIABILITIES,
    this.CONTENT_TYPE_EQUITY,
  ]

  static BANK_CASH_OPTIONS: string[] = [
    this.BANK_CASH_OPTION_BANK,
    this.BANK_CASH_OPTION_CASH_IN_HAND,
    this.BANK_CASH_OPTION_PETTY_CASH,
  ]

  static CURRENT_ASSETS_OPTIONS: string[] = [
    this.CURRENT_ASSETS_OPTION_DEBTOR,
    this.CURRENT_ASSETS_OPTION_INVENTORY,
    this.CURRENT_ASSETS_OPTION_AMOUNT_DUE_DIRECTOR,
    this.CURRENT_ASSETS_OPTION_AMOUNT_DUE_RELATED_COMPANY,
  ]

  static PROPERTY_PLANT_EQUIPMENT_OPTIONS: string[] = [
    this.PPE_OPTION_AT_COST,
    this.PPE_OPTION_ACCUMULATED_DEPRECIATION,
  ]

  static MOTOR_VEHICLE_OPTIONS: string[] = [
    this.MOTOR_VEHICLE_OPTION_AT_COST,
    this.MOTOR_VEHICLE_OPTION_ACCUMULATED_DEPRECIATION,
  ]

  static FURNITURES_FITTINGS_OPTIONS: string[] = [
    this.FURNITURE_FITTINGS_OPTION_AT_COST,
    this.FURNITURE_FITTINGS_OPTION_ACCUMULATED_DEPRECIATION,
  ]

  static COMPUTER_SOFTWARE_OPTIONS: string[] = [
    this.COMPUTER_SOFTWARE_OPTION_AT_COST,
    this.COMPUTER_SOFTWARE_OPTION_ACCUMULATED_DEPRECIATION,
  ]

  static RENOVATION_OPTIONS: string[] = [
    this.RENOVATION_OPTION_AT_COST,
    this.RENOVATION_OPTION_ACCUMULATED_DEPRECIATION,
  ]

  static OTHER_ASSETS_OPTIONS: string[] = [
    this.OTHER_ASSETS_OPTION_INVESTMENT,
    this.OTHER_ASSETS_OPTION_DEPOSIT_PREPAYMENT,
    this.OTHER_ASSETS_OPTION_ADVANCE_LOAN,
  ]

  static EQUITY_OPTIONS: string[] = [this.EQUITY_OPTION_SHARE_CAPITAL, this.EQUITY_OPTION_RETAINED_EARNING]

  static CURRENT_LIABILITIES_OPTIONS: string[] = [this.CURRENT_LIABILITIES_OPTION_TRADE_PAYABLE]

  static ACCRUALS_OPTIONS: string[] = [
    this.ACCRUAL_OPTION_SALARY,
    this.ACCRUAL_OPTION_EPF_SOCSO,
    this.ACCRUAL_OPTION_PCB,
    this.ACCRUAL_OPTION_AMOUNT_DUE_DIRECTOR,
    this.ACCRUAL_OPTION_AMOUNT_DUE_RELATED_COMPANY,
    this.ACCRUAL_OPTION_TAXATION,
    this.ACCRUAL_OPTION_OTHERS,
  ]

  static CORPORATE_FINANCING_OPTIONS: string[] = [
    this.CORPORATE_FINANCING_OPTION_LOAN,
    this.CORPORATE_FINANCING_OPTION_INTEREST,
  ]

  static HIRE_PURCHASE_OPTIONS: string[] = [this.HIRE_PURCHASE_OPTION_FINANCING, this.HIRE_PURCHASE_OPTION_INTEREST]

  static OTHER_LIABILITIES_OPTIONS: string[] = [this.OTHER_LIABILITIES_OPTION_WARRANTIES_PAYABLE]

  static PROFIT_LOSS_CONTENT_TYPES: string[] = [
    this.CONTENT_TYPE_REVENUE,
    this.CONTENT_TYPE_COGS,
    this.CONTENT_TYPE_OTHER_INCOME,
    this.CONTENT_TYPE_ADMIN_EXPENSES,
    this.CONTENT_TYPE_EMPLOYMENT_EXPENSES,
    this.CONTENT_TYPE_TRAVELLING_EXPENSES,
    this.CONTENT_TYPE_MAINTENANCE_EXPENSES,
    this.CONTENT_TYPE_GENERAL_EXPENSES,
  ]

  static REVENUE_OPTIONS: string[] = [
    this.REVENUE_OPTION_SALES,
    this.REVENUE_OPTION_RETURN_INWARDS,
    this.REVENUE_OPTION_DISCOUNTS_GIVEN,
  ]

  static COST_OF_GOOD_SOLD_OPTIONS: string[] = [
    this.COGS_OPTION_SALES,
    this.COGS_OPTION_RETURN_OUTWARD,
    this.COGS_OPTION_DISCOUNTS_RECEIVED,
  ]

  static ADMINISTRATION_EXPENSES_OPTIONS: string[] = [
    this.ADMIN_EXPENSES_OPTION_ACCOUNTING_FEES,
    this.ADMIN_EXPENSES_OPTION_AUDIT_FEES,
    this.ADMIN_EXPENSES_OPTION_DUES_SUBSCRIPTIONS,
    this.ADMIN_EXPENSES_OPTION_LEGAL_PROFESSIONAL_FEES,
    this.ADMIN_EXPENSES_OPTION_MARKETING_PROMOTION,
    this.ADMIN_EXPENSES_OPTION_PANTRY_REFRESHMENT,
    this.ADMIN_EXPENSES_OPTION_PRINTING_STATIONERY,
    this.ADMIN_EXPENSES_OPTION_PREMISE_RENTAL,
    this.ADMIN_EXPENSES_OPTION_STAFF_MEAL,
    this.ADMIN_EXPENSES_OPTION_TELEPHONE_INTERNET,
    this.ADMIN_EXPENSES_OPTION_WATER_ELECTRICITY,
  ]

  static EMPLOYMENT_EXPENSES_OPTIONS: string[] = [
    this.EMPLOYMENT_EXPENSES_OPTION_BONUS,
    this.EMPLOYMENT_EXPENSES_OPTION_EPF,
    this.EMPLOYMENT_EXPENSES_OPTION_INSURANCE,
    this.EMPLOYMENT_EXPENSES_OPTION_OVERTIME,
    this.EMPLOYMENT_EXPENSES_OPTION_SALARIES,
    this.EMPLOYMENT_EXPENSES_OPTION_TELEPHONE_ALLOWANCE,
    this.EMPLOYMENT_EXPENSES_OPTION_TRAVEL_ALLOWANCE,
  ]

  static TRAVELLING_EXPENSES_OPTIONS: string[] = [
    this.TRAVELLING_EXPENSES_OPTION_ACCOMMODATION,
    this.TRAVELLING_EXPENSES_OPTION_FOOD_BEVERAGES,
    this.TRAVELLING_EXPENSES_OPTION_PETROL,
    this.TRAVELLING_EXPENSES_OPTION_VISA_PERMIT,
  ]

  static MAINTENANCE_EXPENSES_OPTIONS: string[] = [
    this.MAINTENANCE_EXPENSES_OPTION_MOTOR_VEHICLE,
    this.MAINTENANCE_EXPENSES_OPTION_PREMISE,
    this.MAINTENANCE_EXPENSES_OPTION_SEWERAGE,
  ]

  static GENERAL_EXPENSES_OPTIONS: string[] = [
    this.GENERAL_EXPENSES_OPTION_BANK_CHARGES,
    this.GENERAL_EXPENSES_OPTION_DEPRECIATION,
    this.GENERAL_EXPENSES_OPTION_FINE_SUMMON,
    this.GENERAL_EXPENSES_OPTION_GIFT_DONATION,
    this.GENERAL_EXPENSES_OPTION_INTEREST_ON_LOAN,
    this.GENERAL_EXPENSES_OPTION_SALES_COMMISSION,
  ]

  static OTHER_EXPENSES_OPTIONS: string[] = [this.OTHER_EXPENSES_OPTION_TAXATION]
  static OTHER_INCOME_OPTIONS: string[] = [this.OTHER_INCOME_OPTION_DELIVERY]

  static MORE_INFO_TARGET_CURRENT_ASSETS = "current-assets"
  static MORE_INFO_TARGET_NON_CURRENT_ASSETS = "non-current-assets"
  static MORE_INFO_TARGET_EQUITY = "equity"
  static MORE_INFO_TARGET_CURRENT_LIABILITIES = "current-liabilities"
  static MORE_INFO_TARGET_NON_CURRENT_LIABILITIES = "non-current-liabilities"
  static MORE_INFO_TARGET_REVENUE = "revenue"
  static MORE_INFO_TARGET_COST_OF_GOODS_SOLD = "cost-of-goods-sold"
  static MORE_INFO_TARGET_OTHER_INCOME = "other-income"
  static MORE_INFO_TARGET_EXPENSES = "expenses"
  static MORE_INFO_TARGET_OTHER_ASSETS = "other-assets"
  static MORE_INFO_TARGET_OTHER_LIABILITIES = "other-liabilities"

  static CONTENT_TYPES_MORE_INFO_EN: ManagementAccountItem[] = [
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_CURRENT_ASSETS,
      "Current Assets",
      `A current asset is any resource or item that a company owns that is expected to be
      converted into cash, sold, or consumed within one year or within the company's
      financial year (whichever is longer). In simpler terms, it's stuff the company
      has that can easily be turned into cash or used up relatively soon.`,
      `Current assets are essential because they help a business manage its day-to-day operations.
      A company needs to have enough current assets to cover its short-term debts
      (things it needs to pay soon, like bills or loans). If a company doesn’t have enough
      current assets, it may affect its operations or even lead to financial problems.`,
      "Here are some common types of current assets and why they matter:",
      [
        new ManagementAccountItemExample(
          "Cash and Cash Equivalents",
          `This is the most straightforward current asset.
          It includes the actual money the business has in its bank accounts,
          along with any very short-term investments that can
          easily be turned into cash (like fixed deposit or unit trust).`,
          `Cash is what a business uses to pay for
          its expenses, wages, bills, and other short-term obligations.
          Without enough cash, the business could run into problems
          paying its employees or suppliers.`
        ),
        new ManagementAccountItemExample(
          "Accounts Receivable",
          `This refers to the money that customers owe the business for
          products or services they've already received but haven’t paid
          for yet. For example, a company might deliver a product now
          and allow the customer to pay within 30 days.`,
          `Accounts receivable is a promise of future
          cash. It’s like an IOU from customers. If a business has a lot
          of accounts receivable, it means it’s waiting for that money
          to come in, which can help pay for expenses.`
        ),
        new ManagementAccountItemExample(
          "Inventory",
          `Inventory includes products the business has on hand that it
          intends to sell in the normal course of business. For example,
          a retail store has items on the shelves that customers can buy.
          For a manufacturer, inventory could include raw materials,
          work-in-progress items, and finished products.`,
          `Inventory is a potential source of future
          revenue. The business hopes to sell it for a profit. However,
          if inventory isn’t sold quickly enough, it could become a
          problem (like if it’s out of date or unsellable).`
        ),
        new ManagementAccountItemExample(
          "Prepaid Expenses",
          `Prepaid expenses are things the business has already paid for
          but will receive the benefit of over the next year. This could
          include things like insurance premiums, rent, or service contracts
          that have been paid in advance.`,
          `Even though the business has already paid
          for these things, it can still use them within the year. For
          example, if a company paid six months of rent in advance,
          the business would recognize part of that as a current asset
          until it is used up.`
        ),
        new ManagementAccountItemExample(
          "Short-Term Investments",
          `Sometimes a company has investments that it plans to sell or
          cash in within the year. These could be stocks, bonds, or other
          financial assets.`,
          `These investments can quickly be converted
          into cash if needed for short-term business needs or expenses.`
        ),
        new ManagementAccountItemExample(
          "Other Receivables",
          `Sometimes a business might expect to receive money from sources
          other than customers, such as tax refunds or loans that will be
          paid back within a year. These are also considered current assets.`,
          `It’s money the business expects to get soon,
          which can help cover short-term costs.`
        ),
      ]
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_NON_CURRENT_ASSETS,
      "Non-Current Assets",
      `A non-current asset is something a business owns that is not meant to be sold
      or used up quickly. These are resources or items that the company plans to keep
      and use for a long time—usually for more than a year.
      In other words, non-current assets are items that are essential for the business’s
      long-term operations and growth, but they aren't turned into cash quickly. These
      assets usually help a business generate income over a long period of time.`,
      `Non-current assets are crucial because they help a business run smoothly in the long term.
      For example, a factory building helps a company produce goods, and machines help it
      manufacture those goods. Without these assets, the business wouldn't be able to
      create products or provide services over time.`,
      "Here are some common examples of non-current assets:",
      [
        new ManagementAccountItemExample(
          `Property, Plant, and Equipment (PPE)`,
          `This category includes things like land, buildings, machinery, vehicles, and furniture. These are physical assets that the business uses to produce goods or services over many years. For example, a car dealership might own buildings and display lots of cars, or a manufacturer might own a factory and machinery to create products.`,
          `These assets are used over a long time and help the business run day to day. They aren't easily sold or turned into cash, but they are essential for production or services.`
        ),
        new ManagementAccountItemExample(
          `Intangible Assets`,
          `These are things the business owns that don't have a physical presence but still have value. For example, patents, trademarks, and copyrights are intangible assets. A company might also have valuable brand names or customer lists.`,
          `Intangible assets represent the intellectual property or competitive advantages a business has. They help the business generate income over time.`
        ),
        new ManagementAccountItemExample(
          `Long-Term Investments`,
          `A business may have investments that it plans to hold for more than a year, such as shares in other companies, bonds, or other financial investments.`,
          `These investments could help the business earn extra income or grow over time. Since the company doesn’t plan to sell them soon, they are considered non-current assets.`
        ),
        new ManagementAccountItemExample(
          `Goodwill`,
          `Goodwill is an intangible asset that comes into play when one company buys another for more than its actual net assets (like property and equipment). The excess amount paid is recorded as goodwill. For example, a popular restaurant chain that’s bought by a larger company may have goodwill because of its loyal customer base, brand reputation, and market position. `,
          `Goodwill represents the extra value of a business that’s not tied to physical assets. It's important for businesses involved in acquisitions (buying other businesses). `
        ),
      ]
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_EQUITY,
      "Equity",
      "Equity refers to the ownership value in a business. It’s like the “net worth” of the company.",
      `Equity is crucial because it shows:
        <ul>
          <li><b>What the business is worth to the owners</b>: It tells the owners or investors the value of their share in the company after all debts are accounted for.</li>
          <li><b>The business’s financial health</b>: If a business has positive equity, it means the business has more assets than liabilities, which is a good sign. But if a company has negative equity (where liabilities exceed assets), it could be a sign of financial trouble.</li>
          <li><b>Access to funds</b>: A company with strong equity can attract investors or secure loans more easily because it shows the business is solid and not heavily indebted.</li>
        </ul>
        For a business owner or investor, understanding equity helps you know how much of the business you own and how much value is left after paying off the company’s debts.
        In simple terms, equity tells you, "How much is the company worth to me, the owner, after paying everything it owes?"`,
      "Under MPERS, equity is made up of several components that show the financial position of the company. These components include:",
      [
        new ManagementAccountItemExample(
          "Share Capital",
          "This is the money invested by the business owners or shareholders when they buy shares in the company. If you start a business by investing RM 10,000, that’s part of the share capital.",
          ""
        ),
        new ManagementAccountItemExample(
          "Retained Earnings",
          "This is the money the company has earned from its business activities over time, minus any dividends it has paid out. It’s essentially the profit that the company has kept for future use instead of paying out to shareholders.",
          ""
        ),
        new ManagementAccountItemExample(
          "Other Reserves",
          "Sometimes companies have other types of reserves, like revaluation reserves (when the value of assets like property increases). These reserves also form part of the total equity.",
          ""
        ),
      ]
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_CURRENT_LIABILITIES,
      "Current Liabilities",
      `Current liabilities are the amounts of money a business owes and needs to pay within the next 12 months (or within its regular financial year, whichever is longer). These are short-term debts and obligations that the company must settle soon.
      Think of current liabilities as bills or debts that a business needs to pay in the near future—usually within a year.`,
      `Current liabilities help us understand whether a business can pay its short-term debts. If a company doesn’t have enough cash or assets to pay these liabilities, it may run into financial trouble. This is why accountants, investors, and lenders pay close attention to current liabilities when evaluating a business’s financial health.
      In simple terms: If a business has more current liabilities than it can pay off quickly, it could face cash flow problems.`,
      "Here are some common examples of current liabilities:",
      [
        new ManagementAccountItemExample(
          "Accounts Payable",
          "This is the money a business owes to its suppliers for products or services it has received, but hasn’t paid for yet. For example, if a company buys materials to make products but hasn’t paid the supplier, that amount is an accounts payable.",
          "The company needs to pay its supplier soon—usually in 30 to 60 days."
        ),
        new ManagementAccountItemExample(
          "Short-Term Loans or Bank Overdrafts",
          "If a business borrows money from a bank for a short period (let’s say, to cover an unexpected expense), that loan is a current liability. Also, if the business spends more money than it has in its bank account (a bank overdraft), it must pay that back quickly.",
          "The company needs to repay these loans soon."
        ),
        new ManagementAccountItemExample(
          "Accrued Expenses (or Accrued Liabilities)",
          "These are costs the company has already incurred but hasn’t paid yet. For example, wages owed to employees or unpaid utility bills. These are expenses that the company must settle in the short term.",
          "Even if the business hasn’t paid yet, it owes money for these services or work already completed."
        ),
        new ManagementAccountItemExample(
          "Current Portion of Long-Term Debt",
          "Sometimes a company has a big loan with payments stretched out over many years. But the part of the loan that needs to be paid within the next 12 months is considered a current liability.",
          "This is money that has to be paid soon, even though the loan was originally for a longer period."
        ),
      ]
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_NON_CURRENT_LIABILITIES,
      "Non-Current Liabilities",
      `Non-current liabilities (also called long-term liabilities) are debts or obligations that a business does not need to pay off within the next 12 months. These are long-term financial commitments the business will pay over a period longer than one year.
      In simpler terms: Non-current liabilities are debts that the business owes, but it doesn't have to pay them soon. Instead, it will pay them in the future, over many years.`,
      `Non-current liabilities help show how much money a business owes over the long term. They are important for understanding the company’s long-term financial health.
      For example, a business with a lot of long-term debt might be taking on more financial risk in the future, but as long as it can make its payments over time, it’s not as much of an immediate concern. On the other hand, if a business has too many short-term debts (current liabilities) and not enough cash to cover them, that could be a bigger problem for its day-to-day operations.
      Key Difference: Current liabilities are debts the business needs to pay within a year. Non-current liabilities are debts that will be paid over a period longer than one year.`,
      "Here are some common examples of non-current liabilities:",
      [
        new ManagementAccountItemExample(
          "Long-Term Loans",
          `A business might borrow a large amount of money from a bank to buy property, equipment, or invest in long-term projects. If the loan is due to be paid back over several years, it’s considered a non-current liability.
          Example: If a business takes out a 5-year loan for $100,000, it will pay it back over 5 years. The amount due beyond the next 12 months is considered a non-current liability.`,
          "This money doesn’t need to be paid back right away, but the business will make regular payments over time."
        ),
        new ManagementAccountItemExample(
          "Bonds Payable",
          `Sometimes, companies borrow large amounts of money by issuing bonds. Investors buy the bonds, and the company promises to pay the bondholders back in the future, usually in several years.
          Example: A company might issue bonds worth $1 million, agreeing to pay the investors back in 10 years.`,
          "Like long-term loans, bonds payable represent money that will be repaid in the future, not immediately."
        ),
        new ManagementAccountItemExample(
          "Lease Obligations (Long-Term Leases)",
          `If a business leases property or equipment for many years, the lease payments it will make in the future are considered non-current liabilities.
          Example: A company might lease office space for 10 years. The payments it will make after the first year are considered non-current liabilities.`,
          "These payments will be spread over many years, so the business doesn’t have to pay them all at once."
        ),
        new ManagementAccountItemExample(
          "Pension Liabilities",
          `Some businesses promise to pay retirement benefits to employees after they retire. The business may not need to pay these amounts immediately, but it has an obligation to make these payments in the future.
          Example: A company promises to pay a pension to an employee once they retire in 20 years.`,
          "The company will gradually save or set aside money for these future payments."
        ),
      ]
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_REVENUE,
      "Revenue",
      `Revenue represents the total income generated by a business from its
      primary operations, such as sales of goods or services.
      Revenue is the starting point for analyzing a company's financial performance.`,
      "",
      "",
      []
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_COST_OF_GOODS_SOLD,
      "Cost of Goods Sold",
      `Cost of Goods Sold represents the direct cost incurred to produce or purchase
      the goods that a company sells. It includes all expenses directly tied to the production
      or procurement of goods, such as raw materials, labor, and manufacturing costs.`,
      "",
      "",
      []
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_OTHER_INCOME,
      "Other Income",
      `Other Income refers to revenue generated form activities that are not part
      of a company's core operations. It includes earnings form secondary or incidental
      sources that contribute to overall profitablility but are not directly tied to the
      primary business activities.`,
      "",
      "",
      []
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_EXPENSES,
      "Expenses",
      `Expenses represent the costs incurred by a buisness to generate revenue
      and maintain operations. THey are the outflows of resources or obligations taken on to
      run the company, and they directly impact profitability.`,
      "",
      "",
      []
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_OTHER_ASSETS,
      "Other Assets",
      "Other Assets are essential for providing a complete picture of a company's financial position.",
      "",
      "Example of Other Assets:",
      [
        new ManagementAccountItemExample(
          "Deferred Tax Assets",
          "Overpaid taxes or tax losses carried fowrad that can reduce future tax liabilities.",
          ""
        ),
        new ManagementAccountItemExample(
          "Long-Term Investments",
          "Investments held for more than an year, such as bonds, stocks, or real estate not used in operations.",
          ""
        ),
      ]
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_OTHER_LIABILITIES,
      "Other Liabilities",
      `Other Liabilities refer to oblications that do not fall into standard liability categories such as current or long-term liabilities.
      These liabilities are typically non-operational, unusual, or miscellaneous in nature.
      They are listed as a separate line item on the balance sheet, ensuring that financial reporting is clear and accurate.`,
      "Other liabilities are essential for understanding a companiy's complete financial picture.",
      "Example of Other Liabilities:",
      [
        new ManagementAccountItemExample(
          "Deferred Revenue (Long-Term)",
          "Payments received in advance for godds or services that will be delivered in future period.",
          ""
        ),
        new ManagementAccountItemExample(
          "Contingent Liabilities",
          "Potential obligation that depend on the outcome of uncertain events, such as lawsuits or guarantees.",
          ""
        ),
      ]
    ),
  ]

  static CONTENT_TYPES_MORE_INFO_BM: ManagementAccountItem[] = [
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_CURRENT_ASSETS,
      "Aset Semasa",
      `Aset semasa ialah sebarang sumber atau item yang dimiliki oleh sesebuah syarikat yang dijangka
      akan ditukar kepada tunai, dijual, atau digunakan dalam tempoh satu tahun atau dalam tahun
      kewangan syarikat (mana-mana yang lebih panjang). Secara ringkasnya, ia adalah barangan yang
      mudah ditukar kepada tunai atau digunakan dalam masa terdekat.`,
      `Aset semasa adalah penting kerana ia membantu perniagaan mengurus operasi hariannya.
      Sesebuah syarikat perlu mempunyai aset semasa yang mencukupi untuk menampung hutang jangka
      pendeknya (perkara yang perlu dibayar tidak lama lagi, seperti bil atau pinjaman). Jika syarikat
      tidak mempunyai aset semasa yang mencukupi, ia boleh menjejaskan operasi atau membawa
      kepada masalah kewangan.`,
      "Berikut adalah beberapa jenis aset semasa yang biasa dan mengapa ia penting:",
      [
        new ManagementAccountItemExample(
          "Tunai dan Setara Tunai",
          `Ini adalah aset semasa yang paling jelas. Ia termasuk wang sebenar yang dimiliki
          oleh perniagaan dalam akaun banknya, berserta sebarang pelaburan jangka pendek
          yang boleh ditukar dengan mudah kepada tunai (seperti deposit tetap atau unit amanah).`,
          `Tunai adalah apa yang digunakan oleh perniagaan untuk membayar perbelanjaan,
          gaji, bil, dan obligasi jangka pendek yang lain. Tanpa tunai yang mencukupi,
          perniagaan boleh menghadapi masalah membayar pekerja atau pembekalnya.`
        ),
        new ManagementAccountItemExample(
          "Akaun Belum Terima",
          `Ini merujuk kepada wang yang perlu dibayar oleh pelanggan kepada perniagaan untuk
          produk atau perkhidmatan yang telah mereka terima tetapi belum dibayar. Sebagai
          contoh, syarikat mungkin menghantar produk sekarang dan membenarkan pelanggan
          membayar dalam tempoh 30 hari.`,
          `Akaun belum terima adalah janji tunai pada masa hadapan. Ia seperti surat janji hutang
          daripada pelanggan. Jika perniagaan mempunyai banyak akaun belum terima, ini bermakna
          ia sedang menunggu wang tersebut masuk, yang boleh membantu membayar perbelanjaan.`
        ),
        new ManagementAccountItemExample(
          "Inventori",
          `Inventori termasuk produk yang ada di tangan perniagaan yang bertujuan untuk dijual
          dalam operasi biasa perniagaan. Contohnya, kedai runcit mempunyai item di rak yang
          boleh dibeli oleh pelanggan. Bagi pengeluar, inventori boleh termasuk bahan mentah,
          item dalam proses, dan produk siap.`,
          `Inventori adalah sumber potensi pendapatan masa hadapan. Perniagaan berharap untuk
          menjualnya untuk mendapatkan keuntungan. Walau bagaimanapun, jika inventori tidak
          dijual dengan cukup pantas, ia boleh menjadi masalah (seperti jika ia sudah lapuk atau tidak boleh dijual).`
        ),
        new ManagementAccountItemExample(
          "Perbelanjaan Prabayar",
          `Perbelanjaan prabayar adalah perkara yang telah dibayar oleh perniagaan tetapi akan
          menerima manfaatnya dalam tempoh tahun akan datang. Ini boleh termasuk perkara seperti
          premium insurans, sewa, atau kontrak perkhidmatan yang telah dibayar terlebih dahulu.`,
          `Walaupun perniagaan telah membayar untuk perkara ini, ia masih boleh menggunakannya
          dalam tempoh tahun tersebut. Sebagai contoh, jika sebuah syarikat membayar sewa enam
          bulan terlebih dahulu, perniagaan akan mengiktiraf sebahagian daripadanya sebagai aset
          semasa sehingga ia habis digunakan.`
        ),
        new ManagementAccountItemExample(
          "Pelaburan Jangka Pendek",
          `Kadangkala syarikat mempunyai pelaburan yang dirancang untuk dijual atau ditunaikan
          dalam tempoh setahun. Ini boleh menjadi saham, bon, atau aset kewangan lain.`,
          `Pelaburan ini boleh ditukar dengan cepat kepada tunai jika diperlukan untuk keperluan
          atau perbelanjaan perniagaan jangka pendek.`
        ),
        new ManagementAccountItemExample(
          "Penerimaan Lain",
          `Kadangkala perniagaan mungkin menjangkakan untuk menerima wang dari sumber selain
          daripada pelanggan, seperti bayaran balik cukai atau pinjaman yang akan dibayar balik
          dalam tempoh setahun. Ini juga dianggap sebagai aset semasa.`,
          `Ia adalah wang yang dijangka akan diperoleh perniagaan tidak lama lagi, yang boleh
          membantu menampung kos jangka pendek.`
        ),
      ]
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_NON_CURRENT_ASSETS,
      "Aset Bukan Semasa",
      `Aset bukan semasa ialah sesuatu yang dimiliki oleh perniagaan yang tidak bertujuan
      untuk dijual atau digunakan dengan cepat. Ini adalah sumber atau item yang dirancang oleh
      syarikat untuk disimpan dan digunakan untuk tempoh yang lama—biasanya lebih daripada setahun.
      Dalam erti kata lain, aset bukan semasa adalah item yang penting untuk operasi dan pertumbuhan
      jangka panjang perniagaan, tetapi ia tidak ditukar kepada tunai dengan cepat. Aset ini biasanya
      membantu perniagaan menjana pendapatan dalam tempoh masa yang panjang.`,
      `Aset bukan semasa adalah penting kerana ia membantu perniagaan berjalan lancar dalam jangka
      masa panjang. Sebagai contoh, bangunan kilang membantu syarikat menghasilkan barangan, dan
      jentera membantunya mengilang barangan tersebut. Tanpa aset ini, perniagaan tidak akan dapat
      mencipta produk atau menyediakan perkhidmatan dari semasa ke semasa.`,
      "Berikut adalah beberapa contoh aset bukan semasa yang biasa:",
      [
        new ManagementAccountItemExample(
          `Harta, Loji, dan Peralatan (PPE)`,
          `Kategori ini termasuk perkara seperti tanah, bangunan, jentera, kenderaan, dan perabot.
          Ini adalah aset fizikal yang digunakan oleh perniagaan untuk menghasilkan barangan atau
          perkhidmatan selama bertahun-tahun. Sebagai contoh, pengedar kereta mungkin memiliki
          bangunan dan tapak pameran kereta, atau pengeluar mungkin memiliki kilang dan jentera
          untuk mencipta produk.`,
          `Aset ini digunakan dalam tempoh yang lama dan membantu perniagaan berjalan dari hari
          ke hari. Ia tidak mudah dijual atau ditukar kepada tunai, tetapi ia penting untuk pengeluaran atau perkhidmatan.`
        ),
        new ManagementAccountItemExample(
          `Aset Tak Ketara`,
          `Ini adalah perkara yang dimiliki oleh perniagaan yang tidak mempunyai kewujudan fizikal
          tetapi masih mempunyai nilai. Sebagai contoh, paten, tanda dagangan, dan hak cipta adalah
          aset tak ketara. Sesebuah syarikat juga mungkin mempunyai jenama yang berharga atau senarai pelanggan.`,
          `Aset tak ketara mewakili harta intelek atau kelebihan daya saing yang dimiliki oleh perniagaan.
          Ia membantu perniagaan menjana pendapatan dari semasa ke semasa.`
        ),
        new ManagementAccountItemExample(
          `Pelaburan Jangka Panjang`,
          `Sesebuah perniagaan mungkin mempunyai pelaburan yang dirancang untuk dipegang
          selama lebih daripada setahun, seperti saham dalam syarikat lain, bon, atau pelaburan kewangan lain.`,
          `Pelaburan ini boleh membantu perniagaan memperoleh pendapatan tambahan atau berkembang
          dari semasa ke semasa. Oleh kerana syarikat tidak merancang untuk menjualnya tidak lama lagi,
          ia dianggap sebagai aset bukan semasa.`
        ),
        new ManagementAccountItemExample(
          `Muhibah (Goodwill)`,
          `Muhibah adalah aset tak ketara yang timbul apabila sesebuah syarikat membeli syarikat
          lain dengan harga yang lebih tinggi daripada aset bersih sebenar (seperti harta dan peralatan).
          Jumlah lebihan yang dibayar direkodkan sebagai muhibah. Sebagai contoh, rantaian restoran
          popular yang dibeli oleh syarikat yang lebih besar mungkin mempunyai muhibah kerana pangkalan
          pelanggan setia, reputasi jenama, dan kedudukan pasarannya. `,
          `Muhibah mewakili nilai tambahan perniagaan yang tidak terikat kepada aset fizikal.
          Ia penting untuk perniagaan yang terlibat dalam pengambilalihan (membeli perniagaan lain). `
        ),
      ]
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_EQUITY,
      "Ekuiti",
      'Ekuiti merujuk kepada nilai pemilikan dalam sesebuah perniagaan. Ia seperti "nilai bersih" syarikat.',
      `Ekuiti adalah penting kerana ia menunjukkan:
        <ul>
          <li><b>Nilai perniagaan kepada pemilik</b>: Ia memberitahu pemilik atau pelabur nilai saham mereka dalam syarikat selepas semua hutang diambil kira.</li>
          <li><b>Kesihatan kewangan perniagaan</b>: Jika perniagaan mempunyai ekuiti positif, ini bermakna perniagaan mempunyai lebih banyak aset daripada liabiliti, yang merupakan petanda baik. Tetapi jika syarikat mempunyai ekuiti negatif (di mana liabiliti melebihi aset), ia boleh menjadi petanda masalah kewangan.</li>
          <li><b>Akses kepada dana</b>: Syarikat dengan ekuiti yang kukuh boleh menarik pelabur atau mendapatkan pinjaman dengan lebih mudah kerana ia menunjukkan perniagaan itu stabil dan tidak banyak berhutang.</li>
        </ul>
        Bagi pemilik atau pelabur perniagaan, memahami ekuiti membantu anda mengetahui berapa banyak perniagaan yang anda miliki dan berapa banyak nilai yang tinggal selepas membayar semua hutang syarikat.
        Secara ringkasnya, ekuiti memberitahu anda, "Berapakah nilai syarikat ini kepada saya, pemilik, selepas membayar semua yang terhutang?"`,
      "Di bawah MPERS, ekuiti terdiri daripada beberapa komponen yang menunjukkan kedudukan kewangan syarikat. Komponen-komponen ini termasuk:",
      [
        new ManagementAccountItemExample(
          "Modal Saham",
          "Ini adalah wang yang dilaburkan oleh pemilik perniagaan atau pemegang saham apabila mereka membeli saham dalam syarikat. Jika anda memulakan perniagaan dengan melabur RM 10,000, itu adalah sebahagian daripada modal saham.",
          ""
        ),
        new ManagementAccountItemExample(
          "Pendapatan Terkumpul",
          "Ini adalah wang yang telah diperoleh syarikat daripada aktiviti perniagaannya dari semasa ke semasa, ditolak sebarang dividen yang telah dibayar. Ia pada dasarnya adalah keuntungan yang telah disimpan oleh syarikat untuk kegunaan masa depan dan bukannya dibayar kepada pemegang saham.",
          ""
        ),
        new ManagementAccountItemExample(
          "Rizab Lain",
          "Kadangkala syarikat mempunyai jenis rizab lain, seperti rizab penilaian semula (apabila nilai aset seperti harta meningkat). Rizab ini juga membentuk sebahagian daripada jumlah ekuiti.",
          ""
        ),
        new ManagementAccountItemExample(
          "Untung atau Rugi",
          `Jika syarikat membuat keuntungan, ia meningkatkan pendapatan terkumpul, dan dengan itu, meningkatkan ekuiti. Jika syarikat membuat kerugian, ia mengurangkan pendapatan terkumpul, dan ekuiti menurun.`,
          `Contoh: Jika perniagaan anda membuat keuntungan sebanyak RM 10,000, ekuiti meningkat sebanyak RM 10,000.`
        ),
        new ManagementAccountItemExample(
          "Pelaburan oleh Pemilik",
          "Jika pemilik perniagaan memasukkan lebih banyak wang (modal saham tambahan), ia meningkatkan ekuiti.",
          "Contoh: Jika anda (pemilik) melabur RM 5,000 lagi dalam perniagaan, ekuiti syarikat meningkat sebanyak RM 5,000."
        ),
        new ManagementAccountItemExample(
          "Dividen",
          "Jika perniagaan memutuskan untuk membayar dividen kepada pemegang saham (mengagihkan sebahagian daripada keuntungan), ia akan mengurangkan ekuiti kerana wang keluar dari perniagaan.",
          "Contoh: Jika syarikat membayar dividen sebanyak RM 2,000, jumlah itu ditolak daripada ekuiti."
        ),
      ]
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_CURRENT_LIABILITIES,
      "Liabiliti Semasa",
      `Liabiliti semasa ialah jumlah wang yang terhutang oleh perniagaan dan perlu dibayar
      dalam tempoh 12 bulan akan datang (atau dalam tahun kewangan biasa, mana-mana yang
      lebih panjang). Ini adalah hutang dan obligasi jangka pendek yang mesti diselesaikan
      oleh syarikat tidak lama lagi.
      Anggap liabiliti semasa sebagai bil atau hutang yang perlu dibayar oleh perniagaan
      dalam masa terdekat—biasanya dalam tempoh setahun.`,
      `Liabiliti semasa membantu kita memahami sama ada perniagaan boleh membayar hutang
      jangka pendeknya. Jika syarikat tidak mempunyai tunai atau aset yang mencukupi untuk
      membayar liabiliti ini, ia boleh menghadapi masalah kewangan. Inilah sebabnya mengapa
      akauntan, pelabur, dan pemberi pinjaman memberi perhatian rapat kepada liabiliti semasa
      apabila menilai kesihatan kewangan perniagaan.
      Secara ringkasnya: Jika perniagaan mempunyai lebih banyak liabiliti semasa daripada
      yang boleh dibayar dengan cepat, ia boleh menghadapi masalah aliran tunai.`,
      "Berikut adalah beberapa contoh liabiliti semasa yang biasa:",
      [
        new ManagementAccountItemExample(
          "Akaun Belum Bayar",
          "Ini adalah wang yang terhutang oleh perniagaan kepada pembekalnya untuk produk atau perkhidmatan yang telah diterimanya, tetapi belum dibayar. Sebagai contoh, jika syarikat membeli bahan untuk membuat produk tetapi belum membayar pembekal, jumlah itu adalah akaun belum bayar.",
          "Syarikat perlu membayar pembekalnya tidak lama lagi—biasanya dalam 30 hingga 60 hari."
        ),
        new ManagementAccountItemExample(
          "Pinjaman Jangka Pendek atau Overdraf Bank",
          "Jika perniagaan meminjam wang daripada bank untuk tempoh yang singkat (katakan, untuk menampung perbelanjaan yang tidak dijangka), pinjaman itu adalah liabiliti semasa. Selain itu, jika perniagaan membelanjakan lebih banyak wang daripada yang ada dalam akaun banknya (overdraf bank), ia mesti membayar balik dengan cepat.",
          "Syarikat perlu membayar balik pinjaman ini tidak lama lagi."
        ),
        new ManagementAccountItemExample(
          "Perbelanjaan Terakru (atau Liabiliti Terakru)",
          "Ini adalah kos yang telah ditanggung oleh syarikat tetapi belum dibayar. Sebagai contoh, gaji yang terhutang kepada pekerja atau bil utiliti yang belum dibayar. Ini adalah perbelanjaan yang mesti diselesaikan oleh syarikat dalam jangka pendek.",
          "Walaupun perniagaan belum membayar, ia berhutang wang untuk perkhidmatan atau kerja yang telah disiapkan ini."
        ),
        new ManagementAccountItemExample(
          "Bahagian Semasa Hutang Jangka Panjang",
          "Kadangkala syarikat mempunyai pinjaman besar dengan bayaran yang tersebar selama bertahun-tahun. Tetapi bahagian pinjaman yang perlu dibayar dalam tempoh 12 bulan akan datang dianggap sebagai liabiliti semasa.",
          "Ini adalah wang yang perlu dibayar tidak lama lagi, walaupun pinjaman itu pada asalnya untuk tempoh yang lebih panjang."
        ),
      ]
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_NON_CURRENT_LIABILITIES,
      "Liabiliti Bukan Semasa",
      `Liabiliti bukan semasa (juga dipanggil liabiliti jangka panjang) adalah hutang atau
      obligasi yang tidak perlu dibayar oleh perniagaan dalam tempoh 12 bulan akan datang.
      Ini adalah komitmen kewangan jangka panjang yang akan dibayar oleh perniagaan
      dalam tempoh masa yang lebih lama daripada setahun.
      Secara ringkasnya: Liabiliti bukan semasa adalah hutang yang terhutang oleh perniagaan,
      tetapi ia tidak perlu membayarnya tidak lama lagi. Sebaliknya, ia akan membayarnya pada
      masa hadapan, selama bertahun-tahun.`,
      `Liabiliti bukan semasa membantu menunjukkan berapa banyak wang yang terhutang oleh
      perniagaan dalam jangka masa panjang. Ia penting untuk memahami kesihatan kewangan
      jangka panjang syarikat.
      Sebagai contoh, perniagaan dengan banyak hutang jangka panjang mungkin mengambil
      lebih banyak risiko kewangan pada masa hadapan, tetapi selagi ia boleh membuat
      pembayarannya dari semasa ke semasa, ia tidak menjadi kebimbangan segera.
      Sebaliknya, jika perniagaan mempunyai terlalu banyak hutang jangka pendek (liabiliti
      semasa) dan tidak cukup tunai untuk menampungnya, itu boleh menjadi masalah yang
      lebih besar untuk operasi hariannya.
      Perbezaan Utama: Liabiliti semasa adalah hutang yang perlu dibayar perniagaan dalam
      tempoh setahun. Liabiliti bukan semasa adalah hutang yang akan dibayar dalam tempoh
      lebih lama daripada satu tahun.`,
      "Berikut adalah beberapa contoh liabiliti bukan semasa yang biasa:",
      [
        new ManagementAccountItemExample(
          "Pinjaman Jangka Panjang",
          `Sesebuah perniagaan mungkin meminjam sejumlah besar wang daripada bank untuk
          membeli harta, peralatan, atau melabur dalam projek jangka panjang. Jika pinjaman
          itu perlu dibayar balik selama beberapa tahun, ia dianggap sebagai liabiliti bukan semasa.
          Contoh: Jika perniagaan mengambil pinjaman 5 tahun untuk \$100,000, ia akan
          membayarnya balik selama 5 tahun. Jumlah yang perlu dibayar melebihi 12 bulan
          akan datang dianggap sebagai liabiliti bukan semasa.`,
          "Wang ini tidak perlu dibayar balik dengan segera, tetapi perniagaan akan membuat bayaran tetap dari semasa ke semasa."
        ),
        new ManagementAccountItemExample(
          "Bon Belum Bayar",
          `Kadangkala, syarikat meminjam sejumlah besar wang dengan mengeluarkan bon.
          Pelabur membeli bon tersebut, dan syarikat berjanji untuk membayar balik pemegang
          bon pada masa hadapan, biasanya dalam beberapa tahun.
          Contoh: Syarikat mungkin mengeluarkan bon bernilai \$1 juta, bersetuju untuk membayar
          balik pelabur dalam tempoh 10 tahun.`,
          "Seperti pinjaman jangka panjang, bon belum bayar mewakili wang yang akan dibayar balik pada masa hadapan, bukan serta-merta."
        ),
        new ManagementAccountItemExample(
          "Obligasi Pajakan (Pajakan Jangka Panjang)",
          `Jika perniagaan memajak harta atau peralatan selama bertahun-tahun, bayaran
          pajakan yang akan dibuat pada masa hadapan dianggap sebagai liabiliti bukan semasa.
          Contoh: Syarikat mungkin memajak ruang pejabat selama 10 tahun. Bayaran yang akan
          dibuat selepas tahun pertama dianggap sebagai liabiliti bukan semasa.`,
          "Bayaran ini akan tersebar selama bertahun-tahun, jadi perniagaan tidak perlu membayar semuanya sekaligus."
        ),
        new ManagementAccountItemExample(
          "Liabiliti Pencen",
          `Sesetengah perniagaan berjanji untuk membayar faedah persaraan kepada pekerja
          selepas mereka bersara. Perniagaan mungkin tidak perlu membayar jumlah ini dengan
          segera, tetapi ia mempunyai obligasi untuk membuat bayaran ini pada masa hadapan.
          Contoh: Syarikat berjanji untuk membayar pencen kepada pekerja apabila mereka bersara dalam tempoh 20 tahun.`,
          "Syarikat akan secara beransur-ansur menyimpan atau mengetepikan wang untuk bayaran masa hadapan ini."
        ),
      ]
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_REVENUE,
      "Hasil",
      `Hasil mewakili jumlah pendapatan yang dijana oleh perniagaan daripada operasi
      utamanya, seperti jualan barangan atau perkhidmatan.
      Hasil adalah titik permulaan untuk menganalisis prestasi kewangan syarikat.`,
      "",
      "",
      []
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_COST_OF_GOODS_SOLD,
      "Kos Barang Dijual",
      `Kos Barang Dijual mewakili kos langsung yang ditanggung untuk menghasilkan atau membeli
      barangan yang dijual oleh syarikat. Ia termasuk semua perbelanjaan yang terikat secara
      langsung kepada pengeluaran atau perolehan barangan, seperti bahan mentah, buruh, dan kos pengilangan.`,
      "",
      "",
      []
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_OTHER_INCOME,
      "Pendapatan Lain",
      `Pendapatan Lain merujuk kepada hasil yang dijana daripada aktiviti yang bukan
      sebahagian daripada operasi teras syarikat. Ia termasuk pendapatan daripada sumber
      sekunder atau sampingan yang menyumbang kepada keuntungan keseluruhan tetapi
      tidak terikat secara langsung kepada aktiviti perniagaan utama.`,
      "",
      "",
      []
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_EXPENSES,
      "Perbelanjaan",
      `Perbelanjaan mewakili kos yang ditanggung oleh perniagaan untuk menjana hasil
      dan mengekalkan operasi. Ia adalah aliran keluar sumber atau obligasi yang diambil
      untuk menjalankan syarikat, dan ia secara langsung memberi kesan kepada keuntungan.`,
      "",
      "",
      []
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_OTHER_ASSETS,
      "Aset Lain",
      "Aset Lain adalah penting untuk menyediakan gambaran lengkap kedudukan kewangan syarikat.",
      "",
      "Contoh Aset Lain:",
      [
        new ManagementAccountItemExample(
          "Aset Cukai Tertunda",
          "Cukai terlebih bayar atau kerugian cukai dibawa ke hadapan yang boleh mengurangkan liabiliti cukai masa hadapan.",
          ""
        ),
        new ManagementAccountItemExample(
          "Pelaburan Jangka Panjang",
          "Pelaburan yang dipegang selama lebih daripada setahun, seperti bon, saham, atau hartanah yang tidak digunakan dalam operasi.",
          ""
        ),
      ]
    ),
    new ManagementAccountItem(
      this.MORE_INFO_TARGET_OTHER_LIABILITIES,
      "Liabiliti Lain",
      `Liabiliti Lain merujuk kepada obligasi yang tidak termasuk dalam kategori liabiliti
      piawai seperti liabiliti semasa atau jangka panjang.
      Liabiliti ini biasanya tidak berkaitan dengan operasi, luar biasa, atau bersifat pelbagai.
      Ia disenaraikan sebagai item baris yang berasingan dalam kunci kira-kira, memastikan
      pelaporan kewangan adalah jelas dan tepat.`,
      "Liabiliti lain adalah penting untuk memahami gambaran kewangan syarikat yang lengkap.",
      "Contoh Liabiliti Lain:",
      [
        new ManagementAccountItemExample(
          "Hasil Tertunda (Jangka Panjang)",
          "Bayaran yang diterima terlebih dahulu untuk barangan atau perkhidmatan yang akan dihantar dalam tempoh masa hadapan.",
          ""
        ),
        new ManagementAccountItemExample(
          "Liabiliti Kontinjen",
          "Obligasi potensi yang bergantung kepada hasil peristiwa yang tidak menentu, seperti tuntutan mahkamah atau jaminan.",
          ""
        ),
      ]
    ),
  ]
}
