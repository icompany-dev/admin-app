import { AnnualReturnCalendar, AnnualReturnCalendarItem } from "~/scripts/models/AnnualReturnCalendar"
import { Filter } from "~/scripts/library/Filter"

export class CalendarController {
  emitEvents: any | null = null

  dayjs = useDayjs()
  language = useLanguage()

  isLoadingAnnualReturnCalendar: Ref<boolean> = ref<boolean>(false)
  annualReturnStartDate: Ref<string> = ref<string>(this.dayjs().startOf("month").format("YYYY-MM-DD"))
  annualReturnEndDate: Ref<string> = ref<string>(this.dayjs().endOf("month").format("YYYY-MM-DD"))
  annualReturnCalendarFilter: Ref<Filter> = ref<Filter>(new Filter())
  annualReturnCalendar: Ref<AnnualReturnCalendar> = ref<AnnualReturnCalendar>(new AnnualReturnCalendar("", "", []))

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents
  }

  async fetchAnnualReturnCalendar(): Promise<void> {
    //
  }

  get calendarAttributes(): any[] {
    return this.annualReturnCalendar.value.items.map((i: AnnualReturnCalendarItem, index) => {
      let color = "white"
      if (i.totalUnpaid > 0) {
        color = "red"
      } else if (i.noOfCompanies > 0) {
        color = "blue"
      }
      return {
        key: index,
        dates: new Date(i.date),
        bar: color,
        customData: {
          data: i,
          backgroundColor: color,
        },
      }
    })
  }

  get calendarTitle(): string {
    return this.dayjs(this.annualReturnStartDate.value).format("MMM YYYY")
  }
}
