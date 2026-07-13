"use client"

import { useI18n } from "@/components/i18n/language-provider"
import type { Attribute } from "@/lib/types"

interface ProductSpecificationsProps {
  attributes: Attribute[]
}

export function ProductSpecifications({ attributes }: ProductSpecificationsProps) {
  const { dictionary } = useI18n()

  if (!attributes || attributes.length === 0) {
    return null
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">{dictionary.products.specifications}</h2>
      </div>
      <div className="divide-y divide-border">
        {attributes.map((attr, index) => (
          <div key={index} className="flex items-center justify-between px-6 py-4">
            <span className="text-sm text-muted-foreground">{attr.name}</span>
            <span className="text-sm font-medium">{attr.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
