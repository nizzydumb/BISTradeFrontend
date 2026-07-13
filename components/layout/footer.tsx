"use client"

import Link from "next/link"
import { useI18n } from "@/components/i18n/language-provider"

export function Footer() {
  const { locale, dictionary } = useI18n()
  const labels = locale === "ru"
    ? { tagline: "Ваш надежный партнер по оборудованию и решениям для безопасности.", support: "Поддержка", contact: "Контакты", faq: "FAQ", shipping: "Доставка", company: "Компания", about: "О нас", terms: "Условия", privacy: "Конфиденциальность", rights: "Все права защищены." }
    : { tagline: "Your trusted partner for safety equipment and solutions.", support: "Support", contact: "Contact", faq: "FAQ", shipping: "Shipping", company: "Company", about: "About", terms: "Terms", privacy: "Privacy", rights: "All rights reserved." }
  const footerLinks = {
    shop: [{ name: dictionary.home.viewAllProducts, href: "/products" }, { name: dictionary.common.categories, href: "/categories" }],
    support: [{ name: labels.contact, href: "#" }, { name: labels.faq, href: "#" }, { name: labels.shipping, href: "#" }],
    company: [{ name: labels.about, href: "#" }, { name: labels.terms, href: "#" }, { name: labels.privacy, href: "#" }],
  }

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1"><Link href="/" className="text-xl font-semibold tracking-tight">{dictionary.common.brand}</Link><p className="mt-4 text-sm text-muted-foreground">{labels.tagline}</p></div>
          <div><h3 className="text-sm font-semibold">{dictionary.common.shop}</h3><ul className="mt-4 space-y-3">{footerLinks.shop.map((link) => <li key={link.name}><Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{link.name}</Link></li>)}</ul></div>
          <div><h3 className="text-sm font-semibold">{labels.support}</h3><ul className="mt-4 space-y-3">{footerLinks.support.map((link) => <li key={link.name}><Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{link.name}</Link></li>)}</ul></div>
          <div><h3 className="text-sm font-semibold">{labels.company}</h3><ul className="mt-4 space-y-3">{footerLinks.company.map((link) => <li key={link.name}><Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{link.name}</Link></li>)}</ul></div>
        </div>
        <div className="mt-12 border-t border-border pt-8"><p className="text-center text-sm text-muted-foreground">{new Date().getFullYear()} {dictionary.common.brand}. {labels.rights}</p></div>
      </div>
    </footer>
  )
}