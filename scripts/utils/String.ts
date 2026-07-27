export class StringUtil {
  static isNullOrEmpty(string: string | null): boolean {
    return !string || (typeof string === "string" && string.trim().length === 0)
  }

  static isEmpty(string: string): boolean {
    if (typeof string !== "string") {
      return true
    }

    const temp = string.replace(/\s+/g, "")

    return temp.length <= 0
  }

  static isEqual(stringA: string, stringB: string): boolean {
    return stringA.toLowerCase() === stringB.toLowerCase()
  }

  static contains(stringA: string, stringB: string): boolean {
    return stringA.toLowerCase().includes(stringB.toLowerCase())
  }

  static inArray(needle: string, haystack: string[]): boolean {
    return haystack
      .map((item: string) => {
        return item.toLowerCase()
      })
      .includes(needle.toLowerCase())
  }

  static capitalize(text: string): string {
    if (!text) {
      return ""
    }

    const excludeWords = new Set([
      "and",
      "or",
      "but",
      "nor",
      "for",
      "yet",
      "so",
      "to",
      "at",
      "by",
      "from",
      "in",
      "of",
      "on",
      "with",
    ])

    const specialCases: Record<string, string> = {
      ssm: "SSM",
      pdf: "PDF",
      rm: "RM",
      mydata: "MyData",
      xbrl: "XBRL",
      afs: "AFS",
      ufs: "UFS",
      ocr: "OCR",
      egm: "EGM",
      dcr: "DCR",
      mcr: "MCR",
    }

    return text.toLowerCase().replace(/\b\w+\b/g, (word, index) => {
      if (specialCases[word]) {
        return specialCases[word]
      }

      if (excludeWords.has(word) && index !== 0) {
        return word
      }

      return word.charAt(0).toUpperCase() + word.slice(1)
    })
  }

  static isEmailAddress(string: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(string.toLowerCase())
  }

  static getPlural(string: string): string {
    if (string.endsWith("y") && !/[aeiou]y$/.test(string)) {
      return string.slice(0, -1) + "ies"
    } else if (string.endsWith("s")) {
      return string
    } else {
      return string + "s"
    }
  }

  static oxfordJoin(and: string = "and", stringArray: string[]): string {
    if (stringArray.length <= 1) {
      return stringArray.join("")
    }

    if (stringArray.length === 2) {
      return stringArray.join(` ${and} `)
    }

    const itemsExceptLast = stringArray.slice(0, -1).join(", ")
    const lastItem = stringArray[stringArray.length - 1]

    return `${itemsExceptLast}, ${and} ${lastItem}`
  }

  static snakeToPascal(str: string): string {
    return str
      .split("_")
      .map((word: string) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      })
      .join("")
  }

  static fullDateInBm(dateString: string): string {
    if (StringUtil.isNullOrEmpty(dateString)) {
      return ""
    }

    let time = useLocalTime()
    let date = time.formatDateOnlyFull(dateString)

    let dateFragments = date.split(" ")
    if (dateFragments.length < 3) {
      return date
    }

    let month = dateFragments[1]
    let monthInBm = month
    switch (month) {
      case "January":
      case "February":
        monthInBm = month.replace("y", "i")
        break
      case "March":
        monthInBm = "Mac"
        break
      case "May":
        monthInBm = "Mei"
        break
      case "June":
        monthInBm = "Jun"
        break
      case "July":
        monthInBm = "Julai"
        break
      case "August":
        monthInBm = "Ogos"
        break
      case "October":
        monthInBm = "Oktober"
        break
      case "December":
        monthInBm = "Disember"
        break
      default:
        monthInBm = month
    }

    date = date.replace(month, monthInBm)

    return date
  }

  static shortDateInBm(dateString: string): string {
    if (StringUtil.isNullOrEmpty(dateString)) {
      return ""
    }

    let time = useLocalTime()
    let date = time.formatDateOnlyShort(dateString)

    let dateFragments = date.split(" ")
    if (dateFragments.length < 3) {
      return date
    }

    let month = dateFragments[1]
    let monthInBm = month
    switch (month) {
      case "Mar":
        monthInBm = "Mac"
        break
      case "May":
        monthInBm = "Mei"
        break
      case "June":
        monthInBm = "Jun"
        break
      case "Aug":
        monthInBm = "Ogos"
        break
      case "Oct":
        monthInBm = "Okt"
        break
      case "Dec":
        monthInBm = "Dis"
        break
      default:
        monthInBm = month
    }

    date = date.replace(month, monthInBm)

    return date
  }

  static collapseSpaces(string: string): string {
    return string.replace(/ +/g, " ")
  }

  static nl2br(string: string): string {
    if (!string) {
      return ""
    }

    return string.replaceAll(/(\r\n|\n|\r)/g, "<br>")
  }

  static simplifyMixedArray(items: string[], and: string = "and"): string {
    if (!Array.isArray(items) || items.length === 0) {
      return ""
    }

    const cleaned = items
      .map((item) => {
        return item?.trim()
      })
      .filter(Boolean)

    if (cleaned.length === 0) {
      return ""
    }
    if (cleaned.length === 1) {
      return cleaned[0]
    }

    const groups: string[][] = []

    for (const item of cleaned) {
      let addedToGroup = false

      for (const group of groups) {
        if (this.shareCommonPrefix(group[0], item)) {
          group.push(item)
          addedToGroup = true
          break
        }
      }

      if (!addedToGroup) {
        groups.push([item])
      }
    }

    const simplifiedGroups = groups.map((group) => this.simplifySingleGroup(group, and))

    return this.oxfordJoin(and, simplifiedGroups)
  }

  static shareCommonPrefix(str1: string, str2: string): boolean {
    const getFirstTwoWords = (str: string) => {
      return str.split(/\s+/).slice(0, 2).join(" ").toLowerCase()
    }

    return getFirstTwoWords(str1) === getFirstTwoWords(str2)
  }

  static simplifySingleGroup(group: string[], and: string = "and"): string {
    if (group.length === 1) {
      return group[0]
    }

    const prefix = this.findCommonWordPrefix(group)
    if (!prefix) {
      return this.oxfordJoin(and, group)
    }

    const suffixes = group.map((item) => {
      return item.slice(prefix.length).trim()
    })

    return `${prefix} ${this.oxfordJoin(and, suffixes)}`.trim()
  }

  static findCommonWordPrefix(strings: string[]): string {
    const firstItemWords = strings[0].match(/\S+|\s+/g) || []
    let sharedPrefix = ""

    for (let i = 0; i < firstItemWords.length; i++) {
      const candidate = sharedPrefix + firstItemWords[i]
      const allMatch = strings.every((str) => {
        return str.startsWith(candidate)
      })

      if (allMatch) {
        sharedPrefix = candidate
      } else {
        break
      }
    }

    return sharedPrefix.trim()
  }
}
