"use client"

import { useRouter } from "next/navigation"
import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/language-provider"
import type { Locale } from "@/lib/i18n"

export function LanguageSwitcher() {
  const router = useRouter()
  const { locale, setLocale, dictionary } = useI18n()

  const changeLanguage = (nextLocale: Locale) => {
    if (nextLocale === locale) return
    setLocale(nextLocale)
    router.refresh()
  }

  return (
    <div className="flex items-center rounded-md border border-border p-0.5" aria-label={dictionary.common.language}>
      <Languages className="mx-2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <Button type="button" variant={locale === "en" ? "default" : "ghost"} size="sm" className="h-7 px-2 text-xs" onClick={() => changeLanguage("en")} aria-label={dictionary.common.english}>EN</Button>
      <Button type="button" variant={locale === "ru" ? "default" : "ghost"} size="sm" className="h-7 px-2 text-xs" onClick={() => changeLanguage("ru")} aria-label={dictionary.common.russian}>RU</Button>
    </div>
  )
}
