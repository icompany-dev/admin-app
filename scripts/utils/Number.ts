export class NumberUtil {
  static currency(amount: number): string {
    return new Intl.NumberFormat("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)
  }

  static thousandSeparator(amount: number): string {
    return new Intl.NumberFormat("en-MY").format(amount)
  }
}

export class NumberToWords {
  static BELOW_TWENTY: string[] = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ]

  static BELOW_TWENTY_BM: string[] = [
    "Kosong",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Lapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
    "Dua Belas",
    "Tiga Belas",
    "Empat Belas",
    "Lima Belas",
    "Enam Belas",
    "Tujuh Belas",
    "Lapan Belas",
    "Sembilan Belas",
  ]

  static TENS: string[] = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]
  static TENS_BM: string[] = [
    "",
    "",
    "Dua Puluh",
    "Tiga Puluh",
    "Empat Puluh",
    "Lima Puluh",
    "Enam Puluh",
    "Tujuh Puluh",
    "Lapan Puluh",
    "Sembilan Puluh",
  ]

  static THOUSANDS: string[] = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion"]
  static THOUSANDS_BM: string[] = ["", "Ribu", "Juta", "Bilion", "Trilion", "Kuartrilion", "Kuintilion"]

  static apply(number: number, isMalay: boolean = false): string {
    if (number === 0) {
      return "Zero"
    }

    const convertToWords = (n: number): string => {
      if (n < 20) {
        return !isMalay ? this.BELOW_TWENTY[n] : this.BELOW_TWENTY_BM[n]
      }

      if (n < 100) {
        if (!isMalay) {
          return `${this.TENS[Math.floor(n / 10)]}${n % 10 ? " " + this.BELOW_TWENTY[n % 10] : ""}`
        }
        return `${this.TENS_BM[Math.floor(n / 10)]}${n % 10 ? " " + this.BELOW_TWENTY_BM[n % 10] : ""}`
      }

      if (n < 1000) {
        if (!isMalay) {
          return `${this.BELOW_TWENTY[Math.floor(n / 100)]} Hundred${n % 100 ? " " + convertToWords(n % 100) : ""}`
        }
        return `${this.BELOW_TWENTY_BM[Math.floor(n / 100)]} Hundred${n % 100 ? " " + convertToWords(n % 100) : ""}`
      }

      for (let i = 1; i < this.THOUSANDS.length; i++) {
        const unit = Math.pow(1000, i)
        if (n < unit * 1000) {
          if (!isMalay) {
            return `${convertToWords(Math.floor(n / unit))} ${this.THOUSANDS[i]}${n % unit ? " " + convertToWords(n % unit) : ""}`
          }
          return `${convertToWords(Math.floor(n / unit))} ${this.THOUSANDS_BM[i]}${n % unit ? " " + convertToWords(n % unit) : ""}`
        }
      }

      return ""
    }

    return convertToWords(number)
  }
}
