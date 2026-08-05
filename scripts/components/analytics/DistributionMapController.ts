import { AnalyticsCompanyCoordinate } from "~/scripts/models/AnalyticsCompanyCoordinate"
import { AnalyticsUserCoordinate } from "~/scripts/models/AnalyticsUserCoordinate"
import { State } from "~/scripts/models/Location"
import { MsicCode } from "~/scripts/models/MsicCode"

export class DistributionMapController {
  userCoordinates: Ref<AnalyticsUserCoordinate[]> = ref<AnalyticsUserCoordinate[]>([])
  companyCoordinates: Ref<AnalyticsCompanyCoordinate[]> = ref<AnalyticsCompanyCoordinate[]>([])
  natureOfBusinesses: Ref<any[]> = ref<any[]>([])
  states: Ref<State[]> = ref<State[]>([])

  emitEvents: any | null = null

  isLoading: Ref<boolean> = ref<boolean>(false)

  constructor(props: any, emitEvents: any) {
    this.emitEvents = emitEvents

    this.init()
  }

  async init(): Promise<void> {
    if (this.isLoading.value) {
      return
    }

    try {
      this.isLoading.value = true

      await Promise.allSettled([this.fetchUserCoordinates(), this.fetchCompanyCoordinates(), this.fetchStates()])
    } catch (e) {
      console.error(e)
    } finally {
      this.isLoading.value = false
    }
  }

  async fetchUserCoordinates(): Promise<void> {
    this.userCoordinates.value = []

    let repository = useAnalyticsStore()
    let response = await repository.fetchUserCoordinates()
    this.userCoordinates.value = response.map((d: any) => {
      return new AnalyticsUserCoordinate(d)
    })
  }
  async fetchCompanyCoordinates() {
    this.companyCoordinates.value = []
    this.natureOfBusinesses.value = []

    let repository = useAnalyticsStore()
    let response = await repository.fetchCompanyCoordinates()
    this.companyCoordinates.value = response.map((d: any) => {
      return new AnalyticsCompanyCoordinate(d)
    })

    this.natureOfBusinesses.value = Array.from(
      new Set(
        this.companyCoordinates.value.flatMap((cc) => {
          return cc.msicCodes
        })
      )
    ).map((msicCode) => {
      return {
        code: msicCode.code,
        color: null,
      }
    })

    const shadesOfColor = this.generateColorShades("#530247", this.natureOfBusinesses.value.length)
    this.natureOfBusinesses.value.forEach((nob, index) => {
      nob.color = shadesOfColor[index]
    })
  }

  async fetchStates() {
    this.states.value = []

    let repository = useStateStore()
    let response = await repository.byCountryId(87) //malaysia only
    this.states.value = repository.states.map((d: any) => {
      return new State(d)
    })
  }

  private generateColorShades(baseHex: string, numberOfShades: number) {
    const [h, s] = this.hexToHsl(baseHex)
    const shades = []
    const minLightness = 15
    const maxLightness = 90
    const step = (maxLightness - minLightness) / (numberOfShades - 1)

    for (let i = 0; i < numberOfShades; i++) {
      const lightness = minLightness + i * step
      shades.push(this.hslToHex(h, s, lightness))
    }
    return shades.reverse() // To get darker shades first
  }

  private hslToHex(h: number, s: number, l: number): string {
    l /= 100
    const a = (s * Math.min(l, 1 - l)) / 100
    const f = (n: any) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0")
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  private hexToHsl(hex: string): any {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!result) {
      return [360, 100, 100]
    }

    const r = parseInt(result[1], 16) / 255
    const g = parseInt(result[2], 16) / 255
    const b = parseInt(result[3], 16) / 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2
    if (max === min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }
    return [h * 360, s * 100, l * 100]
  }
}
