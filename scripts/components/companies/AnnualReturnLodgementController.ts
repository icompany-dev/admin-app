import type { PropsAnnualReturnLodgement } from "~/scripts/props/PropsAnnualReturnLodgement"

export class AnnualReturnLodgementController {
  companyId: Ref<string> = ref<string>("")
  year: Ref<number> = ref<number>(0)

  emitEvents: any | null = null

  constructor(props: PropsAnnualReturnLodgement, emitEvents: any) {
    this.emitEvents = emitEvents
  }

  setDataFromProps(props: PropsAnnualReturnLodgement): void {
    this.companyId.value = props.companyId
    this.year.value = props.year
  }
}
