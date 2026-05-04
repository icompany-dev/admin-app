import { useI18n } from "#imports"

export function useLanguage () {
  const { locale, setLocale } = useI18n()

  const getLocale = () => {
    return locale.value
  }

  const isEnglish = () => {
    return locale.value === 'en'
  }

  const isMalay = () => {
    return locale.value === 'bm'
  }

  const isLanguage = (langCode: string) => {
    return locale.value === langCode
  }

  const setLanguage = (language: 'en' | 'bm') => {
    setLocale(language)
  }

  return {
    getLocale,
    isEnglish,
    isMalay,
    isLanguage,
    setLanguage
  }
}
