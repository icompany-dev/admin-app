export class ObjectUtil {
  static deepMerge(target: any, source: any) {
    const output: any = { ...target }

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (ObjectUtil.isObject(source[key]) && ObjectUtil.isObject(output[key])) {
          output[key] = ObjectUtil.deepMerge(output[key] || {}, source[key])
        } else {
          output[key] = source[key]
        }
      }
    }

    return output
  }

  static isObject(item: any): boolean {
    return typeof item === "object" && item !== null && !Array.isArray(item)
  }

  static sort<T>(objectArray: T[], key: keyof T, order: "asc" | "desc" = "asc"): T[] {
    const sorted = [...objectArray]

    return sorted.sort((a, b) => {
      const valueA = a[key]
      const valueB = b[key]

      if (valueA instanceof Date && valueB instanceof Date) {
        let dayjs = useDayjs()
        const diff = dayjs(valueA).diff(dayjs(valueB))
        return order === "asc" ? diff : -diff
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return order === "asc" ? valueA - valueB : valueB - valueA
      }

      return 0
    })
  }

  static isArrayEqual<T>(arrayA: T[], arrayB: T[]): boolean {
    if (arrayA.length !== arrayB.length) {
      return false
    }

    return arrayA.every((objA: T, index: number) => {
      const objB = arrayB[index]

      return this.isEqual<T>(objA, objB)
    })
  }

  static isEqual<T>(objA: T, objB: T): boolean {
    if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
      return objA === objB
    }

    const objAKeys = Object.keys(objA) as (keyof T)[]
    const objBKeys = Object.keys(objB) as (keyof T)[]

    if (objAKeys.length !== objBKeys.length) {
      return false
    }

    return objAKeys.every((key: keyof T) => {
      const valA = objA[key]
      const valB = objB[key]

      if (typeof valA === "object" && valA !== null && typeof valB === "object" && valB !== null) {
        return this.isEqual(valA, valB)
      }

      return valA === valB
    })
  }
}
