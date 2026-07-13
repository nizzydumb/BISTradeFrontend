"use client"

import { ProductCard } from "./product-card"
import { useI18n } from "@/components/i18n/language-provider"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  const { locale } = useI18n()
  const emptyTitle = locale === "ru" ? "Товары не найдены" : "No products found"
  const emptyText = locale === "ru" ? "Попробуйте изменить поиск или фильтр." : "Try adjusting your search or filter criteria."

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">{emptyTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{emptyText}</p>
        </div>
      </div>
    )
  }

  return <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
}