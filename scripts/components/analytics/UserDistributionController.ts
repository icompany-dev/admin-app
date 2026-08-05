export class UserDistributionController {
  emitEvents: any | null = null

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents
  }
}
