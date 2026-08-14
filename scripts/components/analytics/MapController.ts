import type { Map as LeafletMap, TileLayer, Marker } from "leaflet"
import type { PropsMap } from "~/scripts/props/PropsMap"
import { MapMarker } from "~/scripts/types/MapMarker"
import { ColorModeUtil } from "~/scripts/utils/ColorMode"
import type { UserLocation } from "~/scripts/types/maps/MapUserLocation"
import type { CompanyLocation } from "~/scripts/types/maps/MapCompanyLocation"
import { OfficeLocation } from "~/scripts/types/maps/MapOfficeLocation"

export class MapController {
  mapContainerRef = ref<HTMLDivElement | null>(null)

  // Keep Leaflet map and layer references internal
  mapInstance: any = null
  tileLayer: TileLayer | null = null
  markersLayer: any = null
  proximityCirclesLayer: any = null
  polylineLayer: any = null
  LeafletLib: typeof import("leaflet") | null = null

  emitEvents: any | null = null

  isDarkMode: Ref<boolean> = ref<boolean>(false)

  // should these be reactive?
  users: UserLocation[] = [] //UserLocation
  companies: CompanyLocation[] = [] // CompanyLocation
  office: OfficeLocation = new OfficeLocation() // Company Coordinate
  filters: any // FilterState --TODO
  effectiveTheme: "light" | "dark" = "light"
  selectedUser?: UserLocation | null = null // UserLocation
  selectedCompany?: CompanyLocation | null = null
  mapTarget?: { lat: number; lng: number; zoom: number } | null = null

  // Better way to handle this?
  TILE_URLS = {
    light: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  }
  ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'

  constructor(props: PropsMap, emitEvents: any) {
    this.emitEvents = emitEvents

    this.isDarkMode.value = ColorModeUtil.isDarkMode()
    this.setDatafromProps(props)

    // this.initMap()
  }

  setDatafromProps(props: PropsMap, oldProps: PropsMap | null = null): void {
    this.users = props.users
    this.companies = props.companies
    this.office = props.office
    this.filters = props.filters
    this.selectedUser = props.selectedUser
    this.selectedCompany = props.selectedCompany
    this.mapTarget = props.mapTarget

    if (this.effectiveTheme !== props.effectiveTheme) {
      this.effectiveTheme = props.effectiveTheme
      if (this.tileLayer) {
        const isDark = this.effectiveTheme === "dark"
        let tileUrl = isDark ? this.TILE_URLS.dark : this.TILE_URLS.light

        this.tileLayer.setUrl(tileUrl)
      }
    }

    if (oldProps !== null) {
      if (!this.mapInstance) {
        return
      }

      if (props.mapTarget) {
        this.mapInstance.flyTo([props.mapTarget.lat, props.mapTarget.lng], props.mapTarget.zoom, {
          duration: 1.5,
        })
      } else if (props.selectedUser) {
        this.mapInstance.flyTo([props.selectedUser.lat, props.selectedUser.lng], 14, {
          duration: 1.2,
        })
      } else if (props.selectedCompany) {
        this.mapInstance.flyTo([props.selectedCompany.lat, props.selectedCompany.lng], 13, {
          duration: 1.2,
        })
      }
    }
  }

  setMapContainerRef(mapContainerRef: HTMLDivElement | null): void {
    this.mapContainerRef.value = mapContainerRef
    console.log("set", this.mapContainerRef.value)
  }

  async initMap(): Promise<void> {
    console.log("container", !this.mapContainerRef.value, this.mapInstance)
    if (!this.mapContainerRef.value || this.mapInstance) {
      return
    }

    this.LeafletLib = await import("leaflet")
    const L = this.LeafletLib

    const map = L.map(this.mapContainerRef.value, {
      center: [this.office.lat, this.office.lng],
      zoom: 11,
      zoomControl: false,
      maxBounds: [
        [0.5, 98.0],
        [8.5, 120.5],
      ],
      minZoom: 5,
      maxZoom: 18,
    })

    L.control.zoom({ position: "bottomright" }).addTo(map)

    const isDark = this.effectiveTheme === "dark"
    const tileUrl = isDark ? this.TILE_URLS.dark : this.TILE_URLS.light

    this.tileLayer = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map)

