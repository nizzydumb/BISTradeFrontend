import { cookies } from "next/headers"
import { getDictionary, resolveLocale, type Locale } from "@/lib/i18n"

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  return resolveLocale(cookieStore.get("locale")?.value)
}

export async function getServerDictionary() {
  const locale = await getServerLocale()
  return getDictionary(locale)
}
