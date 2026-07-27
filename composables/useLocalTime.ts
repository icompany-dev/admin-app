import { useDayjs } from "#imports"
import customParseFormat from "dayjs/plugin/customParseFormat"

export function useLocalTime() {
  const dayjs = useDayjs()
  dayjs.extend(customParseFormat)

  const USER_DATE_FORMATS = [
    "D MMM YYYY", // 30 Jun 2025
    "D MMMM YYYY", // 30 June 2025
    "D.M.YYYY", // 30.6.2025, 30.06.2025
    "DD.MM.YYYY", // 30.06.2025
    "D/M/YYYY", // 30/6/2025, 30/06/2025
    "DD/MM/YYYY", // 30/06/2025
    "YYYY-MM-DD", // Standard system date
  ]

  const parseInputDate = (date: string) => {
    if (!date) {
      return dayjs(invalidDateStringPlaceholder())
    }

    const d = dayjs(date)
    if (d.isValid()) {
      return d
    }

    return dayjs(date, USER_DATE_FORMATS)
  }

  const invalidDateStringPlaceholder = () => {
    return ""
  }

  const currentDateFull = () => {
    return dayjs().format("dddd, D MMMM YYYY")
  }

  const currentDateShort = () => {
    return dayjs().format("ddd, D MMM YYYY")
  }

  const currentTime = () => {
    return dayjs().format("h:mm:ss a")
  }

  const currentDataTimeForSignature = () => {
    return dayjs().format("D MMM YYYY - HH:mm:ss")
  }

  const formatDayDateFull = (date: string) => {
    return parseInputDate(date).format("dddd, D MMMM YYYY")
  }

  const formatDayDateShort = (date: string) => {
    return parseInputDate(date).format("ddd, D MMM YYYY")
  }

  const formatDateOnlyFull = (date: string) => {
    return parseInputDate(date).format("D MMMM YYYY")
  }

  const formatDateOnlyShort = (date: string) => {
    return parseInputDate(date).format("D MMM YYYY")
  }

  const formatDateMonthOnly = (date: string) => {
    return parseInputDate(date).format("MMM")
  }

  const formatDateMonthOnlyFull = (date: string) => {
    return parseInputDate(date).format("D MMMM")
  }

  const formatDateOnly = (date: string) => {
    return parseInputDate(date).format("D")
  }

  const formatDateOnlySystem = (date: string) => {
    return parseInputDate(date).format("YYYY-MM-DD")
  }

  const formatDateFullForEmail = (date: string) => {
    return parseInputDate(date).format("DD/MM/YYYY HH:mm:ss")
  }

  const formatDateOnlyWithSlash = (date: string) => {
    return parseInputDate(date).format("DD/MM/YYYY")
  }

  const formatYearOnly = (date: string) => {
    return parseInputDate(date).format("YYYY")
  }

  const formatTimeOnly = (date: string) => {
    return parseInputDate(date).format("h:mm a")
  }

  const formatDateTimeShort = (date: string) => {
    return parseInputDate(date).format("D MM YYYY h:mm a")
  }

  const isMorning = () => {
    const hour = dayjs().hour()
    return hour >= 5 && hour < 12
  }

  const isAfternoon = () => {
    const hour = dayjs().hour()
    return hour >= 12 && hour < 19
  }

  const isEvening = () => {
    const hour = dayjs().hour()
    return hour >= 19 || hour < 5
  }

  return {
    USER_DATE_FORMATS,
    currentDateFull,
    currentDateShort,
    currentTime,
    currentDataTimeForSignature,
    formatDayDateFull,
    formatDayDateShort,
    formatDateOnlyFull,
    formatDateOnlyShort,
    formatDateMonthOnly,
    formatDateMonthOnlyFull,
    formatDateOnly,
    formatDateOnlySystem,
    formatDateFullForEmail,
    formatDateOnlyWithSlash,
    formatYearOnly,
    formatTimeOnly,
    formatDateTimeShort,
    isMorning,
    isAfternoon,
    isEvening,
  }
}