    this.markersLayer = L.layerGroup().addTo(map)
    this.proximityCirclesLayer = L.layerGroup().addTo(map)
    this.polylineLayer = L.layerGroup().addTo(map)

    this.mapInstance = map

    this.renderLayers()
  }

  renderLayers(): void {
    if (!this.mapInstance || !this.LeafletLib || !this.markersLayer) {
      console.log("skipping???")
      return
    }
    const L = this.LeafletLib

    this.markersLayer.clearLayers()
    this.proximityCirclesLayer.clearLayers()
    this.polylineLayer.clearLayers()

    const isDark = this.effectiveTheme === "dark"

    if (this.filters.showOfficeRadius) {
      // 5km circle
      L.circle([this.office.lat, this.office.lng], {
        radius: 5000,
        color: "#10b981",
        weight: 1.5,
        dashArray: "4, 6",
        fillColor: "#10b981",
        fillOpacity: isDark ? 0.08 : 0.05,
      }).addTo(this.proximityCirclesLayer)

      // 15km circle
      L.circle([this.office.lat, this.office.lng], {
        radius: 15000,
        color: "#3b82f6",
        weight: 1.5,
        dashArray: "6, 8",
        fillColor: "#3b82f6",
        fillOpacity: isDark ? 0.06 : 0.03,
      }).addTo(this.proximityCirclesLayer)

      // 50km circle
      L.circle([this.office.lat, this.office.lng], {
        radius: 50000,
        color: "#f97316",
        weight: 1,
        dashArray: "8, 12",
        fillColor: "#f97316",
        fillOpacity: isDark ? 0.04 : 0.02,
      }).addTo(this.proximityCirclesLayer)
    }

    this.renderOffice()
    this.renderOtherMarkers()
  }

  renderOffice(): void {
    if (!this.mapInstance || !this.LeafletLib || !this.markersLayer) {
      console.log("not marking")
      return
    }

    // todo: deal with the styling, change this to class
    const officeHtml = `
    <div class="relative flex items-center justify-center cursor-pointer group" style="width: 44px; height: 44px;">
      <div class="office-radar"></div>
      <div class="w-10 h-10 rounded-2xl bg-rose-600 border-2 border-white dark:border-slate-900 shadow-xl flex items-center justify-center text-white transform group-hover:scale-110 transition-transform">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      </div>
      <div class="absolute -bottom-6 bg-slate-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow whitespace-nowrap border border-slate-700 pointer-events-none">
        My Office (HQ)
      </div>
    </div>
  `

    const L = this.LeafletLib
    const officeIcon = L.divIcon({
      html: officeHtml,
      className: "office-pin",
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    })

    const officeMarker = L.marker([this.office.lat, this.office.lng], {
      icon: officeIcon,
      draggable: true,
      zIndexOffset: 1000,
    }).addTo(this.markersLayer)

    officeMarker.bindPopup(`
      <div class="p-3.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-w-[240px] rounded-xl">
        <div class="flex items-center gap-2 mb-1.5">
          <span class="inline-flex items-center justify-center p-1 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </span>
          <h4 class="font-bold text-sm text-slate-900 dark:text-white leading-tight">${this.office.name}</h4>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">${this.office.address}</p>
        <div class="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <div class="font-medium text-rose-600 dark:text-rose-400">Drag to reposition office</div>
          <div>All proximity calculations update automatically.</div>
        </div>
      </div>
    `)

    officeMarker.on("dragend", (e: any) => {
      const { lat, lng } = e.target.getLatLng()
      this.emitEvents("updateOfficePosition", { lat, lng })
    })
  }

  renderOtherMarkers(): void {
    if (!this.mapInstance || !this.LeafletLib || !this.markersLayer) {
      return
    }
    const L = this.LeafletLib

    // --- Draw Companies ---
    // if (this.filters.viewMode === "all" || this.filters.viewMode === "companies") {
    //   this.companies.forEach((company) => {
    //     const color = getCompanyMarkerColor(company, this.filters.companyCategoryMode)
    //     const isSelected = this.selectedCompany?.id === company.id

    //     const companyHtml = `
    //   <div class="custom-map-pin relative flex flex-col items-center group">
    //     <div class="w-8 h-8 rounded-lg shadow-lg flex items-center justify-center text-white border-2 ${
    //       isSelected ? "ring-4 ring-sky-400 scale-125 z-50" : "border-white dark:border-slate-900"
    //     }" style="background-color: ${color};">
    //       <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
    //       </svg>
    //     </div>
    //     <div class="w-1.5 h-1.5 bg-slate-800 dark:bg-white rounded-full mt-0.5 opacity-60"></div>
    //   </div>
    // `

    //     const icon = L.divIcon({
    //       html: companyHtml,
    //       className: "company-pin-icon",
    //       iconSize: [32, 38],
    //       iconAnchor: [16, 36],
    //     })

    //     const marker = L.marker([company.lat, company.lng], { icon }).addTo(markersLayer)

    //     marker.bindTooltip(
    //       `
    //   <div class="font-semibold text-xs text-slate-900 dark:text-slate-100">${company.name}</div>
    //   <div class="text-[10px] text-slate-500">${company.businessNature} &bull; ${company.state}</div>
    // `,
    //       { direction: "top", offset: [0, -32], opacity: 0.95 }
    //     )

    //     marker.on("click", () => {
    //       emit("selectCompany", company)
    //     })
    //   })
    // }

    // --- Draw Users ---
    // if (this.filters.viewMode === "all" || this.filters.viewMode === "users") {
    //   this.users.forEach((user) => {
    //     const color = getUserMarkerColor(user, this.filters.userCategoryMode)
    //     const isSelected = this.selectedUser?.id === user.id

    //     const roleInitial = user.role.charAt(0)
    //     const userHtml = `
    //   <div class="custom-map-pin relative flex flex-col items-center group">
    //     <div class="w-7 h-7 rounded-full shadow-md flex items-center justify-center text-white text-[11px] font-bold border-2 ${
    //       isSelected ? "ring-4 ring-amber-400 scale-125 z-50" : "border-white dark:border-slate-900"
    //     }" style="background-color: ${color};">
    //       ${
    //         this.filters.userCategoryMode === "gender"
    //           ? user.gender === "Male"
    //             ? "♂"
    //             : "♀"
    //           : this.filters.userCategoryMode === "age_group"
    //             ? user.age
    //             : roleInitial
    //       }
    //     </div>
    //     <div class="w-1 h-1 bg-slate-800 dark:bg-white rounded-full mt-0.5 opacity-60"></div>
    //   </div>
    // `

    //     const icon = L.divIcon({
    //       html: userHtml,
    //       className: "user-pin-icon",
    //       iconSize: [28, 34],
    //       iconAnchor: [14, 32],
    //     })

    //     const marker = L.marker([user.lat, user.lng], { icon }).addTo(markersLayer)

    //     marker.bindTooltip(
    //       `
    //   <div class="font-semibold text-xs text-slate-900 dark:text-slate-100">${user.name}</div>
    //   <div class="text-[10px] text-slate-500">${user.role} @ ${user.companyName} (${user.gender}, ${user.age} y/o)</div>
    // `,
    //       { direction: "top", offset: [0, -28], opacity: 0.95 }
    //     )

    //     marker.on("click", () => {
    //       emit("selectUser", user)
    //     })
    //   })
    // }

    // --- Draw Connecting Lines ---
    // if (this.filters.showConnectingLines) {
    //   if (this.selectedUser) {
    //     const targetCompany = this.companies.find((c) => c.id === this.selectedUser?.companyId)
    //     if (targetCompany) {
    //       L.polyline(
    //         [
    //           [this.selectedUser.lat, this.selectedUser.lng],
    //           [targetCompany.lat, targetCompany.lng],
    //         ],
    //         {
    //           color: "#3b82f6",
    //           weight: 3,
    //           opacity: 0.85,
    //           dashArray: "6, 8",
    //         }
    //       ).addTo(polylineLayer)
    //     }
    //   }

    //   if (this.selectedCompany) {
    //     const affiliatedUsers = this.users.filter((u) => u.companyId === this.selectedCompany?.id)
    //     affiliatedUsers.forEach((u) => {
    //       L.polyline(
    //         [
    //           [u.lat, u.lng],
    //           [this.selectedCompany!.lat, this.selectedCompany!.lng],
    //         ],
    //         {
    //           color: "#f59e0b",
    //           weight: 2,
    //           opacity: 0.75,
    //           dashArray: "4, 6",
    //         }
    //       ).addTo(polylineLayer)
    //     })
    //   }
    // }
  }
}
