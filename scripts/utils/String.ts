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
    const lastItem = stringArray[length - 1]

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
}
