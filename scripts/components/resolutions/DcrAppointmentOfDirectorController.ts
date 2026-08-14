import { CompanyDirectorAppointment } from "~/scripts/models/CompanyDirectorAppointment"
import { ResolutionAppointmentOfDirectorController } from "./ResolutionAppointmentOfDirectorController"
import type { IPropsResolutionDocument } from "~/scripts/props/PropsResolutionDocument"

export class DcrAppointmentOfDirectorController extends ResolutionAppointmentOfDirectorController {
  constructor(props: IPropsResolutionDocument<CompanyDirectorAppointment>, emitEvents: any | null) {
    super(props, true, emitEvents)
  }
}
