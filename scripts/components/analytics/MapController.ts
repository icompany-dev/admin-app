import type { Map as LeafletMap, TileLayer, Marker } from "leaflet"
import type { PropsMap } from "~/scripts/props/PropsMap"
import { MapMarker } from "~/scripts/types/MapMarker"
import { ColorModeUtil } from "~/scripts/utils/ColorMode"
import type { UserLocation } from "~/scripts/types/maps/MapUserLocation"
import type { CompanyLocation } from "~/scripts/types/maps/MapCompanyLocation"
import { OfficeLocation } from "~/scripts/types/maps/MapOfficeLocation"
import { MapUtil } from "~/scripts/utils/Map"

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

    const officeHtml = `
    <div class="office-marker">
      <div class="office-radar"></div>
      <div class="office-icon">
       <i class="fa-solid fa-location-pin"></i>
      </div>
      <div class="office-name">
        iCompany
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
      draggable: false,
      zIndexOffset: 1000,
    }).addTo(this.markersLayer)

    officeMarker.bindPopup(`
      <div class="office-location-details">
        <div class="office-logo-name">
          <img src="/img/loader/loader.gif" > 
          <h4 class="font-bold text-sm text-slate-900 dark:text-white leading-tight">${this.office.name}</h4>
        </div>
        <div class="office-address">
          ${this.office.address}
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
    if (this.filters.viewMode === "all" || this.filters.viewMode === "companies") {
      this.companies.forEach((company) => {
        const color = MapUtil.getCompanyMarkerColor(company, this.filters.companyCategoryMode)
        const isSelected = this.selectedCompany?.id === company.id

        const companyHtml = `
          <div class="company-pin">
          <div class="detail ${isSelected ? "selected" : ""}" style="background-color: ${color};">
              <i class="fa-solid fa-building"></i>
            </div>
            <div class="w-1.5 h-1.5 bg-slate-800 dark:bg-white rounded-full mt-0.5 opacity-60"></div>
          </div>
        `

        const icon = L.divIcon({
          html: companyHtml,
          className: "company-pin-icon",
          iconSize: [32, 38],
          iconAnchor: [16, 36],
        })

        const marker = L.marker([company.lat, company.lng], { icon }).addTo(this.markersLayer)

        marker.bindTooltip(
          `
            <div class="font-semibold text-xs text-slate-900 dark:text-slate-100">${company.name}</div>
            <div class="text-[10px] text-slate-500">${company.businessNature} &bull; ${company.state}</div>
          `,
          { direction: "top", offset: [0, -32], opacity: 0.95 }
        )

        marker.on("click", () => {
          this.emitEvents("selectCompany", company)
        })
      })
    }

    // --- Draw Users ---
    if (this.filters.viewMode === "all" || this.filters.viewMode === "users") {
      this.users.forEach((user) => {
        const color = MapUtil.getUserMarkerColor(user, this.filters.userCategoryMode)
        const isSelected = this.selectedUser?.id === user.id

        const roleInitial = user.role.charAt(0)
        const userHtml = `
          <div class="user-pin">
            <div class="detail ${isSelected ? "selected" : ""}" style="background-color: ${color};">
              ${
                this.filters.userCategoryMode === "gender"
                  ? user.gender === "Male"
                    ? "<i class='fa-solid fa-person'></i>"
                    : "<i class='fa-solid fa-person-dress'></i>"
                  : this.filters.userCategoryMode === "age_group"
                    ? user.age
                    : roleInitial
              }
            </div>
            <div class="w-1 h-1 bg-slate-800 dark:bg-white rounded-full mt-0.5 opacity-60"></div>
          </div>
        `

        const icon = L.divIcon({
          html: userHtml,
          className: "user-pin-icon",
          iconSize: [28, 34],
          iconAnchor: [14, 32],
        })

        const marker = L.marker([user.lat, user.lng], { icon }).addTo(this.markersLayer)

        marker.bindTooltip(
          `
            <div class="font-semibold text-xs text-slate-900 dark:text-slate-100">${user.name}</div>
            <div class="text-[10px] text-slate-500">${user.role} @ ${user.companyName} (${user.gender}, ${user.age} y/o)</div>
          `,
          { direction: "top", offset: [0, -28], opacity: 0.95 }
        )

        marker.on("click", () => {
          this.emitEvents("selectUser", user)
        })
      })
    }

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
