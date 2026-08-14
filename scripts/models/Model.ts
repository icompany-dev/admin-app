import { Application } from "./Application"
import type { IApplication } from "./IApplication"

export class Model extends Application implements IApplication {
  constructor() {
    super()
    //This is a dummy class in the case where there is no specific model, but model is needed
  }
}
