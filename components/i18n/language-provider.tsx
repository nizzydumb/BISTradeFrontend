"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { dictionaries, getDictionary, resolveLocale, type Dictionary, type Locale } from "@/lib/i18n"

interface LanguageContextValue {
  locale: Locale
  dictionary: Dictionary
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    const stored = window.localStorage.getItem("locale")
    const resolved = resolveLocale(stored || initialLocale)
    setLocaleState(resolved)
    document.documentElement.lang = resolved
  }, [initialLocale])

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale)
    window.localStorage.setItem("locale", nextLocale)
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`
    document.documentElement.lang = nextLocale
  }

  const value = useMemo(
    () => ({ locale, dictionary: dictionaries[locale] ?? getDictionary(locale), setLocale }),
    [locale]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useI18n() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useI18n must be used within a LanguageProvider")
  }
  return context
}
