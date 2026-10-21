import moment from "moment"

export class AnnualReturnCalendar {
  items: AnnualReturnCalendarItem[] = []
  startDate: string = ""
  endDate: string = ""

  constructor(startDate: string, endDate: string, data: any) {
    this.startDate = startDate
    this.endDate = endDate

    if (data) {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any) {
    if (!Array.isArray(data)) {
      return
    }

    this.items = data.map((d) => {
      return new AnnualReturnCalendarItem(d)
    })
  }

  clone(data: AnnualReturnCalendar) {
    this.startDate = data.startDate
    this.endDate = data.endDate

    if (!Array.isArray(data.items)) {
      return
    }

    this.items = data.items.map((d) => {
      const newItem = new AnnualReturnCalendarItem()
      newItem.clone(d)

      return newItem
    })
  }
}

export class AnnualReturnCalendarItem {
  date: string = ""
  noOfCompanies: number = 0
  totalPaid: number = 0
  companiesPaid: AnnualReturnCalendarItemCompany[] = []
  totalUnpaid: number = 0
  companiesUnpaid: AnnualReturnCalendarItemCompany[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof AnnualReturnCalendarItem) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.date = data.date ?? ""
    this.noOfCompanies = data.no_of_companies
    this.totalPaid = data.total_paid
    this.companiesPaid = Array.isArray(data.paid)
      ? data.paid.map((d: any) => {
          return new AnnualReturnCalendarItemCompany(d.id ?? "", d.name ?? "")
        })
      : typeof data.paid === "object"
        ? Object.values(data.paid).map((d: any) => {
            return new AnnualReturnCalendarItemCompany(d.id ?? "", d.name ?? "")
          })
        : []
    this.totalUnpaid = data.total_not_paid
    this.companiesUnpaid = Array.isArray(data.unpaid)
      ? data.unpaid.map((d: any) => {
          return new AnnualReturnCalendarItemCompany(d.id ?? "", d.name ?? "")
        })
      : typeof data.unpaid === "object"
        ? Object.values(data.unpaid).map((d: any) => {
            return new AnnualReturnCalendarItemCompany(d.id ?? "", d.name ?? "")
          })
        : []
  }

  clone(data: AnnualReturnCalendarItem): void {
    this.date = data.date
    this.noOfCompanies = data.noOfCompanies
    this.totalPaid = data.totalPaid
    this.companiesPaid = data.companiesPaid
      ? data.companiesPaid.map((d) => {
          return new AnnualReturnCalendarItemCompany(d.id ?? "", d.name ?? "")
        })
      : []
    this.totalUnpaid = data.totalUnpaid
    this.companiesUnpaid = data.companiesUnpaid
      ? data.companiesUnpaid.map((d) => {
          return new AnnualReturnCalendarItemCompany(d.id ?? "", d.name ?? "")
        })
      : []
  }
}

export class AnnualReturnCalendarItemCompany {
  id = ""
  name = ""

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }
}
