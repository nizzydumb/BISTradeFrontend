"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/components/i18n/language-provider"
import type { Category } from "@/lib/types"

interface ProductsFilterProps {
  categories: Category[]
  selectedCategoryId?: string
}

export function ProductsFilter({ categories, selectedCategoryId }: ProductsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { dictionary } = useI18n()

  const handleCategoryChange = (categoryId?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId) {
      params.set("category", categoryId)
    } else {
      params.delete("category")
    }
    params.delete("page")
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="mb-8 flex flex-wrap items-center gap-2">
      <Button
        variant={!selectedCategoryId ? "default" : "outline"}
        size="sm"
        onClick={() => handleCategoryChange()}
      >
        {dictionary.common.all}
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategoryId === String(category.id) ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange(String(category.id))}
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}
