import { Company } from "~/scripts/models/Company"
import { StringUtil } from "~/scripts/utils/String"
import { Error } from "~/scripts/library/Error"
import type { Secretary } from "~/scripts/types/Secretary"
import { SecretaryInformation } from "~/scripts/constants/SecretaryInformation"
import { PaperOrientation } from "~/scripts/constants/Paper"
import { PropsSection236Three } from "~/scripts/props/PropsSection236Three"

export class Section236ThreeController {
  companyName: Ref<string> = ref<string>("")
  companyRegistrationNumberNew: Ref<string> = ref<string>("")
  companyRegistrationNumberOld: Ref<string> = ref<string>("")

  isLoading: Ref<boolean> = ref<boolean>(false)

  secretaries: Secretary[] = SecretaryInformation.SECRETARY_NAME_LIST
  selectedSecretary: Ref<Secretary> = ref<Secretary>(SecretaryInformation.SECRETARY_NAME_LIST[0])

  emitEvents: any | null = null

  paperOrientation: PaperOrientation = PaperOrientation.Portrait
  additionalCssClass: string = "section-236Three"

  isPrinting: Ref<boolean> = ref<boolean>(false)

  constructor(props: PropsSection236Three, emitEvents: any) {
    this.setDataFromProps(props)
    this.emitEvents = emitEvents
  }

  setDataFromProps(props: PropsSection236Three): void {
    this.companyName.value = props.companyName
    this.companyRegistrationNumberNew.value = props.companyRegistrationNumberNew
    this.companyRegistrationNumberOld.value = props.companyRegistrationNumberOld
  }

  get loaderLabel(): string {
    return "Preparing Your"
  }

  get loaderSublabel(): string {
    return "Declaration"
  }

  get declarationDate(): string {
    let dayjs = useDayjs()
    let currentDate = dayjs().format("YYYY-MM-DD")
    let time = useLocalTime()

    return time.formatDateOnlyFull(currentDate)
  }
}
