import { useDayjs } from "#imports"

export function useLocalTime() {
  const dayjs = useDayjs()

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
    return dayjs().format("D MMM YYYY - HH:MM:SS")
  }

  const formatDayDateFull = (date: string) => {
    return dayjs(date).format("dddd, D MMMM YYYY")
  }

  const formatDayDateShort = (date: string) => {
    return dayjs(date).format("ddd, D MMM YYYY")
  }

  const formatDateOnlyFull = (date: string) => {
    return dayjs(date).format("D MMMM YYYY")
  }

  const formatDateOnlyShort = (date: string) => {
    return dayjs(date).format("D MMM YYYY")
  }

  const formatDateMonthOnly = (date: string) => {
    return dayjs(date).format("MMM")
  }

  const formatDateMonthOnlyFull = (date: string) => {
    return dayjs(date).format("D MMMM")
  }

  const formatDateOnly = (date: string) => {
    return dayjs(date).format("D")
  }

  const formatDateOnlySystem = (date: string) => {
    return dayjs(date).format("YYYY-MM-DD")
  }

  const formatDateFullForEmail = (date: string) => {
    return dayjs(date).format("DD/MM/YYYY HH:MM:SS")
  }

  const formatDateOnlyWithSlash = (date: string) => {
    return dayjs(date).format("DD/MM/YYYY")
  }

  const formatYearOnly = (date: string) => {
    return dayjs(date).format("YYYY")
  }

  const formatTimeOnly = (date: string) => {
    return dayjs(date).format("h:mm a")
  }

  const formatDateTimeShort = (date: string) => {
    return dayjs(date).format("D MM YYYY h:mm a")
  }

  const isMorning = () => {
    const now = dayjs()
    const morningStartTime = now.hour(5).minute(0).second(0)
    const morningEndTime = now.hour(12).minute(0).second(0)

    return now.isAfter(morningStartTime) && now.isBefore(morningEndTime)
  }

  const isAfternoon = () => {
    const now = dayjs()
    const afternoonStartTime = now.hour(12).minute(0).second(0)
    const afternoonEndTime = now.hour(19).minute(0).second(0)

    return now.isAfter(afternoonStartTime) && now.isBefore(afternoonEndTime)
  }

  const isEvening = () => {
    const now = dayjs()
    const eveningStartTime = now.hour(19).minute(0).second(0)
    const eveningEndTime = now.hour(5).minute(0).second(0).add(1, "day")

    return now.isAfter(eveningStartTime) || now.isBefore(eveningEndTime)
  }

  return {
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
