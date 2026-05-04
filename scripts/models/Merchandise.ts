import type { IModel } from "./IModel"
import { MerchandiseTypes } from "../constants/Merchandises"
import { File } from "./File"
import { MerchandiseTag } from "./MerchandiseTag"
import { MerchandiseCategory } from "./MerchandiseCategory"
import { MerchandiseDeliveryOption } from "./MerchandiseDeliveryOption"
import { ServicePricing } from "./ServicePricing"

export class Merchandise implements IModel<Merchandise> {
  id: string = ""
  name: string = ""
  description: string = ""
  priceMember: number = 0
  price: number = 0
  tags: MerchandiseTag[] = []
  categories: MerchandiseCategory[] = []
  images: File[] = []
  type: string = ""
  isDownloadable: boolean = false

  deliveryOptions: MerchandiseDeliveryOption[] = []
  fileId: string | null = null
  file: File | null = null
  altFileId: string | null = null
  altFile: File | null = null

  // Dimensions
  hasDimension: boolean = false
  weight: number = 0
  width: number = 0
  height: number = 0
  thickness: number = 0
  volume: number = 0

  // Inventory
  inventoryCount: number = 0
  stockOnHold: number = 0
  hasStock: boolean = false
  isThirdParty: boolean = false

  servicePricing: ServicePricing = new ServicePricing()

  // Recommendataion
  recommendations: Merchandise[] = []

  constructor(data: any | null = null) {
    if (!data) {
      return
    }

    if (data instanceof Merchandise) {
      this.clone(data)
    } else {
      this.convertFromResponse(data)
    }
  }

  convertFromResponse(data: any): void {
    this.id = data.id
    this.name = data.name
    this.price = Number(data.price_non_member)
    this.priceMember = Number(data.price_member)
    this.description = data.description
    this.tags = data.tags
      ? data.tags.map((tag: any) => {
          return new MerchandiseTag(tag)
        })
      : []
    this.categories = data.categories
      ? data.categories.map((category: any) => {
          return new MerchandiseCategory(category)
        })
      : []

    this.images =
      data.images.length > 0
        ? data.images.map((val: any) => {
            return new File(val.file)
          })
        : []
    this.type = data.type ?? MerchandiseTypes.Physical
    this.isDownloadable = data.is_downloadable

    this.deliveryOptions =
      data.delivery_options.length > 0
        ? data.delivery_options.map((option: any) => {
            return new MerchandiseDeliveryOption(option)
          })
        : []
    this.fileId = data.file_id
    this.file = data.file
    this.altFileId = data.alt_file_id
    this.altFile = data.alt_file

    // Dimensions
    this.weight = data.weight ? parseInt(data.weight) : 0
    this.width = data.width ? parseInt(data.width) : 0
    this.height = data.height ? parseInt(data.height) : 0
    this.thickness = data.thickness ? parseInt(data.thickness) : 0
    this.volume = data.width * data.height * data.thickness ? data.width * data.height * data.thickness : 0
    this.hasDimension = this.weight > 0 || this.width > 0 || this.height > 0

    // Inventory
    this.inventoryCount = data.inventory_count
    this.stockOnHold = data.stock_on_hold
    this.hasStock = data.has_stock
    this.isThirdParty = data.is_third_party

    this.servicePricing = new ServicePricing(data.service_pricing)
  }

  clone(data: Merchandise): void {
    this.id = data.id
    this.name = data.name
    this.price = data.price
    this.priceMember = data.priceMember
    this.description = data.description
    this.tags = data.tags.map((tag: MerchandiseTag) => {
      return new MerchandiseTag(tag)
    })
    this.categories = data.categories.map((category: MerchandiseCategory) => {
      return new MerchandiseCategory(category)
    })
    this.images = data.images.map((file: File) => {
      return new File(file)
    })
    this.type = data.type
    this.isDownloadable = data.isDownloadable

    this.deliveryOptions = data.deliveryOptions.map((file: MerchandiseDeliveryOption) => {
      return new MerchandiseDeliveryOption(file)
    })
    this.fileId = data.fileId
    this.file = data.file !== null ? new File(data.file) : null
    this.altFileId = data.altFileId
    this.altFile = data.altFile !== null ? new File(data.altFile) : null

    // Dimensions
    this.weight = data.weight
    this.width = data.width
    this.height = data.height
    this.thickness = data.thickness
    this.volume = data.volume
    this.hasDimension = data.hasDimension

    // Inventory
    this.inventoryCount = data.inventoryCount
    this.stockOnHold = data.stockOnHold
    this.hasStock = data.hasStock
    this.isThirdParty = data.isThirdParty

    this.servicePricing = new ServicePricing(data.servicePricing)
  }

  getRequestBody(): object {
    return {}
  }
}
