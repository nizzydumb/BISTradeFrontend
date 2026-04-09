"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/types"

interface ProductsFilterProps {
  categories: Category[]
  selectedCategoryId?: string
}

export function ProductsFilter({ categories, selectedCategoryId }: ProductsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

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
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategoryId === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}
