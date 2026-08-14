import _ from "lodash"
import moment from "moment"
import { ObjectUtil } from "../../utils/Object"
import { StringUtil } from "../../utils/String"

export class OcrData {
  textExtracted: any = {}
  documentDate: string = ""
  referenceNumber: string = ""
  bankName: string = ""
  openingBalance: number = 0
  total: number = 0
  from: string = ""
  page: number = 1

  constructor(jsonObject: any | null = null) {
    if (jsonObject) {
      if (jsonObject.text_extracted) {
        if (ObjectUtil.isObject(jsonObject.text_extracted)) {
          this.textExtracted = _.cloneDeep(jsonObject.text_extracted)
        } else if (
          typeof jsonObject.text_extracted === "string" &&
          !StringUtil.isNullOrEmpty(jsonObject.text_extracted)
        ) {
          try {
            this.textExtracted = JSON.parse(jsonObject.text_extracted)
          } catch (e) {
            this.textExtracted = {}
          }
        } else {
          this.textExtracted = {}
        }
      }
    }

    if (jsonObject.bank_name) {
      this.bankName = jsonObject.bank_name
    }

    if (jsonObject.total) {
      this.total = jsonObject.total
    }

    if (jsonObject.from) {
      this.from = jsonObject.from
    }

    if (jsonObject.document_date) {
      this.documentDate = jsonObject.document_date
    }

    if (jsonObject.ref_no) {
      this.referenceNumber = jsonObject.ref_no
    }

    if (jsonObject.page) {
      this.page = jsonObject.page
    }
  }

  getObjectPropertyValues(): any {
    // Must be overridden by child
    return []
  }

  getItemValues(): any {
    return []
  }

  getExtractedTextForDisplay() {
    const extracted: any = []
    Object.keys(this.textExtracted).forEach((key) => {
      extracted.push(this.textExtracted[key])
    })

    return extracted
  }

  getValue(item: any) {
    if (item === null || typeof item === "undefined") {
      return ""
    }

    if (Array.isArray(item)) {
      const itemValues: any = []
      item.forEach((i) => {
        const val = this.getValue(i)
        if (!StringUtil.isNullOrEmpty(val)) {
          itemValues.push()
        }
      })

      return itemValues.join(", ")
    }

    if (typeof item === "object") {
      const itemValues: any = []
      Object.keys(item).forEach((k) => {
        const i = item[k]
        const val = this.getValue(i)
        if (!StringUtil.isNullOrEmpty(val)) {
          itemValues.push()
        }
      })

      return itemValues.join(", ")
    }

    return String(item)
  }
}
