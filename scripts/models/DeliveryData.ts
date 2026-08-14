import { Coordinate } from "../types/Coordinate"

export class DeliveryData {
  total: number | null = null
  currency: number | null = null
  provider: string | null = null
  details: DeliveryDataDetails | null = null
  index: number | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof DeliveryData) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.total = data.total ?? null
    this.currency = data.currency ?? null
    this.provider = data.provider ?? null
    this.details = data.details ? new DeliveryDataDetails(data.details) : null
    this.index = data.index ?? null
  }

  clone(data: DeliveryData): void {
    this.total = data.total ?? null
    this.currency = data.currency ?? null
    this.provider = data.provider ?? null
    this.details = data.details ? new DeliveryDataDetails(data.details) : null
    this.index = data.index ?? null
  }

  getRequestBody(): object {
    return {
      total: this.total,
      currency: this.currency,
      provider: this.provider,
      details: this.details ? this.details.getRequestBody() : null,
      index: this.index,
    }
  }
}

//NOTE: This is mainly for Lalamove
export class DeliveryDataDetails {
  quotationId: string | null = null
  scheduleAt: string | null = null
  expiresAt: string | null = null
  serviceType: string | null = null
  language: string | null = null
  stops: DeliveryDataDetailsStops[] | null = null
  isRouteOptimized: boolean | null = null
  priceBreakdown: DeliveryDataDetailsPriceBreakdown | null = null
  distance: DeliveryDataDetailsDistance | null = null

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof DeliveryDataDetails) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.quotationId = data.quotationId ?? null
    this.scheduleAt = data.scheduleAt ?? null
    this.expiresAt = data.expiresAt ?? null
    this.serviceType = data.serviceType ?? null
    this.language = data.language ?? null
    this.stops =
      data.stops && Array.isArray(data.stops)
        ? data.stops.map((st: any) => {
            return new DeliveryDataDetailsStops(st)
          })
        : null
    this.isRouteOptimized = data.isRouteOptimized ?? null
    this.priceBreakdown = data.priceBreakdown ? new DeliveryDataDetailsPriceBreakdown(data.priceBreakdown) : null
    this.distance = data.distance ? new DeliveryDataDetailsDistance(data.distance) : null
  }

  clone(data: DeliveryDataDetails): void {
    this.quotationId = data.quotationId ?? null
    this.scheduleAt = data.scheduleAt ?? null
    this.expiresAt = data.expiresAt ?? null
    this.serviceType = data.serviceType ?? null
    this.language = data.language ?? null
    this.stops =
      data.stops && Array.isArray(data.stops)
        ? data.stops.map((st: any) => {
            return new DeliveryDataDetailsStops(st)
          })
        : null
    this.isRouteOptimized = data.isRouteOptimized ?? null
    this.priceBreakdown = data.priceBreakdown ? new DeliveryDataDetailsPriceBreakdown(data.priceBreakdown) : null
    this.distance = data.distance ? new DeliveryDataDetailsDistance(data.distance) : null
  }

  getRequestBody(): object {
    return {
      quotationId: this.quotationId,
      scheduleAt: this.scheduleAt,
      expiresAt: this.expiresAt,
      serviceType: this.serviceType,
      language: this.language,
      stops: this.stops
        ? this.stops.map((st: DeliveryDataDetailsStops) => {
            return st.getRequestBody()
          })
        : null,
      isRouteOptimized: this.isRouteOptimized,
      priceBreakdown: this.priceBreakdown ? this.priceBreakdown.getRequestBody() : null,
      distance: this.distance ? this.distance.getRequestBody() : null,
    }
  }
}

export class DeliveryDataDetailsStops {
  stopId: string = ""
  coordinates: Coordinate = new Coordinate(0, 0)
  address: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof DeliveryDataDetailsStops) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.stopId = data.stopId
    this.coordinates = new Coordinate(data.lat, data.lng)
    this.address = data.address
  }

  clone(data: DeliveryDataDetailsStops): void {
    this.stopId = data.stopId
    this.coordinates = new Coordinate(data.coordinates.latitude, data.coordinates.longitude)
    this.address = data.address
  }

  getRequestBody(): object {
    return {
      // stopId: this.stopId,
      coordinates: {
        lat:
          typeof this.coordinates.latitude !== "string"
            ? this.coordinates.latitude.toString()
            : this.coordinates.latitude,
        lng:
          typeof this.coordinates.longitude !== "string"
            ? this.coordinates.longitude.toString()
            : this.coordinates.longitude,
      },
      address: this.address,
    }
  }
}

export class DeliveryDataDetailsPriceBreakdown {
  base: number = 0.0
  surcharge: number = 0.0
  totalBeforeOptimization: number = 0.0
  totalExcludePriorityFee: number = 0.0
  total: number = 0.0
  currency: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof DeliveryDataDetailsPriceBreakdown) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.base = data.base
    this.surcharge = data.surcharge
    this.totalBeforeOptimization = data.totalBeforeOptimization
    this.totalExcludePriorityFee = data.totalExcludePriorityFee
    this.total = data.total
    this.currency = data.currency
  }

  clone(data: DeliveryDataDetailsPriceBreakdown): void {
    this.base = data.base
    this.surcharge = data.surcharge
    this.totalBeforeOptimization = data.totalBeforeOptimization
    this.totalExcludePriorityFee = data.totalExcludePriorityFee
    this.total = data.total
    this.currency = data.currency
  }

  getRequestBody(): object {
    return {
      base: this.base,
      surcharge: this.surcharge,
      totalBeforeOptimization: this.totalBeforeOptimization,
      totalExcludePriorityFee: this.totalExcludePriorityFee,
      total: this.total,
      currency: this.currency,
    }
  }
}

export class DeliveryDataDetailsDistance {
  value: number = 0.0
  unit: string = ""

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof DeliveryDataDetailsDistance) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.value = data.value
    this.unit = data.unit
  }

  clone(data: DeliveryDataDetailsDistance): void {
    this.value = data.value
    this.unit = data.unit
  }

  getRequestBody(): object {
    return {
      value: this.value,
      unit: this.unit,
    }
  }
}
