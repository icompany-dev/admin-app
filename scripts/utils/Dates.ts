// NOTE: This class is NOT to replace useLocalTime composable.
// -- use this class to handle date conversions for API communication only
// -- All formatting for display purposes should use useLocalTime composable

export class DateUtil {
  static getDateString(milisecond: number): string {
    const date = new Date(milisecond)
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, "0")
    const day = String(date.getUTCDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }
}
