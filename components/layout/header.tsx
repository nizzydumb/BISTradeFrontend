"use client"

import Link from "next/link"
import { ShoppingBag, Menu, Search, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/components/cart/cart-provider"
import { CartSheet } from "@/components/cart/cart-sheet"
import { LanguageSwitcher } from "@/components/i18n/language-switcher"
import { useI18n } from "@/components/i18n/language-provider"

export function Header() {
  const { totalItems } = useCart()
  const { dictionary } = useI18n()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigation = [
    { name: dictionary.common.shop, href: "/products" },
    { name: dictionary.common.categories, href: "/categories" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={dictionary.common.menu}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex min-w-0 lg:flex-1">
          <Link href="/" className="-m-1.5 truncate p-1.5">
            <span className="text-lg font-semibold tracking-tight sm:text-xl">{dictionary.common.brand}</span>
          </Link>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-1 items-center justify-end gap-x-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <Button variant="ghost" size="icon" aria-label={dictionary.common.search} asChild>
            <Link href="/products">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label={dictionary.common.cart}>
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <CartSheet />
          </Sheet>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 border-t border-border px-4 py-4">
            <div className="pb-2 sm:hidden">
              <LanguageSwitcher />
            </div>
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-2 text-base font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
