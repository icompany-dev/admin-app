import type { PropsUserDetail } from "~/scripts/props/PropsUserDetail"
import { UserController } from "./UserController"

export class DirectorController extends UserController {
  constructor(props: PropsUserDetail, emitEvents: any) {
    super(props, useDirectorStore(), emitEvents)
  }
}
