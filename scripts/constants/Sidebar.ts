export class Sidebar {
  labelEn: string = ""
  labelBm: string = ""
  route: string = ""
  isDisabled: boolean = false

  constructor(labelEn: string, labelBm: string, route: string, isDisabled: boolean) {
    this.labelEn = labelEn
    this.labelBm = labelBm
    this.route = route
    this.isDisabled = isDisabled
  }

  onClick(): void {
    let router = useRouter()
    router.push({ path: `/${this.route}` })
  }

  get isShowing(): boolean {
    let route = useRoute()

    if (this.route === "") {
      return this.route === route.fullPath
    }

    return route.fullPath.includes(this.route)
  }
}

export class SidebarGroup {
  labelEn: string = ""
  labelBm: string = ""
  items: Sidebar[] = []
  isExpanded: boolean = false

  constructor(labelEn: string, labelBm: string, items: Sidebar[], isExpanded: boolean = false) {
    this.labelEn = labelEn
    this.labelBm = labelBm
    this.items = items
    this.isExpanded = isExpanded
  }

  get isShowChildren(): boolean {
    if (this.isExpanded) {
      return true
    }

    return this.items.some((item: Sidebar) => {
      return item.isShowing
    })
  }
}

export class PageSidebar {
  static commandCentre: Sidebar = new Sidebar("Command Centre", "Pusat Kawalan", "", false)
  static analytics: Sidebar = new Sidebar("Analytics", "Analytics", "command-centre/analytics", false)
  static dashboardGroup: SidebarGroup = new SidebarGroup(
    "Dashboard",
    "Dashboard",
    [this.commandCentre, this.analytics],
    true
  )

  static incorpDrafts: Sidebar = new Sidebar(
    "Ongoing Applications",
    "Permohonan Dalam Proses",
    "incorporations/ongoings",
    false
  )
  static incorpGroup: SidebarGroup = new SidebarGroup("New Incorporation", "Permerbadanan Baharu", [this.incorpDrafts])

  static switchDrafts: Sidebar = new Sidebar(
    "Ongoing Applications",
    "Permohonan Dalam Proses",
    "switches/ongoings",
    false
  )
  static switchNew: Sidebar = new Sidebar(
    "Reassignment Process Tracker",
    "Penjejak Proses Tugasan Semula",
    "switches/trackers",
    false
  )
  static switchGroup: SidebarGroup = new SidebarGroup("Reassignment of Secretary", "Pertukaran Setiausaha", [
    this.switchDrafts,
    this.switchNew,
  ])

  static sdnbhdAll: Sidebar = new Sidebar("All Sdn Bhd", "Semua Sdn Bhd", "sdnbhds/all", false)
  static sdnbhdAssign: Sidebar = new Sidebar(
    "Assign Company Secretary",
    "Lantik Setiausaha Syarikat",
    "sdnbhds/assign-cosec",
    false
  )
  static sdnbhdGroup: SidebarGroup = new SidebarGroup("Company", "Syarikat", [this.sdnbhdAll, this.sdnbhdAssign])

  static changeBusinessName: Sidebar = new Sidebar(
    "Change of Name",
    "Penukaran Nama",
    "services/change-business-name",
    false
  )
  static openBankAccount: Sidebar = new Sidebar(
    "Open Bank Account",
    "Buka Akaun Bank",
    "services/open-bank-account",
    false
  )
  static servicesGroup: SidebarGroup = new SidebarGroup("Secretarial Services", "Servis Setiausaha", [
    this.changeBusinessName,
    this.openBankAccount,
  ])

  static personsDraft: Sidebar = new Sidebar(
    "Registrations in Draft",
    "Pendaftaran Masih Draf",
    "users/onboardings",
    false
  )
  static personsRegistered: Sidebar = new Sidebar("All Registered Users", "Pengguna Pendaftar", "users/all", false)
  static personsAuditors: Sidebar = new Sidebar("List of Auditors", "Senarai Juruaudit", "users/auditors", false)
  static personsAccountants: Sidebar = new Sidebar(
    "List of Accountants",
    "Senarai Akauntan",
    "users/accountants",
    false
  )
  static personsGroup: SidebarGroup = new SidebarGroup(
    "Persons, Users, Roles & Access",
    "Individu, Pengguna, Peranan & Akses",
    [this.personsDraft, this.personsRegistered, this.personsAuditors, this.personsAccountants]
  )

  static controlPanelPricing: Sidebar = new Sidebar("Pricing", "Harga", "control-panel/pricings", false)
  static controlPanelMailroom: Sidebar = new Sidebar("Mail Room", "Bilik Surat", "control-panel/mail-room", false)
  static controlPanelLocation: Sidebar = new Sidebar(
    "Location and Postal Address",
    "Lokasi dan Alamat Menyurat",
    "control-panel/postal-location",
    true
  )
  static controlPanelServiceGeneralSettings: Sidebar = new Sidebar(
    "Service General Settings",
    "Tetapan Umum Perkhidmatan",
    "control-panel/service-settings",
    false
  )
  static controlPanelRonda: Sidebar = new Sidebar("RONDA", "RONDA", "control-panel/ronda", false)
  static controlPanelMSICCode: Sidebar = new Sidebar(
    "MSIC Codes Assist",
    "Bantuan Kod MSIC",
    "control-panel/msic-code-assists",
    true
  )
  static controlPanelAppearance: Sidebar = new Sidebar("Appearance", "Tetapan Rupa", "control-panel/appearance", true)
  static controlPanelGroup: SidebarGroup = new SidebarGroup("Control Panel", "Panel Tetapan", [
    this.controlPanelPricing,
    this.controlPanelMailroom,
    this.controlPanelLocation,
    this.controlPanelServiceGeneralSettings,
    this.controlPanelRonda,
    this.controlPanelMSICCode,
    this.controlPanelAppearance,
  ])

  static ITEMS = [
    this.dashboardGroup,
    this.incorpGroup,
    this.switchGroup,
    this.sdnbhdGroup,
    this.servicesGroup,
    this.personsGroup,
    this.controlPanelGroup,
  ]
}
