export class AccessRule {
  id: string = ""
  module: string = ""
  serviceName: string = ""
  serviceDisplayName: string = ""
  accessType: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof AccessRule) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.module = data.module
    this.serviceName = data.service_name
    this.serviceDisplayName = data.service_display_name
    this.accessType = data.access_type
  }

  clone(data: AccessRule): void {
    this.id = data.id
    this.module = data.module
    this.serviceName = data.serviceName
    this.serviceDisplayName = data.serviceDisplayName
    this.accessType = data.accessType
  }
}
