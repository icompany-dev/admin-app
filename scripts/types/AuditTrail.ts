import { AuditTrailDayType, AuditTrailAction } from "../constants/AuditTrails"
import { ServiceName, ServiceNames } from "../constants/ServiceNames"
import type { ActivityRegister } from "../models/ActivityRegister"

export class AuditTrail {
  year: string = ""
  dayType: AuditTrailDayType = AuditTrailDayType.Today
  time: string = ""
  date: string = ""
  action: string = ""
  userName: string = ""
  companyName: string = ""
  createdAt: string = ""

  constructor() {}

  setDataFromActivityRegister(data: ActivityRegister, isMalay: boolean): void {
    let dayjs = useDayjs()
    let time = useLocalTime()

    this.year = time.formatYearOnly(data.createdAt)
    this.time = time.formatTimeOnly(data.createdAt)
    this.date = time.formatDateTimeShort(data.createdAt)
    this.createdAt = data.createdAt

    this.userName = data.user.name
    this.companyName = data.company?.getFullName() ?? ""

    let serviceName = ""
    let status = isMalay
      ? data.status === "success"
        ? "berjaya"
        : "tidak berjaya"
      : data.status === "success"
        ? "successful"
        : "unsuccessful"
    switch (data.action) {
      case AuditTrailAction.Login:
        this.action = `${isMalay ? "Log Masuk" : "Login"} ${status}`
        break
      case AuditTrailAction.Logout:
        this.action = `${isMalay ? "Log Keluar" : "Logout"} ${status}`
        break
      case AuditTrailAction.View:
        this.action = isMalay ? `${data.additionalInfo} diakses.` : `${data.additionalInfo} is accessed.`
        break
      case AuditTrailAction.Download:
        this.action = isMalay
          ? `${data.additionalInfo} ${status} dimuat turun`
          : `${data.additionalInfo} ${status} downloaded`
        break
      case AuditTrailAction.Initiate:
        serviceName = this.serviceName(data.targetType, isMalay)
        this.action = isMalay ? `${this.userName} Mulakan ${serviceName}` : `${this.userName} Initiated ${serviceName}`
        break
      case AuditTrailAction.Update:
        serviceName = this.serviceName(data.targetType, isMalay)
        this.action = isMalay
          ? `${this.userName} Mengemaskini ${serviceName}`
          : `${this.userName} Updated ${serviceName}`
        break
      case AuditTrailAction.Sign:
        serviceName = this.serviceName(data.targetType, isMalay)
        this.action = isMalay
          ? `${this.userName} tandatangan ${serviceName}`
          : `${this.userName} signed on ${serviceName}`
        break
      case AuditTrailAction.MakePayment:
        serviceName = this.serviceName(data.targetType, isMalay)
        this.action = isMalay ? `${serviceName} dibayar.` : `${serviceName} is paid.`
        break
      case AuditTrailAction.MadePayment:
        this.action = isMalay ? `Bayaran ${status}` : `Payment ${status}`
        break
      case AuditTrailAction.Revoke:
        serviceName = this.serviceName(data.targetType, isMalay)
        this.action = isMalay
          ? `${this.userName} Menarik balik ${serviceName}`
          : `${this.userName} Revoked ${serviceName}`
        break
      case AuditTrailAction.Delete:
        serviceName = this.serviceName(data.targetType, isMalay)
        this.action = isMalay ? `${this.userName} Memadam ${serviceName}` : `${this.userName} Removed ${serviceName}`
        break
      case AuditTrailAction.Search:
        this.action = isMalay ? `Cari ${data.additionalInfo}` : `Search ${data.additionalInfo}`
        break
    }
  }

  serviceName(target: string, isMalay: boolean): string {
    let serviceName = ServiceNames.names.find((sn: ServiceName) => {
      return sn.target === target
    })

    if (!serviceName) {
      return isMalay ? "Servis" : "Service"
    }

    return isMalay ? serviceName.bm : serviceName.en
  }
}
