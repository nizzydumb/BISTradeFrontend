"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { CategoryForm } from "@/components/admin/category-form"
import { api } from "@/lib/api"
import { useI18n } from "@/components/i18n/language-provider"
import type { Category } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { locale } = useI18n()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategory() {
      try {
        const data = await api.getCategory(parseInt(id))
        setCategory(data)
      } catch (error) {
        console.error("[v0] Failed to fetch category:", error)
        router.push("/admin/categories")
      } finally {
        setLoading(false)
      }
    }
    fetchCategory()
  }, [id, router])

  if (loading) return <div className="space-y-6"><div><Skeleton className="h-9 w-48" /><Skeleton className="mt-2 h-5 w-64" /></div><Skeleton className="h-64" /></div>
  if (!category) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{locale === "ru" ? "Редактировать категорию" : "Edit Category"}</h1>
        <p className="text-muted-foreground">{locale === "ru" ? `Обновить ${category.name}` : `Update ${category.name}`}</p>
      </div>
      <CategoryForm category={category} mode="edit" />
    </div>
  )
}