export class ApplicationRedoController {
  emitEvents: any | null = null

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents
  }
}
